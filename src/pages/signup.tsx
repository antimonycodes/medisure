import VerificationIcon from "@/shared/VerificationIcon";
import bg from "../../public/signup-bg.jpg";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAPI } from "@/api";

const SignUp = () => {
  // User type: "patient" or "other"
  const [userType, setUserType] = useState<"patient" | "other">("patient");

  // Role for "other" type users
  const [role, setRole] = useState<"manufacturer" | "distributor" | "pharmacy">(
    "manufacturer",
  );

  const [loading, setLoading] = useState(false);

  // Patient form data
  const [patientData, setPatientData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  // Other (business) form data
  const [businessData, setBusinessData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const router = useRouter();

  const handlePatientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBusinessData({
      ...businessData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userType === "patient") {
        // Patient signup
        if (patientData.password !== patientData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        const data = await signupAPI({
          username: patientData.fullName,
          email: patientData.email,
          password: patientData.password,
          phone: patientData.phone,
          address: patientData.address,
          role: "patient",
        });
      } else {
        // Business signup
        if (businessData.password !== businessData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        const data = await signupAPI({
          username: businessData.organizationName,
          email: businessData.email,
          password: businessData.password,
          phone: businessData.phone,
          address: businessData.address,
          role,
        });
      }

      toast.success("Account created successfully! You can now sign in.");
      router.push("/signin");

      // Reset form
      setPatientData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
      });
      setBusinessData({
        organizationName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
      });
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={bg}
        alt="Signup background"
        fill
        className="object-cover"
        priority
        quality={90}
        style={{ zIndex: -2 }}
      />

      {/* Light overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-[2px]"></div>

      {/* Main container - fixed height with internal scroll */}
      <div className="relative z-10 w-full max-w-xl h-[95vh] flex flex-col px-4">
        {/* Header - outside the card, fixed at top */}
        <div className="text-center py-4 flex-shrink-0">
          <div className="animate-bounce-slow inline-block mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white">
                <VerificationIcon />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Join the MediSure network to secure your supply chain
          </p>
        </div>

        {/* Form Card - scrollable */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Option */}
              <button
                type="button"
                onClick={() => setUserType("patient")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  userType === "patient"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <svg
                  className={`w-7 h-7 mb-3 ${userType === "patient" ? "text-teal-600" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div
                  className={`font-semibold text-sm ${userType === "patient" ? "text-teal-700" : "text-gray-800"}`}
                >
                  Patient
                </div>
                <div
                  className={`text-xs mt-1 ${userType === "patient" ? "text-teal-600" : "text-gray-500"}`}
                >
                  Purchase Verified Drugs
                </div>
              </button>

              {/* Other Option */}
              <button
                type="button"
                onClick={() => setUserType("other")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  userType === "other"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <svg
                  className={`w-7 h-7 mb-3 ${userType === "other" ? "text-blue-600" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div
                  className={`font-semibold text-sm ${userType === "other" ? "text-gray-800" : "text-gray-800"}`}
                >
                  Other
                </div>
                <div
                  className={`text-xs mt-1 ${userType === "other" ? "text-gray-600" : "text-gray-500"}`}
                >
                  Manufacturer, Distributor and Pharmacists
                </div>
              </button>
            </div>
          </div>

          {/* Role Selection - Only for "Other" */}
          {userType === "other" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Manufacturer */}
                <button
                  type="button"
                  onClick={() => setRole("manufacturer")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    role === "manufacturer"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${role === "manufacturer" ? "text-blue-600" : "text-gray-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div
                    className={`font-medium text-sm ${role === "manufacturer" ? "text-gray-800" : "text-gray-700"}`}
                  >
                    Manufacturer
                  </div>
                  <div
                    className={`text-xs mt-1 ${role === "manufacturer" ? "text-gray-600" : "text-gray-500"}`}
                  >
                    Create and mint medicine batches
                  </div>
                </button>

                {/* Distributor */}
                <button
                  type="button"
                  onClick={() => setRole("distributor")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    role === "distributor"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${role === "distributor" ? "text-blue-600" : "text-gray-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <div
                    className={`font-medium text-sm ${role === "distributor" ? "text-gray-800" : "text-gray-700"}`}
                  >
                    Distributor
                  </div>
                  <div
                    className={`text-xs mt-1 ${role === "distributor" ? "text-gray-600" : "text-gray-500"}`}
                  >
                    Receive and transfer batches
                  </div>
                </button>

                {/* Pharmacy */}
                <button
                  type="button"
                  onClick={() => setRole("pharmacy")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    role === "pharmacy"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${role === "pharmacy" ? "text-blue-600" : "text-gray-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div
                    className={`font-medium text-sm ${role === "pharmacy" ? "text-gray-800" : "text-gray-700"}`}
                  >
                    Pharmacy
                  </div>
                  <div
                    className={`text-xs mt-1 ${role === "pharmacy" ? "text-gray-600" : "text-gray-500"}`}
                  >
                    Receive batches for patient distribution
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {userType === "patient" ? (
              /* Patient Form */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    value={patientData.fullName}
                    onChange={handlePatientChange}
                    placeholder="Your Full Name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={patientData.email}
                    onChange={handlePatientChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={patientData.phone}
                    onChange={handlePatientChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={patientData.password}
                    onChange={handlePatientChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={patientData.confirmPassword}
                    onChange={handlePatientChange}
                    placeholder="Re-enter your password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address (Optional)
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={patientData.address}
                    onChange={handlePatientChange}
                    placeholder="Your address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
              </>
            ) : (
              /* Business Form */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organization Name
                  </label>
                  <input
                    name="organizationName"
                    type="text"
                    value={businessData.organizationName}
                    onChange={handleBusinessChange}
                    placeholder="Your company or organization name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={businessData.email}
                    onChange={handleBusinessChange}
                    placeholder="you@organization.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={businessData.phone}
                    onChange={handleBusinessChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={businessData.password}
                    onChange={handleBusinessChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={businessData.confirmPassword}
                    onChange={handleBusinessChange}
                    placeholder="Re-enter your password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address (Optional)
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={businessData.address}
                    onChange={handleBusinessChange}
                    placeholder="Your organization's address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
              </>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </Link>
          </p>

          {/* Need business account */}
          {userType === "patient" && (
            <p className="text-center text-gray-500 mt-3 text-sm">
              Need a business account?{" "}
              <button
                type="button"
                onClick={() => setUserType("other")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register here
              </button>
            </p>
          )}

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
