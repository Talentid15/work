import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const EmailVerificationPage = () => {
  let { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;

  useEffect(() => {
    async function verifyUserEmail() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/auth/verifyUserEmail/${token}`);

        if (response.data.success) {
          setIsVerified(true);
        } else {
          setError('The verification token is invalid or expired.');
        }
      } catch (err) {
        console.error("Error occurred during verification:", err);
        setError('The verification token is invalid or expired.');
      } finally {
        setLoading(false);
      }
    }

    verifyUserEmail();
  }, [token, backendUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      {loading && <Loader />}

      {!loading && (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          {isVerified ? (
            <>
              <h1 className="text-2xl font-semibold text-purple-800 mb-4">Email Verified Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for verifying your email! Your account is now under review. Please allow up to{" "}
                <span className="font-semibold text-purple-600">24 hours</span> for our admin team to finalize your account setup.
              </p>
              <div className="mt-6">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                  onClick={() => window.location.href = 'https://talentid.app/'}
                >
                  Back to Home
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-red-600 mb-4">Invalid or Expired </h1>
              <p className="text-gray-600 mb-6">
                The verification link is no longer valid. It may have expired or already been used.
              </p>
              <p className="text-gray-600 mb-6">
                If you believe this is an error, please request a new verification link or contact support.
              </p>
              <div className="mt-6">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                  onClick={() => window.location.href = 'https://talentid.app/'}
                >
                  Back to Home
                </button>
              </div>
              <p className="text-[15px] text-start pt-4">
                For assistance email us at{" "}
                <a href="mailto:support@Talentid.app" className="text-blue-400">
                  support@Talentid.app
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;
