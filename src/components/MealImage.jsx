import { useState, useRef } from "react";
import { Spinner } from "react-bootstrap";

const MealImage = ({ value, onSave }) => {
  const [imagePreview, setImagePreview] = useState(value || null);  // Holds the current image or preview
  const [isImageUploading, setIsImageUploading] = useState(false); // Track image upload state

  // Reference for file input
  const fileInputRef = useRef(null);

  // Function to handle image upload to imgbb
  const handleImageUpload = async (file) => {
    setIsImageUploading(true);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY; // Retrieve the API key from environment
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const uploadedImageUrl = data.data.url;
        setImagePreview(uploadedImageUrl); // Update the image preview with the new URL
        onSave(uploadedImageUrl); // Pass the URL back to the parent to update the meal
      } else {
        console.error("Image upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsImageUploading(false); // Reset the upload state
    }
  };

  // Handles file change (image selection)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image locally before uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file); // Read image as data URL for preview
      handleImageUpload(file); // Upload the image to imgbb
    }
  };

  // Trigger the file input dialog when the image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input programmatically
    }
  };

  return (
    <td className="px-2 py-2 whitespace-nowrap text-center text-base font-medium text-gray-700 relative">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        ref={fileInputRef} // Attach ref to the file input
      />
      {/* Image (clicking this triggers the file input) */}
      <div className="relative">
        {/* Image with reduced opacity during upload */}
        <img
          src={imagePreview || "/path/to/default/image.jpg"} // Fallback image URL
          alt="Meal"
          className={`w-48 h-48 object-cover rounded cursor-pointer border ${isImageUploading ? 'opacity-50' : 'opacity-100'}`}
          onClick={handleImageClick} // Trigger file input on click
        />
        {/* Loading spinner over the image */}
        {isImageUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
            <Spinner animation="border" role="status" style={{ width: '2rem', height: '2rem' }} />
            <span className="text-white ml-2">Uploading...</span>
          </div>
        )}
      </div>
    </td>
  );
};

export default MealImage;
