import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ 
  label, 
  placeholder, 
  onChange,
  className = "",
  id = "password" 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="py-1 bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600">
      <div className="font-medium text-sm text-left py-2">{label}</div>
      <div className="relative w-full">
        <input 
          id={id}
          type={showPassword ? "text" : "password"}
          onChange={onChange} 
          className={`border border-slate-200 bg-slate-200 rounded w-full px-2 py-1 pr-10 ${className}`} 
          placeholder={placeholder}
        />
        <button 
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
};