export const InputBox = ({ label, type = "text", placeholder, onChange, value }) => {
    return (
      <div className="flex flex-col h-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 min-h-[20px]">
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-navy-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-coral-500"
        />
      </div>
    );
  };