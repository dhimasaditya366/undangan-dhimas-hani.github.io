import React from "react";
import Image from "next/image";

type PhotoPlaceholderProps = {
  initial?: string;
  photo?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  objectPosition?: string;
  zoom?: number;
};

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({
  initial = "X",
  photo,
  size = "md",
  className = "",
  objectPosition = "50% 50%",
  zoom = 1,
}) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-32 h-32 text-3xl",
    lg: "w-64 h-64 text-5xl",
  };

  if (photo) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shadow-lg ${sizeClasses[size]} ${className}`}
        style={{ borderColor: 'rgba(201, 169, 110, 0.4)', borderWidth: '2px' }}
      >
        <Image
          src={photo}
          alt={initial}
          fill
          className="object-cover"
          style={{ objectPosition, transform: `scale(${zoom})` }}
        />
      </div>
    );
  }

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
