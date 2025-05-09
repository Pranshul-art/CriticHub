import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../components2/login/InputBox";
import { Button } from "../components2/login/Button";
import { PasswordInput } from "../components2/login/PasswordBox";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [tag, setTag] = useState("CriticsHub");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setError("");
      setIsLoading(true);

      // Validate inputs
      if (!email || !username || !password) {
        setError("Email, username, and password are required");
        setIsLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:8080/api/v1/user/signup", {
        email,
        username,
        password,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        tag: tag || "CriticsHub",
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error signing up");
      } else {
        setError("Network error, please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-gray-800 to-navy-700">
      <div className="bg-white mt-8 dark:bg-navy-800 shadow-lg rounded-lg w-full max-w-6xl p-8">
        <h2 className="text-3xl font-bold text-center text-navy-900 dark:text-cream mb-4">
          Create an Account
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Join CriticsHub and start sharing your reviews today!
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className=" grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <InputBox
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              type="email"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <InputBox
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="JohnDoe"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <PasswordInput
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <InputBox
              label="Age"
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              type="number"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-navy-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-coral-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <InputBox
              label="Tag (Optional)"
              onChange={(e) => setTag(e.target.value)}
              placeholder="CriticsHub"
              value={tag}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            label={isLoading ? "Signing up..." : "Sign Up"}
            onClick={handleSignup}
            disabled={isLoading}
          />
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;