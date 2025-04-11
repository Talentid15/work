import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

const MultiLineChart = () => {
  const chartRef = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.data?.token);
  const [chartData, setChartData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [noData, setNoData] = useState(false); // New state for no data case

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        console.log("Fetching with token:", token); // Debug token
        const response = await axios.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const offers = response.data;
        console.log("Fetched Offers Data:", offers);

        // Check for no data
        if (!offers || offers.length === 0) {
          setNoData(true);
          setChartData(null);
          setAvailableMonths([]);
          return;
        }

        // Extract unique months from offer data
        const monthsSet = new Set();
        offers.forEach((offer) => {
          const offerMonth = new Date(offer.offerDate).getMonth();
          monthsSet.add(offerMonth);
        });
        const uniqueMonths = Array.from(monthsSet).map((monthIdx) => monthNames[monthIdx]);
        setAvailableMonths(uniqueMonths);

        // Process offer data
        const accepted = Array(12).fill(0);
        const rejected = Array(12).fill(0);
        const retracted = Array(12).fill(0);
        const total = Array(12).fill(0);

        offers.forEach((offer) => {
          const offerMonth = new Date(offer.offerDate).getMonth();
          total[offerMonth]++;
          if (offer.status === "Accepted") accepted[offerMonth]++;
          else if (offer.status === "Declined") rejected[offerMonth]++; // Changed "Rejected" to "Declined" to match backend
          else if (offer.status === "Retracted") retracted[offerMonth]++;
        });

        setChartData({
          labels: monthNames,
          datasets: [
            {
              label: "Offer Accepted",
              data: accepted,
              borderColor: "rgba(34, 197, 94, 1)", // Green
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              borderWidth: 2,
            },
            {
              label: "Offer Declined",
              data: rejected,
              borderColor: "rgba(239, 68, 68, 1)", // Red
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              borderWidth: 2,
            },
            {
              label: "Offer Retracted",
              data: retracted,
              borderColor: "rgba(249, 115, 22, 1)", // Orange
              backgroundColor: "rgba(249, 115, 22, 0.2)",
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              borderWidth: 2,
            },
          ],
        });
        setNoData(false);
      } catch (error) {
        console.error("Error fetching offers data:", error);
        setNoData(true); // Treat errors as no data for simplicity
        setChartData(null);
      }
    };

    if (token) fetchOffersData();
  }, [token, dispatch]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Render no data message
  if (noData) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center text-gray-500">
        No data available
      </div>
    );
  }

  // Render loading state
  if (!chartData) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center text-gray-500">
        Loading chart...
      </div>
    );
  }

  // Filter labels and datasets based on selected month
  const filteredLabels = selectedMonth === "All" ? chartData.labels : [selectedMonth];
  const filteredDatasets = chartData.datasets.map((dataset) => ({
    ...dataset,
    data: selectedMonth === "All" ? dataset.data : [dataset.data[monthNames.indexOf(selectedMonth)]],
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#1f2937",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 10,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: { size: 18, weight: "bold" },
          color: "#1f2937",
        },
        ticks: { font: { size: 14 }, color: "#4b5563" },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Number of Offers",
          font: { size: 18, weight: "bold" },
          color: "#1f2937",
        },
        ticks: { font: { size: 14 }, color: "#4b5563" },
        grid: { color: "rgba(209, 213, 219, 0.3)" },
      },
    },
    interaction: { mode: "index", intersect: false },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Offer Status Overview</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-700">Filter by Month:</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:bg-gray-200"
            >
              <option value="All">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="relative" style={{ height: "450px" }}>
        <Line ref={chartRef} data={{ labels: filteredLabels, datasets: filteredDatasets }} options={options} />
      </div>
    </div>
  );
};

export default MultiLineChart;