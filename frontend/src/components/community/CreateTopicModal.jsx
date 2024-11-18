import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTopic } from '../../store/reducers/communityReducer';
import { FaTimes, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateTopicModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const { loading } = useSelector(state => state.community);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Title and content are required');
        return;
    }

    try {
        await dispatch(createTopic(formData)).unwrap();
        toast.success('Topic created successfully');
        onClose();
    } catch (error) {
        if (error.error.includes('title already exists')) {
            toast.error('This title is already taken. Please choose a different one.');
        } else {
            toast.error(error.error || 'Failed to create topic');
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Topic</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Topic Title"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Share your thoughts..."
              rows="5"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-gray-50">
              <FaImage className="text-purple-500" />
              <span>Add Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {imagePreview.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;