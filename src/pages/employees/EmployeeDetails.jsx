'use client';

import { HiX, HiTrash } from 'react-icons/hi';

const EmployeeDetails = ({ isOpen, onClose, employee }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-200" onClick={e => e.stopPropagation()}>
        
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Employee Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <HiX className="text-lg sm:text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Full Name:</span>
                <span className="text-gray-800 dark:text-white font-medium ml-2">{employee.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Mobile Number:</span>
                <span className="text-gray-800 dark:text-white ml-2">{employee.mobileNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-gray-800 dark:text-white ml-2 break-all">{employee.email || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Role:</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {employee.role}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Department:</span>
                <span className="text-gray-800 dark:text-white ml-2">{employee.employeeDetails?.department || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Designation:</span>
                <span className="text-gray-800 dark:text-white ml-2 capitalize">{employee.employeeDetails?.designation || '-'}</span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          {employee.employeeDetails && (
            <>
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                    <span className="text-gray-800 dark:text-white ml-2 capitalize">{employee.employeeDetails.gender || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Date of Birth:</span>
                    <span className="text-gray-800 dark:text-white ml-2">{formatDate(employee.employeeDetails.dob)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Years of Experience:</span>
                    <span className="text-gray-800 dark:text-white ml-2">{employee.employeeDetails.yearsOfExperience || 0} years</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Highest Qualification:</span>
                    <span className="text-gray-800 dark:text-white ml-2">{employee.employeeDetails.highestQualification || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Alternate Mobile:</span>
                    <span className="text-gray-800 dark:text-white ml-2">{employee.employeeDetails.alternateMobile || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  Address Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Present Address:</span>
                    <p className="text-gray-800 dark:text-white mt-1">{employee.employeeDetails.presentAddress || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Permanent Address:</span>
                    <p className="text-gray-800 dark:text-white mt-1">{employee.employeeDetails.permanentAddress || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Identity Details */}
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  Identity Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Aadhar Number:</span>
                    <span className="text-gray-800 dark:text-white ml-2">{employee.employeeDetails.aadhar || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">PAN Number:</span>
                    <span className="text-gray-800 dark:text-white ml-2 uppercase">{employee.employeeDetails.pan || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Professional Experience */}
              {employee.employeeDetails.previousExperience && (
                <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    Professional Experience
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {employee.employeeDetails.previousExperience}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;