const MainContent = () => {
    return (
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Track Candidate status</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Track Candidate</button>
            <button className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100">History</button>
          </div>
        </header>
  
        <div className="flex mb-6">
          <input 
            type="text" 
            placeholder="Enter email address or phone number" 
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700">Check status</button>
        </div>
  
        <div className="grid grid-cols-2 gap-6">
          <StatusCard company="Google" status="Final round" statusColor="text-green-600" />
          <StatusCard company="Microsoft" status="Final round" statusColor="text-green-600" />
          <StatusCard company="TalentID" status="Screening" statusColor="text-red-600" />
          <StatusCard company="Adobe" status="Final round" statusColor="text-green-600" />
        </div>
      </div>
    );
  };
  
  const StatusCard = ({ company, status, statusColor }) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold">{company}</h2>
        <p className={`mt-2 ${statusColor}`}>{status}</p>
      </div>
    );
  };
  
  export default MainContent;
  