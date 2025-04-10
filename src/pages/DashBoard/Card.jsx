
const Card = ({ title, value, statusColor, iconColor, className }) => {
  return (
    <div className={`flex flex-col p-6 bg-white rounded-lg ${className}`}>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}20` }} // Lightened background
        >
          <svg className="w-6 h-6" fill={iconColor} viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
          <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;