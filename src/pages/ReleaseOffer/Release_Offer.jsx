import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",", 2)[1]);
    reader.onerror = reject;
  });
};

const parseResumeText = (text) => {
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line);
  const resumeData = {
    name: "",
    email: "",
    phone: "",
    skills: [],
    about: "",
  };

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const sectionHeaders = ["skills", "about", "summary", "profile"];
  let currentSection = "";

  const programmingLanguages = [
    "javascript", "python", "java", "c++", "c#", "ruby", "php", "typescript",
    "go", "swift", "kotlin", "rust", "scala", "perl", "haskell", "lua",
    "r", "matlab", "sql", "html", "css", "bash", "powershell", "dart",
    "elixir", "erlang", "f#", "groovy", "julia", "lisp", "prolog", "scheme",
    "vb.net", "assembly", "cobol", "fortran", "pascal", "delphi",
  ].map(lang => lang.toLowerCase());

  lines.forEach((line, index) => {
    if (!resumeData.name && line && !emailRegex.test(line) && !phoneRegex.test(line) && index < 5) {
      resumeData.name = line;
    }
    if (emailRegex.test(line) && !resumeData.email) {
      resumeData.email = line.match(emailRegex)[0];
    }
    if (phoneRegex.test(line) && !resumeData.phone) {
      resumeData.phone = line.match(phoneRegex)[0];
    }
    const lowerLine = line.toLowerCase();
    if (sectionHeaders.some((header) => lowerLine.includes(header))) {
      currentSection = lowerLine.includes("skills")
        ? "skills"
        : lowerLine.includes("about") || lowerLine.includes("summary") || lowerLine.includes("profile")
          ? "about"
          : "";
    } else if (currentSection) {
      if (currentSection === "skills") {
        const skills = line.split(/[,;]/).map((s) => s.trim()).filter((s) => s);
        const filteredSkills = skills.filter((skill) => programmingLanguages.includes(skill.toLowerCase()));
        resumeData.skills.push(...filteredSkills);
      } else if (currentSection === "about") {
        resumeData.about += line + " ";
      }
    }
  });

  resumeData.skills = [...new Set(resumeData.skills.filter((skill) => skill.length > 2))];
  resumeData.about = resumeData.about.trim();

  return resumeData;
};

