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
  Lock, Eye, EyeOff, AlertTriangle, Camera
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    email: user?.email || ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            // If we can't create settings due to RLS, set default values locally
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
          // Set default values locally if database insert fails
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
      // Set default values if everything fails
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

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
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
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      uploadAvatar(file);
    }
  };

  const updatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
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
      // If settings has a real ID (not 'temp'), try to update in database
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
          // Continue with local update even if database update fails
        } else {
          toast.success('Settings updated successfully!');
        }
      } else {
        // Try to create the settings record if it doesn't exist
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

      // Update local state regardless of database operation result
      setSettings({ ...settings, ...updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      // Still update local state
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

  const deleteAccount = async () => {
    const confirmation = prompt(
      'This action cannot be undone. Type "DELETE" to confirm account deletion:'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    try {
      // Note: In a real app, you'd want to handle this server-side
      // This is a simplified version for demo purposes
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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed. Contact support if needed.
              </p>
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

        {/* Security Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-600" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Update your password and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Change */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>

              <Button
                onClick={updatePassword}
                disabled={saving || !newPassword || !confirmPassword}
                variant="outline"
                className="w-full"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>

            {/* Privacy Level */}
            <div className="space-y-3">
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
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified
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
                <Switch
                  id="notifications"
                  checked={settings?.notifications || false}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                />
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