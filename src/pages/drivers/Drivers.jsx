import React, { useState } from 'react';
import { HiSearch, HiPlus, HiOutlineEye, HiPencil, HiTrash } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import AddDriverModal from './AddDriver';
import DriverDetailsModal from './DriverDetails';
import { useDrivers } from '../../hooks/useDrivers';

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);

  const { 
    drivers, 
    loading, 
    refreshing, 
    refresh, 
    addDriver, 
    updateDriver, 
    deleteDriver 
  } = useDrivers();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
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
      <div className="min-h-screen bg-white dark:bg-slate-900 -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-pulse">
        <div className="sticky top-16 h-[56px] bg-[#f8f9fa] dark:bg-slate-800/50 px-6 flex items-center justify-between border-b">
          <div className="h-6 w-56 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="bg-white dark:bg-[#0A1128] rounded-3xl border shadow-sm overflow-hidden animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b flex items-center gap-6">
                <div className="h-4 w-12 bg-slate-100 rounded"></div>
                <div className="h-4 flex-1 bg-slate-50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-in fade-in duration-500">
      <div className="bg-slate-50 dark:bg-[#0A1128] min-h-[calc(100vh-64px)]">
        
        <PageHeader
          title="Drivers"
          count={filteredDrivers.length}
          onRefresh={refresh}
          refreshing={refreshing}
          extraButtons={
            <button
              onClick={() => {
                setEditingDriver(null);
                setIsAddModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm"
            >
              <HiPlus className="text-lg md:hidden" />
              <span className="hidden md:inline">Add Driver</span>
              <span className="md:hidden">Add</span>
            </button>
          }
        />

        <div className="p-4 md:p-6">
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">KYC</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {driver.image ? (
                            <img src={driver.image} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                              <span className="text-primary-yellow font-bold">{getInitials(driver.name)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{driver.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{driver.email}</p>
                        <p className="text-xs text-gray-500">{driver.mobileNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono">{driver.driverDetails?.licenseNumber || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{driver.driverDetails?.yearsOfExperience || 0} yrs</p>
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.driverDetails?.verificationStatus)}`}>
                          {driver.driverDetails?.verificationStatus?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-primary-yellow rounded-lg"
                          >
                            <HiOutlineEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDriver(driver);
                              setIsAddModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-500 rounded-lg"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => deleteDriver(driver._id, driver.name)}
                            className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
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
          </div>
        </div>

        <AddDriverModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingDriver(null);
          }}
          onSave={editingDriver ? (data) => updateDriver(editingDriver._id, data) : addDriver}
          editingDriver={editingDriver}
        />

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