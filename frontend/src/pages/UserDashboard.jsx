import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/vehicles/my").then(res => setVehicles(res.data));
  }, []);

  const viewTelemetry = async (v) => {
    setSelected(v);
    const res = await api.get(`/telemetry/${v._id}`);
    setTelemetry(res.data.telemetry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-black text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl">Fleet Console</h1>
            <p className="text-slate-400">Operator: {user.name}</p>
          </div>
          <button onClick={logout} className="bg-red-600 px-6 py-2 rounded-xl">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {vehicles.map(v => (
            <div key={v._id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p>{v.name}</p>
              <p className="text-slate-400 text-sm">{v.number}</p>
              <button
                onClick={() => viewTelemetry(v)}
                className="mt-4 bg-indigo-600 px-4 py-2 rounded-lg">
                View Telemetry
              </button>
            </div>
          ))}
        </div>

        {telemetry && (
          <>
            <h2 className="text-2xl mt-10">Telemetry – {selected.name}</h2>

            <div className="grid grid-cols-2 gap-6 h-64">
              <ResponsiveContainer>
                <LineChart data={telemetry.speed.map((v,i)=>({i,v}))}>
                  <XAxis dataKey="i" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="v" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>

              <ResponsiveContainer>
                <LineChart data={telemetry.temperature.map((v,i)=>({i,v}))}>
                  <XAxis dataKey="i" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="v" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <p>Battery: {telemetry.battery.at(-1)}%</p>
              <p className="text-slate-400">
                Last Updated: {new Date(telemetry.lastUpdated).toLocaleString()}
              </p>
            </div>

            <MapContainer
              center={[telemetry.gps.lat, telemetry.gps.lng]}
              zoom={13}
              className="h-64 mt-6 rounded-xl">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[telemetry.gps.lat, telemetry.gps.lng]} />
            </MapContainer>
          </>
        )}

      </div>
    </div>
  );
}
