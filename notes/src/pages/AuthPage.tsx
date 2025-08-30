import { useState } from "react";
import SignupForm from "../components/SignupForm";
import OTPForm from "../components/OTPForm";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api";
import image from "../assets/right-column.png";
import logo from "../assets/top (1).png";

const AuthPage = () => {
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (email: string, name: string, dob: string) => {
    try {
      await api.post("/api/auth/request-otp", { email, name, dob });
      setEmail(email);
      setName(name);
      setDob(dob);
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error requesting OTP");
    }
  };

  const handleVerify = async (otp: string) => {
    try {
      const res = await api.post("api/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const res = await api.post("/api/auth/google-login", {
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
    <div className="w-screen h-screen flex overflow-hidden">
      <div className="w-1/2 h-full border-2 flex flex-col justify-center relative items-center bg-white px-12">
       <div className="absolute top-6 left-2 ">
        <img src={logo} alt="Auth" className="w-full h-full" />
       </div>
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
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
      <div className="w-1/2 h-full">
        <img
          src={image}
          alt="Wallpaper"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthPage;
