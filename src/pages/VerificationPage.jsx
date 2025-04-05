import { useEffect } from "react";

// import usePreventNavigation from "../hooks/usePreventNavigation";

import { useContext } from "react";

import { UserContext } from "../context/UserContext";

import { useNavigate } from "react-router-dom";

const VerificationPage = () => {

    // usePreventNavigation();

    const navigate = useNavigate();

    const { isSignedUp, setSignedUp } = useContext(UserContext);


    console.log(isSignedUp);

    useEffect(() => {

        if (!isSignedUp) {

            navigate("/signup");

        }

    }, [])


    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
                <h1 className="text-2xl font-bold text-purple-700">Verify Your Email</h1>
                <p className="mt-4 text-gray-600">
                    We have sent a verification email to your registered email address.
                    Please check your inbox and follow the link to verify your account.
                </p>
                <div className="mt-6">
                    <button
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                        onClick={

                            () => {

                                window.location.href = 'https:www.//talentid.app/'
                                setSignedUp(false);
                            }
                        }

                    >

                        Back to Home
                    </button>
                </div>
                <p className='text-[15px] text-start pt-4'>For assistance email us <a href='mailTo:support@Talentid.app' className='text-blue-400'>support@Talentid.app</a></p>
            </div>
        </div>
    );
};

export default VerificationPage;


