import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { plans } from "@/constants";

const SubscriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const token = user?.token;
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionPlan || "FREE");
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [metrics, setMetrics] = useState({
    offerLettersSent: 0,
    OfferReleases: 0,
    ghostedCount: 0,
  });
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  // Update metrics from user data
  useEffect(() => {
    if (user) {
      setMetrics({
        offerLettersSent: user.offerLettersSent || 0,
        OfferReleases: user.OfferReleases || 0,
        ghostedCount: user.ghostedCount || 0,
      });
    }
  }, [user]);

  // Check order status for payment verification
  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get("orderId");
    if (orderId) {
      const checkOrderStatus = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const order = await response.json();
          if (order.data.paymentStatus === "SUCCESS") {
            setSelectedPlan("STARTER");
          }
        } catch (error) {
          console.error("Error checking order status:", error);
          alert("Failed to verify payment status. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      checkOrderStatus();
    }
  }, [location, token]);

  const handlePlanSelection = async (plan) => {
    if (plan === selectedPlan) return;
    if (plan === "FREE") {
      setSelectedPlan("FREE");
      return;
    }
    if (plan === "ENTERPRISE") {
      window.open("https://offers.talentid.app/contact-sales", "_blank");
      return;
    }
    navigate(`/subscription/checkout/${plan.toLowerCase()}?billing=${isYearly ? 'yearly' : 'monthly'}`);
  };

  const PlanFeature = ({ text }) => (
    <div className="flex items-center gap-3">
      <svg className="w-5 h-5 text-[#3affa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm">{text}</span>
    </div>
  );

  const PlanButton = ({ text, bg, hover, shadow = "", onClick }) => (
    <button
      className={`w-full ${bg} ${hover} ${shadow} text-white py-3 rounded-lg font-semibold transition-colors duration-200`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Processing..." : text}
    </button>
  );

  const getPlanPrice = (planKey) => {
    if (isYearly && planKey === "STARTER") {
      return "₹7999";
    }
    if (isYearly && planKey === "GROWTH") {
      return "₹24999";
    }
    return plans[planKey].price;
  };

  const getPlanBasePrice = (planKey) => {
    if (isYearly && planKey === "STARTER") {
      return 7999;
    }
    if (isYearly && planKey === "GROWTH") {
      return 24999;
    }
    return plans[planKey].basePrice;
  };

  const getPlanFeatures = (planKey) => { 
    if (!isYearly) return plans[planKey].features;
    return plans[planKey].features.map((feature) => {
      const match = feature.match(/^Up to (\d+) (\w+)/);
      if (match) {
        const number = parseInt(match[1]) * 12;
        return `Up to ${number} ${match[2]}/year`;
      }
      const alertMatch = feature.match(/^(\d+) Candidate (Ghosting Alerts|Search)/);
      if (alertMatch) {
        const number = parseInt(alertMatch[1]) * 12;
        return `${number} Candidate ${alertMatch[2]}/year`;
      }
      return feature.replace(/\/month$/, '/year');
    });
  };

  const getPlanLimits = (planKey) => {
    const features = isYearly ? getPlanFeatures(planKey) : plans[planKey].features;
    let offerLimit = 0;
    let ghostingLimit = 0;

    features.forEach((feature) => {
      const offerMatch = feature.match(/^Up to (\d+) offers/);
      if (offerMatch) {
        offerLimit = parseInt(offerMatch[1]);
      }
      const ghostingMatch = feature.match(/^(\d+) Candidate Ghosting Alerts/);
      if (ghostingMatch) {
        ghostingLimit = parseInt(ghostingMatch[1]);
      }
    });

    return { offerLimit, ghostingLimit };
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading...</div>;
  }

  const { offerLimit, ghostingLimit } = getPlanLimits(selectedPlan);
  const isUnlimited = selectedPlan === "ENTERPRISE";

  return (
    <div className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto" id="pricing">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-[#d7ffec] text-[#652d96] font-normal px-3 py-1 rounded-full text-sm">
              Simple Pricing
            </span>
          </div>
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. All plans include our core predictive features.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-200 rounded-full p-1 inline-flex">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  !isYearly ? "bg-white text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isYearly ? "bg-white text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setIsYearly(true)}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Other Plans (Starter, Growth, Enterprise) */}
          <div
            className={`grid grid-cols-1 ${isYearly ? "md:grid-cols-3" : "md:grid-cols-3"} gap-6`}
          >
            {(isYearly ? ["STARTER", "GROWTH", "ENTERPRISE"] : ["STARTER", "GROWTH", "ENTERPRISE"]).map(
              (planKey) => (
                <div
                  key={planKey}
                  className={`bg-gray-900 rounded-2xl p-8 text-white relative transition-transform duration-300 hover:shadow-lg ${
                    planKey === "GROWTH" ? "transform scale-105" : ""
                  }`}
                >
                  {planKey === "GROWTH" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-[#3affa0] text-lg font-semibold mb-4">{plans[planKey].name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{getPlanPrice(planKey)}</span>
                      {planKey !== "ENTERPRISE" && (
                        <span className="text-gray-300 text-lg">{isYearly ? "/year" : "/month"}</span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        planKey === "GROWTH" ? "text-purple-200" : "text-gray-300"
                      }`}
                    >
                      {plans[planKey].description}
                    </p>
                  </div>
                  <div className="space-y-4 mb-8">
                    {getPlanFeatures(planKey).map((feature, index) => (
                      <PlanFeature key={index} text={feature} />
                    ))}
                  </div>
                  <PlanButton
                    text={
                      selectedPlan === planKey
                        ? "Current Plan"
                        : planKey === "ENTERPRISE"
                        ? "Contact Sales"
                        : "Get Started"
                    }
                    bg={planKey === "GROWTH" ? "bg-green-500" : "bg-gray-700"}
                    hover={planKey === "GROWTH" ? "hover:bg-[#3affa0]" : "hover:bg-gray-600"}
                    shadow={planKey === "GROWTH" ? "shadow-[0_0_10px_#38ff9f]" : ""}
                    onClick={() => handlePlanSelection(planKey)}
                  />
                </div>
              ),
            )}
          </div>

          {/* Free Plan (only in Monthly billing) */}
          {!isYearly && (
            <div className="grid grid-cols-1 gap-6">
              {["FREE"].map((planKey) => (
                <div
                  key={planKey}
                  className="bg-gray-900 rounded-2xl p-6 text-white transition-transform duration-300 hover:shadow-lg"
                >
                  <div className="mb-4">
                    <h3 className="text-[#3affa0] text-lg font-semibold mb-2">{plans[planKey].name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plans[planKey].price}</span>
                      <span className="text-gray-300 text-lg">/month</span>
                    </div>
                    <p className="text-gray-300 text-sm">{plans[planKey].description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {getPlanFeatures(planKey).map((feature, index) => (
                      <PlanFeature key={index} text={feature} />
                    ))}
                  </div>
                  <PlanButton
                    text={selectedPlan === planKey ? "Current Plan" : "Get Started"}
                    bg="bg-gray-700"
                    hover="hover:bg-gray-600"
                    onClick={() => handlePlanSelection(planKey)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Metrics Summary Section */}
          <div className="mt-12 bg-gray-100 rounded-2xl p-6">
            <h3 className="text-black text-2xl font-semibold mb-6 text-center">Your Plan Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md flex flex-col h-full">
                <p className="text-gray-600 text-sm font-medium">Offer Letters Sent</p>
                <p className="text-black text-2xl font-semibold mt-2">
                  {metrics.offerLettersSent} / {isUnlimited ? "Unlimited" : `${offerLimit} ${isYearly ? "year" : "month"}`}
                </p>
                {!isUnlimited && (
                  <div className="mt-4 bg-gray-200 rounded-full h-3 flex-grow">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((metrics.offerLettersSent / offerLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md flex flex-col h-full">
                <p className="text-gray-600 text-sm font-medium">Offer Releases</p>
                <p className="text-black text-2xl font-semibold mt-2">
                  {metrics.OfferReleases} / {isUnlimited ? "Unlimited" : `${offerLimit} ${isYearly ? "year" : "month"}`}
                </p>
                {!isUnlimited && (
                  <div className="mt-4 bg-gray-200 rounded-full h-3 flex-grow">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((metrics.OfferReleases / offerLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md flex flex-col h-full">
                <p className="text-gray-600 text-sm font-medium">Ghosting Alerts Used</p>
                <p className="text-black text-2xl font-semibold mt-2">
                  {metrics.ghostedCount} / {isUnlimited ? "Unlimited" : `${ghostingLimit} ${isYearly ? "year" : "month"}`}
                </p>
                {!isUnlimited && (
                  <div className="mt-4 bg-gray-200 rounded-full h-3 flex-grow">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((metrics.ghostedCount / ghostingLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;