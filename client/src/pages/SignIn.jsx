import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../components2/login/InputBox";
import { Button } from "../components2/login/Button";
import { ButtonWarning } from "../components2/login/ButtonWarning";
import { PasswordInput } from "../components2/login/PasswordBox";

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            setLoading(true);
            setError('');

            // Basic validation
            if (!email || !password) {
                setError('Please enter both email and password');
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            const response = await axios.post("http://localhost:8080/api/v1/user/signin", {
                email,
                password
            });

            // Store user data in localStorage
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                // Use the username from the backend response instead of email[0]
                localStorage.setItem("username", response.data.username || email[0]);
                navigate("/dashboard?name=" + (response.data.username || email[0]));
            } else {
                setError(response.data.message || 'Sign in failed');
            }
        } catch (error) {
            // Handle different error scenarios
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with an error status
                    setError(error.response.data.message || 'Invalid credentials. Please try again.');
                } else if (error.request) {
                    // Request was made but no response received
                    setError('No response from server. Please check your connection.');
                } else {
                    // Error in setting up the request
                    setError('Error setting up the request. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-clip-padding bg-gradient-to-tr from-slate-300 to-gray-900 flex justify-center h-screen w-full">
            <div className="flex flex-col justify-center">
                <div className="bg-white shadow-lg rounded-lg w-96 h-max p-3 bg-gradient-to-r from-slate-400 to-gray-600">
                    <div className="text-4xl font-bold rounded flex justify-center bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600 p-3">
                        Sign In
                    </div>
                    <div className="text-md flex justify-center bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600 pt-2 pb-8">
                        Enter your credentials to access your account
                    </div>
                    <div className="px-5 bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600">
                        <InputBox 
                            label={"Email"} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder={"john249@gmail.com"} 
                        />
                        <PasswordInput 
                            label={"Password"} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder={"Password (min 6 characters)"}
                        />
                        
                        {error && (
                            <div className="mt-2 mb-2 text-red-500 text-sm bg-red-100 p-2 rounded">
                                {error}
                            </div>
                        )}
                        
                        <Button 
                            label={loading ? "Signing In..." : "Sign In"} 
                            onClick={handleSignIn}
                            disabled={loading}
                        />
                    </div>
                    
                    <ButtonWarning label={"Don't have an account?"} target={"Sign Up"} to={"/"} />
                </div>
            </div>
        </div>
    );
};

export default Signin;