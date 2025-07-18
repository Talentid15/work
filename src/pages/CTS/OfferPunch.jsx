import { useState, useEffect, useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

const OfferPunch = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const formRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [offerPunches, setOfferPunches] = useState([]);
  const [statusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const data = useSelector((state) => state.user.data);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhoneNo: "",
    companyName: data?.company || "",
    joiningDate: "",
    expiryDate: "",
    offerLetter: null,
    candidateResume: null,
    offerLetterStatus: "Offer letter released",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const statusOptions = ["All", "Offer letter released", "Candidate verbal commitment"];
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  useEffect(() => {
    const fetchOfferPunches = async () => {
      setLoading(true);
      setError(null);
      try {
        const offerPunchesResponse = await api.get(`${API_URL}/api/offer/get-offer-punches`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = offerPunchesResponse.data.sort((a, b) =>
          new Date(b.joiningDate) - new Date(a.joiningDate)
        );
        setOfferPunches(sortedData || []);
      } catch (error) {
        console.error("Error fetching offer punches:", error);
        setError("Failed to fetch offer punches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOfferPunches();
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.candidateName.trim()) newErrors.candidateName = "Candidate Name is required";
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = "Candidate Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = "Invalid email format";
    }
    if (!formData.candidatePhoneNo.trim()) {
      newErrors.candidatePhoneNo = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.candidatePhoneNo)) {
      newErrors.candidatePhoneNo = "Phone number must be 10 digits";
    }
    if (!formData.joiningDate) newErrors.joiningDate = "Joining Date is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry Date is required";
    else if (new Date(formData.expiryDate) <= new Date(formData.joiningDate)) {
      newErrors.expiryDate = "Expiry Date must be after Joining Date";
    }
    if (!formData.offerLetter) newErrors.offerLetter = "Offer Letter (PDF) is required";
    if (!formData.candidateResume) newErrors.candidateResume = "Candidate Resume (PDF) is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.type !== "application/pdf") {
          toast.error(`${name === "offerLetter" ? "Offer Letter" : "Resume"} must be a PDF file.`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${name === "offerLetter" ? "Offer Letter" : "Resume"} size exceeds 5MB limit.`);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          setFormData((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        reader.onerror = () =>
          toast.error(`Error reading ${name === "offerLetter" ? "Offer Letter" : "Resume"}`);
      }
    } else if (name !== "companyName") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      const firstErrorField = Object.keys(errors)[0];
      formRef.current.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post(
        `${API_URL}/api/offer/create-offer-punch`,
        {
          ...formData,
          offerLetter: formData.offerLetter ? formData.offerLetter.split(",")[1] : null,
          candidateResume: formData.candidateResume ? formData.candidateResume.split(",")[1] : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Offer punch submitted successfully!", {
        style: { backgroundColor: "#652d96", color: "#ffffff" },
      });
      setShowForm(false);
      setShowConfirmation(false);
      setFormData({
        jobTitle: "",
        candidateName: "",
        candidateEmail: "",
        candidatePhoneNo: "",
        companyName: data?.company || "",
        joiningDate: "",
        expiryDate: "",
        offerLetter: null,
        candidateResume: null,
        offerLetterStatus: "Offer letter released",
      });
      setErrors({});
      setTouched({});
      const offerPunchesResponse = await api.get(`${API_URL}/api/offer/get-offer-punches`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedData = offerPunchesResponse.data.sort((a, b) =>
        new Date(b.joiningDate) - new Date(a.joiningDate)
      );
      setOfferPunches(sortedData || []);
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      toast.error("Failed to submit offer punch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmit = () => setShowConfirmation(false);

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhoneNo: "",
      companyName: data?.company || "",
      joiningDate: "",
      expiryDate: "",
      offerLetter: null,
      candidateResume: null,
      offerLetterStatus: "Offer letter released",
    });
    setErrors({});
    setTouched({});
    toast.success("Form reset successfully!", {
      style: { backgroundColor: "#652d96", color: "#ffffff" },
    });
  };

  const handleRowClick = (punch) => {
    setSelectedUser(punch);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  const completionPercentage = Math.round(
    (Object.values(formData).filter((val) => val !== "" && val !== null && val !== data?.company).length /
      (Object.keys(formData).length - 1)) *
    100
  );

  const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every((val) => val !== "" && val !== null);

  const filteredPunches = statusFilter === "All"
    ? offerPunches
    : offerPunches.filter((punch) => punch.offerLetterStatus === statusFilter);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-6">Offer Punch Dashboard</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            className="flex items-center gap-2 px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all shadow-md w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => setShowForm(true)}
          >
            <FaFileAlt />
            Add Offer Punch
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium py-8">{error}</div>
        ) : showForm ? (
          <form ref={formRef} onSubmit={handleFormSubmit} className="w-full space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Enter Candidate Details</h2>
              <div className="text-sm text-gray-600">
                Completion: <span className="font-semibold text-purple-600">{completionPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Candidate Name"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.candidateName}
                touched={touched.candidateName}
              />
              <InputField
                label="Candidate Email"
                type="email"
                name="candidateEmail"
                value={formData.candidateEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.candidateEmail}
                touched={touched.candidateEmail}
              />
              <InputField
                label="Candidate Phone No"
                type="tel"
                name="candidatePhoneNo"
                value={formData.candidatePhoneNo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.candidatePhoneNo}
                touched={touched.candidatePhoneNo}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.jobTitle}
                touched={touched.jobTitle}
              />
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.companyName}
                touched={touched.companyName}
                readOnly
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Joining Date"
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.joiningDate}
                  touched={touched.joiningDate}
                />
                <InputField
                  label="Expiry Date"
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.expiryDate}
                  touched={touched.expiryDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileInput
                label="Offer Letter (PDF)"
                name="offerLetter"
                value={formData.offerLetter}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.offerLetter}
                touched={touched.offerLetter}
              />
              <FileInput
                label="Resume (PDF)"
                name="candidateResume"
                value={formData.candidateResume}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.candidateResume}
                touched={touched.candidateResume}
              />
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all text-sm font-medium"
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium flex items-center gap-2"
                aria-label="Submit offer punch"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {filteredPunches?.length > 0 ? (
              <>
                <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 mb-6">
                  <table className="w-full bg-white">
                    <thead className="bg-purple-50 text-purple-800">
                      <tr>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Name</th>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Job Title</th>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Status</th>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPunches.map((punch) => (
                        <tr
                          key={punch._id}
                          className="border-b hover:bg-purple-50 transition-all cursor-pointer"
                          onClick={() => handleRowClick(punch)}
                        >
                          <td className="p-4 text-gray-700">{punch.candidateName || "N/A"}</td>
                          <td className="p-4 text-gray-700">{punch.jobTitle || "N/A"}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {punch.offerLetterStatus || "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-700">
                            {punch.joiningDate ? new Date(punch.joiningDate).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden space-y-4">
                  {filteredPunches.map((punch) => (
                    <div
                      key={punch._id}
                      className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleRowClick(punch)}
                    >
                      <h3 className="text-lg font-semibold text-purple-800">
                        {punch.candidateName || "N/A"}
                      </h3>
                      <p className="text-gray-600 mt-1">{punch.candidateEmail || "N/A"}</p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {punch.offerLetterStatus || "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        {punch.joiningDate ? new Date(punch.joiningDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 font-medium py-8">No offer punches available.</p>
            )}
          </>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmation</h3>
              <p className="text-gray-700 mb-6">
                Confirm that the data you punch is real and this action cannot be undone. Do you want to proceed?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelSubmit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showPopup && selectedUser && (
          <UserDetailsPopup user={selectedUser} onClose={closePopup} />
        )}

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, type = "text", name, value, onChange, onBlur, error, touched, readOnly = false }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`border p-3 rounded-lg w-full ${readOnly ? "bg-gray-200" : ""} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${error && touched ? "border-red-500" : "border-gray-300"}`}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={`${name}-error`}
        readOnly={readOnly}
      />
      {touched && !error && value && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" size={20} />}
      {touched && error && <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 pointer-events-none" size={20} />}
    </div>
    {error && touched && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// File Input Component
const FileInput = ({ label, name, value, onChange, onBlur, error, touched }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type="file"
        name={name}
        accept="application/pdf"
        onChange={onChange}
        onBlur={onBlur}
        className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${error && touched ? "border-red-500" : "border-gray-300"}`}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={`${name}-error`}
      />
      {touched && !error && value && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" size={20} />}
      {touched && error && <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 pointer-events-none" size={20} />}
    </div>
    {error && touched && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// User Details Popup Component
const UserDetailsPopup = ({ user, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-purple-800">Candidate Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close popup">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-4">
        <DetailItem label="Candidate Name" value={user.candidateName || "N/A"} />
        <DetailItem label="Email" value={user.candidateEmail || "N/A"} />
        <DetailItem label="Phone Number" value={user.candidatePhoneNo || "N/A"} />
        <DetailItem label="Job Title" value={user.jobTitle || "N/A"} />
        <DetailItem label="Company Name" value={user.companyName || "N/A"} />
        <DetailItem
          label="Joining Date"
          value={user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"}
        />
        <DetailItem
          label="Expiry Date"
          value={user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : "N/A"}
        />
        <DetailItem
          label="Offer Letter"
          value={
            user.offerLetter ? (
              <a
                href={user.offerLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                View Offer Letter
              </a>
            ) : (
              "N/A"
            )
          }
        />
        <DetailItem
          label="Resume"
          value={
            user.candidateResume ? (
              <a
                href={user.candidateResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                View Resume
              </a>
            ) : (
              "N/A"
            )
          }
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 py-3">
    <span className="font-semibold text-gray-700 w-40 text-sm">{label}</span>
    <span className="text-gray-600 text-sm">{value}</span>
  </div>
);

export default OfferPunch;