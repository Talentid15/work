import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useSelector } from "react-redux";

const CompanyForm = () => {
  const { companyName } = useParams();
  const token = useSelector((state) => state.user.data?.token);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  const [formData, setFormData] = useState({
    companyName: companyName || "",
    logo: "",
    address: "",
    website: "",
    about: "",
    contactPhone: "",
    contactEmail: "",
    companySize: "", // Added companySize
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        console.log(`🚀 Fetching company: ${companyName}`);
        const response = await api.get(`${API_URL}/api/company/${companyName}`);
        console.log("✅ API response:", response.data);
        setFormData(
          response.data.data || {
            companyName: companyName,
            logo: "",
            address: "",
            website: "",
            about: "",
            contactPhone: "",
            contactEmail: "",
            companySize: "", // Initialize companySize
          }
        );
      } catch (error) {
        console.error("❌ Error fetching company:", error.response?.data);
        if (error.response?.status === 404) {
          console.log(`ℹ️ Company not found, showing empty form`);
          setFormData({
            companyName: companyName,
            logo: "",
            address: "",
            website: "",
            about: "",
            contactPhone: "",
            contactEmail: "",
            companySize: "",
          });
        } else {
          toast.error(error.response?.data?.error || "Failed to load company data.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [companyName, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setTouched((prev) => ({ ...prev, [name]: true }));
      };
      reader.onerror = () => toast.error("Error reading logo file.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.website || !/^(https?:\/\/)/i.test(formData.website)) {
      newErrors.website = "Valid website URL is required.";
    }
    if (!formData.about) newErrors.about = "About is required.";
    if (!formData.contactPhone || !/^\+?\d{10,15}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Valid phone number is required.";
    }
    if (!formData.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Valid email is required.";
    }
    if (!formData.companySize) newErrors.companySize = "Company size is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        console.log(`📤 Saving company: ${formData.companyName}`);
        const response = await api.put(
          `${API_URL}/api/company/${companyName}`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(`✅ Save response:`, response.data);
        // Store companySize and address in localStorage
        localStorage.setItem(
          `company_${companyName}`,
          JSON.stringify({
            companySize: formData.companySize,
            address: formData.address,
          })
        );
        toast.success("Company saved successfully!");
        window.location.reload();
      } catch (error) {
        console.error(`❌ Error saving company:`, error.response?.data);
        toast.error(error.response?.data?.error || "Failed to save company.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="animate-spin h-8 w-8 text-purple-600"
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
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Edit Company: {companyName}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          {formData.logo && (
            <img src={formData.logo} alt="Logo" className="w-24 h-24 object-contain mb-2" />
          )}
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-50 file:text-purple-700 file:hover:bg-purple-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Size</label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select size</option>
            <option value="Startup">Startup (1-10)</option>
            <option value="Small">Small (11-50)</option>
            <option value="Medium">Medium (51-200)</option>
            <option value="Large">Large (201+)</option>
          </select>
          {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
            rows="4"
          />
          {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            ) : (
              "Save Company"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;