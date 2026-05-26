import React, { useState, useEffect } from 'react';
import { HiOutlineCloudUpload, HiX, HiDocument, HiPhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../utils/httpClient';

const FileUpload = ({ 
  title, 
  description, 
  field, 
  accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
  existingUrl, 
  onUpload,
  folder = "general",
  maxSize = 2 // MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingUrl || null);
  const [fileType, setFileType] = useState('image');

  useEffect(() => {
    setPreview(existingUrl);
    // Detect file type from URL
    if (existingUrl) {
      if (existingUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
        setFileType('image');
      } else if (existingUrl.match(/\.(pdf)/i)) {
        setFileType('pdf');
      } else if (existingUrl.match(/\.(doc|docx)/i)) {
        setFileType('word');
      } else {
        setFileType('document');
      }
    }
  }, [existingUrl]);

  const getFileIcon = () => {
    switch(fileType) {
      case 'pdf':
        return <HiDocument className="text-2xl text-red-500" />;
      case 'word':
        return <HiDocument className="text-2xl text-blue-500" />;
      case 'image':
        return <HiPhotograph className="text-2xl text-green-500" />;
      default:
        return <HiOutlineCloudUpload className="text-2xl text-gray-400" />;
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file size (maxSize in MB)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size should be less than ${maxSize}MB`);
      return;
    }
    
    // Create local preview for images only
    let localPreview = null;
    if (file.type.startsWith('image/')) {
      localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setFileType('image');
    } else {
      setPreview(null);
      if (file.type === 'application/pdf') {
        setFileType('pdf');
      } else if (file.type.includes('word') || file.type.includes('document')) {
        setFileType('word');
      } else {
        setFileType('document');
      }
      // Show file name as preview
      setPreview(file.name);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    setUploading(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        const url = response.data.url;
         console.log('📸 Upload successful, Cloudinary URL:', url);
        setPreview(url);
        onUpload(field, url);
        toast.success(`${title} uploaded successfully`);
      } else {
        if (localPreview) URL.revokeObjectURL(localPreview);
        setPreview(null);
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (localPreview) URL.revokeObjectURL(localPreview);
      setPreview(null);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onUpload(field, '');
    toast.success(`${title} removed`);
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (fileType === 'image' && preview.startsWith('http')) {
      return (
        <img 
          src={preview} 
          alt={title} 
          className="max-h-20 mx-auto rounded-lg object-cover"
          onError={(e) => {
            console.error('Image failed to load:', preview);
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <div className="text-center">
          <HiDocument className="text-3xl text-red-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500 truncate">PDF Document</p>
        </div>
      );
    } else if (fileType === 'word') {
      return (
        <div className="text-center">
          <HiDocument className="text-3xl text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500 truncate">Word Document</p>
        </div>
      );
    } else if (typeof preview === 'string' && !preview.startsWith('http')) {
      return (
        <div className="text-center">
          <HiDocument className="text-3xl text-gray-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500 truncate">{preview}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary-yellow transition-all relative">
      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
        {getFileIcon()}
      </div>
      <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      <p className="text-[10px] text-gray-400 mb-2">Max size: {maxSize}MB | All formats accepted</p>
      
      {preview && (
        <div className="mb-3 relative group">
          {renderPreview()}
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
        {uploading ? 'Uploading...' : 'Choose File'}
      </button>
    </div>
  );
};

export default FileUpload;