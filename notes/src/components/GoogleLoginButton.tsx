import { GoogleLogin} from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

interface GoogleLoginButtonProps {
  onSuccess: (user: unknown) => void;
  onError?: () => void;
}

const  GoogleLoginButton=({ onSuccess, onError }: GoogleLoginButtonProps)=> {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google login failed");
      }

      const decoded = jwtDecode<{ email?: string; name?: string }>(
        credentialResponse.credential
      );
      console.log("Decoded user:", decoded);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        token: credentialResponse.credential,
      });

      onSuccess(res.data);
    } catch (error) {
      console.error("Google login error", error);
      onError?.();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.error("Google login failed");
          onError?.();
        }}
      />
    </div>
  );
}
export default GoogleLoginButton;