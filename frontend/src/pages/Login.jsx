import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-black flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-md text-white">
        <h1 className="text-3xl font-semibold">Bullwork Mobility</h1>
        <p className="text-slate-400 mb-6">Fleet Access Console</p>

        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            placeholder="Email" value={email}
            onChange={(e)=>setEmail(e.target.value)} />
          <input type="password"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            placeholder="Password" value={password}
            onChange={(e)=>setPassword(e.target.value)} />
          {error && <p className="text-red-400">{error}</p>}
          <button className="w-full py-3 bg-indigo-600 rounded-xl">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
