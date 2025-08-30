import { useState } from "react";

interface Props {
  onSubmit: (email: string, name: string, dob: string) => void;
}

const SignupForm = ({ onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, name, dob);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
          <div>
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <input
  type="date"
  value={dob}
  required
  onChange={(e) => setDob(e.target.value)}
  placeholder="Date of Birth"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
/>
      </div>
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
    
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Send OTP
      </button>
    </form>
  );
};

export default SignupForm;