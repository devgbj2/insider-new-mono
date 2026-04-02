import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import LegendControl from './legendControl';
import TotalIspControl from './hoverControl';
import DropdownControl from './dropdownControl';
import MarketShareControl from './marketShareChartControl';
import { Loading } from '@/lib/common';
import { useEffect, useState } from 'react';
import internetServiceProviders from './isp.json';
import { Marker, Tooltip } from 'react-leaflet';
import { divIcon } from "leaflet";
import { Header } from '@/props/header';

// URL untuk TileLayer peta
const MAP_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

const createCustomIcon = (color) => {
  return divIcon({
    html: `<div class="w-[30px] h-[30px] rounded-full border border-gray-800 bg-${color}"></div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

export const colorMap = {
  "ICONNET": "bg-emerald-200",
  "First Media": "bg-orange-200",
  "Biznet Home": "bg-violet-300",
  "CBN Fiber": "bg-fuchsia-300",
  "Indosat Hifi": "bg-blue-300",
  "MNC Play": "bg-red-300",
  "My Republic": "bg-zinc-300",
  "Oxygen.id": "bg-indigo-300",
  "XL Satu": "bg-amber-200"
}

const offsetPosition = (lat, lng, index, total) => {
  const radius = 0.03; // atur di sini (misal 0.01 = 1000 meter)
  const angle = (index / total) * 2 * Math.PI; // distribusi melingkar
  const offsetLat = lat + radius * Math.sin(angle);
  const offsetLng = lng + radius * Math.cos(angle);
  return [offsetLat, offsetLng];
};

const useMapData = () => {
  const [geoData, setGeoData] = useState(null);
  const [totalIsp, setTotalIsp] = useState(0);
  const [totalJartup, setTotalJartup] = useState(0);
  const [totalJartaplok, setTotalJartaplok] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const geoJsonPath = '/geodata.geojson';

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const geodataPromise = fetch(geoJsonPath).then((res) => {
          if (!res.ok) {
            throw new Error(`Gagal mengambil geodata: ${res.status}`);
          }
          return res.json();
        });

        function getIspSummary (){
          return 
        }

        const ispDataPromise = getIspSummary();

        const [geojsonResult, ispDataResult] = await Promise.all([
          geodataPromise,
          ispDataPromise,
        ]);

        geojsonResult.features.forEach((feature) => {
          const provinceName = feature.properties.name;
          const info = ispDataResult[provinceName];
          feature.properties.total_isp = info ? info.total_isp : 0;
          feature.properties.total_jartup = info ? info.total_jartup : 0;
          feature.properties.total_jartaplok = info ? info.total_jartaplok : 0;
        });

        setGeoData(geojsonResult);

        const ispSummaryValues = Object.values(ispDataResult);
        setTotalIsp(
          ispSummaryValues.reduce((sum, info) => sum + (info?.total_isp || 0), 0)
        );
        setTotalJartup(
          ispSummaryValues.reduce((sum, info) => sum + (info?.total_jartup || 0), 0)
        );
        setTotalJartaplok(
          ispSummaryValues.reduce((sum, info) => sum + (info?.total_jartaplok || 0), 0)
        );
      } catch (err) {
        console.error('Error fetching map data:', err);
        toast.error(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { geoData, totalIsp, totalJartup, totalJartaplok, isLoading };
};

export default function HomePage() {
  const { geoData, totalIsp, totalJartup, totalJartaplok, isLoading } =
    useMapData();
  const [selectedProvider, setSelectedProvider] = useState([]);

  const styleByFeature = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: feature.properties.color || '#ccc',
    fillOpacity: 0.6,
  });

  const onEachFeature = (feature, layer) => {
    const { name, region, total_isp, total_jartup, total_jartaplok } =
      feature.properties;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>Wilayah: ${region}<br/>Total ISP: ${total_isp}<br/>JARTUP: ${total_jartup}<br/>JARTAPLOK: ${total_jartaplok}`,
      { sticky: true }
    );
  };

  if (isLoading) {
    return <Loading>Memuat data...  </Loading>;
  }

  return (
    <div className="card  p-4 flex flex-col gap-4">
      <Header
        headingName="Peta ISP Nasional"
        paragraphName="Last Updated W4 Mei 25 "
      />
      <div className="w-full h-[74vh] border border-gray-300 rounded-lg">
        <MapContainer
          center={[-2.0, 115.0]}
          zoomControl={false}
          zoom={5}
          className="w-full h-full rounded-lg"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url={MAP_TILE_URL}
          />
          {internetServiceProviders
            .filter((p) => selectedProvider.includes(p.name))
            .flatMap((p) =>
              p.locations.map((location, locationIndex) => (
                <Marker
                  key={`${p.name}-${locationIndex}`}
                  position={offsetPosition(
                    location.lat,
                    location.lng,
                    locationIndex,
                    p.locations.length
                  )}
                  icon={createCustomIcon(p.color)}
                >
                  <Tooltip direction="bottom" offset={[0, 10]} opacity={1}>
                    <div className="flex flex-col items-center">
                      <div className="font-semibold text-sm mb-0.5 text-gray-800">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-700">
                        {location.city}
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              ))
            )}
          {geoData && (
            <>
              <GeoJSON
                data={geoData}
                style={styleByFeature}
                onEachFeature={onEachFeature}
              />
              <LegendControl />
              <TotalIspControl
                totalIsp={totalIsp}
                totalJartup={totalJartup}
                totalJartaplok={totalJartaplok}
              />
              <DropdownControl
                providers={internetServiceProviders}
                selected={selectedProvider}
                setSelected={setSelectedProvider}
              />
              <MarketShareControl />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}