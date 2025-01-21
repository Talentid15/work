import React, { useState } from 'react';
import axios from 'axios';

import { useContext } from 'react';

import toast from 'react-hot-toast';

import Loader from './Loader';

import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';


import { isValidEmail } from '../utils';

function PopUps({ setshowPopUps, showPopUps,emailSearch ,setSearchedResponseData}) {

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  async function checkStatusHandler() {


    try {

      setLoading(true);


      if (emailSearch === "") {

        toast.error("plz provide the email");
        setshowPopUps(false);

        return;
      }

      if (!isValidEmail(emailSearch)) {

        toast.error("plz provide the valid  email");

        setshowPopUps(false);

        return;

      }


      setshowPopUps(false);

      if (Number(data?.credits) === 0) {

        toast.error("you do not have enough  credits left");
        return
      }

      const response = await axios.post(`${backendUrl}/api/users/user-info`, {

        email: emailSearch,
        userId: data._id

      });

      console.log("response ka data ", response.data);

      toast.success("data fetched successfully");

      // make a call to backend to seraching the user 

    } catch (error) {

      console.log(error?.response?.data?.message);

      toast.error(error?.response?.data?.message);

    }
    finally {

      setLoading(false);

    }
  }

  return (
    <div>

      {

        loading && <Loader></Loader>

      }

      <div className="fixed inset-0  flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
        <div className="bg-white m-8 p-8 rounded-xl shadow-xl max-w-md w-full">
          <p className="text-base font-semibold mb-4 text-center">For Checking the status of Candidate,You need to burn one credit</p>

          <div className='flex gap-5  justify-center items-centertext-xs font-semibold'>
            <button onClick={() => setshowPopUps(false)} className=' px-10 border-[1px] border-gray-500 text-black  py-1 rounded-3xl'>Cancel</button>
            <button onClick={checkStatusHandler} className=' py-1 px-10 border-[1px] border-gray-500  text-white rounded-3xl  bg-[#56b54a]'>Proceed</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PopUps;

