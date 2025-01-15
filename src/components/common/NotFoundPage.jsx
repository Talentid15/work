
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
      <p className="text-xl text-gray-600 mb-8">No record found for that candidate</p>
      <Link to="/">
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
           Check another candidate
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;




