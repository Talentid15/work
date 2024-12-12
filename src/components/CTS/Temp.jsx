import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css"; // Import the default styles

const StepProgress = ({ roundName, recommended_status }) => {
    const statusColors = {
        hire: "bg-green-500",
        pending: "bg-yellow-500",
        rejected: "bg-red-500",
    };

    // const getStatusColor = (status) => statusColors[status?.toLowerCase()] || "bg-gray-400";
    const getStatusColor = (status) => {
        if (typeof status !== "string") {
            console.warn("Invalid status:", status); // Log for debugging
            return "bg-gray-400"; // Default color
        }
        return statusColors[status.toLowerCase()] || "bg-gray-400";
    };

    // Calculate percentage based on the current round and total rounds
    const progressPercentage = (index, totalRounds) => {
        return totalRounds > 1 ? (index / (totalRounds - 1)) * 100 : 50; // Center if only one round
    };

    // Dynamically calculate the width of the progress bar based on the number of rounds
    const calculateWidth = (numRounds) => {
        const baseWidth = 25; // 25% for 1 round
        const maxWidth = 100; // Maximum width of 100%
        const step = 15; // Increment width by 15% per additional round
        return Math.min(baseWidth + (numRounds - 1) * step, maxWidth); // Ensure it doesn't exceed 100%
    };

    const progressBarWidth = `${calculateWidth(roundName.length)}%`;

    return (
        <div className="w-full md:w-4/5 mx-auto mt-10">
            <div className="mx-auto" style={{ width: progressBarWidth }}>
                {/* Progress Bar */}
                <ProgressBar
                    percent={100} // The total progress is 100%, each step is positioned dynamically.
                    filledBackground="linear-gradient(to right, #4ade80, #22c55e)" // Green gradient
                    height={6} // Thicker progress bar for better visibility
                >
                    {roundName?.map((data, index) => (
                        <Step
                            key={index}
                            position={progressPercentage(index, roundName.length)} // Adjust position for each step
                            transition="scale"
                        >
                            {({ accomplished }) => (
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg 
                                    ${
                                        index === roundName.length - 1
                                            ? getStatusColor(recommended_status) // Set the color based on recommended_status
                                            : "bg-green-300"
                                    } transition-colors duration-300 ease-in-out`}
                                >
                                    {/* Accomplished indicator */}
                                    <span
                                        className={`${accomplished ? "text-white" : "text-gray-800"} text-sm font-bold`}
                                    >
                                        {index + 1}
                                    </span>
                                </div>
                            )}
                        </Step>
                    ))}
                </ProgressBar>

                {/* Labels */}
                <div className="flex justify-between text-xs md:text-sm mt-6">
                    {roundName.map((data, index) => (
                        <span key={index} className="text-gray-700">
                            {data}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepProgress;
