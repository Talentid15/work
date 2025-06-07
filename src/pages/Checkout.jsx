import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { plans } from "../constants/index";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const token = user?.token;
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const billing = new URLSearchParams(location.search).get("billing") || "monthly";
  const isYearly = billing === "yearly";
  const plan = plans[id?.toUpperCase()];
  const isValidPlan = plan && id.toUpperCase() !== "FREE" && id.toUpperCase() !== "ENTERPRISE";

  useEffect(() => {
    setIsAnimated(true);
    
    if (!isValidPlan) {
      navigate("/subscription");
      return;
    }

    const initiatePayment = async () => {
      setLoading(true);
      try {
        const orderId = `ORDER_${Date.now()}`;
        const basePrice = isYearly ? plan.yearlyBasePrice : plan.basePrice;
        const total_amount = basePrice + (basePrice * 0.18);
        const credits = id.toUpperCase() === "STARTER" ? (isYearly ? 360 : 30) : (isYearly ? 2400 : 200);
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
            orderAmount: total_amount?.toFixed(2),
            credits,
            orderId,
          }),
        });
        const data = await response.json();
        if (data.data.paymentLink) {
          setPaymentLink(data.data.paymentLink);
        } else {
          throw new Error(data.message || "Failed to get payment link");
        }
      } catch (error) {
        console.error("Error initiating payment:", error);
        alert("Failed to initiate payment. Please try again.");
        navigate("/subscription");
      } finally {
        setLoading(false);
      }
    };

    initiatePayment();
  }, [id, token, navigate, plan, isYearly]);

  const calculateGST = (basePrice) => {
    return basePrice * 0.18;
  };

  const getPlanFeatures = () => {
    if (!isYearly) return plan.features;
    return plan.features.map(feature => {
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

  const PlanFeature = ({ text, index }) => (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-white border border-purple-100 transform transition-all duration-500 hover:shadow-md ${
        isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-700 font-medium text-sm">{text}</span>
    </div>
  );

  if (!isValidPlan) {
    return null;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-[#74449D] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-[#74449D] text-lg font-semibold">Preparing your checkout...</div>
          <div className="text-gray-500 text-sm mt-1">Please wait while we set up your payment</div>
        </div>
      </div>
    );
  }

  const basePrice = isYearly ? plan.yearlyBasePrice : plan.basePrice;
  const gst = calculateGST(basePrice);
  const totalPrice = basePrice + gst;

  return (
    <div className="h-[87vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#74449D]/10 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-[#74449D]/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`max-w-6xl w-full h-full max-h-[95vh] relative transform transition-all duration-1000 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-full">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Left Section - Plan Details */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#74449D] to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-3 shadow-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure Checkout
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#74449D] to-purple-600 bg-clip-text text-transparent mb-1">
                  Almost There!
                </h1>
                <p className="text-gray-600 text-sm">Complete your subscription to unlock premium features</p>
              </div>

              <div className="bg-gradient-to-br from-[#74449D]/5 to-purple-100/30 rounded-xl p-4 mb-4 border border-purple-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#74449D]">{plan.name} Plan</h2>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">What's included:</h3>
                <div className="space-y-2 overflow-y-auto max-h-72">
                  {getPlanFeatures().map((feature, index) => (
                    <PlanFeature key={index} text={feature} index={index} />
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => navigate("/settings/subscription")}
                  className="group inline-flex items-center gap-2 text-[#74449D] hover:text-purple-700 font-semibold transition-all duration-300 hover:gap-3 text-sm"
                >
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Change Plan
                </button>
              </div>
            </div>

            {/* Right Section - Payment Summary */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white border-l border-gray-100/50">
              <div className="p-6 lg:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Payment Summary</h3>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 mb-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 font-medium text-sm">Base Price</span>
                        <span className="text-lg font-semibold text-gray-900">₹{basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 font-medium text-sm">GST (18%)</span>
                        <span className="text-lg font-semibold text-gray-900">₹{gst.toFixed(2)}</span>
                      </div>
                      <div className="border-t-2 border-gray-100 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#74449D] to-purple-600 bg-clip-text text-transparent">
                            ₹{totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full bg-gradient-to-r from-[#74449D] to-purple-600 hover:from-purple-600 hover:to-[#74449D] text-white py-3 px-6 rounded-xl font-bold text-base text-center transition-all duration-300 transform hover:shadow-2xl shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Proceed to Secure Payment
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      🔒 Your payment is secured with industry-standard encryption
                    </p>
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        SSL Encrypted
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                        Bank Grade Security
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">*All prices inclusive of GST*</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;