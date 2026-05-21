import React, { useState, useRef } from 'react';
import {
  HiMail,
  HiPhone,
  HiBadgeCheck,
  HiShieldCheck,
  HiLocationMarker,
  HiBriefcase,
  HiIdentification,
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiArrowRight,
  HiCamera,
  HiPencil,
  HiSave,
  HiX,
  HiUserGroup,
  HiStar,
  HiTrendingUp,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock user data - Static for now
  const [user, setUser] = useState({
    id: 1,
    name: "Admin",
    email: "admin@smile4u.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    kycStatus: "verified",
    profileCompleted: true,
    employeeId: "EMP-2024-001",
    department: "Operations",
    position: "Senior Manager",
    address: "123 Business District, Downtown, New York, NY 10001",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20 09:30 AM",
    identityVerified: true,
    addressVerified: true,
    profilePhoto: null,
    stats: {
      totalTrips: 1234,
      totalRevenue: 45678,
      satisfaction: 98,
      activeDrivers: 45,
    }
  });

  const [formData, setFormData] = useState({ ...user });

  // Stats for the profile
  const STATS = [
    { label: "Member Since", value: "Jan 2024", icon: <HiCalendar className="text-primary-yellow" />, trend: "+12%" },
    { label: "Last Login", value: "2 hours ago", icon: <HiClock className="text-primary-green" />, trend: "Active" },
    { label: "Account Status", value: "Premium", icon: <HiShieldCheck className="text-blue-500" />, trend: "Verified" },
    { label: "Security Level", value: "Level 3", icon: <HiShieldCheck className="text-purple-500" />, trend: "High" },
  ];

  // Performance metrics
  const METRICS = [
    { label: "Total Trips Managed", value: user.stats.totalTrips, change: "+15%", icon: <HiTrendingUp />, color: "from-blue-500 to-blue-600" },
    { label: "Revenue Generated", value: `$${user.stats.totalRevenue.toLocaleString()}`, change: "+23%", icon: <HiTrendingUp />, color: "from-green-500 to-green-600" },
    { label: "Customer Satisfaction", value: `${user.stats.satisfaction}%`, change: "+5%", icon: <HiStar />, color: "from-yellow-500 to-yellow-600" },
    { label: "Active Drivers", value: user.stats.activeDrivers, change: "+8%", icon: <HiUserGroup />, color: "from-purple-500 to-purple-600" },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...user });
  };

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...user });
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    // Simulate API upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePhoto: reader.result });
        setFormData({ ...formData, profilePhoto: reader.result });
        toast.success("Profile photo updated!");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      uploadPhoto(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-yellow to-primary-green bg-clip-text text-transparent">
            My Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information and preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <HiPencil /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-green text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <HiSave /> Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <HiX /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-2xl transition-all">
            <div className="relative inline-block group">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover mx-auto mb-4 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary-yellow to-yellow-600 rounded-2xl flex items-center justify-center text-primary-black text-4xl font-bold shadow-lg mx-auto mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-primary-yellow rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-primary-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <HiCamera className="text-primary-black text-sm" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-center text-xl font-bold bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
            )}
            
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-center text-sm bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary-yellow/10 text-primary-yellow rounded-lg text-xs font-semibold">
                {user.role}
              </span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold">
                KYC: {user.kycStatus}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-semibold">
                Premium Account
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employee ID</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{user.employeeId}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">Department</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="text-sm bg-transparent text-right focus:outline-none"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{user.department}</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">Position</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="text-sm bg-transparent text-right focus:outline-none"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{user.position}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiTrendingUp className="text-primary-yellow" /> Quick Stats
            </h4>
            <div className="space-y-3">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {stat.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{stat.value}</span>
                    {stat.trend && (
                      <p className="text-xs text-green-500">{stat.trend}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((metric, i) => (
              <div key={i} className={`bg-gradient-to-br ${metric.color} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm opacity-90">{metric.label}</span>
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs opacity-90">{metric.change} vs last month</div>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white mb-4">
              <HiMail className="text-primary-yellow" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <HiMail className="text-2xl text-primary-yellow" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="text-sm font-semibold bg-transparent border-b border-gray-300 focus:border-primary-yellow outline-none w-full"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <HiPhone className="text-2xl text-primary-yellow" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="text-sm font-semibold bg-transparent border-b border-gray-300 focus:border-primary-yellow outline-none w-full"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl md:col-span-2">
                <HiLocationMarker className="text-2xl text-primary-yellow" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="text-sm font-semibold bg-transparent border-b border-gray-300 focus:border-primary-yellow outline-none w-full resize-none"
                      rows="2"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Identity & Verification Section */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                <HiShieldCheck className="text-primary-yellow text-2xl" /> Identity & Verification
              </h3>
              <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-lg">
                <HiCheckCircle /> Secure
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-xs font-bold text-gray-400 uppercase">Registered Address</p>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 flex gap-2">
                    <HiLocationMarker className="shrink-0 text-primary-yellow mt-0.5" />
                    {user.address}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Status</p>
                <div className="space-y-3">
                  <DocStatus label="Identity Verification" status={user.identityVerified ? "verified" : "pending"} />
                  <DocStatus label="Address Verification" status={user.addressVerified ? "verified" : "pending"} />
                  <DocStatus label="KYC Completion" status={user.kycStatus === "verified" ? "verified" : "pending"} />
                  <DocStatus label="Profile Completion" status={user.profileCompleted ? "verified" : "pending"} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-yellow/10 to-primary-green/10 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <HiCheckCircle className="inline mr-1 text-primary-green" /> 
              Profile last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Document Status
const DocStatus = ({ label, status }) => {
  const statusConfig = {
    verified: { color: "bg-green-500", text: "text-green-500", icon: "✓" },
    pending: { color: "bg-yellow-500", text: "text-yellow-500", icon: "○" },
    rejected: { color: "bg-red-500", text: "text-red-500", icon: "✗" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase ${config.text}`}>{status}</span>
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
      </div>
    </div>
  );
};

export default Profile;