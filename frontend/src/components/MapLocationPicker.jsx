import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function ClickMarker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const nominatimSearch = async (q) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  return res.json();
};

const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  return res.json();
};

export default function MapLocationPicker({ label, value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const center = useMemo(() => [26.8467, 80.9462], []); // Lucknow default

  const handleSearch = async () => {
    if (!query.trim()) return;
    const data = await nominatimSearch(query.trim());
    setResults((data || []).slice(0, 5));
  };

  const selectResult = (r) => {
    onChange({
      address: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    });
    setResults([]);
  };

  const pickFromMap = async ({ lat, lng }) => {
    const data = await reverseGeocode(lat, lng);
    onChange({
      address: data.display_name || "Selected on map",
      lat,
      lng,
    });
    setResults([]);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <h5 style={{ marginBottom: 10 }}>{label}</h5>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-outline-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="list-group mt-2">
          {results.map((r) => (
            <button
              key={r.place_id}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => selectResult(r)}
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}

      <div style={{ height: 320, marginTop: 12, borderRadius: 12, overflow: "hidden" }}>
        <MapContainer
          center={value?.lat ? [value.lat, value.lng] : center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickMarker onPick={pickFromMap} />
          {value?.lat && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>

      <div className="mt-2">
        <small className="text-muted">
          Selected: {value?.address ? value.address : "None"} <br />
          {value?.lat ? `(${value.lat.toFixed(5)}, ${value.lng.toFixed(5)})` : ""}
        </small>
      </div>
    </div>
  );
}