import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/userAction';
import logo from '../../assets/MainLogo.svg';
import PasswordInput from '../../elements/passwordInput/PasswordInput';

function LoginPage({ isDarkMode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (error) {
      setError(null); // Clear the error when the user starts typing again
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const data = { email, password };

    setLoading(true);  // Start loading
    setError(null);
    try {
      await dispatch(login(data));      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen w-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      <img
        src={logo}
        alt="Main Logo"
        className={`h-32 w-32 mb-6 ${isDarkMode ? 'filter invert' : ''}`}
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-lg">
        Patient Communication PLatform
      </h1>
      <p
        className={`text-lg drop-shadow-md tracking-wide mb-6 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}
      >
        Your Voice, Amplified
      </p>
      {/* Login Form */}
      <div
        className={`p-8 rounded-lg shadow-lg w-96 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      >
        <h2
          className={`text-2xl font-semibold mb-6 text-center ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          Log In
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white'
            }`}
            required
          />
          {/* Password Field */}
          <div className="relative w-full mb-4">
            <PasswordInput
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white'
              }`}
              required
            />
          </div>
          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}  // Disable button when loading
            className={`py-2 rounded-md font-semibold hover:shadow-lg transition-all ${
              isDarkMode ? 'text-black bg-mylightblue' : 'bg-myblue text-white'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Additional Options */}
        <p
          className={`text-gray-600 mt-4 text-center ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-myblue hover:underline border-none bg-transparent focus:outline-none"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
