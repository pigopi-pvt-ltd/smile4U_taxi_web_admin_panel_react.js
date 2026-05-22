import React from 'react';
import { HiXMark } from 'react-icons/hi2';
import { HiUser, HiPhone, HiMail, HiLocationMarker, HiCalendar, HiIdentification, HiDocumentText, HiOutlinePhotograph } from 'react-icons/hi';

const VehicleDetailsModal = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'expired', color: 'bg-red-100 text-red-700', label: 'Expired', icon: '🔴' };
    if (daysLeft <= 30) return { status: 'warning', color: 'bg-orange-100 text-orange-700', label: `${daysLeft} days left`, icon: '⚠️' };
    return { status: 'good', color: 'bg-green-100 text-green-700', label: 'Valid', icon: '✅' };
  };

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
        <img src={imageUrl} alt={title} className="max-h-20 mx-auto rounded-lg" />
      ) : (
        <div className="h-16 flex items-center justify-center text-gray-400 text-xs">Not uploaded</div>
      )}
    </div>
  );

  const StatusBadge = ({ expiryDate, label }) => {
    const status = getExpiryStatus(expiryDate);
    if (!status) return null;
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
        <span>{status.icon}</span>
        <span>{label}: {status.label}</span>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500 text-white';
      case 'inactive': return 'bg-red-500 text-white';
      case 'maintenance': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-yellow/20 flex items-center justify-center">
              <HiOutlinePhotograph className="text-primary-yellow text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{vehicle.cabNumber}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{vehicle.modelName} ({vehicle.yearOfMaking})</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <HiXMark className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vendor Information */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <HiUser className="text-primary-yellow" /> Vendor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<HiUser />} label="Vendor Name" value={vehicle.vendor?.vendorName} />
              <InfoRow icon={<HiPhone />} label="Mobile Number" value={vehicle.vendor?.mobile} />
              <InfoRow icon={<HiMail />} label="Email" value={vehicle.vendor?.email} />
              <InfoRow icon={<HiLocationMarker />} label="Address" value={vehicle.vendor?.address} />
              <InfoRow icon={<HiIdentification />} label="Aadhar" value={vehicle.vendor?.aadhar} />
              <InfoRow icon={<HiIdentification />} label="PAN" value={vehicle.vendor?.pan} />
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoRow icon={<HiIdentification />} label="RC Number" value={vehicle.rcNumber} />
              <InfoRow icon={<HiCalendar />} label="Model" value={vehicle.modelName} />
              <InfoRow icon={<HiCalendar />} label="Year" value={vehicle.yearOfMaking} />
              <InfoRow icon={<HiUser />} label="Type" value={vehicle.type} />
              <InfoRow icon={<HiUser />} label="Capacity" value={`${vehicle.capacity} Seater`} />
              <InfoRow icon={<HiUser />} label="AC" value={vehicle.ac ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* Document Status with Expiry Alerts */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Document Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Insurance</p>
                  <StatusBadge expiryDate={vehicle.insuranceExpiryDate} label="Insurance" />
                </div>
                <p className="text-xs text-gray-500">Number: {vehicle.insuranceNumber || '—'}</p>
                <p className="text-xs text-gray-500">Expiry: {vehicle.insuranceExpiryDate || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Pollution</p>
                  <StatusBadge expiryDate={vehicle.pollutionExpiryDate} label="Pollution" />
                </div>
                <p className="text-xs text-gray-500">Number: {vehicle.pollutionNumber || '—'}</p>
                <p className="text-xs text-gray-500">Expiry: {vehicle.pollutionExpiryDate || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Permit</p>
                  <StatusBadge expiryDate={vehicle.permitExpiryDate} label="Permit" />
                </div>
                <p className="text-xs text-gray-500">Number: {vehicle.permitNumber || '—'}</p>
                <p className="text-xs text-gray-500">Expiry: {vehicle.permitExpiryDate || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Fitness</p>
                  <StatusBadge expiryDate={vehicle.fitnessExpiryDate} label="Fitness" />
                </div>
                <p className="text-xs text-gray-500">Number: {vehicle.fitnessNumber || '—'}</p>
                <p className="text-xs text-gray-500">Expiry: {vehicle.fitnessExpiryDate || '—'}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">📄 Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <DocumentCard title="RC Document" imageUrl={vehicle.rcImage} />
              <DocumentCard title="Insurance" imageUrl={vehicle.insuranceImage} />
              <DocumentCard title="Pollution" imageUrl={vehicle.pollutionImage} />
              <DocumentCard title="Permit" imageUrl={vehicle.permitImage} />
              <DocumentCard title="Fitness" imageUrl={vehicle.fitnessImage} />
            </div>
          </div>

          {/* Vehicle Images */}
          {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <HiOutlinePhotograph className="text-primary-yellow" /> Vehicle Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vehicle.vehicleImages.map((url, index) => (
                  <img key={index} src={url} alt={`Vehicle ${index + 1}`} className="w-full h-28 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium text-sm hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;