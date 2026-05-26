import React, { useState, useEffect } from 'react';
import { HiX, HiUser, HiMail, HiPhone, HiCalendar, HiIdentification, HiCreditCard, HiLocationMarker, HiTruck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../utils/httpClient';
import FileUpload from '../../components/common/FileUpload';

const AddDriverModal = ({ isOpen, onClose, onSave, editingDriver }) => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information (Required)
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    
    // Personal Details (Optional)
    fullName: '',
    dateOfBirth: '',
    yearsOfExperience: '',
    gender: '',
    presentAddress: '',
    permanentAddress: '',
    alternateMobile: '',
    aadhar: '',
    pan: '',
    highestQualification: '',
    
    // Bank Information (Optional)
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    
    // Vehicle Information (Optional)
    vehicleRegNumber: '',
    vehicleType: 'Sedan',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    dlExpiryDate: '',
    
    // Documents (Optional)
    image: '',
    aadharFront: '',
    aadharBack: '',
    panImage: '',
    licenseImage: ''
  });

  useEffect(() => {
    if (editingDriver) {
      const details = editingDriver.driverDetails || {};
      setFormData({
        name: editingDriver.name || '',
        email: editingDriver.email || '',
        phone: editingDriver.mobileNumber || '',
        password: '',
        licenseNumber: details.licenseNumber || '',
        fullName: details.fullName || '',
        dateOfBirth: details.dateOfBirth || '',
        yearsOfExperience: details.yearsOfExperience?.toString() || '',
        gender: details.gender || '',
        presentAddress: details.presentAddress || '',
        permanentAddress: details.permanentAddress || '',
        alternateMobile: details.alternateMobile || '',
        aadhar: details.aadhar || '',
        pan: details.pan || '',
        highestQualification: details.highestQualification || '',
        accountHolderName: details.accountHolderName || '',
        bankName: details.bankName || '',
        accountNumber: details.accountNumber || '',
        ifscCode: details.ifscCode || '',
        vehicleRegNumber: details.vehicleRegNumber || '',
        vehicleType: details.vehicleType || 'Sedan',
        vehicleMake: details.vehicleMake || '',
        vehicleModel: details.vehicleModel || '',
        vehicleYear: details.vehicleYear?.toString() || '',
        dlExpiryDate: details.dlExpiryDate || '',
        image: editingDriver.image || '',
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
      name: '', email: '', phone: '', password: '', licenseNumber: '',
      fullName: '', dateOfBirth: '', yearsOfExperience: '', gender: '',
      presentAddress: '', permanentAddress: '', alternateMobile: '',
      aadhar: '', pan: '', highestQualification: '',
      accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '',
      vehicleRegNumber: '', vehicleType: 'Sedan', vehicleMake: '', vehicleModel: '', vehicleYear: '', dlExpiryDate: '',
      image: '', aadharFront: '', aadharBack: '', panImage: '', licenseImage: ''
    });
  };

  const handleFileUploadComplete = (field, url) => {
      console.log(`Saving URL for ${field}:`, url); 
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate required fields
    if (!formData.name) {
      toast.error('Please enter driver name');
      setSubmitting(false);
      return;
    }
    if (!formData.email && !formData.phone) {
      toast.error('Please enter either email or phone number');
      setSubmitting(false);
      return;
    }
    if (!formData.licenseNumber) {
      toast.error('Please enter license number');
      setSubmitting(false);
      return;
    }
    
    // Send data exactly as backend expects
    const driverData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      password: formData.password || undefined,
      licenseNumber: formData.licenseNumber,
      fullName: formData.fullName || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
      gender: formData.gender || undefined,
      presentAddress: formData.presentAddress || undefined,
      permanentAddress: formData.permanentAddress || undefined,
      alternateMobile: formData.alternateMobile || undefined,
      aadhar: formData.aadhar || undefined,
      pan: formData.pan || undefined,
      highestQualification: formData.highestQualification || undefined,
      accountHolderName: formData.accountHolderName || undefined,
      bankName: formData.bankName || undefined,
      accountNumber: formData.accountNumber || undefined,
      ifscCode: formData.ifscCode || undefined,
      vehicleRegNumber: formData.vehicleRegNumber || undefined,
      vehicleType: formData.vehicleType || undefined,
      vehicleMake: formData.vehicleMake || undefined,
      vehicleModel: formData.vehicleModel || undefined,
      vehicleYear: formData.vehicleYear ? parseInt(formData.vehicleYear) : undefined,
      dlExpiryDate: formData.dlExpiryDate || undefined,
      image: formData.image || undefined,
      aadharFront: formData.aadharFront || undefined,
      aadharBack: formData.aadharBack || undefined,
      panImage: formData.panImage || undefined,
      licenseImage: formData.licenseImage || undefined
    };
    
    onSave(driverData);
    setSubmitting(false);
    onClose();
    resetForm();
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="driver@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Either email or phone is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="+1 234 567 8900"
                />
              </div>
              {!editingDriver && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                    placeholder="Leave empty for auto-generated"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">License Number *</label>
                <input
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800 uppercase"
                  placeholder="DL123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
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
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={formData.dlExpiryDate}
                  onChange={(e) => setFormData({ ...formData, dlExpiryDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter present address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Permanent Address</label>
                <textarea
                  rows="2"
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
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
                <label className="block text-sm font-medium mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={formData.vehicleRegNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleRegNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800 uppercase"
                  placeholder="MH01AB1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Make</label>
                <input
                  type="text"
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Toyota, Honda, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Camry, City, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Year</label>
                <input
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="As per bank records"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="IFSC code"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads using FileUpload Component */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              📄 Document Uploads
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <FileUpload
                title="Profile Photo"
                description="Clear face photo"
                field="image"
                folder="drivers"
                existingUrl={formData.image}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="Aadhar (Front)"
                description="Front side"
                field="aadharFront"
                folder="drivers"
                existingUrl={formData.aadharFront}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="Aadhar (Back)"
                description="Back side"
                field="aadharBack"
                folder="drivers"
                existingUrl={formData.aadharBack}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="PAN Card"
                description="PAN card image"
                field="panImage"
                folder="drivers"
                existingUrl={formData.panImage}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="Driving License"
                description="License image"
                field="licenseImage"
                folder="drivers"
                existingUrl={formData.licenseImage}
                onUpload={handleFileUploadComplete}
              />
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