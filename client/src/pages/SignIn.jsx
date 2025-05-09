import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../components2/login/InputBox";
import { Button } from "../components2/login/Button";
import { PasswordInput } from "../components2/login/PasswordBox";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      // Basic validation
      if (!email || !password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:8080/api/v1/user/signin", {
        email,
        password,
      });

      // Store user data in localStorage
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username || email.split("@")[0]);
        navigate("/dashboard?name=" + (response.data.username || email.split("@")[0]));
      } else {
        setError(response.data.message || "Sign in failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || "Invalid credentials. Please try again.");
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("Error setting up the request. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-gray-800 to-navy-700">
      <div className="bg-white dark:bg-navy-800 shadow-lg rounded-lg w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center text-navy-900 dark:text-cream mb-4">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Sign in to your account and continue exploring!
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <InputBox
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            type="email"
          />
          <PasswordInput
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
          />
        </div>

        <div className="mt-6">
          <Button
            label={loading ? "Signing In..." : "Sign In"}
            onClick={handleSignIn}
            disabled={loading}
          />
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <a
            href="/"
            className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;