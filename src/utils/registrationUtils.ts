export interface PlayerRegistration {
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  timestamp: string;
  lastPlayed?: string;
  totalGamesPlayed: number;
  highestScore?: number;
  totalScore: number;
  wonPrize?: boolean;
  registrationId: string;
}

// Generate unique ID
export const generateRegistrationId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `REG-${timestamp}-${random}`.toUpperCase();
};

// Validate phone number (Maldives format)
export const validatePhoneNumber = (phone: string): boolean => {
  // Maldives phone format: 7XXXXXX or 9XXXXXX (7 digits)
  // Or international: +960 7XXXXXX
  const cleanPhone = phone.replace(/\s+/g, '');
  const maldivesPattern = /^(\+960)?[79]\d{6}$/;
  return maldivesPattern.test(cleanPhone);
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Save registration to localStorage
export const saveRegistration = (registration: PlayerRegistration): boolean => {
  try {
    const existing = getRegistrations();
    existing.push(registration);
    localStorage.setItem('expo_registrations', JSON.stringify(existing));
    return true;
  } catch (error) {
    console.error('Failed to save registration:', error);
    return false;
  }
};



// Get all registrations
export const getRegistrations = (): PlayerRegistration[] => {
  try {
    const data = localStorage.getItem('expo_registrations');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load registrations:', error);
    return [];
  }
};

// Find user by username and phone (for login)
export const findUserByCredentials = (username: string, phoneNumber: string): PlayerRegistration | null => {
  const registrations = getRegistrations();
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  
  return registrations.find(
    reg => 
      reg.username.toLowerCase() === username.toLowerCase() &&
      reg.phoneNumber.replace(/\s+/g, '') === cleanPhone
  ) || null;
};

// Check if username exists (for new registrations)
export const isUsernameTaken = (username: string, excludePhone?: string): boolean => {
  const registrations = getRegistrations();
  return registrations.some(
    reg => {
      const isMatchingUsername = reg.username.toLowerCase() === username.toLowerCase();
      // If excludePhone is provided, exclude the user with that phone
      if (excludePhone) {
        return isMatchingUsername && reg.phoneNumber.replace(/\s+/g, '') !== excludePhone.replace(/\s+/g, '');
      }
      return isMatchingUsername;
    }
  );
};

// Check if phone is registered (for new registrations)
export const isPhoneRegistered = (phone: string): boolean => {
  const registrations = getRegistrations();
  const cleanPhone = phone.replace(/\s+/g, '');
  return registrations.some(
    reg => reg.phoneNumber.replace(/\s+/g, '') === cleanPhone
  );
};

// Get user by phone
export const getUserByPhone = (phone: string): PlayerRegistration | null => {
  const registrations = getRegistrations();
  const cleanPhone = phone.replace(/\s+/g, '');
  return registrations.find(
    reg => reg.phoneNumber.replace(/\s+/g, '') === cleanPhone
  ) || null;
};

// Update existing registration
export const updateRegistration = (username: string, updates: Partial<PlayerRegistration>): boolean => {
  try {
    const registrations = getRegistrations();
    const index = registrations.findIndex(
      reg => reg.username.toLowerCase() === username.toLowerCase()
    );
    
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...updates };
      localStorage.setItem('expo_registrations', JSON.stringify(registrations));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to update registration:', error);
    return false;
  }
};

// Record game session
export const recordGameSession = (username: string, score: number, wonPrize: boolean): void => {
  try {
    const registrations = getRegistrations();
    const index = registrations.findIndex(
      reg => reg.username.toLowerCase() === username.toLowerCase()
    );
    
    if (index !== -1) {
      const user = registrations[index];
      user.lastPlayed = new Date().toISOString();
      user.totalGamesPlayed = (user.totalGamesPlayed || 0) + 1;
      user.totalScore = (user.totalScore || 0) + score;
      user.highestScore = Math.max(user.highestScore || 0, score);
      
      if (wonPrize) {
        user.wonPrize = true;
      }
      
      localStorage.setItem('expo_registrations', JSON.stringify(registrations));
      console.log(`Session recorded for ${username}: Score ${score}, Games played: ${user.totalGamesPlayed}`);
    }
  } catch (error) {
    console.error('Failed to record game session:', error);
  }
};

// Export to CSV with enhanced save options
export const exportToCSV = async (autoSave: boolean = false): Promise<void> => {
  const registrations = getRegistrations();
  
  if (registrations.length === 0) {
    if (!autoSave) alert('No registrations to export!');
    return;
  }

  // CSV Headers
  const headers = [
    'Registration ID',
    'Username',
    'Full Name',
    'Phone Number',
    'Email',
    'Registration Time',
    'Last Played',
    'Games Played',
    'Highest Score',
    'Total Score',
    'Won Prize'
  ];

  // Convert to CSV rows
  const rows = registrations.map(reg => [
    reg.registrationId,
    reg.username,
    reg.fullName,
    reg.phoneNumber,
    reg.email,
    new Date(reg.timestamp).toLocaleString(),
    reg.lastPlayed ? new Date(reg.lastPlayed).toLocaleString() : 'Never',
    (reg.totalGamesPlayed || 0).toString(),
    (reg.highestScore || 0).toString(),
    (reg.totalScore || 0).toString(),
    reg.wonPrize ? 'YES' : 'NO'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const time = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
  const filename = autoSave 
    ? `MIRA_Expo_Backup_${timestamp}_${time}.csv`
    : `MIRA_Expo_Registrations_${timestamp}.csv`;

  // Try File System Access API (Chrome/Edge) - allows user to choose save location
  if ('showSaveFilePicker' in window && !autoSave) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'CSV Files',
          accept: { 'text/csv': ['.csv'] },
        }],
      });
      
      const writable = await handle.createWritable();
      await writable.write(csvContent);
      await writable.close();
      
      console.log(`✅ Exported ${registrations.length} registrations to ${filename}`);
      alert(`✅ Saved ${registrations.length} registrations!\n\nFile: ${filename}`);
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return; // User cancelled
      }
      console.warn('File System Access API failed, falling back to download:', err);
    }
  }

  // Fallback: Regular download (Downloads folder)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`📥 Downloaded ${registrations.length} registrations to Downloads folder`);
  if (!autoSave) {
    alert(`✅ Exported ${registrations.length} registrations!\n\nFile: ${filename}\n\nCheck your Downloads folder.`);
  }
};

// Auto-save CSV (silent backup)
export const autoSaveCSV = async (): Promise<void> => {
  await exportToCSV(true);
};



// Clear all registrations (admin only)
export const clearAllRegistrations = (): boolean => {
  const confirm = window.confirm(
    '⚠️ WARNING: This will delete ALL registrations!\n\nAre you sure?'
  );
  
  if (confirm) {
    const doubleConfirm = window.confirm(
      '⚠️ FINAL WARNING: This action cannot be undone!\n\nExport CSV first if needed.\n\nContinue with deletion?'
    );
    
    if (doubleConfirm) {
      localStorage.removeItem('expo_registrations');
      localStorage.removeItem('csv_buffer');
      alert('All registrations cleared.');
      return true;
    }
  }
  
  return false;
};
