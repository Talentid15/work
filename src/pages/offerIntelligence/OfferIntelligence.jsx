// import { Outlet } from "react-router-dom";
import { Rocket } from "lucide-react";

function OfferIntelligence() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 mt-20 text-center">
      <Rocket className="h-12 w-12 text-purple-600 animate-bounce mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Offer Lens</h1>
      <p className="text-lg text-gray-500 mb-6">
        🚀 This feature is launching soon. We are cooking up something awesome for you!
      </p>
      <span className="text-sm text-gray-400">Stay tuned for powerful insights and analytics 💡</span>

      {/* Uncomment this once routing is needed */}
      {/* <Outlet /> */}
    </div>
  );
}

export default OfferIntelligence;
