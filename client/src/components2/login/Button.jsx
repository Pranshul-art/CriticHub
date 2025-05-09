export const Button = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-coral-500 hover:bg-coral-600 dark:bg-coral-400 dark:hover:bg-coral-500"
      }`}
    >
      {label}
    </button>
  );
};