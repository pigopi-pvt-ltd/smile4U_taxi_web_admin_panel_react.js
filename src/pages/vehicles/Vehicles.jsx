import React, { useState, useEffect } from 'react';
import { HiSearch, HiPlus, HiOutlineEye, HiPencil, HiTrash, HiOutlinePhotograph } from 'react-icons/hi';
import { HiArrowPath } from 'react-icons/hi2';
import PageHeader from '../../components/common/PageHeader';
import AddVehicleModal from './AddVehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import toast from 'react-hot-toast';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Mock data
  const mockVehicles = [
    {
      _id: 'VEH-001',
      cabNumber: 'MH01AB1234',
      modelName: 'Toyota Camry',
      yearOfMaking: 2022,
      status: 'active',
      vendor: {
        vendorName: 'John Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        address: 'Mumbai, Maharashtra',
        gender: 'male',
        aadhar: '1234-5678-9012',
        pan: 'ABCDE1234F'
      },
      rcNumber: 'RC123456789',
      insuranceNumber: 'INS987654321',
      insuranceExpiryDate: '2024-12-31',
      pollutionNumber: 'PUC123456',
      pollutionExpiryDate: '2024-08-15',
      permitNumber: 'PER789012345',
      permitExpiryDate: '2025-06-30',
      fitnessNumber: 'FIT456789012',
      fitnessExpiryDate: '2024-10-20',
      vehicleImages: [],
      capacity: 4,
      type: 'Sedan',
      ac: true
    },
    {
      _id: 'VEH-002',
      cabNumber: 'MH02CD5678',
      modelName: 'Honda CR-V',
      yearOfMaking: 2021,
      status: 'active',
      vendor: {
        vendorName: 'Sarah Johnson',
        mobile: '9876543211',
        email: 'sarah@example.com',
        address: 'Delhi, India',
        gender: 'female',
        aadhar: '5678-9012-3456',
        pan: 'FGHIJ5678K'
      },
      rcNumber: 'RC234567890',
      insuranceNumber: 'INS876543210',
      insuranceExpiryDate: '2024-11-15',
      pollutionNumber: 'PUC234567',
      pollutionExpiryDate: '2024-07-20',
      permitNumber: 'PER890123456',
      permitExpiryDate: '2025-05-25',
      fitnessNumber: 'FIT567890123',
      fitnessExpiryDate: '2025-01-10',
      vehicleImages: [],
      capacity: 5,
      type: 'SUV',
      ac: true
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setVehicles(mockVehicles);
      setRefreshing(false);
      toast.success('Vehicles refreshed');
    }, 500);
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success('Vehicle deleted successfully');
    }
  };

  const handleAddVehicle = (newVehicle) => {
    const vehicleWithId = {
      ...newVehicle,
      _id: `VEH-${String(vehicles.length + 1).padStart(3, '0')}`
    };
    setVehicles(prev => [vehicleWithId, ...prev]);
    toast.success('Vehicle added successfully!');
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(prev => prev.map(v => v._id === updatedVehicle._id ? updatedVehicle : v));
    toast.success('Vehicle updated successfully!');
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { color: 'bg-red-100 text-red-700', label: 'Expired' };
    if (daysLeft <= 30) return { color: 'bg-orange-100 text-orange-700', label: `${daysLeft} days left` };
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'V';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'inactive': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.cabNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vendor?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vendor?.mobile?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-pulse transition-colors duration-300">
        <div className="sticky top-16 h-[56px] z-30 bg-[#f8f9fa] dark:bg-slate-800/50 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="h-6 w-56 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
        <div className="p-4 md:p-8 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-in fade-in duration-500">
      <div className="bg-slate-50 dark:bg-[#0A1128] min-h-[calc(100vh-64px)] transition-colors duration-300">
        
        {/* Page Header Component */}
        <PageHeader
          title="Vehicles"
          count={filteredVehicles.length}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          extraButtons={
            <button
              onClick={() => {
                setEditingVehicle(null);
                setIsAddModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <HiPlus className="text-lg md:hidden" />
              <span className="hidden md:inline">Add Vehicle</span>
              <span className="md:hidden">Add</span>
            </button>
          }
        />

        {/* Search and Filters */}
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by cab number, model, vendor name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="px-4 md:px-6 pb-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Model</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Insurance Expiry</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredVehicles.map((vehicle) => {
                    const insuranceStatus = getExpiryStatus(vehicle.insuranceExpiryDate);
                    return (
                      <tr key={vehicle._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-yellow/20 flex items-center justify-center">
                              <HiOutlinePhotograph className="text-primary-yellow" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">{vehicle.cabNumber}</p>
                              <p className="text-xs text-gray-500">{vehicle.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{vehicle.vendor?.vendorName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{vehicle.vendor?.mobile}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{vehicle.modelName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{vehicle.yearOfMaking}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{vehicle.insuranceExpiryDate}</p>
                            {insuranceStatus && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${insuranceStatus.color}`}>
                                {insuranceStatus.label}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setIsDetailsModalOpen(true);
                              }}
                              className="p-2 text-gray-500 hover:text-primary-yellow rounded-lg hover:bg-yellow-50 transition-all"
                              title="View Details"
                            >
                              <HiOutlineEye className="text-lg" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingVehicle(vehicle);
                                setIsAddModalOpen(true);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all"
                              title="Edit Vehicle"
                            >
                              <HiPencil className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle._id)}
                              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                              title="Delete Vehicle"
                            >
                              <HiTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
              <p className="text-gray-500">Showing {filteredVehicles.length} of {vehicles.length} vehicles</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Previous</button>
                <button className="px-3 py-1 text-sm bg-primary-yellow text-primary-black rounded-lg font-semibold">1</button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">2</button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Vehicle Modal */}
        <AddVehicleModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingVehicle(null);
          }}
          onSave={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
          editingVehicle={editingVehicle}
        />

        {/* Vehicle Details Modal */}
        <VehicleDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
        />
      </div>
    </div>
  );
};

export default Vehicles;