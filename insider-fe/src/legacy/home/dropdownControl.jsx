import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom/client";
import { ChevronsUpDown } from "lucide-react";
import { colorMap } from "./home";

export default function DropdownControl({ providers, selected, setSelected }) {
  const map = useMap();
  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);
  const divRef = useRef(null);
  const controlRef = useRef(null);

  // Helpers untuk dropdown
  const toggleIsp = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((n) => n !== name));
    } else {
      setSelected([...selected, name]);
    }
  };
  const selectAll = () => setSelected(providers.map((p) => p.name));
  const deselectAll = () => setSelected([]);

  // Buat Leaflet control sekali
  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-control");
    controlDiv.style.pointerEvents = "auto";
    // Sedikit styling biar terlihat seperti control

    divRef.current = controlDiv;
    L.DomEvent.disableClickPropagation(controlDiv);
    L.DomEvent.disableScrollPropagation(controlDiv);

    const control = L.control({ position: "topleft" });
    control.onAdd = () => controlDiv;
    control.addTo(map);
    controlRef.current = control;

    const root = ReactDOM.createRoot(controlDiv);
    rootRef.current = root;

    // Cleanup aman untuk StrictMode
    return () => {
      root.unmount();
      control.remove();
      controlRef.current = null;
      rootRef.current = null;
      divRef.current = null;
    };
  }, [map]);

  // Render konten dropdown setiap ada perubahan data/state
  useEffect(() => {
    if (!rootRef.current || !divRef.current) return;

    rootRef.current.render(
      <div className="p-1 bg-white border-2 border-gray-300 rounded-md z-[8000] w-[180px]">
        {/* Title */}
        <div className="text-xs font-semibold text-gray-700 ml-1">
          ISP (Area Expansion)
        </div>

        <button
          className="w-full pt-1 px-1 text-left cursor-pointer hover:bg-gray-200 flex justify-between items-center rounded"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-xs text-gray-700">
            {open ? "Tutup" : "Pilih ISP"}
          </span>
          <ChevronsUpDown className="w-4 h-4" />
        </button>

        {open && (
          <div>
            <div className="border-y-2 border-gray-300 p-1 flex flex-row gap-2 my-1">
              <button
                className="flex-1 bg-blue-500 text-white rounded text-xs py-1 hover:bg-blue-600 transition-colors"
                onClick={selectAll}
              >
                All
              </button>
              <button
                className="flex-1 bg-gray-400 text-white rounded text-xs py-1 hover:bg-gray-500 transition-colors"
                onClick={deselectAll}
              >
                None
              </button>
            </div>

            <div className="max-h-56 overflow-auto pr-1">
              {providers.map((p) => (
                <label
                  key={p.name}
                  className="flex justify-between items-center hover:bg-gray-100 cursor-pointer py-1 text-xs px-1 rounded"
                >
                  {/* Left: checkbox + name */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.name)}
                      onChange={() => toggleIsp(p.name)}
                    />
                    <span className="text-gray-800">{p.name}</span>
                  </div>

                  {/* Right: color circle */}
                  <div
                    className={`w-4 h-4 rounded-full ${
                      colorMap[p.name] ?? "bg-gray-300"
                    }`}
                    title={p.name}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [providers, selected, open, setSelected]);

  return null;
}
