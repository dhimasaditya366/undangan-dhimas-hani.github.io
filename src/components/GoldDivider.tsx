import React from "react";

type GoldDividerProps = {
  variant?: "short" | "long" | "ornate";
  theme?: "light" | "dark";
};

export const GoldDivider: React.FC<GoldDividerProps> = ({ variant = "short", theme = "light" }) => {
  const lineLight = "rgba(201, 169, 110, 0.35)";
  const diamondLight = "#C9A96E";
  const lineDark = "rgba(212, 168, 67, 0.35)";
  const diamondDark = "#D4A843";

  const lineColor = theme === "dark" ? lineDark : lineLight;
  const diamondColor = theme === "dark" ? diamondDark : diamondLight;

  if (variant === "long") {
    return (
      <div className="flex flex-row items-center gap-2 w-full mx-auto my-4">
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: lineColor }} />
        <div className="w-[5px] h-[5px] rotate-45 opacity-75" style={{ backgroundColor: diamondColor }} />
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: lineColor }} />
      </div>
    );
  }

  if (variant === "ornate") {
    return (
      <div className="flex flex-row items-center gap-[6px] w-[180px] mx-auto my-4 justify-center">
        <div className="w-[40px] h-[0.5px]" style={{ backgroundColor: lineColor }} />
        <div className="w-[3px] h-[3px] rotate-45 opacity-50" style={{ backgroundColor: diamondColor }} />
        <div className="w-[5px] h-[5px] rotate-45 opacity-85" style={{ backgroundColor: diamondColor }} />
        <div className="w-[3px] h-[3px] rotate-45 opacity-50" style={{ backgroundColor: diamondColor }} />
        <div className="w-[40px] h-[0.5px]" style={{ backgroundColor: lineColor }} />
      </div>
    );
  }

  // short variant
  return (
    <div className="flex flex-row items-center gap-2 w-fit mx-auto mt-2 mb-5">
      <div className="w-[32px] h-[0.5px]" style={{ backgroundColor: lineColor }} />
      <div className="w-[5px] h-[5px] rotate-45 opacity-75" style={{ backgroundColor: diamondColor }} />
      <div className="w-[32px] h-[0.5px]" style={{ backgroundColor: lineColor }} />
    </div>
  );
};
