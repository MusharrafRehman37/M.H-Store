
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Trash2,
  User,
  ShieldCheck,
} from "lucide-react";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // ==============================
  // LOAD USERS
  // ==============================

  useEffect(() => {
    try {
      const savedUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      setUsers(savedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  }, []);

  // ==============================
  // DELETE USER
  // ==============================

  const handleDelete = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    const updatedUsers = users.filter(
      (user) =>
        (user.id || user._id || user.email) !== userId
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      user.email
        ?.toLowerCase()
        .includes(searchText) ||
      user.role
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Users size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Users
            </h1>

            <p className="text-gray-500 mt-1">
              Manage registered users and their roles.
            </p>
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

        <div className="relative max-w-md">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* COUNT */}

      <div className="mb-5 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredUsers.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {users.length}
        </span>{" "}
        users
      </div>

      {/* EMPTY */}

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

          <Users
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-5 text-gray-900">
            {users.length === 0
              ? "No Users Yet"
              : "No Users Found"}
          </h2>

          <p className="text-gray-500 mt-2">
            {users.length === 0
              ? "Registered customers will appear here."
              : "Try searching with a different keyword."}
          </p>

        </div>
      ) : (

        /* USERS TABLE */

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Joined
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredUsers.map((user) => {

                  const userId =
                    user.id ||
                    user._id ||
                    user.email;

                  const role =
                    user.role || "customer";

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                            <User size={20} />
                          </div>

                          <div>

                            <p className="font-semibold text-gray-900">
                              {user.fullName ||
                                "Unnamed User"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              ID: {userId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-4">

                        <span className="text-gray-700">
                          {user.email}
                        </span>

                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                            role.toLowerCase() ===
                            "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >

                          {role.toLowerCase() ===
                            "admin" && (
                            <ShieldCheck size={15} />
                          )}

                          {role}

                        </span>

                      </td>

                      {/* JOINED */}

                      <td className="px-6 py-4 text-gray-600">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-PK",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}

                      </td>

                      {/* DELETE */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              handleDelete(userId)
                            }
                            disabled={
                              role.toLowerCase() ===
                              "admin"
                            }
                            title={
                              role.toLowerCase() ===
                              "admin"
                                ? "Admin cannot be deleted"
                                : "Delete user"
                            }
                            className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserPage;

