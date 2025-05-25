import { useState, useContext, useEffect } from "react";
import { Search, Users, FileText, UserPlus, Menu, X, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PipelineContext } from "../../context/PipelineContext";
import PopUps from "../../components/PopUps";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const StatusCard = ({ company, status, offerDate, statusColor, iconColor }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white/30 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
      <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-purple-600">
        <Users className="h-6 w-6" style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
        {company || "Unknown Company"}
      </h3>
      <p className={`text-sm font-medium ${statusColor} mt-2`}>{status || "Unknown"}</p>
      {offerDate && (
        <p className="text-xs text-gray-500 mt-2">Offer Date: {offerDate}</p>
      )}
    </div>
  );
};

const FeedbackCard = ({ rating, comment, createdAt, reviewer }) => {
  return (
    <div className="flex flex-col p-6 bg-white/30 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
          <span className="text-lg font-semibold text-purple-600">{rating}/5</span>
        </div>
        <p className="ml-4 text-sm font-medium text-gray-700">
          From: {reviewer?.name || "Anonymous"}
        </p>
      </div>
      <p className="text-sm text-gray-700">{comment || "No comment provided."}</p>
      <p className="text-xs text-gray-500 mt-2">
        Received: {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
};

const HiringCandidateDetails = ({ data }) => {
  return (
    <div className="mb-12 p-6 bg-white/30 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hiring Process Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span> {data?.email || "N/A"}
          </p>
          {data?.name && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Candidate Name:</span> {data.name}
            </p>
          )}
          {data?.currentStage && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Current Stage:</span> {data.currentStage}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {data?.totalOffers && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Total Offers:</span> {data.totalOffers}
            </p>
          )}
          {data?.lastUpdated && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Last Updated:</span>{" "}
              {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const [showPopups, setShowPopups] = useState(false);
  const [email, setEmail] = useState("");
  const { searchedResponseData, setSearchedResponseData } = useContext(PipelineContext);
  const [isError, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [offerDetails, setOfferDetails] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  const fetchFeedback = async (candidateId) => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/received/HiringCandidate/${candidateId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch feedback: ${response.statusText}`);
      }
      const data = await response.json();
      setFeedbackData(data.feedback || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load candidate feedback.");
      setFeedbackData([]);
    }
  };

  const fetchOfferDetails = async (offerIds) => {
    if (!offerIds || offerIds.length === 0) {
      setOfferDetails([]);
      setIsLoadingOffers(false);
      return;
    }
    try {
      setIsLoadingOffers(true);
      const offerPromises = offerIds.map(async (offerId) => {
        const response = await fetch(`${API_URL}/api/offer/offer/${offerId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch offer ${offerId}`);
        }
        return response.json();
      });
      const offers = await Promise.allSettled(offerPromises)
        .then((results) =>
          results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value.data)
            .filter((offer) => offer.status?.toLowerCase() !== "pending")
        );
      setOfferDetails(offers);
    } catch (error) {
      console.error("Error fetching offer details:", error);
      toast.error("Failed to load offer details.");
      setOfferDetails([]);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  useEffect(() => {
    if (searchedResponseData?.hiringCandidateData?._id) {
      fetchFeedback(searchedResponseData.hiringCandidateData._id);
      if (searchedResponseData.hiringCandidateData?.offers?.length > 0) {
        fetchOfferDetails(searchedResponseData.hiringCandidateData.offers);
      } else {
        setOfferDetails([]);
        setIsLoadingOffers(false);
      }
    }
  }, [searchedResponseData, token]);

  const handleSearch = () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setShowPopups(true);
    setError("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderContent = () => {
    if (!searchedResponseData) {
      return (
        <p className="text-gray-500 text-center">No candidate data available. Please perform a search.</p>
      );
    }

    return (
      <div className="w-full space-y-12">
        {searchedResponseData.hiringCandidateData && (
          <HiringCandidateDetails data={searchedResponseData.hiringCandidateData} />
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Offers</h2>
          {isLoadingOffers ? (
            <div className="flex items-center justify-center h-32">
              <svg
                className="animate-spin h-8 w-8 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-3 text-gray-600 text-lg">Loading offers...</span>
            </div>
          ) : offerDetails.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerDetails.map((offer, index) => (
                <StatusCard
                  key={`offer-${index}`}
                  company={offer.jobTitle || "Unknown Position"}
                  status={offer.status || "Offer Received"}
                  offerDate={offer.offerDate && new Date(offer.offerDate).toLocaleDateString()}
                  statusColor="text-purple-600"
                  iconColor="#fff"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              {searchedResponseData.hiringCandidateData?.offers?.length > 0
                ? "No non-pending offers found for this candidate."
                : "No offers found for this candidate."}
            </p>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidate Feedback</h2>
          {feedbackData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {feedbackData.map((feedback, index) => (
                <FeedbackCard
                  key={`feedback-${index}`}
                  rating={feedback.rating}
                  comment={feedback.comment}
                  createdAt={feedback.createdAt}
                  reviewer={feedback.reviewerId}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No feedback available for this candidate.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-2"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
              <span className="ml-2 text-lg font-semibold">Search Candidate</span>
            </button>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="group relative">
              <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md">
                <Users className="h-5 w-5 mr-2" />
                Track
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                Track Candidates
              </span>
            </Link>
            <Link to="/history" className="group relative">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <FileText className="h-5 w-5 mr-2" />
                History
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                View History
              </span>
            </Link>
            <Link to="/invite" className="group relative">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <UserPlus className="h-5 w-5 mr-2" />
                Invites
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                Send Invites
              </span>
            </Link>
          </nav>
          <button
            className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg px-4 py-6 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 w-full text-left">
                  <Users className="h-5 w-5 mr-2" />
                  Track
                </button>
              </Link>
              <Link to="/history" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left">
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </button>
              </Link>
              <Link to="/invite" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Invites
                </button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center animate-fade-in">
          Search Candidate Pipeline
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
          <div className="relative w-full group">
            <input
              type="email"
              placeholder="Enter candidate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md bg-white/80"
              aria-label="Search candidate by email"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors duration-200"
              size={20}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300"
            aria-label="Search"
          >
            Check
          </button>
        </div>
        {isError && (
          <p className="mt-4 text-sm text-red-500 text-center animate-pulse">{isError}</p>
        )}
        <div className="w-full max-w-7xl mx-auto px-4 py-12">{renderContent()}</div>
      </main>

      {showPopups && (
        <PopUps
          setshowPopUps={setShowPopups}
          emailSearch={email}
          setSearchedResponseData={setSearchedResponseData}
          setError={setError}
        />
      )}
    </div>
  );
};

export default MainContent;