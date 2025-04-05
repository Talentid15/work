import  { useState } from 'react'
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import axios from "axios";

import toast from 'react-hot-toast';

import Loader from '../components/Loader';

import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

  const navigate = useNavigate();
  
  const {id} = useParams();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';


  const [loading, setLoading] = useState(false);

  // const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;

  const [password, setPassword] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState(true);

  const [passwordData, setPasswordData] = useState({ password: "", confirmPasswordValue: "" });

  async function resetPasswordhandler(event) {

    event.preventDefault();

    if (passwordData.password === "" || passwordData.confirmPasswordValue === "") {

      toast.error("all fields are required")

      return;

    }

    // here i have to make database call to update the password

    try {

      setLoading(true);

       await axios.post(`${API_URL}/api/auth/forgotPassword`, {

        password:passwordData.password,
        confirmPassword:passwordData.confirmPasswordValue,
        userId:id
        
      })

      toast.success("Password changed successfully");

      navigate("/login");

    } catch (error) {
      
      console.log(error);

      toast.error(error?.response?.data?.message);

      // toast.error("Failed to change password", error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className='flex flex-col gap-12 min-h-screen w-full justify-center items-center'>
      {

        loading && <Loader></Loader>
      }

      <div className=' flex flex-col justify-center items-center border gap-3 rounded-xl shadow-2xl p-10'>

        <h1 className='text-center text-black text-xl font-semibold'>Reset Your Password </h1>

        <div className=' relative flex flex-col'>

          <label className='text-gray-800' htmlFor="Cpd">New Password</label>
          <div className='relative w-full lg:w-max'>
            <input placeholder='Enter Current password'
              className='bg-[#f5f5f5]
             text-black placeholder:text-xs lg:placeholder:text-lg placeholder:text-gray-500 p-3
              focus:outline-none rounded-lg  lg:w-[400px] w-full '
              type={`${password ? "password" : "text"}`}
              value={passwordData.password}
              onChange={(event) => {

                setPasswordData({ ...passwordData, password: event.target.value });

              }}
            />
            <span onClick={() => {

              setPassword(!password);

            }} className='absolute top-4 right-4 cursor-pointer'>{

                password ? <VscEye /> : <VscEyeClosed />

              }
            </span>
          </div>
        </div>

        <div className='flex flex-col'>
          <label className='text-gray-800'>ConFirm Password</label>
          <div className='relative w-full lg:w-max'>
            <input placeholder='Enter New password'
              className='bg-[#f5f5f5] text-black
           placeholder:text-gray-500 p-3 w-full focus:outline-none 
           rounded-lg lg:w-[400px]'
              type={`${confirmPassword ? "password" : "text"}`}
              value={passwordData.confirmPasswordValue}
              onChange={(event) => {

                setPasswordData({ ...passwordData, confirmPasswordValue: event.target.value });

              }}
            />

            <span onClick={() => {

              setConfirmPassword(!confirmPassword)

            }} className='absolute top-4 right-4 cursor-pointer'>{

                confirmPassword ? <VscEye /> : <VscEyeClosed />

              }</span>
          </div>


        </div>

        <button className='rounded-full border mt-3 w-fit p-3 bg-indigo-500 text-white' onClick={resetPasswordhandler}>reset Password</button>

      </div>

    </div>
  )
}

export default ForgotPassword;