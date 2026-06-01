import React from 'react';
import { 
  HiX, HiMail, HiPhone, HiCalendar, HiIdentification, 
  HiCreditCard, HiLocationMarker, HiTruck, HiUser, 
  HiBadgeCheck, HiDocumentText ,HiPaperClip
} from 'react-icons/hi';

const DriverDetailsModal = ({ isOpen, onClose, driver }) => {
  if (!isOpen || !driver) return null;

  const details = driver.driverDetails || {};
  const assignedVehicle = driver.vehicle || null;
  
  let kycDocuments = {};
  if (details.kycDocuments) {
    try {
      kycDocuments = typeof details.kycDocuments === 'string' 
        ? JSON.parse(details.kycDocuments) 
        : details.kycDocuments;
    } catch (e) {
      console.error("Error decoding verified profile payload metadata matrix:", e);
      kycDocuments = {};
    }
  }

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return null;
  };

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-100 dark:border-gray-700/50">
      <div className="text-indigo-500 dark:text-indigo-400 text-xl mt-0.5">{icon}</div>
      <div className="overflow-hidden break-words w-full">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const DocumentCard = ({ title, imageUrl }) => {
    const fullUrl = getImageUrl(imageUrl);
    return (
      <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 rounded-lg p-3 text-center flex flex-col justify-between min-h-[140px]">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 truncate" title={title}>{title}</p>
        {fullUrl ? (
          <div className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-24 flex items-center justify-center">
            <img 
              src={fullUrl} 
              alt={title} 
              className="max-h-24 w-full object-contain p-1 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 items-center justify-center text-red-400 text-[10px] bg-gray-50 p-1 text-center">
              Failed to load image
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 py-4">
            <HiDocumentText className="text-gray-300 dark:text-gray-600 text-2xl mb-1" />
            <span className="text-gray-400 dark:text-gray-500 text-[11px]">Not uploaded</span>
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      case 'submitted': return 'bg-blue-500 text-white';
      default: return 'bg-yellow-500 text-white';
    }
  };

  const getAvailabilityColor = (status) => {
    return status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  };

  const profileImageUrl = getImageUrl(driver.image || kycDocuments.profilePhoto);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={driver.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                <HiUser className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{driver.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-[10px] tracking-wide font-bold rounded-full ${getStatusColor(details.verificationStatus)}`}>
                  {details.verificationStatus?.toUpperCase() || 'PENDING'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] tracking-wide font-bold rounded-full ${getAvailabilityColor(details.availabilityStatus)}`}>
                  {details.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <HiUser className="text-indigo-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <InfoRow icon={<HiMail />} label="Email Address" value={driver.email} />
              <InfoRow icon={<HiPhone />} label="Mobile Number" value={driver.mobileNumber} />
              <InfoRow icon={<HiCalendar />} label="Date of Birth" value={details.dateOfBirth} />
              <InfoRow icon={<HiUser />} label="Gender" value={details.gender} />
              <InfoRow icon={<HiBadgeCheck />} label="Experience Level" value={details.yearsOfExperience ? `${details.yearsOfExperience} Years` : '0 Years'} />
              <InfoRow icon={<HiIdentification />} label="License Document Number" value={details.licenseNumber} />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <HiLocationMarker className="text-indigo-500" /> Address Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiLocationMarker />} label="Present Address" value={details.presentAddress} />
              <InfoRow icon={<HiLocationMarker />} label="Permanent Address" value={details.permanentAddress} />
            </div>
          </div>

          {/* Fixed Vehicle Mapping Matrix block */}
          {assignedVehicle && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                <HiTruck className="text-indigo-500" /> Vehicle Assignments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <InfoRow icon={<HiTruck />} label="Registration Plate Number" value={assignedVehicle.plateNumber} />
                <HiTruck className="text-indigo-500" />
                <InfoRow icon={<HiTruck />} label="Vehicle Configuration Type" value={assignedVehicle.vehicleType} />
                <InfoRow icon={<HiTruck />} label="Make & Model" value={assignedVehicle.company ? `${assignedVehicle.company} ${assignedVehicle.model || ''}` : 'Not Specifed'} />
              </div>
            </div>
          )}

          {/* Settlement / Financial Details */}
          {(details.accountHolderName || details.bankName || details.accountNumber) && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                <HiPaperClip className="text-indigo-500" /> Disbursal Bank Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <InfoRow icon={<HiUser />} label="Account Holder" value={details.accountHolderName} />
                <InfoRow icon={<HiCreditCard />} label="Bank Institution" value={details.bankName} />
                <InfoRow icon={<HiCreditCard />} label="Account Identifier" value={details.accountNumber} />
                <InfoRow icon={<HiIdentification />} label="Routing / IFSC Code" value={details.ifscCode} />
              </div>
            </div>
          )}

          {/* KYC Secure File Storage Verification */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <HiDocumentText className="text-indigo-500" /> Verified Identity Vault
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <DocumentCard title="Profile Photo" imageUrl={driver.image || kycDocuments.profilePhoto} />
              <DocumentCard title="Govt ID Card (Front)" imageUrl={kycDocuments.aadharFront} />
              <DocumentCard title="Govt ID Card (Back)" imageUrl={kycDocuments.aadharBack} />
              <DocumentCard title="Tax Identifier Card" imageUrl={kycDocuments.panImage} />
              <DocumentCard title="Driving License Verification" imageUrl={kycDocuments.licenseImage} />
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;