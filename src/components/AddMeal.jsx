import { useState, useEffect, useRef } from 'react';
import { addMeal } from '../../utils/api';
import { Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AddMeal = ({ setIsOpen, setIsUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [lastEaten, setLastEaten] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [rating, setRating] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(true);
  const [timer, setTimer] = useState(null);

  const modalRef = useRef(null); // Reference for the modal container

  useEffect(() => {
    setIsVisible(true);
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose(); // Trigger close on ESC key
      }
    };
    document.addEventListener('keydown', handleEscape); // Listen for keydown events
    return () => {
      document.removeEventListener('keydown', handleEscape); // Cleanup listener
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose(); // Close modal if the click is outside the modal
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Listen for clicks
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup listener
    };
  }, []);

  const handleImageUpload = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsImageUploading(true)
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
        setIsImageUploading(false);
        setIsImageUploaded(true);
      } else {
        console.error('Image upload failed:', data.message);
        setIsImageUploaded(false);
        setIsImageUploading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddMeal = async () => {
    setIsUpdated(false)
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
        created_by: loggedInUser.username,
      };

      setIsLoading(true);
      await addMeal({ meal }, token);
      setIsUpdated(true);
      setIsLoading(false);
      handleClose();
    } catch (err) {
      setIsLoading(false);
      setIsUpdated(false)
      setIsError(true);
      setError(err.response.data.msg);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setIsError(false);
    setter(e.target.value);
  };

  const isFormValid = () => {
    return name.trim() !== '' && source.trim() !== '' && rating !== '' && !isImageUploading && isImageUploaded;
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
    ${isVisible ? 'opacity-100' : 'opacity-0'} 
    transition-opacity duration-500`}
    >
      <div
        ref={modalRef} // Attach the ref to the modal container
        className={`bg-slate-50 dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6 transform transition-transform duration-300 
      ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}`}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Meal</h2>
        <div className="space-y-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={handleInputChange(setName)}
                className="p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">Source</label>
              <input
                required
                type="text"
                value={source}
                onChange={handleInputChange(setSource)}
                className="p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">Last Eaten</label>
              <input
                type="date"
                value={lastEaten}
                onChange={handleInputChange(setLastEaten)}
                className="p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">Rating</label>
              <input
                required
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
                className="p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">Image</label>
              <input
                type="file"
                accept="image/*"
                id="image"
                className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm bg-gray-50 placeholder-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setIsError(false);
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
            </div>
          </form>
        </div>
        <div className="flex justify-between items-center space-x-2 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>

          <button
            className={`px-4 py-2 rounded transition ${isImageUploading || !isImageUploaded || !isFormValid() || isLoading
              ? 'cursor-not-allowed opacity-50 bg-indigo-500'
              : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white`}
            onClick={handleAddMeal}
            disabled={isImageUploading || !isImageUploaded || !isFormValid() || isLoading}
            title={
              isImageUploading && !isImageUploaded
                ? 'Uploading image... please wait'
                : !isFormValid()
                  ? 'Please fill out the form first'
                  : 'Save Your Changes'
            }
          >
            {isImageUploading || !isImageUploaded ? (
              <div className="flex justify-between items-center">
                <Spinner animation="border" role="status" style={{ width: '1rem', height: '1rem' }} />
                <span className="ml-2">Uploading Image...</span>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? 'Saving Meal' : 'Save Meal'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

};

export default AddMeal;
