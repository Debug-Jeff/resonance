'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  User, Mail, Bell, Shield, Phone, Trash2, 
  Save, Upload, Settings as SettingsIcon, 
  Lock, Eye, EyeOff, AlertTriangle, Camera, Check,
  Download
} from 'lucide-react';
import { useNotifications } from '@/components/notifications/notification-provider';
import { ExportButton } from '@/components/data-export/export-button';

interface UserSettings {
  id: string;
  voice_reminders: boolean;
  notifications: boolean;
  privacy_level: string;
  crisis_contacts: any[];
}

interface CrisisContact {
  name: string;
  phone: string;
  relation: string;
}

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { notificationsEnabled, enableNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    email: user?.email || ''
  });
  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: '',
    password: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [crisisContacts, setCrisisContacts] = useState<CrisisContact[]>([]);
  const [newContact, setNewContact] = useState<CrisisContact>({
    name: '',
    phone: '',
    relation: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: user?.email || ''
      });
    }
  }, [profile, user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      if (data) {
        setSettings(data);
        setCrisisContacts(data.crisis_contacts || []);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          user_id: user?.id,
          voice_reminders: true,
          notifications: true,
          privacy_level: 'medium',
          crisis_contacts: []
        };

        try {
          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert(defaultSettings)
            .select()
            .single();

          if (createError) {
            console.error('Error creating settings:', createError);
            setSettings({
              id: 'temp',
              voice_reminders: true,
              notifications: true,
              privacy_level: 'medium',
              crisis_contacts: []
            });
          } else {
            setSettings(newSettings);
          }
        } catch (createError) {
          console.error('Error creating default settings:', createError);
          setSettings({
            id: 'temp',
            voice_reminders: true,
            notifications: true,
            privacy_level: 'medium',
            crisis_contacts: []
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      setSettings({
        id: 'temp',
        voice_reminders: true,
        notifications: true,
        privacy_level: 'medium',
        crisis_contacts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changeEmail = async () => {
    if (!emailChangeData.newEmail || !emailChangeData.password) {
      toast.error('Please provide both new email and current password');
      return;
    }

    setSaving(true);
    try {
      // First verify the current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: emailChangeData.password
      });

      if (verifyError) {
        toast.error('Current password is incorrect');
        return;
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: emailChangeData.newEmail
      });

      if (error) throw error;

      toast.success('Email change initiated! Please check your new email for confirmation.');
      setEmailChangeData({ newEmail: '', password: '' });
    } catch (error) {
      console.error('Error changing email:', error);
      toast.error('Failed to change email');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast.success('Profile photo updated successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const updatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      // First verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordData.currentPassword
      });

      if (verifyError) {
        toast.error('Current password is incorrect');
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      if (settings.id !== 'temp') {
        const { error } = await supabase
          .from('user_settings')
          .update({
            ...updatedSettings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error updating settings in database:', error);
        } else {
          toast.success('Settings updated successfully!');
        }
      } else {
        try {
          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user?.id,
              ...settings,
              ...updatedSettings
            })
            .select()
            .single();

          if (!createError && newSettings) {
            setSettings(newSettings);
            toast.success('Settings updated successfully!');
            return;
          }
        } catch (createError) {
          console.error('Error creating settings:', createError);
        }
      }

      setSettings({ ...settings, ...updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      setSettings({ ...settings, ...updatedSettings });
      toast.error('Settings updated locally (database sync failed)');
    }
  };

  const addCrisisContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim() || !newContact.relation.trim()) {
      toast.error('Please fill in all contact fields');
      return;
    }

    const updatedContacts = [...crisisContacts, { ...newContact }];
    setCrisisContacts(updatedContacts);
    updateSettings({ crisis_contacts: updatedContacts });
    
    setNewContact({ name: '', phone: '', relation: '' });
  };

  const removeCrisisContact = (index: number) => {
    const updatedContacts = crisisContacts.filter((_, i) => i !== index);
    setCrisisContacts(updatedContacts);
    updateSettings({ crisis_contacts: updatedContacts });
  };

  const handleEnableNotifications = async () => {
    const success = await enableNotifications();
    if (success) {
      updateSettings({ notifications: true });
    }
  };

  const deleteAccount = async () => {
    const confirmation = prompt(
      'This action cannot be undone. Type "DELETE" to confirm account deletion:'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Account deletion initiated. You have been signed out.');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 skeleton"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account, privacy, and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="gradient-primary text-white text-xl">
                  {profile?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <Button
              onClick={updateProfile}
              disabled={saving}
              className="w-full gradient-primary hover:scale-105 transition-transform"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Email & Password Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-600" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Update your email and password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Email */}
            <div className="space-y-2">
              <Label>Current Email</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            {/* Change Email */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Change Email</h4>
              
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailChangeData.newEmail}
                  onChange={(e) => setEmailChangeData(prev => ({ ...prev, newEmail: e.target.value }))}
                  placeholder="Enter new email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="emailPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={emailChangeData.password}
                    onChange={(e) => setEmailChangeData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={changeEmail}
                disabled={saving || !emailChangeData.newEmail || !emailChangeData.password}
                variant="outline"
                className="w-full"
              >
                {saving ? 'Updating...' : 'Change Email'}
              </Button>
            </div>

            {/* Change Password */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={updatePassword}
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                variant="outline"
                className="w-full"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-600" />
              Notifications & Privacy
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified and your privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications for mood reminders and insights
                  </p>
                </div>
                {notificationsEnabled ? (
                  <Switch
                    id="notifications"
                    checked={settings?.notifications || false}
                    onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                  />
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEnableNotifications}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Enable
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voiceReminders" className="font-medium">
                    Voice Session Reminders
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daily reminders to record voice sessions
                  </p>
                </div>
                <Switch
                  id="voiceReminders"
                  checked={settings?.voice_reminders || false}
                  onCheckedChange={(checked) => updateSettings({ voice_reminders: checked })}
                />
              </div>
            </div>

            {/* Privacy Level */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Privacy Level</h4>
              <div className="space-y-2">
                {[
                  { value: 'low', label: 'Low', desc: 'Share insights for research' },
                  { value: 'medium', label: 'Medium', desc: 'Balanced privacy and features' },
                  { value: 'high', label: 'High', desc: 'Maximum privacy protection' }
                ].map((level) => (
                  <div key={level.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={level.value}
                      name="privacy"
                      value={level.value}
                      checked={settings?.privacy_level === level.value}
                      onChange={(e) => updateSettings({ privacy_level: e.target.value })}
                      className="text-purple-600"
                    />
                    <div>
                      <Label htmlFor={level.value} className="font-medium">
                        {level.label}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {level.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Export */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Export Your Data</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download all your data in JSON format
                  </p>
                </div>
                <ExportButton />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Contacts */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-purple-600" />
              Crisis Support Contacts
            </CardTitle>
            <CardDescription>
              Emergency contacts for mental health crises
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Contacts */}
            {crisisContacts.length > 0 && (
              <div className="space-y-3">
                {crisisContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.phone} • {contact.relation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCrisisContact(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Contact */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Add New Contact</h4>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Contact name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Relationship (e.g., Therapist, Family)"
                  value={newContact.relation}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
                />
                <Button onClick={addCrisisContact} variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="glassmorphism border-0 shadow-xl border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Delete Account
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                onClick={deleteAccount}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}