const DeleteMealModal = ({ toggleModal, handleDeleteMeal, mealId }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-slate-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this meal?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => toggleModal(null)}
            className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDeleteMeal(mealId);
              toggleModal(null);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMealModal;
