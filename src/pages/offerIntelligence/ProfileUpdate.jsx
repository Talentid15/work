import BackButton from "../../assets/backButton.png";
import ProfileUpdateCard from "../../components/offerIntelligence/AddCandidate";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

function ProfileUpdate() {
  return (
    <div className="flex flex-col w-full p-2">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center">
          <button className="text-gray-600 hover:text-gray-800">
            <img src={BackButton} alt="Back" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-2">Profile</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#652D96] text-white p-2 rounded-xl mr-4">
          <AiOutlineUsergroupAdd className="h-5 w-5" />
          Add Candidate
        </button>
      </div>
      <div className="">
        <ProfileUpdateCard />
        {/* <EngagementSection /> */}
      </div>
    </div>
  );
}

export default ProfileUpdate;
