import React, { useState, useEffect } from 'react';
import { HiX, HiOutlineCloudUpload, HiUser, HiMail, HiPhone, HiCalendar, HiIdentification, HiCreditCard, HiLocationMarker, HiTruck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AddDriverModal = ({ isOpen, onClose, onSave, editingDriver }) => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState(null);
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    yearsOfExperience: '',
    
    // License Information
    drivingLicenseNumber: '',
    dlExpiryDate: '',
    
    // Address
    presentAddress: '',
    permanentAddress: '',
    
    // Vehicle Information
    vehicleRegNumber: '',
    vehicleType: 'Sedan',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    
    // Bank Information
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    
    // Documents
    aadharNumber: '',
    panNumber: '',
    profilePhoto: '',
    aadharFront: '',
    aadharBack: '',
    panImage: '',
    licenseImage: ''
  });

  useEffect(() => {
    if (editingDriver) {
      const details = editingDriver.driverDetails || {};
      setFormData({
        fullName: editingDriver.name || '',
        email: editingDriver.email || '',
        mobile: editingDriver.mobileNumber || '',
        dateOfBirth: details.dateOfBirth || '',
        gender: details.gender || '',
        yearsOfExperience: details.yearsOfExperience?.toString() || '',
        drivingLicenseNumber: details.drivingLicenseNumber || '',
        dlExpiryDate: details.dlExpiryDate || '',
        presentAddress: details.presentAddress || '',
        permanentAddress: details.permanentAddress || '',
        vehicleRegNumber: details.vehicleRegNumber || '',
        vehicleType: details.vehicleType || 'Sedan',
        vehicleMake: details.vehicleMake || '',
        vehicleModel: details.vehicleModel || '',
        vehicleYear: details.vehicleYear?.toString() || '',
        accountHolderName: details.accountHolderName || '',
        bankName: details.bankName || '',
        accountNumber: details.accountNumber || '',
        ifscCode: details.ifscCode || '',
        aadharNumber: details.aadhar || '',
        panNumber: details.pan || '',
        profilePhoto: editingDriver.profilePhoto || details.kycDocuments?.profilePhoto || '',
        aadharFront: details.kycDocuments?.aadharFront || '',
        aadharBack: details.kycDocuments?.aadharBack || '',
        panImage: details.kycDocuments?.panImage || '',
        licenseImage: details.kycDocuments?.licenseImage || ''
      });
    } else {
      resetForm();
    }
  }, [editingDriver]);

  const resetForm = () => {
    setFormData({
      fullName: '', email: '', mobile: '', dateOfBirth: '', gender: '', yearsOfExperience: '',
      drivingLicenseNumber: '', dlExpiryDate: '', presentAddress: '', permanentAddress: '',
      vehicleRegNumber: '', vehicleType: 'Sedan', vehicleMake: '', vehicleModel: '', vehicleYear: '',
      accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '',
      aadharNumber: '', panNumber: '', profilePhoto: '', aadharFront: '', aadharBack: '', panImage: '', licenseImage: ''
    });
    setTempPassword(null);
  };

  const handleFileUpload = async (field, file) => {
    setUploading(true);
    // Simulate upload - replace with actual API call
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: fakeUrl }));
      toast.success(`${field} uploaded successfully`);
      setUploading(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const driverData = {
        name: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobile,
        profilePhoto: formData.profilePhoto,
        driverDetails: {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          drivingLicenseNumber: formData.drivingLicenseNumber,
          dlExpiryDate: formData.dlExpiryDate,
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress,
          vehicleRegNumber: formData.vehicleRegNumber,
          vehicleType: formData.vehicleType,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleYear: parseInt(formData.vehicleYear),
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          aadhar: formData.aadharNumber,
          pan: formData.panNumber,
          kycDocuments: {
            profilePhoto: formData.profilePhoto,
            aadharFront: formData.aadharFront,
            aadharBack: formData.aadharBack,
            panImage: formData.panImage,
            licenseImage: formData.licenseImage
          }
        }
      };

      if (!editingDriver) {
        const generatedPassword = 'Driver@' + Math.random().toString(36).slice(2, 8);
        driverData.temporaryPassword = generatedPassword;
      }

      onSave(driverData);
      setSubmitting(false);
      onClose();
      resetForm();
    }, 1500);
  };

  const DocumentUploadCard = ({ title, description, field, accept = "image/*", existingUrl }) => {
    const displayUrl = existingUrl || formData[field];
    return (
      <div className="bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary-yellow transition-all">
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <HiOutlineCloudUpload className="text-2xl text-gray-400" />
        </div>
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>
        
        {displayUrl && (
          <div className="mb-3">
            <img src={displayUrl} alt={title} className="max-h-20 mx-auto rounded-lg" />
          </div>
        )}
        
        <input
          type="file"
          id={`upload-${field}`}
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(field, file);
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById(`upload-${field}`)?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-primary-yellow text-primary-black text-xs rounded-lg font-semibold hover:bg-yellow-500 transition-all"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingDriver ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiUser className="text-primary-yellow" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="driver@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Years"
                />
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiIdentification className="text-primary-yellow" /> License Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Driving License Number *</label>
                <input
                  type="text"
                  required
                  value={formData.drivingLicenseNumber}
                  onChange={(e) => setFormData({ ...formData, drivingLicenseNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="DL123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={formData.dlExpiryDate}
                  onChange={(e) => setFormData({ ...formData, dlExpiryDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiLocationMarker className="text-primary-yellow" /> Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Present Address</label>
                <textarea
                  rows="2"
                  value={formData.presentAddress}
                  onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Enter present address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Permanent Address</label>
                <textarea
                  rows="2"
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Enter permanent address"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiTruck className="text-primary-yellow" /> Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleRegNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleRegNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="MH01AB1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Auto">Auto</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Make</label>
                <input
                  type="text"
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Toyota, Honda, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Camry, City, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Year</label>
                <input
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="2023"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiCreditCard className="text-primary-yellow" /> Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="As per bank records"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="Account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  placeholder="IFSC code"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              📄 Document Uploads
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <DocumentUploadCard title="Profile Photo" description="Clear face photo" field="profilePhoto" />
              <DocumentUploadCard title="Aadhar (Front)" description="Front side" field="aadharFront" />
              <DocumentUploadCard title="Aadhar (Back)" description="Back side" field="aadharBack" />
              <DocumentUploadCard title="PAN Card" description="PAN card image" field="panImage" />
              <DocumentUploadCard title="Driving License" description="License image" field="licenseImage" />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Processing...' : (editingDriver ? 'Update Driver' : 'Create Driver')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;