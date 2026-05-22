import React, { useState, useEffect } from 'react';
import { HiSearch, HiPlus, HiOutlineEye, HiPencil, HiTrash, HiUser } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import PageHeader from '../../components/common/PageHeader';
import AddDriverModal from './AddDriver';
import DriverDetailsModal from './DriverDetails';
import toast from 'react-hot-toast';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);

  // Mock data
  const mockDrivers = [
    {
      _id: '1',
      name: 'Mike Smith',
      email: 'mike.smith@example.com',
      mobileNumber: '+1 234 567 8901',
      profilePhoto: null,
      driverDetails: {
        fullName: 'Mike Smith',
        dateOfBirth: '1985-05-15',
        drivingLicenseNumber: 'DL123456789',
        dlExpiryDate: '2028-05-14',
        vehicleRegNumber: 'MH01AB1234',
        vehicleType: 'Sedan',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleYear: 2022,
        yearsOfExperience: 8,
        kycStatus: 'approved',
        availabilityStatus: 'available',
        gender: 'male',
        presentAddress: '123 Main St, Downtown, NY 10001',
        permanentAddress: '123 Main St, Downtown, NY 10001',
        aadhar: '1234-5678-9012',
        pan: 'ABCDE1234F',
        accountHolderName: 'Mike Smith',
        bankName: 'Chase Bank',
        accountNumber: '123456789012',
        ifscCode: 'CHAS0123456'
      }
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      mobileNumber: '+1 234 567 8902',
      profilePhoto: null,
      driverDetails: {
        fullName: 'Sarah Johnson',
        dateOfBirth: '1990-08-22',
        drivingLicenseNumber: 'DL987654321',
        dlExpiryDate: '2027-08-21',
        vehicleRegNumber: 'MH02CD5678',
        vehicleType: 'SUV',
        vehicleMake: 'Honda',
        vehicleModel: 'CR-V',
        vehicleYear: 2021,
        yearsOfExperience: 5,
        kycStatus: 'pending',
        availabilityStatus: 'unavailable',
        gender: 'female'
      }
    },
    {
      _id: '3',
      name: 'David Wilson',
      email: 'david.w@example.com',
      mobileNumber: '+1 234 567 8903',
      profilePhoto: null,
      driverDetails: {
        fullName: 'David Wilson',
        dateOfBirth: '1988-12-10',
        drivingLicenseNumber: 'DL456789123',
        dlExpiryDate: '2029-12-09',
        vehicleRegNumber: 'MH03EF9012',
        vehicleType: 'Hatchback',
        vehicleMake: 'Hyundai',
        vehicleModel: 'i20',
        vehicleYear: 2023,
        yearsOfExperience: 10,
        kycStatus: 'submitted',
        availabilityStatus: 'available',
        gender: 'male'
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTimeout(() => {
      setDrivers(mockDrivers);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDrivers(mockDrivers);
      setRefreshing(false);
      toast.success('Drivers refreshed');
    }, 500);
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(prev => prev.filter(d => d._id !== id));
      toast.success('Driver deleted successfully');
    }
  };

  const handleAddDriver = (newDriver) => {
    const driverWithId = {
      ...newDriver,
      _id: Date.now().toString(),
      driverDetails: {
        ...newDriver.driverDetails,
        kycStatus: 'pending',
        availabilityStatus: 'available'
      }
    };
    setDrivers(prev => [driverWithId, ...prev]);
    toast.success('Driver added successfully!');
    if (newDriver.temporaryPassword) {
      toast.success(`Temporary Password: ${newDriver.temporaryPassword}`, { duration: 10000 });
    }
  };

  const handleUpdateDriver = (updatedDriver) => {
    setDrivers(prev => prev.map(d => d._id === updatedDriver._id ? updatedDriver : d));
    toast.success('Driver updated successfully!');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'submitted': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.mobileNumber?.includes(searchTerm)
  );

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
        <div className="p-4 md:p-8">
          <div className="bg-white dark:bg-[#0A1128] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
            <div className="h-[56px] border-b border-slate-100 dark:border-slate-800 flex items-center px-6">
              <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
            </div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/30 flex items-center gap-6">
                <div className="h-4 w-12 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
                <div className="h-4 flex-1 bg-slate-100/50 dark:bg-slate-800/20 rounded"></div>
                <div className="h-4 w-24 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
                <div className="h-4 w-40 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-in fade-in duration-500">
      <div className="bg-slate-50 dark:bg-[#0A1128] min-h-[calc(100vh-64px)] transition-colors duration-300">
        
        {/* Page Header Component */}
        <PageHeader
          title="Drivers"
          count={filteredDrivers.length}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          extraButtons={
            <button
              onClick={() => {
                setEditingDriver(null);
                setIsAddModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <HiPlus className="text-lg md:hidden" />
              <span className="hidden md:inline">Add Driver</span>
              <span className="md:hidden">Add</span>
            </button>
          }
        />

        {/* Search */}
        <div className="p-4 md:p-6 space-y-4">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            />
          </div>
        </div>

        {/* Drivers Table */}
        <div className="px-4 md:px-6 pb-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Driver</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">License</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">KYC</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {driver.profilePhoto ? (
                            <img src={driver.profilePhoto} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                              <span className="text-primary-yellow font-bold">{getInitials(driver.name)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.driverDetails?.vehicleType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm truncate max-w-[200px]">{driver.email}</p>
                          <p className="text-sm">{driver.mobileNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono">{driver.driverDetails?.drivingLicenseNumber || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold">{driver.driverDetails?.yearsOfExperience || 0} yrs</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{driver.driverDetails?.vehicleMake} {driver.driverDetails?.vehicleModel}</p>
                        <p className="text-xs text-gray-500">{driver.driverDetails?.vehicleRegNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          driver.driverDetails?.availabilityStatus === 'available' 
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {driver.driverDetails?.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.driverDetails?.kycStatus)}`}>
                          {driver.driverDetails?.kycStatus?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-primary-yellow rounded-lg hover:bg-yellow-50 transition-all"
                            title="View Details"
                          >
                            <HiOutlineEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDriver(driver);
                              setIsAddModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all"
                            title="Edit Driver"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver._id)}
                            className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                            title="Delete Driver"
                          >
                            <HiTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
              <p className="text-gray-500">Showing {filteredDrivers.length} of {drivers.length} drivers</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Previous</button>
                <button className="px-3 py-1 text-sm bg-primary-yellow text-primary-black rounded-lg font-semibold">1</button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">2</button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Driver Modal */}
        <AddDriverModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingDriver(null);
          }}
          onSave={editingDriver ? handleUpdateDriver : handleAddDriver}
          editingDriver={editingDriver}
        />

        {/* Driver Details Modal */}
        <DriverDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedDriver(null);
          }}
          driver={selectedDriver}
        />
      </div>
    </div>
  );
};

export default Drivers;