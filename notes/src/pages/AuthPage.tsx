import { useState } from "react";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm"
import OTPForm from "../components/OTPForm";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api";
import image from "../assets/right-column.png";
import logo from "../assets/top (1).png";

type AuthStep = "signup" | "otp" | "signin";

const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (email: string, name: string, dob: string) => {
    try {
      await api.post("/api/auth/request-otp", { 
        email, 
        name, 
        dob, 
        isSignup: true 
      });
      
      setEmail(email);
      setName(name);
      setDob(dob);
      setIsNewUser(true);
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error requesting OTP");
    }
  };

  const handleVerify = async (email: string, otp: string) => {
    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    try {
      if (isNewUser) {
        console.log('Starting new user verification:', { email: trimmedEmail, name, dob });
        
        const signupResponse = await api.post("/api/auth/verify-signup", { 
          email: trimmedEmail, 
          otp: trimmedOtp, 
          name: name?.trim(), 
          dob: dob
        });

        if (!signupResponse.data?.success) {
          const errorMsg = signupResponse.data?.message || 'Signup verification failed';
          throw new Error(errorMsg);
        }
        
        console.log('Signup successful, switching to signin');
        alert("Account created successfully! Please sign in.");
        setStep("signin");
        setIsNewUser(false);
        return;
      } else {
        console.log('Verifying OTP for existing user:', { email: trimmedEmail });
        
        try {
          const loginResponse = await api.post("/api/auth/verify-otp", { 
            email: trimmedEmail, 
            otp: trimmedOtp 
          });

          console.log('Login response:', loginResponse);

          if (!loginResponse || !loginResponse.data) {
            throw new Error('No response received from server');
          }

          if (loginResponse.data.success === false) {
            throw new Error(loginResponse.data.message || 'Authentication failed');
          }

          const { token, user } = loginResponse.data;
          
          if (!token) {
            console.error('No token in response:', loginResponse.data);
            throw new Error('Authentication token is missing');
          }

          console.log('Authentication successful, storing user session');
          localStorage.setItem("token", token);

          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }
          
          navigate("/dashboard");
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.message || error.message || 'Authentication failed');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An unexpected error occurred during verification';
      
      console.error('Verification error:', {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      throw new Error(errorMessage);
    }
  };

  const handleResendOtp = async (email: string) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      if (!isNewUser) {
        try {
          const response = await api.post("/api/auth/request-otp", { 
            email,
            isSignup: false 
          });
          
          if (response.data?.exists === false) {

            setEmail(email);
            setStep("signup");
            alert("No account found with this email. Please complete the signup process.");
            return false; 
          }
          
          alert("OTP has been sent to your email");
          return true;
        } catch (err: any) {
     
          if (err.response?.data?.message?.includes("No account found")) {
            setEmail(email);
            setStep("signup");
            alert("No account found with this email. Please complete the signup process.");
            return false;
          }
          throw err; 
        }
      }

      await api.post("/api/auth/request-otp", { 
        email, 
        name, 
        dob, 
        isSignup: true 
      });
      
      alert("OTP has been sent to your email");
      return true;
    } catch (err: any) {
      console.error("OTP request error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP";
      alert(errorMessage);
      throw new Error(errorMessage);
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
  <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
    <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white px-6 sm:px-12 relative">
      <div className="absolute top-6 left-6 md:left-4 flex items-center space-x-2">
        <img src={logo} alt="Auth Logo" className="w-100 h-8" />
      </div>

      <div className="w-full max-w-md mt-12 md:mt-0">
        <h2 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
          {step === "signup" ? "Sign up" : step === "otp" ? "Verify OTP" : "Sign in"}
        </h2>

        {step === "signup" && (
          <SignupForm
            onSubmit={handleSignup}
            onSignInClick={() => {
              setEmail(email);
              setStep("signin");
            }}
          />
        )}

        {step === "otp" && (
          <OTPForm
            onSubmit={(otp) => handleVerify(email, otp)}
            onResendOtp={() => handleResendOtp(email)}
            email={email}
            isNewUser={isNewUser}
          />
        )}

        {step === "signin" && (
          <SigninForm
            onSubmit={handleVerify}
            onResendOtp={handleResendOtp}
            onBackToSignup={() => setStep("signup")}
            initialEmail={email}
          />
        )}
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

    <div className="hidden md:block w-1/2 h-full">
      <img
        src={image}
        alt="Wallpaper"
        className="w-full h-full p-2 rounded-lg object-cover"
      />
    </div>
  </div>
);

};

export default AuthPage;
