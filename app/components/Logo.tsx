import React from "react";
import Image from "next/image";

export function TerraLogo({ className = "", size = "normal" }: { className?: string; size?: "small" | "normal" | "large" }) {
  // Height in pixels based on size prop
  const h = size === "small" ? 24 : size === "large" ? 72 : 72;
  // Approx aspect ratio for the full logo (icon + text) is roughly 1.5 : 1 or 2 : 1. 
  // Let's assume auto width to keep aspect ratio correct.
  
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/terra-logo.png" 
        alt="BNI TERRA" 
        height={h} 
        width={h * 3} // Estimate width, object-contain will handle ratio
        className="object-contain"
        style={{ width: "auto", height: `${h}px`, mixBlendMode: "multiply" }} // Force height, auto width, blend white bg
        priority
      />
    </div>
  );
}

export function DanantaraLogo({ className = "", height = 140 }: { className?: string; height?: number }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/danantara-logo.png" 
        alt="Danantara Indonesia" 
        height={height} 
        width={height * 4} 
        className="object-contain"
        style={{ width: "auto", height: `${height}px`, mixBlendMode: "multiply" }}
        priority
      />
    </div>
  );
}
