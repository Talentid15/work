import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { dateDifference } from "../../utils";

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
  });
};

const Release_Offer = () => {
  const data = useSelector((state) => state.user.data);
  const [step, setStep] = useState(1);
  const [form, setform] = useState({
    jobTitle: "",
    joiningDate: "",
    expiryDate: "",
    emailSubject: "",
    emailMessage: "",
    candidateEmail: "",
    candidateName: "",
    candidatePhoneNo: "",
    companyName: data.company,
    offerLetter: null,
    candidateResume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiryDate" && !form.joiningDate) {
      toast.error("Please Enter the Joining Date First");
      return;
    }

    setform((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setform((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!form.offerLetter || !form.candidateResume) {
      toast.error("Please Upload Offer Letter and Candidate Resume");
      return;
    }
  
    let diffBwDays = dateDifference(form.joiningDate, form.expiryDate);
    if (diffBwDays > 90) {
      toast.error("Joining Date should be within 90 days of the Expiry Date");
      return;
    }
  
    const offerLetterBase64 = await readFileAsBase64(form.offerLetter);
  
    const digioRequestBody = {
      file_name: `offer-letter-${form.candidateName}`,
      file_data: offerLetterBase64,
      signers: [
        {
          identifier: form.candidateEmail,
          reason: "for sign the offer letter",
          sign_type: "electronic",
        },
      ],
      display_on_page: "All",
      include_authentication_url: true,
    };

    console.log("digio req body at the forntend side ",digioRequestBody);
  
    var formData = new FormData();
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
  
    formData.append("digioReqBody", JSON.stringify(digioRequestBody)); // Fixed this
  
    try {
      console.log("Form data is", form);
      const response = await axios.post("http://localhost:4000/api/offer/create-offer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Response is", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };
  
  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 bg-white p-6 sm:p-8 shadow-xl rounded-xl mt-10 border border-gray-200">
      {/* Stepper Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
        {["Offer Details", "Release Offer"].map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-semibold transition-all duration-300 ${step === index + 1 ? "bg-indigo-600" : "bg-gray-400"
                }`}
            >
              {index + 1}
            </div>
            <p className={`text-sm mt-2 font-medium ${step === index + 1 ? "text-indigo-600" : "text-gray-500"}`}>
              {label}
            </p>
          </div>
        ))}
        <div className={`absolute top-6 left-1/4 w-1/2 h-1 ${step === 2 ? "bg-indigo-600" : "bg-gray-300"}`}></div>
      </div>

      {/* Step 1 - Offer Details */}
      {step === 1 && (
        <form className="w-full space-y-5">
          {["jobTitle", "candidateName", "candidateEmail", "candidatePhoneNo", "companyName", "joiningDate", "expiryDate"].map(
            (name, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700 capitalize">{name.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={name.includes("Date") ? "date" : "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${name === "companyName" ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  readOnly={name === "companyName"}
                />
              </div>
            )
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2 - Release Offer */}
      {step === 2 && (
        <form className="w-full space-y-5" onSubmit={formSubmitHandler}>
          <div>
            <label className="font-semibold text-gray-700">Email Subject</label>
            <input
              type="text"
              name="emailSubject"
              value={form.emailSubject}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Email Message</label>
            <ReactQuill
              theme="snow"
              value={form.emailMessage}
              onChange={(value) => setform((prev) => ({ ...prev, emailMessage: value }))}
              className="w-full border rounded-lg"
            />
          </div>

          {["candidateResume", "offerLetter"].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700">Upload {name.replace(/([A-Z])/g, " $1")}</label>
              <input type="file" name={name} onChange={handleFileChange} className="w-full border rounded-lg p-3" />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              Release Offer
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col justify-center items-center p-3 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Release_Offer;
