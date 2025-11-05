import React, { useState } from 'react';
import {
  generateRegistrationId,
  validatePhoneNumber,
  validateEmail,
  isUsernameTaken,
  isPhoneRegistered,
  saveRegistration,
  type PlayerRegistration,
} from '../utils/registrationUtils';

export const RegistrationForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (isUsernameTaken(formData.username)) {
      newErrors.username = 'Username already taken';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid Maldives phone number (e.g., 7XXXXXX or 9XXXXXX)';
    } else if (isPhoneRegistered(formData.phoneNumber)) {
      newErrors.phoneNumber = 'This phone number is already registered';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const registration: PlayerRegistration = {
      registrationId: generateRegistrationId(),
      username: formData.username.trim(),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      totalGamesPlayed: 0,
      totalScore: 0,
    };

    const success = saveRegistration(registration);

    if (success) {
      // Store current username for later score update
      localStorage.setItem('current_username', formData.username);
      localStorage.setItem('player_full_name', formData.fullName);

      alert(`✅ Registration successful!\n\nRegistration ID: ${registration.registrationId}\n\nGood luck, ${formData.fullName}!`);
      onComplete();
    } else {
      alert('❌ Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-yellow-500">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            🎮 Player Registration
          </h1>
          <p className="text-gray-300 text-sm">
            MIRA - Legends of Revenue Expo Challenge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded border-2 ${
                errors.username ? 'border-red-500' : 'border-gray-600'
              } focus:border-yellow-500 focus:outline-none`}
              placeholder="Choose a username"
              maxLength={20}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded border-2 ${
                errors.fullName ? 'border-red-500' : 'border-gray-600'
              } focus:border-yellow-500 focus:outline-none`}
              placeholder="Your full name"
              maxLength={50}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded border-2 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
              } focus:border-yellow-500 focus:outline-none`}
              placeholder="7XXXXXX or 9XXXXXX"
              maxLength={15}
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Maldives format: 7XXXXXX or +960 7XXXXXX
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded border-2 ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } focus:border-yellow-500 focus:outline-none`}
              placeholder="your.email@example.com"
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            {isSubmitting ? 'Registering...' : '🎮 Start Playing!'}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-4">
          * All fields are required for prize eligibility
        </p>
      </div>
    </div>
  );
};
