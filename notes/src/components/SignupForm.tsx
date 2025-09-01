import { useState } from "react";

interface Props {
  onSubmit: (email: string, name: string, dob: string) => void;
  onSignInClick: () => void;
}

const SignupForm = ({ onSubmit, onSignInClick }: Props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, name, dob);
  };

  return (

   
    <form onSubmit={handleSubmit} className="space-y-6">
       <h1 className="text-gray-400 text-center">Sign up to enjoy the feature of HD</h1>
      <div className="relative">
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="name"
         className="absolute left-3 top-1.5 text-gray-500 text-sm transition-all 
  peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
  peer-focus:top-1.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600"
        >
          Your Name
        </label>
      </div>
      <div className="relative">
        <input
          type="date"
          id="dob"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="dob"
         className="absolute left-3 top-1.5 text-gray-500 text-sm transition-all 
  peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
  peer-focus:top-1.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600"
        >
          Date of Birth
        </label>
      </div>
      <div className="relative">
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="email"
         className="absolute left-3 top-1.5 text-gray-500 text-sm transition-all 
  peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
  peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
  peer-focus:top-1.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600"
        >
          Email
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
      >
        Send OTP
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          className="text-indigo-600 cursor-pointer"
          onClick={onSignInClick}
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
