
import React, { useState } from 'react';
import { UserProfile, Zone } from '../src/domain/entities/types';

interface Props {
  profiles: UserProfile[];
  zones: Zone[];
  isAlert: boolean;
}

const MapVisualizer: React.FC<Props> = ({ profiles, zones, isAlert }) => {
  const [zoom, setZoom] = useState(1);

  const getIcon = (type: string) => {
      switch(type) {
          case 'ELDERLY': return '👴';
          case 'PET': return '🐾';
          case 'OBJECT': return '🎒';
          case 'FRIEND': return '🧑‍🤝‍🧑';
          default: return '👶';
      }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  return (
    <div className="relative w-full h-full bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 group">
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-1 bg-white/90 backdrop-blur rounded-lg shadow-lg border border-slate-200 p-1">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 rounded transition-colors text-lg"
          aria-label="Zoom In"
        >
          +
        </button>
        <div className="h-px w-full bg-slate-200"></div>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 rounded transition-colors text-lg"
          aria-label="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Zoomable Container */}
      <div 
        className="w-full h-full relative transition-transform duration-500 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {/* Fake Map Grid Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        
        {/* Map Labels - Responsive text size */}
        <div className="absolute top-4 left-4 lg:top-10 lg:left-10 text-slate-400 font-bold text-[10px] lg:text-xs tracking-widest uppercase pointer-events-none transform scale-100">Zona Norte - Residencial</div>
        <div className="absolute bottom-4 right-4 lg:bottom-10 lg:right-10 text-slate-400 font-bold text-[10px] lg:text-xs tracking-widest uppercase pointer-events-none transform scale-100">Parque Central</div>

        {/* Custom Safe Zones */}
        {zones.map(zone => (
          <div 
              key={zone.id}
              className="absolute border-2 border-dashed border-indigo-400 bg-indigo-400/10 rounded-full flex items-center justify-center"
              style={{
                  width: `${zone.radius * 2}px`,
                  height: `${zone.radius * 2}px`,
                  top: `${zone.lat}%`,
                  left: `${zone.lng}%`,
                  transform: 'translate(-50%, -50%)'
              }}
          >
              <div className="absolute -top-6 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap transform -translate-x-1/2 left-1/2">
                  {zone.name}
              </div>
          </div>
        ))}

        {/* Location History Trails */}
        {profiles.map((p) => (
          <React.Fragment key={`history-${p.id}`}>
              {p.locationHistory.map((point, idx) => (
                  <div 
                      key={idx}
                      className="absolute w-1.5 h-1.5 rounded-full bg-slate-500/30"
                      style={{
                          top: `${point.lat}%`,
                          left: `${point.lng}%`,
                          opacity: (idx + 1) / p.locationHistory.length
                      }}
                  />
              ))}
          </React.Fragment>
        ))}

        {/* Profile Markers */}
        {profiles.map((p) => (
          <div
            key={p.id}
            className={`absolute transition-all duration-1000 ease-in-out flex flex-col items-center justify-center z-10`}
            style={{
              top: p.status === 'DANGER' ? '15%' : `${p.location.lat}%`, 
              left: p.status === 'DANGER' ? '80%' : `${p.location.lng}%`,
              transform: `translate(-50%, -50%) scale(${1/Math.max(1, zoom * 0.7)})` // Counter-scale markers slightly to prevent them becoming huge
            }}
          >
              {/* Ping Animation for Tags */}
              <div className={`absolute w-16 h-16 rounded-full opacity-20 animate-ping ${p.status === 'DANGER' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

              <div className={`relative w-12 h-12 rounded-full border-4 shadow-lg flex items-center justify-center overflow-hidden bg-white
                  ${p.status === 'DANGER' ? 'border-red-500 animate-bounce' : 'border-emerald-500'}
              `}>
                  <span className="text-2xl">{getIcon(p.type)}</span>
              </div>
              
              <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm whitespace-nowrap flex flex-col items-center 
                  ${p.status === 'DANGER' ? 'bg-red-600 text-white' : 'bg-white text-slate-600'}`}>
                  <span>{p.name}</span>
                  <span className="text-[8px] opacity-80 flex items-center gap-1">
                      {p.deviceType === 'GPS_TAG' ? '📡 TAG' : '📱 CEL'} | {p.speed}mph
                  </span>
              </div>
          </div>
        ))}
      </div>

      {/* Geofence Alert Effect - Outside zoom container so it frames the viewport */}
      {isAlert && (
         <div className="absolute inset-0 border-8 border-red-500/30 animate-pulse pointer-events-none z-10"></div>
      )}
    </div>
  );
};

export default MapVisualizer;
