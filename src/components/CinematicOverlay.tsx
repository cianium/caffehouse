import React from 'react';

interface CinematicOverlayProps {
  isEnabled: boolean;
}

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({ isEnabled }) => {
  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden" aria-hidden="true">
      {/* 1. Subtle 35mm Film Grain Simulation */}
      <div className="absolute -inset-[50%] w-[200%] h-[200%] cinematic-film-grain opacity-40 mix-blend-overlay pointer-events-none" />

      {/* 2. Soft Atmospheric Ambient Bloom */}
      <div className="absolute inset-0 cinematic-bloom-layer pointer-events-none opacity-60" />

      {/* 3. Luxury Cinema Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(10,5,3,0.45)_100%)] pointer-events-none" />
    </div>
  );
};
