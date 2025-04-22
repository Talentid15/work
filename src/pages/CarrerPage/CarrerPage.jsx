import { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa";  // Import FontAwesome stars
import lg from '../../assets/kb.png'
const CareerPage = () => {
    const [editMode, setEditMode] = useState(false);
    const [companyData, setCompanyData] = useState({
        logo: lg,
        name: "Kotak Mahindra Bank",
        address: "Hyderabad, Telangana, India",
        website: "https://www.kotak.com/",
        about: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Lorem ipsum dorlor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    `,
        contactPhone: "779526789",
        contactEmail: "jobs@kotak.com",
        rating: 4, // Default rating
    });

    // Handle text field updates
    const handleChange = (field, value) => {
        setCompanyData((prev) => ({ ...prev, [field]: value }));
    };
    const handleRatingChange = (newRating) => {
        if (editMode) {
            setCompanyData((prev) => ({ ...prev, rating: newRating }));
        }
    };

    // Handle logo upload
    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyData((prev) => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="overflow-y-auto no-scrollbar">

            <div className="max-w-5xl h-[600px] no-scrollbar overflow-y-auto mx-auto p-6 bg-white relative top-2">
                {/* Edit Button */}
                <button
                    onClick={() => setEditMode(!editMode)}
                    className="absolute top-7 right-7 bg-white rounded-full text-purple-900 px-2 py-2 transition duration-300"
                >
                    {editMode ? <FaRegSave /> : <FaRegEdit />}
                </button>

                {/* Company Banner */}
                <div className="bg-purple-900 text-white text-center py-6 text-5xl font-semibold h-40">
                    <h3 className="px-20"> Know if your candidate is double dating you.</h3>
                    {/* Company Logo (Half in Banner, Half Below) */}
                    <div className="absolute left-10 top-48 transform -translate-y-1/2 w-40 h-40">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                                disabled={!editMode}
                            />
                            <img
                                src={companyData.logo}
                                alt="Company Logo"
                                className="w-full h-full rounded-full border-4 border-white shadow-lg"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex justify-between mt-28">
                    <div className="w-2/3">
                        {editMode ? (
                            <input
                                type="text"
                                value={companyData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="text-2xl font-bold border p-1 rounded w-full"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{companyData.name}</h2>
                        )}

                        {editMode ? (
                            <input
                                type="text"
                                value={companyData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="text-gray-600 border p-1 rounded w-full"
                            />
                        ) : (
                            <p className="text-gray-600">{companyData.address}</p>
                        )}

                        {editMode ? (
                            <input
                                type="text"
                                value={companyData.website}
                                onChange={(e) => handleChange("website", e.target.value)}
                                className="text-blue-500 underline border p-1 rounded w-full"
                            />
                        ) : (
                            <a href={companyData.website} className="text-blue-500 underline">
                                {companyData.website}
                            </a>
                        )}
                    </div>

                    <div className="w-1/3 text-gray-700 text-end">
                        <div className="flex justify-end">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar size={22}
                                    key={star}
                                    className={`cursor-pointer ${star <= companyData.rating ? "text-yellow-500" : "text-gray-300"
                                        }`}
                                    onClick={() => handleRatingChange(star)}
                                />
                            ))}
                        </div>
                        <h3 className="font-semibold text-md">Contact</h3>
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    value={companyData.contactPhone}
                                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                                    className="block border p-1 rounded w-full mt-1"
                                />
                                <h3 className="font-semibold text-md">Email</h3>
                                <input
                                    type="text"
                                    value={companyData.contactEmail}
                                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                                    className="block border p-1 rounded w-full"
                                />
                            </>
                        ) : (
                            <>
                                <p>{companyData.contactPhone}</p>
                                <h3 className="font-semibold text-md">Email</h3>
                                <p className="text-blue-500 underline">{companyData.contactEmail}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">About Company</h3>
                    {editMode ? (
                        <textarea
                            value={companyData.about}
                            onChange={(e) => handleChange("about", e.target.value)}
                            className="w-full h-40 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="text-gray-600 leading-relaxed">{companyData.about}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerPage;