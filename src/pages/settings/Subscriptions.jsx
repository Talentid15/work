import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SubscriptionPage = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const token = user?.token;
  console.log(user)
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionPlan || "FREE");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const plans = {
    FREE: {
      name: "Free",
      price: "₹0",
      description: "Perfect for trying out basic features.",
      features: [
        "Up to 5 offers/month",
        "10 Candidate Ghosting Alerts",
        "10 Candidate Search",
        "Basic Offer Punch",
        "Basic Analytics",
        "Email Support",
      ],
    },
    STARTER: {
      name: "Starter",
      price: "₹799",
      description: "Perfect for small teams making up to 10 offers per month.",
      features: [
        "Up to 10 offers/month",
        "30 Candidate Ghosting Alerts",
        "30 Candidate Search",
        "Unlimited Offer Punch",
        "Basic Analytics",
        "Email Support",
      ],
    },
    GROWTH: {
      name: "Growth",
      price: "₹2499",
      description: "Ideal for growing teams making up to 50 offers per month.",
      features: [
        "Up to 50 offers/month",
        "200 Candidate Ghosting Alerts",
        "200 Candidate Search",
        "Unlimited Offer Punch",
        "Full Analytics Suite",
        "Priority Support",
      ],
    },
    ENTERPRISE: {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom requirements.",
      features: [
        "Unlimited offers",
        "Unlimited Candidate Ghosting Alerts",
        "Unlimited Candidate Search",
        "Unlimited Offer Punch",
        "Dedicated Account Manager",
        "Custom Integrations",
        "SLA & Premium Support",
      ],
    },
  };

  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get("orderId");
    if (orderId) {
      const checkOrderStatus = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
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
    setLoading(true);
    try {
      const orderId = `ORDER_${Date.now()}`;
      const response = await fetch(`${API_URL}/api/payments/create-payment-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerDetails: {
            customer_name: user?.fullname || "Jai User",
            customer_email: user?.email || "jai@gmail.com",
            customer_phone: user?.phone || "1234567890",
            customer_id: user?._id || "67494527994341a870ceaf7b",
          },
          orderAmount: plan === "STARTER" ? 1 : 1,
          credits: plan === "STARTER" ? 30 : 200,
          orderId,
        }),
      });
      const data = await response.json();
      if (data.data.paymentLink) {
        window.open(data.data.paymentLink, "_blank");
      } else {
        throw new Error(data.message || "Failed to get payment link");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto" id="pricing">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-[#d7ffec] text-[#652d96] font-normal px-3 py-1 rounded-full text-sm">
              Simple Pricing
            </span>
          </div>
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. All plans include our core predictive features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Object.keys(plans).map((planKey) => (
            <div
              key={planKey}
              className={`bg-gray-900 rounded-2xl p-8 text-white relative ${
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
                  <span className="text-4xl font-bold">{plans[planKey].price}</span>
                  {planKey !== "FREE" && planKey !== "ENTERPRISE" && (
                    <span className="text-gray-300 text-lg">/month</span>
                  )}
                </div>
                <p className={`text-sm ${planKey === "GROWTH" ? "text-purple-200" : "text-gray-300"}`}>
                  {plans[planKey].description}
                </p>
              </div>
              <div className="space-y-4 mb-8">
                {plans[planKey].features.map((feature, index) => (
                  <PlanFeature key={index} text={feature} />
                ))}
              </div>
              <PlanButton
                text={selectedPlan === planKey ? "Current Plan" : planKey === "ENTERPRISE" ? "Contact Sales" : "Get Started"}
                bg={planKey === "GROWTH" ? "bg-green-500" : "bg-gray-700"}
                hover={planKey === "GROWTH" ? "hover:bg-[#3affa0]" : "hover:bg-gray-600"}
                shadow={planKey === "GROWTH" ? "shadow-[0_0_10px_#38ff9f]" : ""}
                onClick={() => handlePlanSelection(planKey)}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;