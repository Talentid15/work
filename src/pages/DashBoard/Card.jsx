import { useState } from 'react';

const Card = ({ title, value, statusColor, iconColor, icon, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Different SVG icons for each card type
  const renderIcon = () => {
    switch (icon) {
      case 'credits':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" className="w-6 h-6">
            <path d="M12 8c-3.28 0-6-1.5-6-4s2.72-4 6-4 6 1.5 6 4-2.72 4-6 4z" />
            <path d="M6 8v4c0 2.5 2.72 4 6 4s6-1.5 6-4V8" />
            <path d="M6 12v4c0 2.5 2.72 4 6 4s6-1.5 6-4v-4" />
          </svg>
        );
      case 'punches':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" className="w-6 h-6">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
            <path d="M9 9h1" />
          </svg>
        );
      case 'letters':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" className="w-6 h-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
            <path d="M8 10h8" />
            <path d="M8 14h4" />
          </svg>
        );
      case 'alerts':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" className="w-6 h-6">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <circle cx="12" cy="3" r="1" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md transition-all duration-300 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{ backgroundColor: `${iconColor}15` }}
          >
            {renderIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`text-2xl font-bold mt-1 ${statusColor}`}>{value}</p>
          </div>
        </div>
        
        {/* Progress or trend indicator - could be enhanced with actual data */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`text-xs font-medium ${value > 0 ? 'text-green-500' : 'text-gray-400'}`}>
              {value > 0 ? `Active` : 'No activity'}
            </div>
            <div className="text-xs text-gray-400">Updated today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;