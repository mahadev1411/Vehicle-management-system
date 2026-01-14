import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [v, u] = await Promise.all([
        api.get("/vehicles"),
        api.get("/users"),
      ]);
      setVehicles(v.data);
      setUsers(u.data);
      setError("");
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const saveVehicle = async (e) => {
    e.preventDefault();
    if (!name.trim() || !number.trim()) {
      setError("Name and number are required");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await api.put(`/vehicles/${editId}`, { name, number });
        setSuccess("Vehicle updated successfully!");
      } else {
        await api.post("/vehicles", { name, number });
        setSuccess("Vehicle added successfully!");
      }
      setEditId(null);
      setName("");
      setNumber("");
      setError("");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  const editVehicle = (v) => {
    setEditId(v._id);
    setName(v.name);
    setNumber(v.number);
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setNumber("");
    setError("");
  };

  const deleteVehicle = async (id, vehicleName) => {
    if (!window.confirm(`Are you sure you want to delete "${vehicleName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/vehicles/${id}`);
      setSuccess("Vehicle deleted successfully!");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  const assign = async (vid, uid) => {
    if (!uid) return;

    try {
      setLoading(true);
      await api.put(`/vehicles/${vid}/assign`, { userId: uid });
      setSuccess("Vehicle assigned successfully!");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to assign vehicle");
    } finally {
      setLoading(false);
    }
  };


  const getUserName = (assignedTo) => {
    // Handle case where assignedTo is populated (object with name)
    if (assignedTo && typeof assignedTo === 'object' && assignedTo.name) {
      return assignedTo.name;
    }
    // Handle case where assignedTo is just an ID string
    if (assignedTo && typeof assignedTo === 'string') {
      const user = users.find(u => u._id === assignedTo);
      return user ? user.name : "Unassigned";
    }
    return "Unassigned";
  };

  const getAssignedUserId = (assignedTo) => {
    // Return the ID whether assignedTo is an object or string
    if (assignedTo && typeof assignedTo === 'object') {
      return assignedTo._id;
    }
    return assignedTo || "";
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Console
            </h1>
            <p className="text-gray-400 mt-2">Manage vehicles and users</p>
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          >
            Logout
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl backdrop-blur-lg">
            {success}
          </div>
        )}

        {/* Vehicle Management Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vehicle Management
          </h2>

          {/* Add/Edit Form */}
          <form onSubmit={saveVehicle} className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              className="flex-1 bg-black/40 border border-white/20 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500"
              placeholder="Vehicle Name (e.g., Toyota Camry)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <input
              className="flex-1 bg-black/40 border border-white/20 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500"
              placeholder="Vehicle Number (e.g., ABC-1234)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50"
                disabled={loading}
              >
                {editId ? "Update" : "Add Vehicle"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-4 rounded-xl font-semibold transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Vehicles Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-300">Vehicle Name</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Number</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Assigned To</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Assign/Reassign</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-400">
                      No vehicles found. Add your first vehicle above.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-medium">{v.name}</td>
                      <td className="p-4 text-gray-300">{v.number}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${v.assignedTo
                          ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                          }`}>
                          {v.assignedTo ? getUserName(v.assignedTo) : "Unassigned"}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={getAssignedUserId(v.assignedTo)}
                          onChange={(e) => assign(v._id, e.target.value)}
                          className="bg-black/60 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[180px]"
                          disabled={loading}
                        >
                          <option value="">-- Select User --</option>
                          {users.filter(u => u.role === "user").map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editVehicle(v)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors px-3 py-1 rounded-lg hover:bg-indigo-500/20"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteVehicle(v._id, v.name)}
                            className="text-red-400 hover:text-red-300 font-semibold transition-colors px-3 py-1 rounded-lg hover:bg-red-500/20"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User List Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            User Management
          </h2>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-300">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Role</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Assigned Vehicles</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const assignedVehicles = vehicles.filter(v => getAssignedUserId(v.assignedTo) === u._id);
                    return (
                      <tr
                        key={u._id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-medium">{u.name}</td>
                        <td className="p-4 text-gray-300">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                            }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          {assignedVehicles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {assignedVehicles.map(v => (
                                <span
                                  key={v._id}
                                  className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 px-3 py-1 rounded-full text-sm"
                                >
                                  {v.name} ({v.number})
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No vehicles assigned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
