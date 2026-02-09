import VerificationIcon from "@/shared/VerificationIcon";
import bg from "../../public/signin-banner.jpg";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useRedirectIfAuth();
  const { login } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin/`,
        {
          username,
          password,
        },
      );

      const {
        token,
        user_id,
        username: userUsername,
        role,
        entity_id,
        name,
      } = res.data;
      login(token, user_id, userUsername, role, entity_id, name);
      toast.success("Login successful!");
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <Image
        src={bg}
        alt="Hero background"
        fill
        className="object-cover"
        priority
        quality={90}
        style={{ zIndex: -2 }}
      />
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-[2px]"></div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-lg py-4 mx-4 my-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left side - Form */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="max-w-md mx-auto">
              {/* Logo/Icon Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative h-24 w-24 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 flex items-center justify-center bg-white rounded-full shadow-lg">
                    <div className="animate-bounce-slow">
                      <VerificationIcon />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mt-2">
                  Sign in to your MediSure account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 ${
                          rememberMe
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        } transition flex items-center justify-center`}
                      >
                        {rememberMe && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
