// components/ProfileCard.js
import React, { useState } from "react";
import { BsUpload } from "react-icons/bs";

import Loader from "../Loader";

import { dateDifference } from "../../utils";

import {
  MdOutlineRemoveRedEye,
  MdOutlineLocalPhone,
  MdOutlineMail,
  MdOutlineLocationOn,
  MdDelete,
} from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

const AddCandidate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState([{ id: Date.now(), value: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    offerDate: "",
    joiningDate: "",
    status: "",
    experience: "",
    educationDegree: "",
    educationCollege: "",
    resumeLink:""
  });

  // Add a new skill input fieldW
  const addSkillField = () => {
    setSkills((prevSkills) => [...prevSkills, { id: Date.now(), value: "" }]);
  };

  // Handle skill input value change
  const handleSkillChange = (id, value) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) => (skill.id === id ? { ...skill, value } : skill))
    );
  };

  // Remove a skill input field
  const removeSkillField = (id) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(name);

    if(name ==="joiningDate" && candidateDetails.offerDate === ""){

      toast.error("Offer Date is required");

      return ;
    }

    if(name == "joiningDate" && candidateDetails.offerDate !=""){

        if(dateDifference(candidateDetails.offerDate,value)<0){

          toast.error("Joining Date should be greater than Offer Date");

          return ;

        }
      
    }

    setCandidateDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddCandidate = () => {
    const candidateData = {
      ...candidateDetails,
      skills: skills.map((skill) => skill.value),
      imagePreview,
    };

    // offer date and joining date muts be provide 

    if(candidateData.name === ""){

      toast.error("Name is required");
      
      return;

    }
    
    if(candidateData.phone === ""){

      toast.error("Phone is required");
      
      return;
    }

    if(candidateData.email === ""){

      toast.error("Email is required");
      
      return;

    }

    if(candidateData.joiningDate ==""){

      toast.error("Joining Date is required");

      return;
    }

    if(candidateData.offerDate ==""){

      toast.error("Offer Date is required");
      
      return;
    }

    if(candidateData.skills.length < 3){

      toast.error("atleast provide three skills ");
      
      return;

    }

    console.log("Candidate Details:", candidateData);


    setCandidateDetails({
      name: "",
      phone: "",
      email: "",
      address: "",
      offerDate: "",
      joiningDate: "",
      status: "",
      experience: "",
      educationDegree: "",
      educationCollege: "",
    });
    setSkills([{ id: Date.now(), value: "" }]);
    setImagePreview(null);
  };


  async function fileUploadHandler(e) {

    try {

      setLoading(true);

      console.log(e.target.files[0]);
      const formData = new FormData();
      formData.append("resume", e.target.files[0]);

      // let token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjY3OGZlM2MyYTBmYWE0N2QyODBkMDA0MiIsImlhdCI6MTczNzQ4MzI3N30.PQbaxodYV-J5vmMcNXXf0tsCN23GcdXXYl96NDeYt0Y";

      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("i am in oip file upload handler", response.data.response);

      setLoading(false);

      toast.success("data fetched from resume successfully ");

      setCandidateDetails({
        ...candidateDetails,
        name: response.data.response.Name,
        email: response.data.response.Email[0],
        phone: response.data.response.Phone,
        resumeLink:response.data.response.Uploaded_File_URL || "",
        
      });

      let SkillsArray = response.data.response.Skills;

      let updatedSkills = SkillsArray.map((data, index) => ({
        value: data,
        id: `${Date.now()}-${index}`, // Generate unique IDs
      }));

      setSkills(updatedSkills);

    } catch (e) {

      toast.error(e.message);

    }
    finally {

      setLoading(false);
      
    }

  }


  return (

    <div className="no-scrollbar bg-[#EEEEEE] rounded flex flex-col shadow p-4 w-full mx-auto h-screen sm:max-h-[600px] overflow-y-auto">
      <div
        className="flex gap-2 justify-start items-center cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <IoIosArrowBack size={30}></IoIosArrowBack>
        <h1 className="text-slate-700 text-2xl font-semibold">Profile</h1>
      </div>


    loading ? <Loader></Loader>
      : <div className="no-scrollbar bg-[#EEEEEE] rounded flex flex-col shadow p-4 w-full mx-auto h-screen sm:max-h-[600px] overflow-y-auto">

        <div
          className="flex gap-2 justify-start items-center cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowBack size={30}></IoIosArrowBack>
          <h1 className="text-slate-700 text-2xl font-semibold">Profile</h1>
        </div>

        <div className=" flex flex-col sm:flex-row items-center sm:space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full relative overflow-hidden flex items-center justify-center cursor-pointer mb-4 sm:mb-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <label
                htmlFor="photoInput"
                className="absolute inset-0 flex items-center justify-center text-sm text-gray-500"
              >
                + Upload
              </label>
            )}
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex-grow mb-6">
            <h2 className="text-2xl font-bold text-[#818181]">
              <input
                type="text"
                name="name"
                placeholder="Enter the name"
                value={candidateDetails.name}
                onChange={handleInputChange}
                className="bg-transparent outline-none text-[#818181] w-full"
              />
            </h2>
            <div className="w-1/2 h-[1px] bg-[#818181] my-2"></div>
            <hr className="text-black" />
            <p className="flex gap-2 text-sm text-[#818181]">
              <MdOutlineLocalPhone className="text-black mt-1" size={25} />
              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={candidateDetails.phone}
                onChange={handleInputChange}
                className="bg-transparent outline-none text-[#818181] w-full"
              />
            </p>
            <p className="flex gap-2 text-sm text-[#818181]">
              <MdOutlineMail className="text-black mt-1" size={25} />
              <input
                type="text"
                name="email"
                placeholder="Email address"
                value={candidateDetails.email}
                onChange={handleInputChange}
                className="bg-transparent outline-none text-[#818181] w-full"
              />
            </p>
            <p className="flex gap-2 text-sm text-[#818181]">
              <MdOutlineLocationOn className="text-black mt-1" size={25} />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={candidateDetails.address}
                onChange={handleInputChange}
                className="bg-transparent outline-none text-[#818181] w-full"
              />
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4 w-full sm:w-[350px] mb-5">
            {/* Offer and Joining Dates */}
            <div className="text-sm text-gray-800">
              <div className="flex mb-2 gap-2">
                <span className="font-bold">Offer Date :</span>
                <input
                  type="date"
                  name="offerDate"
                  value={candidateDetails.offerDate}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none text-gray-600"
                  placeholder="Enter the date"
                />
              </div>
              <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-20"></div>

              <div className="flex mb-2 gap-2">
                <span className="font-bold">Joining Date :</span>
                <input
                  type="date"
                  name="joiningDate"
                  value={candidateDetails.joiningDate}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none text-gray-600"
                  placeholder="Enter the date"
                />
              </div>
              <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-20"></div>

              <div className="flex mb-2 gap-2">
                <span className="font-bold">Status :</span>
                <input
                  type="text"
                  name="status"
                  value={candidateDetails.status}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none text-gray-600"
                  placeholder="Enter status"
                />
              </div>
              <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-10 mb-5"></div>
            </div>
            {/* View Predictions Button */}
            <button className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 w-full rounded">
              <i className="text-xl">
                <MdOutlineRemoveRedEye />
              </i>
              View Predictions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 w-full h-auto mx-auto">
          <div className="flex flex-wrap justify-between gap-4 pr-6">
            <div className="flex flex-col w-full sm:w-auto">
              <h3 className="text-lg font-semibold text-gray-800">
                Experience summary
              </h3>
              <input
                type="text"
                name="experience"
                value={candidateDetails.experience}
                onChange={handleInputChange}
                className="w-full sm:w-[300px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="About their work experience..."
              />
            </div>

            <div className="flex gap-2 justify-center items-center mr-4">

              <BsUpload />
              <input type="file" className="h-[40px] px-2 py-2 bg-[#EEEEEE] rounded hover:bg-gray-300 flex sm:w-auto" onChange={fileUploadHandler} />

            </div>
          </div>

          {/* <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Education summary
              </h3>
              <input
                type="text"
                name="educationDegree"
                value={candidateDetails.educationDegree}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Degree Eg: BA, BBA, BE, BTECH..."
              />
              <input
                type="text"
                name="educationCollege"
                value={candidateDetails.educationCollege}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="College..."
              />
            </div>
          </div> */}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Engagement Preference
            </h3>
            <div className="relative flex flex-wrap w-full gap-4 mt-1">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <input
                    type="text"
                    value={skill.value}
                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                    className="border border-gray-300 rounded p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-[200px]"
                  />
                  <div
                    onClick={() => removeSkillField(skill.id)}
                    className="text-white rounded px-2 py-1 cursor-pointer"
                  >
                    <MdDelete className="text-slate-700" size={20} />
                  </div>
                </div>
              ))}
              <div
                onClick={addSkillField}
                className="bg-white rounded flex items-center justify-center cursor-pointer w-full sm:w-auto"
              >
                <FaPlus size={20} />
              </div>
            </div>

            <div className="flex justify-end items-end mt-4">
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-[#652D96] text-white rounded-3xl hover:bg-purple-800"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default AddCandidate;
