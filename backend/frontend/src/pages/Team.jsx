import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";
import {
  FiUser,
  FiMail,
  FiShield,
  FiStar,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USERS RESPONSE:", response.data);

      setUsers(
        Array.isArray(response.data.users)
          ? response.data.users
          : []
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load team members");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit">
          <FiShield size={12} />
          <span>Administrator</span>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit">
        <FiUser size={12} />
        <span>Team Member</span>
      </div>
    );
  };

  const safeUsers = Array.isArray(users)
    ? users
    : [];

  const admins = safeUsers.filter(
    (u) => u.role === "admin"
  );

  const members = safeUsers.filter(
    (u) => u.role === "member"
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>

            <p className="mt-4 text-gray-600">
              Loading team members...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-0">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Team Members
          </h1>

          <p className="text-blue-100">
            Manage and collaborate with your team
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8">

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">
                  Total Members
                </p>

                <p className="text-4xl font-bold mt-1">
                  {safeUsers.length}
                </p>
              </div>

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiUsers size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">
                  Administrators
                </p>

                <p className="text-4xl font-bold mt-1">
                  {admins.length}
                </p>
              </div>

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiShield size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">
                  Team Members
                </p>

                <p className="text-4xl font-bold mt-1">
                  {members.length}
                </p>
              </div>

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiTrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="px-6 pb-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              All Team Members
            </h2>

            <p className="text-gray-500 text-sm">
              View and manage your team
            </p>
          </div>

          {safeUsers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">

              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers
                  size={32}
                  className="text-gray-400"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No team members found
              </h3>

              <p className="text-gray-500">
                Invite users to join your team
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {safeUsers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 relative">

                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg">

                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {member?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                      </div>
                    </div>

                  </div>

                  <div className="pt-14 p-6">

                    <h3 className="text-xl font-bold text-gray-800">
                      {member.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <FiMail size={14} />
                      <span className="text-sm break-all">
                        {member.email}
                      </span>
                    </div>

                    <div className="mt-4">
                      {getRoleBadge(member.role)}
                    </div>

                    <div className="pt-4 border-t mt-4">

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Joined
                        </span>

                        <span className="font-medium">
                          {member.createdAt
                            ? new Date(
                                member.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      {currentUser?.id ===
                        member.id && (
                        <div className="bg-blue-50 rounded-lg p-2 mt-3 flex items-center gap-2">
                          <FiStar
                            className="text-blue-600"
                            size={14}
                          />

                          <span className="text-xs text-blue-600 font-medium">
                            This is you
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Team;