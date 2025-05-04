import { FaCheckCircle, FaRegEdit, FaHistory } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SubscriptionPage = () => {
    const location = useLocation();
    const token = useSelector((state) => state.user.data?.token);
    const [userData, setUserData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState("FREE");
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

    const pastTransactions = [
        { id: 1, plan: "STARTER", email: "jai@gmail.com", date: "2025-02-01", amount: "₹2500.99", status: "Completed" },
        { id: 2, plan: "PRO", email: "jai@gmail.com", date: "2025-02-01", amount: "₹3500.99", status: "Completed" },
        { id: 3, plan: "STARTER", email: "jai@gmail.com", date: "2025-02-01", amount: "₹2500.99", status: "Completed" },
    ];

    // Plan details
    const plans = {
        FREE: {
            name: "Free Plan",
            price: "₹0",
            credits: "100/1000",
            offerPunch: "10",
            offerReleases: "5",
            ghostingNotifications: "2",
            features: [
                "Basic interview tracking",
                "Limited candidate management",
                "Email support",
            ],
        },
        PAID: {
            name: "Starter Plan",
            price: "₹1",
            credits: "680/1000",
            offerPunch: "150",
            offerReleases: "45",
            ghostingNotifications: "12",
            features: [
                "Advanced interview tracking",
                "Unlimited candidate management",
                "Priority email support",
                "Analytics dashboard",
                "Custom notifications",
            ],
        },
    };

    // Fetch user subscription details
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.subscriptionPlan === "Starter") {
                setSelectedPlan("PAID");
            } else {
                setSelectedPlan("FREE");
            }
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to load subscription details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();

        // Handle redirect after payment
        const orderId = new URLSearchParams(location.search).get("orderId");
        if (orderId) {
            // Optionally, you can fetch the order status to confirm payment
            const checkOrderStatus = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const order = await response.json();
                    if (order.paymentStatus === "SUCCESS") {
                        fetchUserData(); // Refresh user data to reflect updated subscription
                    }
                } catch (error) {
                    console.error("Error checking order status:", error);
                }
            };
            checkOrderStatus();
        }
    }, [location, token]);

    const handlePlanSelection = async (plan) => {
        setSelectedPlan(plan);
        if (plan === "PAID") {
            try {
                const response = await fetch(`${API_URL}/api/payments/create-payment-link`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        customerDetails: {
                            customer_name: userData?.fullname || "Jai User",
                            customer_email: userData?.email || "jai@gmail.com",
                            customer_phone: userData?.phone || "1234567890",
                            customer_id: userData?._id || "67494527994341a870ceaf7b",
                        },
                        orderAmount: 1,
                        credits: 680,
                        orderId: `ORDER_${Date.now()}`,
                    }),
                });
                const data = await response.json();
                if (data.data.paymentLink) {
                    window.location.href = data.data.paymentLink;
                } else {
                    throw new Error(data.message || "Failed to get payment link");
                }
            } catch (error) {
                console.error("Error initiating payment:", error);
                alert("Failed to initiate payment. Please try again.");
            }
        }
    };

    if (loading) {
        return <div className="text-center p-6">Loading subscription details...</div>;
    }

    return (
        <div className="w-full mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscriptions</h2>

                {/* Plan Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {Object.keys(plans).map((planKey) => (
                        <div
                            key={planKey}
                            className={`bg-gray-50 rounded-2xl p-6 shadow-md ${
                                selectedPlan === planKey ? "border-2 border-purple-600" : ""
                            }`}
                        >
                            <h3 className="text-xl font-bold text-purple-900">{plans[planKey].name}</h3>
                            <p className="text-2xl font-semibold text-gray-800 mt-2">{plans[planKey].price}</p>
                            <ul className="mt-4 space-y-2">
                                {plans[planKey].features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-600">
                                        <FaCheckCircle className="text-green-500 mr-2" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePlanSelection(planKey)}
                                className={`mt-6 w-full flex items-center justify-center gap-2 ${
                                    planKey === "FREE"
                                        ? "bg-gray-400 text-white"
                                        : "bg-purple-600 text-white hover:bg-purple-700"
                                } px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-md`}
                                aria-label={`Select ${plans[planKey].name}`}
                            >
                                {planKey === "FREE" ? "Active" : "Upgrade to Starter"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Subscription Details Card */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <p className="text-gray-600">You are currently on</p>
                            <p className="text-2xl font-bold text-purple-900">{plans[selectedPlan].name}</p>
                        </div>
                        {selectedPlan === "FREE" && (
                            <button
                                onClick={() => handlePlanSelection("PAID")}
                                className="mt-4 sm:mt-0 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md"
                                aria-label="Upgrade plan"
                            >
                                <FaRegEdit /> Upgrade to Starter
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Interview tracking credits left", value: userData?.credits || plans[selectedPlan].credits, progress: selectedPlan === "PAID" ? 68 : 10 },
                            { label: "No. of Offer Punch", value: plans[selectedPlan].offerPunch, progress: null },
                            { label: "Offer Releases", value: plans[selectedPlan].offerReleases, progress: null },
                            { label: "Candidate Ghosting Notification", value: plans[selectedPlan].ghostingNotifications, progress: null },
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
                        <p className="text-sm font-bold text-gray-500">
                            {userData?.subscriptionExpiry
                                ? new Date(userData.subscriptionExpiry).toLocaleDateString()
                                : "15/07/2025"}
                        </p>
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