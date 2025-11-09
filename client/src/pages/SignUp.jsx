import { useState, useEffect, useRef } from "react";
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
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef();

  // Countdown effect for OTP timer
  useEffect(() => {
    if (showOtp && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(timerRef.current);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(timerRef.current);
    }
    // eslint-disable-next-line
  }, [showOtp, timer]);

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
        setShowOtp(true);
        setEmailForOtp(email);
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

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/v1/user/verify-otp", {
        email: emailForOtp,
        otp,
      });
      if (res.data.success) {
        // Optionally auto-login or redirect
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username || email.split("@")[0]);
        navigate("/dashboard?name=" + (res.data.username || email.split("@")[0]));

      } else {
        setError(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      setError("OTP verification failed");
    }
    setIsLoading(false);
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/v1/user/resend-otp", { email: emailForOtp });
      setTimer(600);
      setCanResend(false);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
    setIsLoading(false);
  };

  // Delete unverified user (e.g., on cancel)
  const handleDeleteUnverified = async () => {
    setIsLoading(true);
    setError("");
    try {
      await axios.delete("http://localhost:8080/api/v1/user/clear", { data: { email: emailForOtp } });
      setShowOtp(false);
      setEmailForOtp("");
      setOtp("");
      setTimer(600);
      setCanResend(false);
      setError("Signup cancelled. Your account has been deleted.");
    } catch (err) {
      setError("Failed to delete unverified account.");
    }
    setIsLoading(false);
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

        {!showOtp ? (
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
        ) : (
          <div className="mb-4">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
              A verification link has been sent to{" "}
              <span className="font-medium text-navy-900 dark:text-cream">
                {emailForOtp}
              </span>
              . Please check your email and enter the OTP below:
            </p>
            <div className="flex flex-col items-center">
              <InputBox
                label="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                type="text"
                value={otp}
                className="w-full max-w-xs"
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {timer > 0 ? (
                  <>OTP expires in: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</>
                ) : (
                  <span className="text-red-500">OTP expired.</span>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  label="Resend OTP"
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                />
                <Button
                  label="Cancel"
                  onClick={handleDeleteUnverified}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {!showOtp ? (
            <Button
              label={isLoading ? "Signing up..." : "Sign Up"}
              onClick={handleSignup}
              disabled={isLoading}
            />
          ) : (
            <Button
              label={isLoading ? "Verifying OTP..." : "Verify OTP"}
              onClick={handleVerifyOtp}
              disabled={isLoading}
            />
          )}
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