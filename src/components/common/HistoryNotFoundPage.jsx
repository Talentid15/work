// src/components/NoHistoryPage.js

import React from 'react';
import { FaHistory } from 'react-icons/fa';

const NoHistoryPage = () => {
  return (
    <div className='flex items-center justify-center h-screen mt-14 mix-blend-multiply'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-screen-sm text-center mr-6'>
        <FaHistory className='text-gray-400 text-6xl mb-4' />
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>No History Found</h1>
        <p className='text-gray-600 mb-6'>
          It looks like you don't have any history at the moment. Please check back later or start exploring.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default NoHistoryPage;

