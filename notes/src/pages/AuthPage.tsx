import { useState } from "react";
import SignupForm from "../components/SignupForm";
import OTPForm from "../components/OTPForm";
import { GoogleLogin, CredentialResponse} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "./api";

const AuthPage = () => {
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();


  const handleSignup = async (email: string, name: string) => {
    try {
      await api.post("/auth/request-otp", { email, name });
      setEmail(email);
      setName(name);
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error requesting OTP");
    }
  };

  const handleVerify = async (otp: string) => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const res = await api.post("/auth/google-login", {
          tokenId: credentialResponse.credential,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } catch (err: any) {
        console.error(err);
        alert("Google login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          {step === "signup" ? "Sign Up / Login" : "Verify OTP"}
        </h2>

        {step === "signup" && <SignupForm onSubmit={handleSignup} />}
        {step === "otp" && <OTPForm onSubmit={handleVerify} />}

        <div className="mt-6 border-t pt-6 text-center">
          <h3 className="text-gray-600 mb-3 font-medium">Or continue with</h3>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
