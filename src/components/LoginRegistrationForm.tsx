import { useState } from 'react';
import {
  generateRegistrationId,
  validatePhoneNumber,
  validateEmail,
} from '../utils/registrationUtils';
import {
  findPlayer,
  findPlayerByPhone,
  isUsernameTaken,
  addPlayer,
  type Player
} from '../utils/database';

interface LoginRegistrationFormProps {
  onSuccess: (user: Player) => void;
}

type FormMode = 'login' | 'register';

export default function LoginRegistrationForm({ onSuccess }: LoginRegistrationFormProps) {
  const [mode, setMode] = useState<FormMode>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  
  // Registration fields
  const [regUsername, setRegUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!loginUsername.trim()) {
      setError('Please enter your username');
      setLoading(false);
      return;
    }

    if (!loginPhone.trim()) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(loginPhone)) {
      setError('Invalid phone number format (use 7XXXXXX or 9XXXXXX)');
      setLoading(false);
      return;
    }

    // Debug: Log Dexie check
    console.log('🔍 Checking Dexie database for login...');
    console.log('Username:', loginUsername);
    console.log('Phone:', loginPhone);

    // Try to find user
    const user = await findPlayer(loginUsername, loginPhone);

    if (user) {
      // Success! Welcome back
      console.log('✅ Login successful:', user.username);
      console.log('📦 User data:', user);
      onSuccess(user);
    } else {
      console.log('❌ User not found in Dexie database');
      
      // Check if phone exists with different username
      const phoneUser = await findPlayerByPhone(loginPhone);
      if (phoneUser) {
        console.log('⚠️ Phone found with different username:', phoneUser.username);
        setError(`This phone is registered to username: "${phoneUser.username}"\n\nPlease use that username or register a new account with a different phone number.`);
      } else {
        console.log('❌ Phone not found in database');
        setError('Account not found. Please check your username and phone number, or register a new account.');
      }
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!regUsername.trim()) {
      setError('Please enter a username');
      setLoading(false);
      return;
    }

    if (regUsername.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number format (use 7XXXXXX or 9XXXXXX)');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    // Check if phone already registered
    const phoneUser = await findPlayerByPhone(phoneNumber);
    if (phoneUser) {
      setError(`This phone number is already registered to username: "${phoneUser.username}"\n\nPlease login instead or use a different phone number.`);
      setLoading(false);
      return;
    }

    // Check if username is taken
    const usernameTaken = await isUsernameTaken(regUsername);
    if (usernameTaken) {
      setError('This username is already taken. Please choose another.');
      setLoading(false);
      return;
    }

    // Create new registration
    const newUser: Player = {
      username: regUsername,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      timestamp: new Date().toISOString(),
      totalGamesPlayed: 0,
      totalScore: 0,
      registrationId: generateRegistrationId(),
      wonPrize: false,
    };

    try {
      await addPlayer(newUser);
      console.log('✅ Registration successful:', newUser.username);
      onSuccess(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to save registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-2xl p-8 border-2 border-purple-500">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            Legends of Revenue
          </h1>
          <p className="text-gray-400 text-sm">
            MIRA Expo Experience
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'login'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'register'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="7XXXXXX or 9XXXXXX"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                Maldives format: 7XXXXXX or 9XXXXXX
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Username *
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Choose a unique username"
                disabled={loading}
                minLength={3}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Your full name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="7XXXXXX or 9XXXXXX"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Maldives format: 7XXXXXX or 9XXXXXX
              </p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="your.email@example.com"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>All data is stored securely on this device</p>
        </div>
      </div>
    </div>
  );
}
