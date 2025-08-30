import { useState } from "react";

interface Props {
  onSubmit: (email: string, otp: string) => void;
  onResendOtp?: (email: string) => void;
  onBackToSignup?: () => void;
}

const SigninForm = ({ onSubmit, onResendOtp, onBackToSignup }: Props) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          required
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={() => onResendOtp?.(email)}
          className="text-indigo-600 hover:underline"
        >
          Resend OTP
        </button>
        <label className="flex items-center space-x-2 text-gray-600">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="form-checkbox h-4 w-4 text-indigo-600"
          />
          <span>Keep me logged in</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Sign in
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Need an account?{" "}
        <button
          type="button"
          className="text-indigo-600 hover:underline"
          onClick={onBackToSignup}
        >
          Create one
        </button>
      </p>
    </form>
  );
};

export default SigninForm;
