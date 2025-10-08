import React, { useState, useRef } from 'react';
import { usePlayerStore } from '../state/playerStore';

export const AvatarSelector: React.FC = () => {
  const { avatar, customAvatar, setAvatar, setCustomAvatar } = usePlayerStore();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultAvatars = [
    { id: 'rogue', name: 'Rogue', path: '/images/avatars/rogue.svg' },
    { id: 'warrior', name: 'Warrior', path: '/images/avatars/warrior.svg' },
    { id: 'mage', name: 'Mage', path: '/images/avatars/mage.svg' },
    { id: 'priest', name: 'Priest', path: '/images/avatars/priest.svg' },
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
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }
      
      // Create object URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomAvatar(result);
        setIsOpen(false);
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
                setAvatar('/images/avatars/rogue.svg');
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                      className="w-full h-24 object-contain mb-2"
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
                  Supports: JPG, PNG, GIF, SVG (Max 2MB)
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
