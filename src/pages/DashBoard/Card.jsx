import { FaCircle } from "react-icons/fa6";

const Card = ({ title, value, statusColor, iconColor }) => {
  return (
    <div className="flex items-center justify-center p-6 py-8 bg-white border-purple-600  rounded-3xl shadow-lg hover:shadow-xl transition duration-300 border-2  w-[250px] h-[150px] group">
      <div className="text-center w-[250px] h-[100px]">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {title}
        </h2>

        <div className="group-hover:hidden transition-all duration-500 ease-in-out">
          <p
            className={`mt-1 text-lg  font-medium ${statusColor} flex items-center justify-center animate-slide-down`}
          >
            <FaCircle
              className="h-4 w-4 shadow-custom-green rounded-full border-none "
              style={{ color: iconColor }}
            />
            <span className="mr-2 m-2">{value}</span>
          </p>
        </div>

        <div
          className="group-hover:block hidden bg-custom-gray rounded-full p-2 px-3 mt-2 font-poppins font-semibold 
                     transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:animate-slide-up transition-all duration-500 ease-in-out"
        >
          <button className="text-white">View More</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
