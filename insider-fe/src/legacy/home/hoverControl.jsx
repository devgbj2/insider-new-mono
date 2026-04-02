import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function HoverControl({ totalIsp, totalJartup, totalJartaplok }) {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', `info legend bg-white border-2 border-gray-300`)
      div.innerHTML = `
        <div class="flex justify-around text-center text-gray-700">
          <div class="flex flex-col items-center justify-center p-1">
            <span class="text-xs px-1">ISP Nasional</span>
            <span class="text-lg md:text-xl font-semibold">${totalIsp}</span>
          </div>
          <div class="flex flex-col items-center justify-center p-1 border-l-2 border-gray-300">
            <span class="text-xs px-1">JARTUP</span>
            <span class="text-lg md:text-xl font-semibold">${totalJartup}</span>
          </div>
          <div class="flex flex-col items-center justify-center p-1 border-l-2 border-gray-300">
            <span class="text-xs px-1">JARTAPLOK</span>
            <span class="text-lg md:text-xl font-semibold">${totalJartaplok}</span>
          </div>
        </div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, totalIsp, totalJartup, totalJartaplok]);

  return null;
}