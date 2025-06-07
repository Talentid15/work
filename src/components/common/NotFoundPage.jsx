
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className=" w-screen h-full relative">

      <div className='flex relative flex-col py-10 w-[80%] h-full items-center justify-center mx-auto text-center bg-gray-100'>

        <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-8">No record found for that candidate</p>
        <Link to="/">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
            Check another candidate
          </button>
        </Link>

      </div>
    </div>
  );
};

export default NotFoundPage;




