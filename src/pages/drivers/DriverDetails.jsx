import React from 'react';
import { HiX, HiMail, HiPhone, HiCalendar, HiIdentification, HiCreditCard, HiLocationMarker, HiTruck, HiUser, HiBadgeCheck } from 'react-icons/hi';

const DriverDetailsModal = ({ isOpen, onClose, driver }) => {
  if (!isOpen || !driver) return null;

  const details = driver.driverDetails || {};

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="text-primary-yellow text-xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const DocumentCard = ({ title, imageUrl }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
      <p className="text-xs font-semibold mb-2">{title}</p>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="max-h-32 mx-auto rounded-lg" />
      ) : (
        <div className="h-20 flex items-center justify-center text-gray-400 text-sm">Not uploaded</div>
      )}
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      case 'submitted': return 'bg-blue-500 text-white';
      default: return 'bg-yellow-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {driver.profilePhoto ? (
              <img src={driver.profilePhoto} alt={driver.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                <HiUser className="text-primary-yellow text-2xl" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{driver.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(details.kycStatus)}`}>
                  {details.kycStatus?.toUpperCase() || 'PENDING'}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  details.availabilityStatus === 'available' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {details.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiUser className="text-primary-yellow" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiMail />} label="Email" value={driver.email} />
              <InfoRow icon={<HiPhone />} label="Mobile" value={driver.mobileNumber} />
              <InfoRow icon={<HiCalendar />} label="Date of Birth" value={details.dateOfBirth} />
              <InfoRow icon={<HiUser />} label="Gender" value={details.gender} />
              <InfoRow icon={<HiBadgeCheck />} label="Experience" value={`${details.yearsOfExperience || 0} years`} />
            </div>
          </div>

          {/* License Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiIdentification className="text-primary-yellow" /> License Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiIdentification />} label="License Number" value={details.drivingLicenseNumber} />
              <InfoRow icon={<HiCalendar />} label="License Expiry" value={details.dlExpiryDate} />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiLocationMarker className="text-primary-yellow" /> Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiLocationMarker />} label="Present Address" value={details.presentAddress} />
              <InfoRow icon={<HiLocationMarker />} label="Permanent Address" value={details.permanentAddress} />
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiTruck className="text-primary-yellow" /> Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiTruck />} label="Registration Number" value={details.vehicleRegNumber} />
              <InfoRow icon={<HiTruck />} label="Vehicle Type" value={details.vehicleType} />
              <InfoRow icon={<HiTruck />} label="Make & Model" value={`${details.vehicleMake} ${details.vehicleModel}`} />
              <InfoRow icon={<HiCalendar />} label="Year" value={details.vehicleYear} />
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiCreditCard className="text-primary-yellow" /> Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiUser />} label="Account Holder" value={details.accountHolderName} />
              <InfoRow icon={<HiCreditCard />} label="Bank Name" value={details.bankName} />
              <InfoRow icon={<HiCreditCard />} label="Account Number" value={details.accountNumber} />
              <InfoRow icon={<HiIdentification />} label="IFSC Code" value={details.ifscCode} />
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">📄 Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <DocumentCard title="Profile Photo" imageUrl={driver.profilePhoto || details.kycDocuments?.profilePhoto} />
              <DocumentCard title="Aadhar (Front)" imageUrl={details.kycDocuments?.aadharFront} />
              <DocumentCard title="Aadhar (Back)" imageUrl={details.kycDocuments?.aadharBack} />
              <DocumentCard title="PAN Card" imageUrl={details.kycDocuments?.panImage} />
              <DocumentCard title="Driving License" imageUrl={details.kycDocuments?.licenseImage} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;