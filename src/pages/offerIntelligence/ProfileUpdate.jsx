import React from 'react'
import ProfileCard from '../../components/offerIntelligence/ProfileCard'
// import EngagementSection from '../../components/offerIntelligence/EngagementSection'
import ExperienceSection from '../../components/offerIntelligence/ExperienceSection'
import BackButton from "../../assets/backButton.png";
import ProfileUpdateCard from '../../components/offerIntelligence/ProfUpCard';

function ProfileUpdate() {
  return (
    <div className="flex flex-col w-full p-2">
        <div className="flex flex-1">
            <button className="text-gray-600 hover:text-gray-800">
              <img src={BackButton} alt="Back" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-2">Profile</h1>
          </div>
      <div className="bg-gray-200 rounded shadow p-2 mt-2 " >
      <ProfileUpdateCard />
      {/* <EngagementSection /> */}
      </div>
    </div>
  )
}

export default ProfileUpdate;