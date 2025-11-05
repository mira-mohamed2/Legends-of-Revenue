import React, { useState, useRef } from 'react';
import { usePlayerStore } from '../state/playerStore';

export const AvatarSelector: React.FC = () => {
  const { avatar, customAvatar, setAvatar, setCustomAvatar } = usePlayerStore();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultAvatars = [
    { id: 'male-agent', name: 'Male Agent', path: '/images/avatars/male-ta-default.jpg' },
    { id: 'female-agent', name: 'Female Agent', path: '/images/avatars/female-ta-default.jpg' },
    { id: 'warrior', name: 'Warrior', path: '/images/avatars/warrior.svg' },
    { id: 'mage', name: 'Mage', path: '/images/avatars/mage.svg' },
    { id: 'rogue', name: 'Rogue', path: '/images/avatars/rogue.svg' },
    { id: 'healer', name: 'Healer', path: '/images/avatars/healer.svg' },
  ];
  
  const currentAvatar = customAvatar || avatar;
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // REDUCED: 500KB limit (was 2MB) for safer LocalStorage usage on GitHub Pages
      if (file.size > 500 * 1024) {
        alert('Image size must be less than 500KB. Please resize your image or use a default avatar.');
        return;
      }
      
      // Create object URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Check base64 size (adds ~33% overhead)
        const base64Size = result.length;
        const estimatedKB = Math.round(base64Size / 1024);
        
        // Warn if > 700KB after encoding
        if (base64Size > 700 * 1024) {
          alert(`Encoded image is ${estimatedKB}KB. This may cause storage issues. Please use a smaller image.`);
          return;
        }
        
        // Try to save with error handling for quota exceeded
        try {
          setCustomAvatar(result);
          setIsOpen(false);
        } catch (error: any) {
          // Check if it's a quota error
          if (error.name === 'QuotaExceededError' || 
              error.code === 22 || 
              error.code === 1014) {
            alert('Storage quota exceeded! Please:\n1. Use a smaller image\n2. Clear browser data\n3. Use a default avatar instead');
            console.error('LocalStorage quota exceeded:', error);
          } else {
            alert('Failed to save avatar. Please try a different image.');
            console.error('Avatar save error:', error);
          }
        }
      };
      
      reader.onerror = () => {
        alert('Failed to read image file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSelectDefault = (avatarPath: string) => {
    setAvatar(avatarPath);
    setIsOpen(false);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        {/* Current Avatar Display */}
        <div className="w-32 h-32 bg-parchment-200 border-4 border-gold rounded-lg overflow-hidden shadow-lg">
          <img 
            src={currentAvatar} 
            alt="Your Avatar" 
            className="w-full h-full object-contain p-2"
          />
        </div>
        
        {/* Change Avatar Button */}
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-primary mb-2"
          >
            Change Avatar
          </button>
          {customAvatar && (
            <button
              onClick={() => {
                setCustomAvatar(null);
                setAvatar('/images/avatars/male-ta-default.jpg');
              }}
              className="btn-secondary block w-full text-sm"
            >
              Reset to Default
            </button>
          )}
        </div>
      </div>
      
      {/* Avatar Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="panel max-w-2xl w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medieval text-2xl text-gold">Choose Your Avatar</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-brown hover:text-red-600"
              >
                ✕
              </button>
            </div>
            
            {/* Default Avatars */}
            <div className="mb-6">
              <h4 className="font-medieval text-lg text-brown mb-3">Default Avatars</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {defaultAvatars.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => handleSelectDefault(av.path)}
                    className={`p-3 rounded border-2 transition-all hover:shadow-lg ${
                      avatar === av.path && !customAvatar
                        ? 'border-gold bg-gold-light'
                        : 'border-brown bg-parchment-100 hover:border-gold'
                    }`}
                  >
                    <img 
                      src={av.path} 
                      alt={av.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="font-body text-sm text-brown text-center">{av.name}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Upload */}
            <div className="border-t-2 border-brown pt-4">
              <h4 className="font-medieval text-lg text-brown mb-3">Upload Custom Avatar</h4>
              <div className="bg-parchment-100 p-4 rounded border-2 border-brown">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="btn-primary cursor-pointer inline-block text-center"
                >
                  📁 Choose Image File
                </label>
                <p className="font-body text-sm text-brown-600 mt-2">
                  Supports: JPG, PNG, GIF, SVG (Max 500KB for optimal performance)
                </p>
                {customAvatar && (
                  <p className="font-body text-sm text-green-600 mt-2">
                    ✓ Custom avatar uploaded successfully!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
