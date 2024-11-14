import { useState, useEffect } from 'react';
import { addMeal } from '../../utils/api';
import { Spinner } from 'react-bootstrap';
import { format } from 'date-fns';

const AddMeal = ({ setIsOpen, setIsUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [lastEaten, setLastEaten] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  const [rating, setRating] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleImageUpload = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        console.error('Image upload failed:', data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddMeal = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    try {
      setIsError(false);
      const meal = {
        name,
        source,
        ingredients: ingredientsStr.split(','),
        last_eaten: format(new Date(lastEaten), 'yyyy/MM/dd'),
        rating,
        image: imageUrl,
        created_by: loggedInUser.username
      };

      setIsLoading(true); // Start loading
      await addMeal({ meal }, token);
      setIsUpdated(true);
      setIsLoading(false);
      handleClose(); // Close the component
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError(err.response.data.msg);
    }
  };


  // Reset error message when inputs change
  const handleInputChange = (setter) => (e) => {
    setIsError(false); // Hide error when input changes
    setter(e.target.value);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        transition-opacity duration-500`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-96 p-6 transform transition-transform duration-300 
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}`}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Meal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleInputChange(setName)} // Handle change
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <input
              type="text"
              value={source}
              onChange={handleInputChange(setSource)} // Handle change
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ingredients (comma-separated)</label>
            <input
              type="text"
              value={ingredientsStr}
              onChange={handleInputChange(setIngredientsStr)} // Handle change
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Eaten</label>
            <input
              type="date"
              value={lastEaten}
              onChange={handleInputChange(setLastEaten)} // Handle change
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={rating}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 1 && value <= 5 && value % 0.5 === 0) {
                  setRating(value);
                  setIsError(false); // Reset error on rating change
                }
              }}
              className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              className="block w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm bg-gray-50 placeholder-gray-400
                 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setIsError(false);
                if (file) {
                  handleImageUpload(file);
                  console.log(imageUrl);
                }
              }}
            />
          </div>
        </div>

        {isError && (
          <div className="mt-4 text-center text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end items-center space-x-2 mt-6">
          {isLoading && (
            <div className="text-indigo-500 mr-2">
              <Spinner
                animation="border"
                role="status"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </div>
          )}


          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            onClick={handleAddMeal}
          >
            Save Meal
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMeal;
