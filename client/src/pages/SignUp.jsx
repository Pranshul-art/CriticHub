import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../components2/login/InputBox";
import { Button } from "../components2/login/Button";
import { ButtonWarning } from "../components2/login/ButtonWarning";
import { PasswordInput } from "../components2/login/PasswordBox";

const SignUp = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [tag, setTag] = useState("CriticsHub")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async () => {
        try {
            setError("")
            setIsLoading(true)

            // Validate inputs
            if (!email || !username || !password) {
                setError("Email, username, and password are required")
                setIsLoading(false)
                return
            }

            const response = await axios.post("http://localhost:8080/api/v1/user/signup", {
                email,
                username,
                password,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                tag: tag || "CriticsHub"
            })

            if (response.data.success) {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("username", username)
                navigate("/dashboard")
            }
        } catch (error) {
            console.error("Signup error:", error)
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Error signing up")
            } else {
                setError("Network error, please try again")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-clip-padding bg-gradient-to-tr from-slate-300 to-gray-900 flex justify-center h-screen w-full">
            <div className="flex flex-col justify-center">
                <div className="bg-white shadow-lg rounded-lg w-96 h-max p-3 bg-gradient-to-r from-slate-400 to-gray-600">
                    <div className="text-4xl font-bold rounded flex justify-center bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600 p-3">
                        Sign Up
                    </div>
                    <div className="text-md flex justify-center bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600 pt-2 pb-8">
                        Enter your information to create an account
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-5">
                            {error}
                        </div>
                    )}

                    <div className="px-5 bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600">
                        <InputBox 
                            label={"Email"} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder={"example@email.com"}
                            type="email"
                        />
                        
                        <InputBox 
                            label={"Username"} 
                            onChange={e => setUsername(e.target.value)} 
                            placeholder={"JohnDoe"} 
                        />
                        
                        <PasswordInput 
                            label={"Password"} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder={"Password (min 6 characters)"} 
                        />
                        
                        <InputBox 
                            label={"Age"} 
                            onChange={e => setAge(e.target.value)} 
                            placeholder={"25"} 
                            type="number"
                        />
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                        
                        <InputBox 
                            label={"Tag (Optional)"} 
                            onChange={e => setTag(e.target.value)} 
                            placeholder={"CriticsHub"} 
                            value={tag}
                        />
                    
                        <Button 
                            label={isLoading ? "Signing up..." : "Sign Up"} 
                            onClick={handleSignup}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <ButtonWarning 
                        label={"Already have an account?"} 
                        target={"Sign In"} 
                        to={"/signin"} 
                    />
                </div>
            </div>
        </div>
    )
}

export default SignUp;