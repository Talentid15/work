import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { plans } from "../constants/index";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const token = user?.token;
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

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
        const total_amount = plan.basePrice + (plan.basePrice * 0.18);
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
            orderAmount: total_amount?.toFixed(2) ,
            credits: id.toUpperCase() === "STARTER" ? 30 : 200,
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
  }, [id, token, navigate, plan]);

  const calculateGST = (basePrice) => {
    return basePrice * 0.18;
  };

  const PlanFeature = ({ text, index }) => (
    <div 
      className={`flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-white border border-purple-100 transform transition-all duration-500 hover:shadow-md hover:scale-105 ${
        isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );

  if (!isValidPlan) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-[#74449D] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-[#74449D] text-xl font-semibold">Preparing your checkout...</div>
          <div className="text-gray-500 text-sm mt-2">Please wait while we set up your payment</div>
        </div>
      </div>
    );
  }

  const basePrice = plan.basePrice;
  const gst = calculateGST(basePrice);
  const totalPrice = basePrice + gst;

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#74449D]/10 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-[#74449D]/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`max-w-5xl w-full relative transform transition-all duration-1000 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            <div className="flex-1 lg:p-12">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#74449D] to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure Checkout
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#74449D] to-purple-600 bg-clip-text text-transparent mb-2">
                  Almost There!
                </h1>
                <p className="text-gray-600 text-lg">Complete your subscription to unlock premium features</p>
              </div>

              <div className="bg-gradient-to-br from-[#74449D]/5 to-purple-100/30 rounded-2xl p-6 mb-8 border border-purple-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#74449D]">{plan.name} Plan</h2>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What's included:</h3>
                {plan.features.map((feature, index) => (
                  <PlanFeature key={index} text={feature} index={index} />
                ))}
              </div>

              <button
                onClick={() => navigate("/settings/subscription")}
                className="group inline-flex items-center gap-2 text-[#74449D] hover:text-purple-700 font-semibold transition-all duration-300 hover:gap-3"
              >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change Plan
              </button>
            </div>

            {/* Right Section - Payment Summary */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white border-l border-gray-100/50">
              <div className="p-8 lg:p-12 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#74449D] to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Payment Summary</h3>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Base Price</span>
                        <span className="text-xl font-semibold text-gray-900">₹{basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">GST (18%)</span>
                        <span className="text-xl font-semibold text-gray-900">₹{gst.toFixed(2)}</span>
                      </div>
                      <div className="border-t-2 border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">Total Amount</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-[#74449D] to-purple-600 bg-clip-text text-transparent">
                            ₹{totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full bg-gradient-to-r from-[#74449D] to-purple-600 hover:from-purple-600 hover:to-[#74449D] text-white py-4 px-6 rounded-2xl font-bold text-lg text-center transition-all duration-300 transform  hover:shadow-2xl shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 transform  transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Proceed to Secure Payment
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      🔒 Your payment is secured with industry-standard encryption
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
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