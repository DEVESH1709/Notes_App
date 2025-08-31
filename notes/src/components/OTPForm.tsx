import { useState, useEffect } from "react";

interface Props {
  onSubmit: (otp: string) => void;
  onResendOtp: () => void;
  email: string;
  isNewUser?: boolean;
}

const OTPForm = ({ onSubmit, onResendOtp, email, isNewUser = false }: Props) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      await onResendOtp();
      setResendCooldown(30); 
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      <p className="text-gray-400 text-sm mb-6">
        {isNewUser 
          ? 'We\'ve sent a verification code to create your account at'
          : 'We\'ve sent a verification code to'}
        <br />
        <span className="font-medium text-white">{email}</span>
      </p>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        required
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-center text-xl tracking-widest
                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading || resendCooldown > 0}
          className={`text-sm ${(isLoading || resendCooldown > 0) ? 'text-gray-500' : 'text-blue-500 hover:text-blue-400'}`}
        >
          {isLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                  font-medium py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
};

export default OTPForm;
