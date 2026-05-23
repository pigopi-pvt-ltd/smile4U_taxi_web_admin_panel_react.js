import React, { useState } from 'react';
import { HiOutlineCloudUpload, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../utils/httpClient';

const FileUpload = ({ 
  title, 
  description, 
  field, 
  accept = "image/*", 
  existingUrl, 
  onUpload,
  folder = "general"
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingUrl || null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    setUploading(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        const url = response.data.url;
        setPreview(url);
        onUpload(field, url);
        toast.success(`${title} uploaded successfully`);
      } else {
        toast.error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(field, '');
    toast.success(`${title} removed`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary-yellow transition-all relative">
      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
        <HiOutlineCloudUpload className="text-2xl text-gray-400" />
      </div>
      <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      
      {preview && (
        <div className="mb-3 relative group">
          <img src={preview} alt={title} className="max-h-20 mx-auto rounded-lg object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
          >
            <HiX className="text-sm" />
          </button>
        </div>
      )}
      
      <input
        type="file"
        id={`upload-${field}`}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => document.getElementById(`upload-${field}`)?.click()}
        disabled={uploading}
        className="px-3 py-1.5 bg-primary-yellow text-primary-black text-xs rounded-lg font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;