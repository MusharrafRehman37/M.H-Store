import { useEffect, useState } from "react";
import { Search, Trash2, Users, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdminUsers, deleteAdminUser } from "../../services/userService";

function User() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { try { setLoading(true); setError(""); setUsers(await getAdminUsers()); } catch (e) { setError(e.message || "Failed to load users"); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const handleDelete = async (uid) => { if (!window.confirm("Delete this user? They will need to register again with the same email.")) return; try { await deleteAdminUser(uid); setUsers((prev) => prev.filter((x) => x.uid !== uid)); } catch (e) { setError(e.message || "Failed to delete user"); } };
  const filtered = users.filter((x) => `${x.fullName} ${x.email} ${x.role}`.toLowerCase().includes(search.toLowerCase().trim()));
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><div className="flex items-center gap-3"><div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Users size={22}/></div><div><h1 className="text-2xl font-bold">Users</h1><p className="text-sm text-gray-500 mt-1">Users are loaded directly from MongoDB.</p></div></div></div><button onClick={load} className="inline-flex items-center gap-2 border px-4 py-3 rounded-xl font-semibold"><RefreshCw size={17}/>Refresh</button></div>
    {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">{error}</div>}
    <div className="bg-white rounded-2xl border shadow-sm p-5"><div className="relative max-w-md"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"/></div></div>
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">{loading ? <div className="p-12 text-center text-gray-500">Loading users...</div> : filtered.length === 0 ? <div className="p-12 text-center text-gray-500">No users found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[750px]"><thead className="bg-gray-50"><tr><th className="text-left px-6 py-4">Name</th><th className="text-left px-6 py-4">Email</th><th className="text-left px-6 py-4">Role</th><th className="text-left px-6 py-4">Joined</th><th className="text-right px-6 py-4">Action</th></tr></thead><tbody className="divide-y">{filtered.map((item)=><tr key={item.uid}><td className="px-6 py-4 font-semibold">{item.fullName}</td><td className="px-6 py-4 text-gray-600">{item.email}</td><td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">{item.role}</span></td><td className="px-6 py-4 text-gray-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-PK") : "-"}</td><td className="px-6 py-4 text-right">{item.uid !== user?.uid && item.role !== "admin" && <button onClick={()=>handleDelete(item.uid)} className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"><Trash2 size={17}/>Delete</button>}</td></tr>)}</tbody></table></div>}</div>
  </div>;
}
export default User;
