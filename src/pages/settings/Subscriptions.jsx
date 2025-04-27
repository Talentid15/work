import { FaCheckCircle, FaRegEdit, FaHistory } from "react-icons/fa";

const SubscriptionPage = () => {
  const pastTransactions = [
    { id: 1, plan: "STARTER", email: "jai@gmail.com", date: "2025-02-01", amount: "₹2500.99", status: "Completed" },
    { id: 2, plan: "PRO", email: "jai@gmail.com", date: "2025-02-01", amount: "₹3500.99", status: "Completed" },
    { id: 3, plan: "STARTER", email: "jai@gmail.com", date: "2025-02-01", amount: "₹2500.99", status: "Completed" },
  ];

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">

        {/* Subscription Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <p className="text-gray-600">You are currently on</p>
              <p className="text-2xl font-bold text-purple-900">STARTER Plan</p>
            </div>
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md"
              aria-label="Upgrade plan"
            >
              <FaRegEdit /> Upgrade Plan
            </button>
          </div>

          <div className="space-y-4">
            {[
              { label: "Interview tracking credits left", value: "680/1000", progress: 68 },
              { label: "No. of Offer Punch", value: "150", progress: null },
              { label: "Offer Releases", value: "45", progress: null },
              { label: "Candidate Ghosting Notification", value: "12", progress: null },
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{item.label}</p>
                  <p className="text-gray-800 font-semibold">{item.value}</p>
                </div>
                {item.progress && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-red-600">Your plan expires on</p>
            <p className="text-sm font-bold text-gray-500">15/07/2025</p>
          </div>
        </div>

        {/* Past Transactions Table */}
        <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaHistory className="mr-2" /> Past Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {["Plan", "Email", "Start Date", "Amount", "Status"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pastTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-purple-50 transition-all duration-200">
                    <td className="px-4 py-3 text-gray-800">{transaction.plan}</td>
                    <td className="px-4 py-3 text-gray-800">{transaction.email}</td>
                    <td className="px-4 py-3 text-gray-800">{transaction.date}</td>
                    <td className="px-4 py-3 text-gray-800">{transaction.amount}</td>
                    <td className="px-4 py-3 text-gray-800">
                      <span className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" /> {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