const Release_Offer = () => {
  const data = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeParseError, setResumeParseError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [testSchedule, setTestSchedule] = useState(null);
  const [form, setForm] = useState({
    jobTitle: "",
    joiningDate: "",
    expiryDate: "",
    emailSubject: "",
    emailMessage: "",
    candidateEmail: "",
    candidateName: "",
    candidatePhoneNo: "",
    companyName: data?.company || "",
    offerLetter: null,
    candidateResume: null,
    currentCTC: "",
  });
  const [errors, setErrors] = useState({});
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";
  const token = useSelector((state) => state.user.data?.token);

  const availableTags = ["Behavioral", "Technical", "Leadership", "Communication", "Problem-Solving"];
  const isPredictionMode = new URLSearchParams(location.search).get("prediction") === "true";
  const totalSteps = isPredictionMode ? 3 : 2;

  const frequencyOptions = [
    { value: "Low", label: "Low (1 test)", count: 1 },
    { value: "Medium", label: "Medium (3 tests)", count: 3 },
    { value: "High", label: "High (5 tests)", count: 5 },
  ];

  useEffect(() => {
    if (step === 3 && isPredictionMode && form.candidateResume) {
      parseResume();
    }
  }, [step, form.candidateResume, isPredictionMode]);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const joining = new Date(joiningDate);
    if (isNaN(joining.getTime())) return "Invalid joining date format";
    if (joining < today) return "Joining date must be today or a future date";
    return "";
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return "Expiry date is required";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };
    if (name === "candidatePhoneNo") {
      newErrors.candidatePhoneNo = validatePhoneNumber(value);
    } else if (name === "candidateEmail") {
      newErrors.candidateEmail = validateEmail(value);
    } else if (name === "joiningDate") {
      newErrors.joiningDate = validateJoiningDate(value);
      if (form.expiryDate) {
        newErrors.expiryDate = validateExpiryDate(form.expiryDate, value);
      }
    } else if (name === "expiryDate") {
      newErrors.expiryDate = validateExpiryDate(value, form.joiningDate);
    } else if (name === "jobTitle") {
      newErrors.jobTitle = value ? "" : "Job title is required";
    } else if (name === "candidateName") {
      newErrors.candidateName = value ? "" : "Candidate name is required";
    } else if (name === "emailSubject") {
      newErrors.emailSubject = value ? "" : "Email subject is required";
    } else if (name === "currentCTC") {
      newErrors.currentCTC = validateCurrentCTC(value);
    }
    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let newErrors = { ...errors };

    if (file) {
      newErrors[name] = validateFile(file, name === "offerLetter" ? "Offer letter" : "Candidate resume");
    } else {
      newErrors[name] = `${name === "offerLetter" ? "Offer letter" : "Candidate resume"} is required`;
    }

    setForm((prev) => ({ ...prev, [name]: file }));
    setErrors(newErrors);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const parseResume = async () => {
    setIsLoading(true);
    setResumeParseError(null);
    try {
      const arrayBuffer = await form.candidateResume.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join("\n") + "\n";
      }

      const parsedData = parseResumeText(text);
      if (!parsedData.email || !parsedData.name) {
        throw new Error("Resume must contain a valid email and name.");
      }
      setResumeData(parsedData);
    } catch (error) {
      console.error("Error parsing resume:", error);
      setResumeParseError("Failed to parse resume. Please ensure the file is a valid PDF containing a name and email.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateFormStep1 = () => {
    const newErrors = {
      jobTitle: !form.jobTitle ? "Job title is required" : "",
      candidateName: !form.candidateName ? "Candidate name is required" : "",
      candidateEmail: validateEmail(form.candidateEmail),
      candidatePhoneNo: validatePhoneNumber(form.candidatePhoneNo),
      joiningDate: validateJoiningDate(form.joiningDate),
      expiryDate: validateExpiryDate(form.expiryDate, form.joiningDate),
      companyName: !form.companyName ? "Company name is required" : "",
      currentCTC: validateCurrentCTC(form.currentCTC),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const validateFormStep2 = () => {
    const newErrors = {
      emailSubject: !form.emailSubject ? "Email subject is required" : "",
      emailMessage: !form.emailMessage || form.emailMessage === "<p><br></p>" ? "Email message is required" : "",
      offerLetter: validateFile(form.offerLetter, "Offer letter"),
      candidateResume: validateFile(form.candidateResume, "Candidate resume"),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const formSubmitHandler = async (e) => {
    if (e) e.preventDefault();

    if (!validateFormStep2()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const offerLetterBase64 = await readFileAsBase64(form.offerLetter);
      const digioRequestBody = {
        file_name: `offer-letter-${form.candidateName}`,
        file_data: offerLetterBase64,
        signers: [
          {
            identifier: form.candidateEmail,
            reason: "for signing the offer letter",
            sign_type: "electronic",
          },
        ],
        display_on_page: "All",
        include_authentication_url: true,
      };

      const formData = new FormData();
      formData.append("jobTitle", form.jobTitle);
      formData.append("joiningDate", form.joiningDate);
      formData.append("expiryDate", form.expiryDate);
      formData.append("emailSubject", form.emailSubject);
      formData.append("emailMessage", form.emailMessage);
      formData.append("candidateEmail", form.candidateEmail);
      formData.append("candidateName", form.candidateName);
      formData.append("candidatePhoneNo", form.candidatePhoneNo);
      formData.append("companyName", form.companyName);
      formData.append("offerLetter", form.offerLetter, form.offerLetter.name);
      formData.append("candidateResume", form.candidateResume, form.candidateResume.name);
      formData.append("digioReqBody", JSON.stringify(digioRequestBody));
      formData.append("currentCTC", form.currentCTC || "0"); // Send currentCTC, default to 0 if not provided
      if (isPredictionMode && resumeData) {
        formData.append("resumeData", JSON.stringify(resumeData));
      }

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

      console.log("Release_Offer.jsx: API response:", response.data);
      toast.success("Offer released successfully!");
      if (!isPredictionMode) {
        setTimeout(() => {
          navigate("/joboffers");
        }, 2000);
      } else {
        setStep(3);
      }
    } catch (error) {
      console.error("Release_Offer.jsx: Error submitting form:", error);
      const errorMessage = error.response?.data?.error || "Failed to release offer. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleTests = async () => {
    if (!selectedTags.includes("Technical")) {
      toast.error("Please select the Technical tag for assessment.");
      return;
    }
    if (!frequency) {
      toast.error("Please select a test frequency.");
      return;
    }
    if (!resumeData) {
      toast.error("Resume data is not available. Please ensure the resume is uploaded and parsed.");
      return;
    }
    if (!resumeData.skills || resumeData.skills.length === 0) {
      toast.error("No technical skills found in the resume. Please upload a resume with relevant skills.");
      return;
    }

    setIsLoading(true);
    try {
      const selectedFreq = frequencyOptions.find((opt) => opt.value === frequency);
      const testData = {
        candidateEmail: form.candidateEmail,
        candidateName: form.candidateName,
        jobTitle: form.jobTitle,
        skills: resumeData.skills,
        questionCount: 5,
        frequency: selectedFreq.count,
        joiningDate: form.joiningDate,
      };

      const response = await api.post(
        `${API_URL}/api/offer/schedule-tests`,
        testData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setTestSchedule(response.data);
      toast.success(`Scheduled ${selectedFreq.count} tests for ${form.candidateName}! Tests have been emailed to the candidate.`);
      console.log("Scheduled Tests Response:", response.data);
    } catch (error) {
      console.error("Error scheduling tests:", error);
      const errorMessage = error.response?.data?.error || "Failed to schedule tests. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateFormStep1()) {
      setStep(2);
    } else if (step === 2) {
      formSubmitHandler();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 bg-white p-6 sm:p-8 shadow-xl rounded-xl mt-10 border border-gray-200">
      {/* Stepper Navigation */}
      <div className="flex justify-between items-center mb-10 relative">
        {["Offer Details", "Release Offer", ...(isPredictionMode ? ["Candidate Profile"] : [])].map(
          (label, index) => (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-base font-semibold transition-all duration-300 ${step >= index + 1 ? "bg-indigo-600" : "bg-gray-300"
                  }`}
              >
                {index + 1}
              </div>
              <p
                className={`text-xs mt-2 font-medium text-center max-w-[100px] ${step >= index + 1 ? "text-indigo-600" : "text-gray-500"
                  }`}
              >
                {label}
              </p>
            </div>
          )
        )}
        <div className="absolute top-5 left-[10%] w-[80%] h-0.5 bg-gray-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1 - Offer Details */}
      {step === 1 && (
        <form className="w-full space-y-6">
          {[
            "jobTitle",
            "candidateName",
            "candidateEmail",
            "candidatePhoneNo",
            "companyName",
            "joiningDate",
            "expiryDate",
            "currentCTC", // Added currentCTC field to form
          ].map((name, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-700 capitalize mb-2">
                {name === "currentCTC" ? "Current CTC (Optional)" : name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  name.includes("Date")
                    ? "date"
                    : name === "candidateEmail"
                      ? "email"
                      : name === "currentCTC"
                        ? "number"
                        : "text"
                }
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${name === "companyName" ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                readOnly={name === "companyName"}
                min={name === "currentCTC" ? "0" : undefined}
                step={name === "currentCTC" ? "0.01" : undefined}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed"
              onClick={handleNextStep}
              disabled={isLoading}
            >
              Next
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="w-full space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
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
              <span className="ml-3 text-gray-600 text-lg">Releasing Offer...</span>
            </div>
          ) : (
            <form className="w-full space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
                <input
                  type="text"
                  name="emailSubject"
                  value={form.emailSubject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.emailSubject ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={isLoading}
                />
                {errors.emailSubject && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailSubject}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Message</label>
                <ReactQuill
                  theme="snow"
                  value={form.emailMessage}
                  onChange={(value) => setForm((prev) => ({ ...prev, emailMessage: value }))}
                  className={`w-full border rounded-lg ${errors.emailMessage ? "border-red-500" : "border-gray-300"
                    }`}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      ["link"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["clean"],
                    ],
                  }}
                  readOnly={isLoading}
                />
                {errors.emailMessage && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailMessage}</p>
                )}
              </div>
              {["candidateResume", "offerLetter"].map((name, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload {name.replace(/([A-Z])/g, " $1")} (PDF, Max 5MB)
                  </label>
                  <input
                    type="file"
                    name={name}
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={`w-full border rounded-lg p-3 text-gray-700 ${errors[name] ? "border-red-500" : "border-gray-300"
                      }`}
                    disabled={isLoading}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  {isLoading ? (
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
                  ) : isPredictionMode ? (
                    "Next"
                  ) : (
                    "Release Offer"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {step === 3 && isPredictionMode && (
        <div className="w-full space-y-8">
          <h2 className="text-3xl font-bold text-indigo-600">Candidate Profile & Test Scheduling</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
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
            </div>
          ) : resumeParseError ? (
            <div className="text-center text-red-500 font-medium py-8">{resumeParseError}</div>
          ) : resumeData ? (
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200 space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl font-bold shrink-0">
                  {resumeData.name ? resumeData.name[0].toUpperCase() : "C"}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800">{resumeData.name || "N/A"}</h3>
                  <p className="text-gray-600 text-sm mt-2">{resumeData.email || "N/A"}</p>
                  <p className="text-gray-600 text-sm">{resumeData.phone || "N/A"}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <h4 className="text-xl font-medium text-gray-700 mb-4">Programming Languages</h4>
                  <div className="flex flex-wrap gap-3">
                    {resumeData.skills?.length > 0 ? (
                      resumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-red-500 text-sm">
                        No programming languages listed. Please upload a resume with relevant skills.
                      </p>
                    )}
                  </div>
                </div>

                {/* About */}
                {resumeData.about && (
                  <div>
                    <h4 className="text-xl font-medium text-gray-700 mb-4">About</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{resumeData.about}</p>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h4 className="text-xl font-medium text-gray-700 mb-4">Assessment Tags</h4>
                  <div className="flex flex-wrap gap-3">
                    {availableTags.map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {!selectedTags.includes("Technical") && (
                    <p className="text-red-500 text-xs mt-2">
                      Technical tag is required for test scheduling.
                    </p>
                  )}
                </div>

                {/* Frequency Dropdown */}
                <div>
                  <h4 className="text-xl font-medium text-gray-700 mb-4">Test Frequency</h4>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${!form.joiningDate ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    disabled={!form.joiningDate}
                  >
                    <option value="">Select Frequency</option>
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {!form.joiningDate && (
                    <p className="text-red-500 text-xs mt-1">
                      Please set a joining date in Step 1 to enable frequency selection.
                    </p>
                  )}
                  {frequency && (
                    <p className="text-gray-600 text-sm mt-2">
                      {frequencyOptions.find((opt) => opt.value === frequency)?.count} tests will be scheduled between today and the joining date.
                    </p>
                  )}
                </div>

                {/* Test Schedule Display */}
                {testSchedule && (
                  <div>
                    <h4 className="text-xl font-medium text-gray-700 mb-4">Scheduled Tests</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      The following tests have been scheduled and emailed to {form.candidateName}. Each test link will only be active during its scheduled time window (60 minutes from the start time).
                    </p>
                    <ul className="space-y-4">
                      {testSchedule.testDates.map((date, index) => (
                        <li
                          key={index}
                          className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                        >
                          <p className="text-gray-800 font-medium">
                            Test {index + 1}:{" "}
                            {new Date(date).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Duration: 60 minutes | Questions: 5
                          </p>
                          <a
                            href={testSchedule.testLinks[index]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Test Link {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-600 text-sm mt-4">
                      Note: Test links are for preview only. Candidates must use the links sent via email, which are active only during the scheduled time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 font-medium py-8">
              No resume data available. Please upload a valid resume.
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all w-full sm:w-auto"
              onClick={() => setStep(2)}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="button"
              disabled={
                isLoading ||
                !resumeData ||
                !resumeData.skills ||
                resumeData.skills.length === 0 ||
                !selectedTags.includes("Technical") ||
                !frequency
              }
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
              onClick={handleScheduleTests}
            >
              Schedule Tests
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center p-3 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Release_Offer;