import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
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
  const token = useSelector((state) => state.user.data?.token);
  const [chartData, setChartData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    const fetchOffersData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const offers = response.data;

        // Check for no data
        if (!offers || offers.length === 0) {
          setNoData(true);
          setChartData(null);
          setAvailableMonths([]);
          setIsLoading(false);
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
          else if (offer.status === "Declined") rejected[offerMonth]++; 
          else if (offer.status === "Retracted") retracted[offerMonth]++;
        });

        setChartData({
          labels: monthNames,
          datasets: [
            {
              label: "Offer Accepted",
              data: accepted,
              borderColor: "rgba(16, 185, 129, 1)", // Green
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Offer Declined",
              data: rejected,
              borderColor: "rgba(239, 68, 68, 1)", // Red
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Offer Retracted",
              data: retracted,
              borderColor: "rgba(245, 158, 11, 1)", // Amber
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2,
              fill: true,
            },
          ],
        });
        setNoData(false);
      } catch (error) {
        console.error("Error fetching offers data:", error);
        setNoData(true);
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchOffersData();
    else setIsLoading(false);
  }, [token]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Render no data or loading states
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center text-gray-500 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
        <div className="h-64 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700">No Chart Data Available</h3>
        <p className="mt-2 text-gray-500">Start creating offers to see your statistics here</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
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
          font: { size: 12, weight: "500" },
          color: "#4B5563",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
        align: "end",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#4B5563",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        borderColor: "rgba(229, 231, 235, 1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
      },
      zoom: {
        pan: { 
          enabled: true, 
          mode: "x",
          modifierKey: 'shift',
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
          onZoomComplete: ({chart}) => {
            chart.update('none');
          }
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: { size: 14, weight: "bold" },
          color: "#4B5563",
          padding: { top: 10 }
        },
        ticks: { font: { size: 12 }, color: "#6B7280" },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Number of Offers",
          font: { size: 14, weight: "bold" },
          color: "#4B5563",
        },
        ticks: { font: { size: 12 }, color: "#6B7280" },
        grid: { color: "rgba(243, 244, 246, 1)", drawBorder: false },
        beginAtZero: true,
      },
    },
    interaction: { mode: "index", intersect: false },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Offer Status Overview</h2>
            <p className="text-gray-500 text-sm mt-1">Track your offers performance over time</p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200 hover:bg-gray-50 shadow-sm"
            >
              <option value="All">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <button
              onClick={handleResetZoom}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 15l6 6m-6-6v4.8m0-4.8h4.8" />
                <circle cx="10.5" cy="10.5" r="7.5" />
              </svg>
              Reset Zoom
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="relative" style={{ height: "450px" }}>
          <Line ref={chartRef} data={{ labels: filteredLabels, datasets: filteredDatasets }} options={options} />
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Use mouse wheel to zoom or shift+drag to pan the chart
        </div>
      </div>
    </div>
  );
};

export default MultiLineChart;