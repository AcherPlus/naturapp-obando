import { useState, useEffect, useCallback } from 'react';
import StorageService from '../services/storageService';

export default function useProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] =
    useState(true);

  const loadProfile = useCallback(async () => {
    const profile = await StorageService.getUserProfile();
    setName(profile.name);
    setEmail(profile.email);
    setNotifications(
      await StorageService.getNotifications()
    );
  }, []);

  const saveProfile = useCallback(async () => {
    await StorageService.saveUserProfile(name, email);
  }, [name, email]);

  const toggleNotifications = useCallback(async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    await StorageService.setNotifications(newVal);
  }, [notifications]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  return {
    name,
    setName,
    email,
    setEmail,
    notifications,
    saveProfile,
    toggleNotifications,
  };
}
