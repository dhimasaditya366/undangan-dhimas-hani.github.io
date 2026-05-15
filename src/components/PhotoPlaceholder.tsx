import React from "react";

type PhotoPlaceholderProps = {
  initial?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({ 
  initial = "X", 
  size = "md",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-32 h-32 text-3xl",
    lg: "w-64 h-64 text-5xl",
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center shadow-lg font-display italic ${sizeClasses[size]} ${className}`}
      style={{ 
        backgroundImage: 'linear-gradient(to bottom right, #6B6B2A, #7A8A3A)',
        color: '#D4A843',
        borderColor: 'rgba(201, 169, 110, 0.4)',
        borderWidth: '2px'
      }}
    >
      {initial}
    </div>
  );
};
