import {useState} from 'react';
import SignupForm from "../Components/OTPForm";
import {useNavigate} from "react-router-dom";
import OTPForm from "../Components/SignupForm";
import api from "../api";

const AuthPage = ()=>{
  const [step,setStep] = useState<"signup" | "otp">("signup");
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

return(
  <div className="auth-container">
      {step === "signup" && <SignupForm onSubmit={handleSignup} />}
      {step === "otp" && <OTPForm onSubmit={handleVerify} />}

      <div style={{ marginTop: "20px" }}>
        <h3>Or continue with Google</h3>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />
      </div>
    </div>
  );
};

export default AuthPage;
