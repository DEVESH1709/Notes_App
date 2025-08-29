import { useState } from "react";

interface Props {
  onSubmit: (otp: string) => void;
}

const OTPForm = ({ onSubmit }: Props) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-12 p-6 bg-white shadow-md rounded-2xl flex flex-col gap-5"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Enter OTP
      </h2>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        required
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                   font-medium py-2 rounded-xl transition-colors duration-200"
      >
        Verify OTP
      </button>
    </form>
  );
};

export default OTPForm;
