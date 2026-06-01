import React, { useState, useEffect } from 'react';
import { HiX, HiUser, HiMail, HiPhone, HiCalendar, HiIdentification, HiCreditCard, HiLocationMarker, HiTruck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import FileUpload from '../../components/common/FileUpload';

const AddDriverModal = ({ isOpen, onClose, onSave, editingDriver }) => {
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

  useEffect(() => {
    if (isOpen) {
      if (editingDriver) {
        const details = editingDriver.driverDetails || {};
        setFormData({
          name: editingDriver.name || '',
          email: editingDriver.email || '',
          phone: editingDriver.mobileNumber || '',
          password: '',
          licenseNumber: details.licenseNumber || '',
          fullName: details.fullName || '',
          dateOfBirth: details.dateOfBirth ? details.dateOfBirth.split('T')[0] : '',
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
          dlExpiryDate: details.dlExpiryDate ? details.dlExpiryDate.split('T')[0] : '',
          image: editingDriver.image || '',
          aadharFront: details.kycDocuments?.aadharFront || '',
          aadharBack: details.kycDocuments?.aadharBack || '',
          panImage: details.kycDocuments?.panImage || '',
          licenseImage: details.kycDocuments?.licenseImage || ''
        });
      } else {
        resetForm();
      }
    }
  }, [editingDriver, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUploadComplete = (field, url) => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!formData.name.trim()) {
      toast.error('Please enter driver name');
      setSubmitting(false);
      return;
    }
    if (!formData.email && !formData.phone) {
      toast.error('Please enter either email or phone number');
      setSubmitting(false);
      return;
    }
    if (!formData.licenseNumber.trim()) {
      toast.error('Please enter license number');
      setSubmitting(false);
      return;
    }
    
    const driverData = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      password: formData.password || undefined,
      licenseNumber: formData.licenseNumber.trim().toUpperCase(),
      fullName: formData.fullName.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : undefined,
      gender: formData.gender || undefined,
      presentAddress: formData.presentAddress.trim() || undefined,
      permanentAddress: formData.permanentAddress.trim() || undefined,
      alternateMobile: formData.alternateMobile.trim() || undefined,
      aadhar: formData.aadhar.trim() || undefined,
      pan: formData.pan.trim().toUpperCase() || undefined,
      highestQualification: formData.highestQualification || undefined,
      accountHolderName: formData.accountHolderName.trim() || undefined,
      bankName: formData.bankName.trim() || undefined,
      accountNumber: formData.accountNumber.trim() || undefined,
      ifscCode: formData.ifscCode.trim().toUpperCase() || undefined,
      vehicleRegNumber: formData.vehicleRegNumber.trim().toUpperCase() || undefined,
      vehicleType: formData.vehicleType || undefined,
      vehicleMake: formData.vehicleMake.trim() || undefined,
      vehicleModel: formData.vehicleModel.trim() || undefined,
      vehicleYear: formData.vehicleYear ? parseInt(formData.vehicleYear, 10) : undefined,
      dlExpiryDate: formData.dlExpiryDate || undefined,
      image: formData.image || undefined,
      aadharFront: formData.aadharFront || undefined,
      aadharBack: formData.aadharBack || undefined,
      panImage: formData.panImage || undefined,
      licenseImage: formData.licenseImage || undefined
    };
    
    try {
      await onSave(driverData);
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingDriver ? 'Edit Driver Details' : 'Register New Driver'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 text-gray-700 dark:text-gray-300">
          
          {/* Section: Personal Core Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              <HiUser className="text-yellow-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter registration name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="driver@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Primary contact phone"
                />
              </div>
              {!editingDriver && (
                <div>
                  <label className="block text-sm font-medium mb-1">Access Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Leave blank for auto-generation"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender Identification</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Statutory Government Identification & Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              <HiIdentification className="text-yellow-500" /> Identity & Verification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Driving License Number *</label>
                <input
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white uppercase"
                  placeholder="DL-XXXXXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={formData.dlExpiryDate}
                  onChange={(e) => handleInputChange('dlExpiryDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Driving Experience</label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Total years active"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aadhar Verification Number</label>
                <input
                  type="text"
                  maxLength={12}
                  value={formData.aadhar}
                  onChange={(e) => handleInputChange('aadhar', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="12-digit structural identity string"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PAN Card String</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white uppercase"
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alternative Contact Phone</label>
                <input
                  type="tel"
                  value={formData.alternateMobile}
                  onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Emergency alternative contact"
                />
              </div>
            </div>
          </div>

          {/* Section: Residence Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              <HiLocationMarker className="text-yellow-500" /> Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Present/Current Address</label>
                <textarea
                  rows="2"
                  value={formData.presentAddress}
                  onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter current local residential details"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Permanent Address</label>
                <textarea
                  rows="2"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter permanent documented residency text"
                />
              </div>
            </div>
          </div>

          {/* Section: Vehicle Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              <HiTruck className="text-yellow-500" /> Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Registration Plate Number</label>
                <input
                  type="text"
                  value={formData.vehicleRegNumber}
                  onChange={(e) => handleInputChange('vehicleRegNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white uppercase"
                  placeholder="e.g., MH01AB1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Classification Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Manufacturer Make</label>
                <input
                  type="text"
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Toyota, Hyundai, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model Variant Name</label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Etios, Accent, etc."
                />
              </div>
            </div>
          </div>

          {/* Section: Settlement Banking Records */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              <HiCreditCard className="text-yellow-500" /> Settlement Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Name visible on passbook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Bank institution title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ledger Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Account identification digits"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Routing IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 text-gray-900 dark:text-white uppercase"
                  placeholder="IFSC Character Mapping"
                />
              </div>
            </div>
          </div>

          {/* Section: Image/KYC Binary Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-100 dark:border-gray-800">
              📄 Document File Assets
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
                description="Front face matrix"
                field="aadharFront"
                folder="drivers"
                existingUrl={formData.aadharFront}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="Aadhar (Back)"
                description="Address mapping reverse side"
                field="aadharBack"
                folder="drivers"
                existingUrl={formData.aadharBack}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="PAN Asset Image"
                description="Tax document photo matrix"
                field="panImage"
                folder="drivers"
                existingUrl={formData.panImage}
                onUpload={handleFileUploadComplete}
              />
              <FileUpload
                title="Driving License File"
                description="Permit scan graphic"
                field="licenseImage"
                folder="drivers"
                existingUrl={formData.licenseImage}
                onUpload={handleFileUploadComplete}
              />
            </div>
          </div>

          {/* Section UI Controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Processing Submission...' : (editingDriver ? 'Save Configuration' : 'Confirm Registration')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;