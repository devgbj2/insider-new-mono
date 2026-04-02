import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', `info legend bg-white py-1 px-2  z-50 border-2 border-gray-300`);
      div.innerHTML = `
        <div class="flex items-center text-xs mb-0.5 text-gray-700"><span class="inline-block w-2.5 h-2.5 bg-[#002fff] mr-1"></span>TR1</div>
        <div class="flex items-center text-xs mb-0.5 text-gray-700"><span class="inline-block w-2.5 h-2.5 bg-[#9d00ff] mr-1"></span>TR2</div>
        <div class="flex items-center text-xs mb-0.5 text-gray-700"><span class="inline-block w-2.5 h-2.5 bg-[#00d90b] mr-1"></span>TR3</div>
        <div class="flex items-center text-xs text-gray-700"><span class="inline-block w-2.5 h-2.5 bg-[#a9a9a9] mr-1"></span>TR4</div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}