import React, { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { HiOutlineCloudUpload, HiOutlinePhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AddVehicleModal = ({ isOpen, onClose, onSave, editingVehicle }) => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Vendor Information
    vendorName: '',
    vendorMobile: '',
    vendorEmail: '',
    vendorAddress: '',
    vendorGender: 'male',
    vendorAadhar: '',
    vendorPan: '',
    
    // Vehicle Basic Information
    cabNumber: '',
    modelName: '',
    yearOfMaking: new Date().getFullYear(),
    type: 'Sedan',
    capacity: 4,
    ac: true,
    status: 'active',
    
    // RC Details
    rcNumber: '',
    
    // Insurance Details
    insuranceNumber: '',
    insuranceExpiryDate: '',
    
    // Pollution Certificate
    pollutionNumber: '',
    pollutionExpiryDate: '',
    
    // Permit Details
    permitNumber: '',
    permitExpiryDate: '',
    
    // Fitness Certificate
    fitnessNumber: '',
    fitnessExpiryDate: '',
    
    // Documents
    rcImage: '',
    insuranceImage: '',
    pollutionImage: '',
    permitImage: '',
    fitnessImage: '',
    vehicleImages: []
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        vendorName: editingVehicle.vendor?.vendorName || '',
        vendorMobile: editingVehicle.vendor?.mobile || '',
        vendorEmail: editingVehicle.vendor?.email || '',
        vendorAddress: editingVehicle.vendor?.address || '',
        vendorGender: editingVehicle.vendor?.gender || 'male',
        vendorAadhar: editingVehicle.vendor?.aadhar || '',
        vendorPan: editingVehicle.vendor?.pan || '',
        cabNumber: editingVehicle.cabNumber || '',
        modelName: editingVehicle.modelName || '',
        yearOfMaking: editingVehicle.yearOfMaking || new Date().getFullYear(),
        type: editingVehicle.type || 'Sedan',
        capacity: editingVehicle.capacity || 4,
        ac: editingVehicle.ac !== undefined ? editingVehicle.ac : true,
        status: editingVehicle.status || 'active',
        rcNumber: editingVehicle.rcNumber || '',
        insuranceNumber: editingVehicle.insuranceNumber || '',
        insuranceExpiryDate: editingVehicle.insuranceExpiryDate || '',
        pollutionNumber: editingVehicle.pollutionNumber || '',
        pollutionExpiryDate: editingVehicle.pollutionExpiryDate || '',
        permitNumber: editingVehicle.permitNumber || '',
        permitExpiryDate: editingVehicle.permitExpiryDate || '',
        fitnessNumber: editingVehicle.fitnessNumber || '',
        fitnessExpiryDate: editingVehicle.fitnessExpiryDate || '',
        rcImage: editingVehicle.rcImage || '',
        insuranceImage: editingVehicle.insuranceImage || '',
        pollutionImage: editingVehicle.pollutionImage || '',
        permitImage: editingVehicle.permitImage || '',
        fitnessImage: editingVehicle.fitnessImage || '',
        vehicleImages: editingVehicle.vehicleImages || []
      });
    } else {
      resetForm();
    }
  }, [editingVehicle]);

  const resetForm = () => {
    setFormData({
      vendorName: '', vendorMobile: '', vendorEmail: '', vendorAddress: '', vendorGender: 'male',
      vendorAadhar: '', vendorPan: '', cabNumber: '', modelName: '', yearOfMaking: new Date().getFullYear(),
      type: 'Sedan', capacity: 4, ac: true, status: 'active', rcNumber: '', insuranceNumber: '',
      insuranceExpiryDate: '', pollutionNumber: '', pollutionExpiryDate: '', permitNumber: '',
      permitExpiryDate: '', fitnessNumber: '', fitnessExpiryDate: '', rcImage: '', insuranceImage: '',
      pollutionImage: '', permitImage: '', fitnessImage: '', vehicleImages: []
    });
  };

  const handleFileUpload = async (field, file) => {
    setUploading(true);
    // Simulate upload - replace with actual API call
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: fakeUrl }));
      toast.success(`${field} uploaded successfully`);
      setUploading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!formData.cabNumber || !formData.modelName || !formData.vendorName || !formData.vendorMobile) {
      toast.error('Please fill all required fields');
      setSubmitting(false);
      return;
    }
    
    const vehicleData = {
      ...formData,
      vendor: {
        vendorName: formData.vendorName,
        mobile: formData.vendorMobile,
        email: formData.vendorEmail,
        address: formData.vendorAddress,
        gender: formData.vendorGender,
        aadhar: formData.vendorAadhar,
        pan: formData.vendorPan
      }
    };
    
    onSave(vehicleData);
    setSubmitting(false);
    onClose();
    resetForm();
  };

  const DocumentUploadCard = ({ title, description, field, accept = "image/*", existingUrl }) => {
    const displayUrl = existingUrl || formData[field];
    return (
      <div className="bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center hover:border-primary-yellow transition-all">
        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
          <HiOutlineCloudUpload className="text-xl text-gray-400" />
        </div>
        <h3 className="font-semibold text-xs text-gray-800 dark:text-white mb-1">{title}</h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{description}</p>
        
        {displayUrl && (
          <div className="mb-2">
            <img src={displayUrl} alt={title} className="max-h-16 mx-auto rounded-lg" />
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
          className="px-2 py-1 bg-primary-yellow text-primary-black text-[10px] rounded-lg font-semibold hover:bg-yellow-500 transition-all"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    );
  };

  const getExpiryWarning = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { color: 'border-red-500 bg-red-50', text: 'Expired', icon: '🔴' };
    if (daysLeft <= 30) return { color: 'border-orange-500 bg-orange-50', text: `${daysLeft} days left`, icon: '⚠️' };
    return null;
  };

  const insuranceWarning = getExpiryWarning(formData.insuranceExpiryDate);
  const pollutionWarning = getExpiryWarning(formData.pollutionExpiryDate);
  const permitWarning = getExpiryWarning(formData.permitExpiryDate);
  const fitnessWarning = getExpiryWarning(formData.fitnessExpiryDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <HiXMark className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vendor Information */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Vendor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.vendorMobile}
                  onChange={(e) => setFormData({ ...formData, vendorMobile: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.vendorEmail}
                  onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="vendor@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.vendorAddress}
                  onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Gender</label>
                <select
                  value={formData.vendorGender}
                  onChange={(e) => setFormData({ ...formData, vendorGender: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Aadhar Number</label>
                <input
                  type="text"
                  value={formData.vendorAadhar}
                  onChange={(e) => setFormData({ ...formData, vendorAadhar: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="12-digit Aadhar"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">PAN Number</label>
                <input
                  type="text"
                  value={formData.vendorPan}
                  onChange={(e) => setFormData({ ...formData, vendorPan: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="PAN number"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Basic Information */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Cab Number *</label>
                <input
                  type="text"
                  required
                  value={formData.cabNumber}
                  onChange={(e) => setFormData({ ...formData, cabNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800 uppercase"
                  placeholder="MH01AB1234"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Toyota Camry"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Year of Making</label>
                <input
                  type="number"
                  value={formData.yearOfMaking}
                  onChange={(e) => setFormData({ ...formData, yearOfMaking: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="2023"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Vehicle Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Seating Capacity</label>
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="2">2 Seater</option>
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="6">6 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="8">8 Seater</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">AC Availability</label>
                <select
                  value={formData.ac}
                  onChange={(e) => setFormData({ ...formData, ac: e.target.value === 'true' })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="true">Yes (AC)</option>
                  <option value="false">No (Non-AC)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">RC Number</label>
                <input
                  type="text"
                  value={formData.rcNumber}
                  onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800 uppercase"
                  placeholder="RC123456789"
                />
              </div>
            </div>
          </div>

          {/* Registration Documents with Expiry Alerts */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Registration Documents</h3>
            
            {/* Insurance */}
            <div className={`p-3 rounded-lg border-2 ${insuranceWarning?.color || 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-2">
                    Insurance Number * {insuranceWarning && <span className="text-[10px] font-bold">{insuranceWarning.icon} {insuranceWarning.text}</span>}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.insuranceNumber}
                    onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                    placeholder="Insurance number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Insurance Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.insuranceExpiryDate}
                    onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  />
                </div>
              </div>
              <DocumentUploadCard title="Insurance Document" description="Upload insurance certificate" field="insuranceImage" existingUrl={formData.insuranceImage} />
            </div>

            {/* Pollution Certificate */}
            <div className={`p-3 rounded-lg border-2 ${pollutionWarning?.color || 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-2">
                    Pollution Number {pollutionWarning && <span className="text-[10px] font-bold">{pollutionWarning.icon} {pollutionWarning.text}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.pollutionNumber}
                    onChange={(e) => setFormData({ ...formData, pollutionNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                    placeholder="PUC number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Pollution Expiry Date</label>
                  <input
                    type="date"
                    value={formData.pollutionExpiryDate}
                    onChange={(e) => setFormData({ ...formData, pollutionExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  />
                </div>
              </div>
              <DocumentUploadCard title="Pollution Certificate" description="Upload PUC certificate" field="pollutionImage" existingUrl={formData.pollutionImage} />
            </div>

            {/* Permit */}
            <div className={`p-3 rounded-lg border-2 ${permitWarning?.color || 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-2">
                    Permit Number {permitWarning && <span className="text-[10px] font-bold">{permitWarning.icon} {permitWarning.text}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                    placeholder="Permit number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Permit Expiry Date</label>
                  <input
                    type="date"
                    value={formData.permitExpiryDate}
                    onChange={(e) => setFormData({ ...formData, permitExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  />
                </div>
              </div>
              <DocumentUploadCard title="Permit Document" description="Upload permit certificate" field="permitImage" existingUrl={formData.permitImage} />
            </div>

            {/* Fitness Certificate */}
            <div className={`p-3 rounded-lg border-2 ${fitnessWarning?.color || 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-2">
                    Fitness Number {fitnessWarning && <span className="text-[10px] font-bold">{fitnessWarning.icon} {fitnessWarning.text}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.fitnessNumber}
                    onChange={(e) => setFormData({ ...formData, fitnessNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                    placeholder="Fitness certificate number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Fitness Expiry Date</label>
                  <input
                    type="date"
                    value={formData.fitnessExpiryDate}
                    onChange={(e) => setFormData({ ...formData, fitnessExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  />
                </div>
              </div>
              <DocumentUploadCard title="Fitness Certificate" description="Upload fitness certificate" field="fitnessImage" existingUrl={formData.fitnessImage} />
            </div>

            {/* RC Document */}
            <div className="p-3 rounded-lg border-2 border-gray-200">
              <DocumentUploadCard title="RC Document" description="Upload registration certificate" field="rcImage" existingUrl={formData.rcImage} />
            </div>
          </div>

          {/* Vehicle Images */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <HiOutlinePhotograph className="text-primary-yellow" /> Vehicle Images (2-4 recommended)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formData.vehicleImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Vehicle ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.vehicleImages.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, vehicleImages: newImages }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <HiXMark className="text-sm" />
                  </button>
                </div>
              ))}
              {formData.vehicleImages.length < 4 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-primary-yellow transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="vehicle-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fakeUrl = URL.createObjectURL(file);
                        setFormData(prev => ({
                          ...prev,
                          vehicleImages: [...prev.vehicleImages, fakeUrl]
                        }));
                      }
                    }}
                  />
                  <label
                    htmlFor="vehicle-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <HiOutlineCloudUpload className="text-xl text-gray-400" />
                    <span className="text-[10px] text-gray-500 mt-1">Upload Image</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Processing...' : (editingVehicle ? 'Update Vehicle' : 'Create Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;