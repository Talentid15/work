import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setOfferData } from "../../redux/offerSlice";
import { formateDate } from "../../utils";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";
import { toast } from "sonner";
import { parse, isValid, isBefore, startOfDay } from "date-fns";

const Job_Offer = () => {
  const offersData = useSelector((state) => state.offer.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkOffers, setBulkOffers] = useState([]);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";
  const token = useSelector((state) => state.user.data?.token);
  const data = useSelector((state) => state.user.data);

  useEffect(() => {
    const fetchOffersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        console.log("Fetched Offers Data:", response.data);

        const fetchedOffers = Array.isArray(response.data) ? response.data : [];

        const sortedData = fetchedOffers.sort((a, b) => {
          return new Date(b.offerDate) - new Date(a.offerDate);
        });

        dispatch(setOfferData(sortedData));
      } catch (error) {
        console.error("Error fetching offers data:", error);

        if (error.response && error.response.status === 404) {
          dispatch(setOfferData([]));
        } else {
          // setError("Failed to fetch offers. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOffersData();
    } else {
      setLoading(false);
      setError("No authentication token found. Please log in.");
    }
  }, [dispatch, token]);

  const handleSendEmail = async (offerId) => {
    try {
      const response = await api.post(
        `${API_URL}/api/offer/send-offer-email/${offerId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      toast.success(response.data.message, {
        style: {
          backgroundColor: '#652d96',
          color: '#ffffff',
        },
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const statusOptions = [
    "All",
    "Pending",
    "Accepted",
    "Declined",
    "Ghosted",
    "Expired",
    "Retracted",
  ];

  const visibleOffers = (Array.isArray(offersData) ? offersData : []).filter(
    (offer) => offer.showOffer !== false
  );

  const filteredOffers = visibleOffers.filter((offer) => {
    const matchesStatus = statusFilter === "All" || offer.status === statusFilter;
    const matchesSearch = searchQuery
      ? offer?.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const downloadTemplateCSV = () => {
    const headers = [
      "jobTitle",
      "candidateName",
      "candidateEmail",
      "candidatePhoneNo",
      "joiningDate",
      "expiryDate",
      "emailSubject",
      "emailMessage",
      "companyName",
      "currentCTC",
    ];
    const csvContent = [
      headers.join(","),
      headers.map(() => "").join(","), // Empty row for user to fill
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "offer_template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()));
      const headers = rows[0];
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell));

      const expectedHeaders = [
        "jobTitle",
        "candidateName",
        "candidateEmail",
        "candidatePhoneNo",
        "joiningDate",
        "expiryDate",
        "emailSubject",
        "emailMessage",
        "companyName",
        "currentCTC",
      ];

      if (!expectedHeaders.every(header => headers.includes(header))) {
        toast.error("Invalid CSV format. Please use the provided template.");
        return;
      }

      const offers = dataRows.map(row => {
        const offer = {};
        headers.forEach((header, index) => {
          offer[header] = row[index] || "";
        });
        offer.offerLetter = null;
        offer.candidateResume = null;
        offer.errors = {};
        return offer;
      });

      setBulkOffers(offers);
      setShowFilePopup(false);
      setShowBulkPopup(true);
    };
    reader.readAsText(file);
  };

  const validatePhoneNumber = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneNo) return "Phone number is required";
    if (!phoneRegex.test(phoneNo)) return "Phone number must be 10 digits";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Candidate email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateJoiningDate = (joiningDate) => {
    if (!joiningDate) return "Joining date is required";

    const formats = [
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd-MM-yyyy",
      "dd/MM/yyyy",
      "MMMM dd, yyyy",
    ];

    let parsedDate;
    for (const format of formats) {
      parsedDate = parse(joiningDate, format, new Date());
      if (isValid(parsedDate)) break;
    }

    if (!isValid(parsedDate)) return "Invalid joining date format";

    const today = startOfDay(new Date());
    if (isBefore(parsedDate, today)) return "Joining date must be today or a future date";

    return "";
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return "Expiry date is required";

    const formats = [
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd-MM-yyyy",
      "dd/MM/yyyy",
      "MMMM dd, yyyy",
    ];

    let parsedDate;
    for (const format of formats) {
      parsedDate = parse(expiryDate, format, new Date());
      if (isValid(parsedDate)) break;
    }

    if (!isValid(parsedDate)) return "Invalid expiry date format";

    return "";
  };

  const validateCurrentCTC = (currentCTC) => {
    if (!currentCTC) return "";
    const ctc = parseFloat(currentCTC);
    if (isNaN(ctc) || ctc < 0) return "Current CTC must be a positive number";
    return "";
  };

  const validateFile = (file, fieldName) => {
    if (!file) return `${fieldName} is required`;
    const maxSize = 100 * 1024 * 1024;
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return `${fieldName} must be a PDF file`;
    }
    if (file.size > maxSize) {
      toast.error(`${fieldName} must be less than 100MB`);
      return `${fieldName} must be less than 100MB`;
    }
    return "";
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",", 2)[1]);
      reader.onerror = reject;
    });
  };

  const handleBulkOfferChange = (index, field, value) => {
    setBulkOffers(prev => {
      const newOffers = [...prev];
      newOffers[index] = { ...newOffers[index], [field]: value };
      newOffers[index].errors = validateBulkOffer(newOffers[index]);
      return newOffers;
    });
  };

  const handleBulkFileChange = (index, field, file) => {
    setBulkOffers(prev => {
      const newOffers = [...prev];
      newOffers[index] = { ...newOffers[index], [field]: file };
      newOffers[index].errors = validateBulkOffer(newOffers[index]);
      return newOffers;
    });
  };

  const validateBulkOffer = (offer) => {
    const errors = {
      jobTitle: !offer.jobTitle ? "Job title is required" : "",
      candidateName: !offer.candidateName ? "Candidate name is required" : "",
      candidateEmail: validateEmail(offer.candidateEmail),
      candidatePhoneNo: validatePhoneNumber(offer.candidatePhoneNo),
      joiningDate: validateJoiningDate(offer.joiningDate),
      expiryDate: validateExpiryDate(offer.expiryDate),
      companyName: !offer.companyName ? "Company name is required" : "",
      emailSubject: !offer.emailSubject ? "Email subject is required" : "",
      emailMessage: !offer.emailMessage ? "Email message is required" : "",
      offerLetter: validateFile(offer.offerLetter, "Offer letter"),
      candidateResume: validateFile(offer.candidateResume, "Candidate resume"),
      currentCTC: validateCurrentCTC(offer.currentCTC),
    };
    return errors;
  };

  const handleBulkSubmit = async () => {
    const invalidOffers = bulkOffers.filter(offer => {
      const errors = validateBulkOffer(offer);
      offer.errors = errors;
      return !Object.values(errors).every(error => error === "");
    });

    if (invalidOffers.length > 0) {
      setBulkOffers([...bulkOffers]);
      toast.error("Please correct errors in the form before submitting.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to release ${bulkOffers.length} offer(s)? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setLoading(true);
    const responses = [];
    
    for (const offer of bulkOffers) {
      try {
        const offerLetterBase64 = await readFileAsBase64(offer.offerLetter);
        const digioRequestBody = {
          file_name: `offer-letter-${offer.candidateName}`,
          file_data: offerLetterBase64,
          signers: [
            {
              identifier: offer.candidateEmail,
              reason: "for signing the offer letter",
              sign_type: "electronic",
            },
          ],
          display_on_page: "All",
          include_authentication_url: true,
        };

        const formData = new FormData();
        formData.append("jobTitle", offer.jobTitle);
        formData.append("joiningDate", offer.joiningDate);
        formData.append("expiryDate", offer.expiryDate);
        formData.append("emailSubject", offer.emailSubject);
        formData.append("emailMessage", offer.emailMessage);
        formData.append("candidateEmail", offer.candidateEmail);
        formData.append("candidateName", offer.candidateName);
        formData.append("candidatePhoneNo", offer.candidatePhoneNo);
        formData.append("companyName", offer.companyName);
        formData.append("offerLetter", offer.offerLetter, offer.offerLetter.name);
        formData.append("candidateResume", offer.candidateResume, offer.candidateResume.name);
        formData.append("digioReqBody", JSON.stringify(digioRequestBody));
        formData.append("currentCTC", offer.currentCTC || "0");

        const response = await api.post(
          `${API_URL}/api/offer/create-offer`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        responses.push({ success: true, candidateName: offer.candidateName });
      } catch (error) {
        responses.push({ success: false, candidateName: offer.candidateName, error });
      }
    }

    const successes = responses.filter(res => res.success);
    const failures = responses.filter(res => !res.success);

    if (successes.length > 0) {
      toast.success(`${successes.length} offer(s) released successfully!`, {
        style: { backgroundColor: '#652d96', color: '#ffffff' },
      });
    }

    if (failures.length > 0) {
      failures.forEach(failure => {
        if (failure.error.response?.status === 403 && failure.error.response?.data?.error?.includes("Monthly offer limit")) {
          const planName = failure.error.response.data.error.match(/of (\w+) plan/)?.[1] || "your";
          toast.error(`Offer for ${failure.candidateName} failed: Monthly offer limit reached for ${planName} plan.`, {
            style: { backgroundColor: "#ff4d4f", color: "#ffffff" },
            duration: 5000,
          });
        } else {
          toast.error(`Offer for ${failure.candidateName} failed: ${failure.error.response?.data?.error || "Unknown error"}`, {
            style: { backgroundColor: "#ff4d4f", color: "#ffffff" },
          });
        }
      });
    }

    if (successes.length === bulkOffers.length) {
      setShowBulkPopup(false);
      setBulkOffers([]);
      navigate("/joboffers");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-6">
          Job Offers Dashboard
        </h1>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by candidate name..."
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
              onChange={(e) => {
                if (e.target.value === "release-offer") navigate("/release-offer");
                if (e.target.value === "release-offer-bulk") setShowFilePopup(true);
              }}
            >
              <option value="" disabled selected>Select an action</option>
              <option value="release-offer">Release Offer</option>
              <option value="release-offer-bulk">Release Offer Bulk</option>
            </select>
            <button
              className="flex items-center justify-center gap-2 px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all shadow-md w-full sm:w-auto"
              onClick={downloadTemplateCSV}
            >
              <FaFileAlt />
              Download Template
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium py-8">{error}</div>
        ) : filteredOffers.length > 0 ? (
          <>
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full bg-white">
                <thead className="bg-purple-50 text-purple-800">
                  <tr>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Name</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Role</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Status</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Offer Letter</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Date Added</th>
                    <th className="p-4 text-center font-semibold text-sm uppercase tracking-wide min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr
                      key={offer._id}
                      className="border-b hover:bg-purple-50 transition-all"
                    >
                      <td className="p-4 text-gray-700">{offer?.candidate?.name || "N/A"}</td>
                      <td className="p-4 text-gray-700">{offer?.jobTitle || "N/A"}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {offer.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {data.company}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">{formateDate(offer.offerDate) || "N/A"}</td>
                      <td className="p-4 flex items-center justify-center gap-3">
                        {offer.status === "Pending" ? (
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                            onClick={() => handleSendEmail(offer._id)}
                            title="Send Offer Email"
                          >
                            <MdMarkEmailUnread className="text-purple-600" size={20} />
                          </button>
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0" />
                        )}
                        <button
                          className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
                          onClick={() => navigate(`/joboffers/${offer._id}`)}
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-purple-800">
                    {offer?.candidate?.name || "N/A"}
                  </h3>
                  <p className="text-gray-600 mt-1">{offer?.candidate?.email || "N/A"}</p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {offer.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {offer.offerLetterStatus || "N/A"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {formateDate(offer.offerDate) || "N/A"}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start">
                    {offer.status === "Pending" ? (
                      <button
                        className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium flex items-center gap-2"
                        onClick={() => handleSendEmail(offer._id)}
                      >
                        <MdMarkEmailUnread size={16} />
                        Send Email
                      </button>
                    ) : (
                      <div className="w-0 sm:w-28 h-10 flex-shrink-0" />
                    )}
                    <button
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
                      onClick={() => navigate(`/joboffers/${offer._id}`)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 font-medium py-8">
            <p>No offers found. Please release an offer or adjust your search.</p>
          </div>
        )}

        {showBulkPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Bulk Offer Release</h2>
              {bulkOffers.map((offer, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">
                    Offer {index + 1}: <span className="text-purple-800">{offer.candidateName || "New Candidate"}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "jobTitle",
                      "candidateName",
                      "candidateEmail",
                      "candidatePhoneNo",
                      "companyName",
                      "joiningDate",
                      "expiryDate",
                      "emailSubject",
                      "currentCTC",
                    ].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-gray-700 capitalize mb-2">
                          {field === "currentCTC" ? "Current CTC (Optional)" : field.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          type={
                            field.includes("Date")
                              ? "date"
                              : field === "candidateEmail"
                                ? "email"
                                : field === "currentCTC"
                                  ? "number"
                                  : "text"
                          }
                          value={offer[field]}
                          onChange={(e) => handleBulkOfferChange(index, field, e.target.value)}
                          className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${offer.errors[field] ? "border-red-500" : "border-gray-300"}`}
                          readOnly={field === "companyName"}
                          min={field === "currentCTC" ? "0" : undefined}
                          step={field === "currentCTC" ? "0.01" : undefined}
                        />
                        {offer.errors[field] && (
                          <p className="text-red-500 text-xs mt-1">{offer.errors[field]}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Message</label>
                      <textarea
                        value={offer.emailMessage}
                        onChange={(e) => handleBulkOfferChange(index, "emailMessage", e.target.value)}
                        className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${offer.errors.emailMessage ? "border-red-500" : "border-gray-300"}`}
                        rows={4}
                      />
                      {offer.errors.emailMessage && (
                        <p className="text-red-500 text-xs mt-1">{offer.errors.emailMessage}</p>
                      )}
                    </div>
                    {["offerLetter", "candidateResume"].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload {field.replace(/([A-Z])/g, " $1")} (PDF, Max 100MB)
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleBulkFileChange(index, field, e.target.files[0])}
                          className={`w-full border rounded-lg p-3 text-gray-700 ${offer.errors[field] ? "border-red-500" : "border-gray-300"}`}
                        />
                        {offer[field] && (
                          <p className="text-gray-600 text-xs mt-1">Selected: {offer[field].name}</p>
                        )}
                        {offer.errors[field] && (
                          <p className="text-red-500 text-xs mt-1">{offer.errors[field]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
                  onClick={() => setShowBulkPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-all disabled:bg-purple-400 disabled:cursor-not-allowed"
                  onClick={handleBulkSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Releasing...
                    </>
                  ) : (
                    "Release Offers"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showFilePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Import CSV for Bulk Release</h2>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag and drop files here</p>
                  <p className="text-gray-500 text-sm">or</p>
                  <label className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 cursor-pointer transition-all">
                    Browse files
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVImport}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
                  onClick={() => setShowFilePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Job_Offer;