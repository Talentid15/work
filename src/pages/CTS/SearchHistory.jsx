import React, { useEffect, useState } from "react";
import ellipse from "../../assets/ellipse.png";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { formateDate } from "../../utils";

import { useDispatch } from "react-redux";

const SearchHistory = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const historyData = useSelector((state)=>state.user.userHistoryData);

  console.log("user history data ",historyData);

  const [userHistoryData,setUserHistoryData] = useState(null);


  function viewMoreHandler(data){

    console.log("view more handler data is ",data);

      // dispatch(setPipelineData(data));

      console.log("data is ",data.appliedCompanies[0]._id);

      // dispatch(setPipelineData(data.appliedCompanies));

      // navigate(`/pipeline/${data.appliedCompanies[0]._id}`);

  }

  return (
    <div className="relative h-full overflow-hidden p-6 md:p-8 flex flex-col bg-white ">
      {/* Header */}
      <div className="w-full relative flex flex-col md:flex-row align-start justify-between pb-5 border-b border-gray-300 mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="flex items-center text-gray-800 focus:outline-none" >
            <IoIosArrowBack className="text-2xl mr-4" onClick={()=>{

              navigate("/")

            }}/>
            <span className="font-bold text-xl md:text-2xl">Search History</span>
          </button>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Link to="/">
            <button className="flex items-center px-4 py-2 bg-white font-semibold border-purple-600 rounded-full text-gray-800 hover:bg-gray-100 space-x-3 transition duration-200 shadow-md">
              <HiOutlineUsers className="h-5 w-5" />
              <span>Track Candidate</span>
            </button>
          </Link>

          <button className="flex items-center px-5 py-2 bg-[#74449E] text-white rounded-full hover:bg-[#5a2889] space-x-3 transition duration-200 shadow-md">
            <FaFileCircleQuestion className="h-5 w-5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative h-[30rem]">
        <table className="w-full relativebg-white shadow-lg  rounded-xl border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
              <th className="p-4 text-md">Profile</th>
              {/* <th className="p-4 text-md">Name</th> */}
              <th className="p-4 text-md">Email</th>
              <th className="p-4 text-md">Last Searched on</th>
              <th className="p-4 text-md">View pipeline</th>
            </tr>
          </thead>
          <tbody className="">
            {historyData.map((candidate, index) => (
              <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                <td className="p-4">
                  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwQMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIFAwQGBwj/xAA8EAABAwIEAwUFBwMDBQAAAAABAAIDBBEFEiExBhNBIlFhcZFSYoGxwRQjMkKh0fAHFfFDU+FygpKywv/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACMRAQEBAAEFAAICAwAAAAAAAAABAhEDBBIhMTJBE1EUM0L/2gAMAwEAAhEDEQA/AEAmEBNfJj6ZgKQCQ2TCJTTCSkAiAJ2QE0CTsmoSSNiY50pytaLp7OUkKqh4gwuoic5tbEyxsQ91j6LWn4qoW6QMlmJFw5rMrfU+a14aS6n7Xya42u44ZDpHSgu6gv8A2UqLjYSFhrqMxMPVjrn0stfxa454Z/kzb9dgha9DWU1dCJaSZkrD7J1Hmtmyw2LIsmkgSSaFAWRZAUgEAApAIAUrKhWQmhBoBSCQCkpGgmEAKQCJQFJKyYRAmEWTI0VCfI1jHPeQGtFySbABee49jr8VrBTxl0VM0ZrBxvIBvtpr+i6zi6Qx8P1Tha5AaM22pC4TDMJrcRxWEYfC427TpHC7Wjx16aLv0sz8q5dS38YrYZS+Yxsp4msaLbdq3n1VoxtTNGY6WmeC1valy29O5emYPwfh1FG17oRNUEduSTUkq7bSxRMsIo2gaAAALrer/TE6F/bxFmB1RY57qZxaBr2TqVr1wk5ZbJDJHI3QF23X9h+q9wqIWW1aAPBU+JUME0VjFcHe4WP5uPsb/wAeX5Xm3DOJxUWKRZnmCJ1sw1y6948l6g05gCLWXn+O4AW5paNtuz2mdF03B+JnEMKaJD99T2if46aH4/usdTjU8ouZc3xq8SKaVlxdCQnZOyAATRZOyBjZMJKSAQkhBpBMBAUgFItATCLJogTTCdkCTO2iExuqOP4+kzf2+lv926R0jwOtrAf+xXVcGUTKfD8zRbNa571zXFNM6qx7CommznteGnuN2rsppo8Gwy0Tbua2wB6nx/Zd/wDmRjP5WrlrXW7OyxyMdY2XAy8VcQO5jaWEbntCLVg+Xcuk4UxKvqY3/wBxeyZx/CQLEeYFk9Ne/qyezPEDl7Qaq+pjdlW/ilQKRj3yENaG6krzGoOI4vWyT0NQ+RjDbmglrW+Gbb0U8eVmnUVUGZzm97SFRcOwSYbxFLA7RlREdPeFiPr6rBQPximrI2Vjs8R0uXgj1XRVkDf73hMwyglko37m/wDKScJrXK1TQiy4rfoQnZCATSTQCaSaB3QhCDTCkAgbJgKRaAFKyAmiAJpJhUCE02i7gLX1270JHPY92MewOXo2ZzfUtXXVtGKyJo5cbnj8JkFwCsVfgjKrDKOrqxH9ogkZKHwtytb2hcWJNxbrdXFPG1zBfxsu09xPjhsW4ZxWspsgxR0TQ4jlxtytIuOgNwdDffc7bK54dwmTDmkvc85rWDzfL4roZKe2o2UGvzuDQQGg2c47Jasqmx2lNTT1EOYkyRlrh56LiWYNI/CpcLqRs68U7W5sulrWOwse699d16BiesjnxOjMgBIbm3XP01XHPjFZSuZkkicA5rumg/cJLZ7XjlW4Zg09BTU7YpjaM9prhdrx9N/LQdb3ssZkZFjGEZRaMmYZjsOxf0V02naWgWuq3iOloxHSurYeeGyDKy9r6tBPjYX0T7GeJzw2WkFoIIIOxCar8Gq3VUNRzdXw1UsN7WuATl2HcQPgrBcrGrOKSEIUQIukUrqCSaimEDQldCDANkwkFIFItNNNFkQBNCaoSYNiDe1uqEIsWGJzB9C4yC8MdO6RvdmaNvPb0W9RytfExw1BF7dypZZ2f22pp5rFr4nBp7rhanDWLNmwemnkkbYMDH+Y0Py/VdYzXUVkxFM8Ntqeq5zHajCoI6eKpe57mPaQ1jyAXe9byW9jUdVXU9NFQvsHyAvd7tj9Vhjw6rhDR9wA0Czo4uluriSbq8RcuX4hNNJhLKuSKojjdKCGE/gPQ3Oo8lkwCGlmrZ8QiqHyvqCCc5F2nYD00VvXw1M5MZn7G2UtJzeaoqvAcQ5zHUjIYomm+dnYLt9C3a3iq3Zw7elbqD8Fx/8AUSGoxGsoKKjiMjo2OleQdGNJAuT0tuugir3U9FSNqmWmLspB66C5VHST/b+I6yTnOMMLGsy9HkEm5PgbeitvpyzbN8rOkpY6Nj2sBvJK6RxI1LnG59NAs5Rf+dEl529Xm8hCEXUQikmldAXRdK6RKlWHdCjdCBAJhIKQ2VhTCkAohSRAmhCAsiyEKhO1FiAfNcbOyTh/E5WuizUFQ7Mw78s6b/r6Ls1mZRQV1LNT1EbZGOFiCOhC1m+0rZwaTLTNDZMwI0t0Vi4Oexwva437l5xWyYpwlOzk/f4e0nIXdB3Ldpf6h08gyvby3W2J2On6Lr41nyi6qcOqBXPkNVIIzbI0dP59FvxAuADjfL1K4+s45hdIC0NLdic2ixyccB9PyqKLPVSOAb3a/wAKTNLqJcY1jqOuBMpe6wEcbW6Ak/uFv8O0bqPDI2ygiaTtyE31cd91kp+HnOczFMTfzaprQWsIFozp8rKwaFjd/S5gCdkJLm1yEkyokqAskU0lKsRKRTKgUU0KF0kGYKQSTCsSmmkmiGhCEAhC57GuLsOw7NHTn7XUN/LGey0+Lunwv8FrObr4l1MzmrqtraWgp3T1szYYmnVzr7+Q1Vlgr2zxCVuYMkaC3M0tJHkbELgOD6p3EPE7psWc17oIC+CG3YYbtuQO/X+WXpkDbPNhYELr4eNZmvKMVdTQVLTHOxj22tZzbrgse4DYc09A4x3N8o1C9JIFjmWFz22LVucxmyWPGKXhSolqWxyiRlzrpqP1XeYPwjQ4blmLDJKSC10ljlI7l0RiHNDsrb9Vklk5jmxd3VW65SZk+JviL6N7W720/Rc/DWwSVMlKXZKmMXdDILOt3jvHiNF1EQyxfBeT/wBRKpw4gh5Lix8EX4mmxudd/iFz8PKr5cTl3KF5xhPGFfSfd1VquPukNnD/ALuvxBXY4VxDhuKWZDNy5j/oygNd8O/4FZ309ZXPUzpalKydkWXJ0JCaFKsQIWMrIdlAorGhNCDOmopohp3SVDxBxRR4QHxxvE9Zawibsw+8enktZzb8TWpPq/LgASSABuT0XOYvxjh9Bmjpz9smbpaNwDGnxd+11wGIYpiGJEuq6mWRpNxHcho8m7LSyut+FerHbz7qvNrr/qLjFeI6/FSWVL8sX+ywlrfj3/EqpcWkEZGt8lBMamy9EzJ8cLbfq0wHEn4VidPWx3PJfZ7erm7Eei9ww6spsQpIquimEkMguCPkR0Ph0K+fGZmuPZd6K54f4hrsDndLRSNDXkZ4JW9l/p18te9Z3jybxvx9Pc3HTRadZJZpLTZwG65bD/6jYZNGBiNPPSv6lg5jfhax/T1UpuLcEqZrxVp5fe+N4+i43OnbO81b4fLO2V/PlzAm4C34W/eF3Urkjxbw9TOLzVTTEdI4HfN1gqnEP6hSvDmYVSctv+5PYuA8h+6TGlu8x6BxBjtPglC1872mVzTy49LuXiuL1slfWy1Mx7czrkdwWPEMSqa6Z09TO+ed2jnO107h4LT7Ttcrl2xjx9uG92+oysdl/K0+alzfdasBzIut3+3Pnh0GFcU4hh5a18n2iEacqU3t5O3C7HDOK8Lr7NdKKeY6cuYW9D1Xl3a9lybD2h2eq5b6OdOmerrL2u+2o29UiVwPD/Es1FG2CpvLTdOrmDwPX4rtaWrp6yHm00ge0223HmvJvp6w9WN517ZiVAlTUHLk6oXQhCDYRvokmDqg5TjvGZaKCOjpJnRzTdqRzTZzWd3x19F58Re7he19ydb+Kt+I6r7bjlXKXdnmctl+5un0v8Vo8u7SMzdl9HpZ4y+f1Nc6ana9pPM72neqllu09bHoo21XRzJAU+X7zUi3L+ZqBZ3e05I5nfmQm1ubXNbzQJr3t/C6ylzZPaRk95qgR43QSMkh0zKJI/M5G+ifL95qCIJ/KsrHO9pyWT3moComfe3UCFla3N+ayHR+81BhzO9pyBm9pyk1naWang51RHH7RQZKXQtYep0XT8JVBp8RfY/dSFsb/ofh9Vy9S5prXZHNyxn5K/pyKWSRhLScr5Hf+Tfleyms+U4azfG8vQtfzG/isbkqWUz0sUh3tr5jT+eak9fLs4vD6UvM5QQlZCgzrUxesbQ4bVVWxYwlh946N/UraXL/ANQKtsdBT03WZ5cf+lv/ACR6LfTnOozu8ZefSnS53usmb7weShJlII7WvioMffI7xt/P1X0+OHzeeWVg0KTmrLEW2d5puyW0a66DXso2WRwUbd+yCNkwFMcv2XeqDb8qDGUlIoGX8zXX8EEUWUzl9l3qolAgndA9/ZSvH7LkDasmXRY22v2WrZi1FkEY4u9b2Fx2fNUHaNhI9FKKNvsu26LcEbYcPrWNa6/Kv8EHNwNMspA3cbepV3M9wdWk7iiPq511V4YwmqZ3b/z4rdll5javS5nlZCz4bqweiYHKHQOb0IBH8+AW84qk4ena9mYaAueB5Zv8K3e5fO7icbe/oXnIumsWZC4Ozb6Lzrjyo5uO8rNdsETWAeJ7X1C9Fv3bryfiGf7TjddMNnTOA8h2R8l6u2nOnn7i8ZVbjZpPioZunxWUuy6+0sbnuH+Ava8TZhdoe65WRYKZxdfMs2xugi4aKFlnEjuu3RQc5zv8IMSCUyEg9zfw7IESo31UzK7+WUCcyB3Qhuhusgc46f8AygxIU3OcdPooWQSatyDZa8bnN0W5A92iKsKQaCy3HGMyZJHtaHt5bru1cCtamNhf5LDj0gFAHNDGyF7Rm9b/AFQU8eaj54dpK1xjaPH/ADYpsk5LszNW0w7PjIdvp6FRnxCSpqnTEjMbNaA3c7XPotmkjElTDCT93D95IbbkC/y+aI7Hh5pggp4j/pgNPnb/ACr571z+DkmOFz9zdx+JV2+TReTvJ6leztb9h5k1h5iF4eHq4WNXMKakmnO0Ubn+guvIMryMx/ETcpIXu7b5Xj7j7GN7Ty9RrdYv4EIXreVKEOaQRss4BcNkIQhZ8qY7WyEIGY39wUHtLNe9CEGIlSawu2GiEIJ5CAgbIQgMmZAjNtk0IJMaWkLchCEIN5ji0AWVTj8ryyKO3Z1cfl+6EIrQowGh0xF8g9SdlcUUZFBI5ovJO8R3Pjq4/JCER1tGwsdGwDRoAHkrKY5fQJoXDu/9b0dt+bXzJoQvlvpP/9k=" alt="profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
                </td>
                {/* <td className="p-4 text-sm font-medium text-gray-800">{candidate.name}</td> */}
                <td className="p-4 text-sm text-gray-600">{candidate.email}</td>
                <td className="p-4 text-sm text-gray-600">{formateDate(candidate.createdAt)}</td>
                <td className="p-4">
                  <button className="text-sm text-white bg-purple-600 rounded-full px-5 py-2 font-medium hover:bg-purple-200  hover:text-black focus:ring-2 focus:ring-purple-500 transition duration-200">
                    View more
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SearchHistory;
