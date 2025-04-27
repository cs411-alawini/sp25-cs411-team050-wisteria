"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";

interface UserProfile {
  name: string;
  email: string;
  location: string;
}

const initialProfile: UserProfile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  location: "Champaign, IL",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleEdit = (field: keyof UserProfile) => {
    setEditField(field);
    setEditValue(profile[field]);
  };

  const handleSave = () => {
    if (editField) {
      setProfile({ ...profile, [editField]: editValue });
      setEditField(null);
    }
  };

  const handleCancel = () => {
    setEditField(null);
    setEditValue("");
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setResetMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMessage("New passwords do not match.");
      return;
    }
    setResetMessage("Password reset successfully (placeholder)");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Navbar />
      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          <section className="mb-8 text-black bg-gradient-to-br from-white to-green-50 p-8 rounded-xl shadow-md border border-green-100">
            <h2 className="text-3xl font-bold mb-6 text-emerald-900">Profile</h2>
            <div className="flex flex-col gap-6">
              {/* Name Row */}
              <div className="flex flex-row items-center md:gap-6 gap-2 w-full">
                <span className="text-2xl text-gray-700 w-32">Name</span>
                <div className="flex-1">
                  {editField === "name" ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[200px]"
                      />
                      <button
                        className="ml-2 bg-emerald-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-gray-900">{profile.name}</span>
                  )}
                </div>
                <button
                  className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                  onClick={() => handleEdit("name")}
                  disabled={!!editField}
                >
                  Edit
                </button>
              </div>
              {/* Email Row */}
              <div className="flex flex-row items-center md:gap-6 gap-2 w-full">
                <span className="text-2xl text-gray-700 w-32">Email</span>
                <div className="flex-1">
                  {editField === "email" ? (
                    <>
                      <input
                        type="email"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[200px]"
                      />
                      <button
                        className="ml-2 bg-emerald-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-gray-900">{profile.email}</span>
                  )}
                </div>
                <button
                  className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                  onClick={() => handleEdit("email")}
                  disabled={!!editField}
                >
                  Edit
                </button>
              </div>
              {/* Location Row */}
              <div className="flex flex-row items-center md:gap-6 gap-2 w-full">
                <span className="text-2xl text-gray-700 w-32">Location</span>
                <div className="flex-1">
                  {editField === "location" ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[200px]"
                      />
                      <button
                        className="ml-2 bg-emerald-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-gray-900">{profile.location}</span>
                  )}
                </div>
                <button
                  className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                  onClick={() => handleEdit("location")}
                  disabled={!!editField}
                >
                  Edit
                </button>
              </div>
            </div>
            {/* Password Reset */}
            <div className="mt-10 flex flex-col items-center">
              <button
                className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
                onClick={() => setShowReset(!showReset)}
              >
                {showReset ? "Cancel" : "Reset Password"}
              </button>
              {showReset && (
                <form
                  className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow border border-blue-100"
                  onSubmit={handlePasswordReset}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">Reset Password</h3>
                  <div className="flex flex-col gap-4">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition"
                    >
                      Reset Password
                    </button>
                    {resetMessage && (
                      <div className="text-center text-sm text-red-600 mt-2">{resetMessage}</div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
