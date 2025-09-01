import { useState } from "react";

interface Props {
  onSubmit: (email: string, otp: string) => void;
  onResendOtp?: (email: string) => void;
  onBackToSignup?: () => void;
  initialEmail?: string;
}

const SigninForm = ({ 
  onSubmit, 
  onResendOtp, 
  onBackToSignup, 
  initialEmail = "" 
}: Props) => {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(!!initialEmail);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setIsSendingOtp(true);
    setError("");
    
    try {
      await onResendOtp?.(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;
    setIsLoading(true);
    onSubmit(email, otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`peer w-full px-4 pt-5 pb-2 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
            placeholder=" "
            disabled={otpSent && !isSendingOtp}
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-1.5 text-gray-500 text-sm transition-all 
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
                      peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                      peer-focus:top-1.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600"
          >
            Email Address
          </label>
        </div>
        
        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
          
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center text-xl tracking-widest"
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
              >
                Resend OTP
              </button>
              {onBackToSignup && (
                <>
                  <span className="mx-2 text-gray-400">•</span>
                  <button
                    type="button"
                    onClick={onBackToSignup}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Back to Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
};

export default SigninForm;
