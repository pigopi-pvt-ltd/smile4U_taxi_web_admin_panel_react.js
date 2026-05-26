'use client';

import { useState, useEffect } from 'react';
import { HiX, HiClipboardCopy, HiCheck } from 'react-icons/hi';

const AddEmployee = ({ isOpen, onClose, onSave, editingEmployee = null }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tempPassword, setTempPassword] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gender: '',
    presentAddress: '',
    permanentAddress: '',
    alternateMobile: '',
    aadhar: '',
    dob: '',
    pan: '',
    yearsOfExperience: '',
    highestQualification: '',
    previousExperience: '',
    department: '',
    designation: '',
    salary: '',
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        fullName: editingEmployee.employeeDetails?.fullName || editingEmployee.name || '',
        mobile: editingEmployee.mobileNumber || '',
        email: editingEmployee.email || '',
        gender: editingEmployee.employeeDetails?.gender || '',
        presentAddress: editingEmployee.employeeDetails?.presentAddress || '',
        permanentAddress: editingEmployee.employeeDetails?.permanentAddress || '',
        alternateMobile: editingEmployee.employeeDetails?.alternateMobile || '',
        aadhar: editingEmployee.employeeDetails?.aadhar || '',
        dob: editingEmployee.employeeDetails?.dob || '',
        pan: editingEmployee.employeeDetails?.pan || '',
        yearsOfExperience: editingEmployee.employeeDetails?.yearsOfExperience?.toString() || '',
        highestQualification: editingEmployee.employeeDetails?.highestQualification || '',
        previousExperience: editingEmployee.employeeDetails?.previousExperience || '',
        department: editingEmployee.employeeDetails?.department || '',
        designation: editingEmployee.employeeDetails?.designation || '',
        salary: editingEmployee.employeeDetails?.salary?.toString() || '',
      });
    } else {
      setFormData({
        fullName: '',
        mobile: '',
        email: '',
        gender: '',
        presentAddress: '',
        permanentAddress: '',
        alternateMobile: '',
        aadhar: '',
        dob: '',
        pan: '',
        yearsOfExperience: '',
        highestQualification: '',
        previousExperience: '',
        department: '',
        designation: '',
        salary: '',
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyPasswordToClipboard = async () => {
    if (tempPassword) {
      await navigator.clipboard.writeText(tempPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTempPassword(null);
    
    // Validate required fields
    if (!formData.fullName) {
      setMessage('Employee name is required');
      setLoading(false);
      return;
    }
    
    // Prepare payload for backend - MUST include 'name' field
    const payload = {
      name: formData.fullName,  // CRITICAL: This is required by backend
      email: formData.email,
      phone: formData.mobile,
      department: formData.department || 'General',
      designation: formData.designation || 'normal',
      salary: formData.salary ? parseInt(formData.salary) : null,
      gender: formData.gender,
      presentAddress: formData.presentAddress,
      permanentAddress: formData.permanentAddress,
      alternateMobile: formData.alternateMobile,
      aadhar: formData.aadhar,
      dob: formData.dob,
      pan: formData.pan,
      yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
      highestQualification: formData.highestQualification,
      previousExperience: formData.previousExperience,
    };
    
    console.log('Sending payload:', payload);
    
    try {
      const result = await onSave(payload);
      if (result?.temporaryPassword) {
        setTempPassword(result.temporaryPassword);
      }
      setMessage(`${editingEmployee ? 'Employee updated' : 'Employee created'} successfully!`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <HiX className="text-xl sm:text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          
          {message && (
            <div className={`p-3 sm:p-4 rounded-xl text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              message.includes('successfully') 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              <span className="flex items-center gap-2">
                {message.includes('successfully') ? '✅' : '⚠️'} {message}
              </span>
              {tempPassword && (
                <button 
                  type="button" 
                  onClick={copyPasswordToClipboard} 
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-all w-full sm:w-auto justify-center"
                >
                  {copySuccess ? <HiCheck className="text-emerald-600" /> : <HiClipboardCopy />}
                  {copySuccess ? 'Copied!' : 'Copy Password'}
                </button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-l-4 border-yellow-500 pl-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="10-digit mobile number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="employee@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  required
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-l-4 border-yellow-500 pl-3">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., IT, HR, Finance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary (per annum)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter salary amount"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-l-4 border-yellow-500 pl-3">
              Address & Identity
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Present Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="presentAddress"
                  required
                  value={formData.presentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="Current residential address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  required
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="Permanent residential address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhar"
                    required
                    value={formData.aadhar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all uppercase"
                    placeholder="12-digit Aadhar number"
                    maxLength="12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pan"
                    required
                    value={formData.pan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all uppercase"
                    placeholder="10-digit PAN number"
                    maxLength="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="highestQualification"
                    required
                    value={formData.highestQualification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Bachelor's Degree, Master's, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alternate Mobile
                  </label>
                  <input
                    type="tel"
                    name="alternateMobile"
                    value={formData.alternateMobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                    placeholder="Alternate contact number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-l-4 border-yellow-500 pl-3">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Experience
                </label>
                <textarea
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe previous work experience, companies worked at, roles, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;