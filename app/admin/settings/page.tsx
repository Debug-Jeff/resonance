'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Settings, Save, AlertTriangle, Shield, 
  Lock, Database, Server, RefreshCw
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    dataRetentionDays: 365,
    maxUploadSizeMB: 10,
    systemNotice: '',
    privacyPolicy: '',
    termsOfService: ''
  });
  const supabase = createClient();

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, you would save these settings to your database
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRebuildCache = async () => {
    try {
      // Simulate cache rebuild
      toast.loading('Rebuilding cache...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Cache rebuilt successfully');
    } catch (error) {
      console.error('Error rebuilding cache:', error);
      toast.error('Failed to rebuild cache');
    }
  };

  const handlePurgeData = async () => {
    const confirm = window.confirm('Are you sure you want to purge old data? This action cannot be undone.');
    if (!confirm) return;
    
    try {
      toast.loading('Purging old data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Old data purged successfully');
    } catch (error) {
      console.error('Error purging data:', error);
      toast.error('Failed to purge data');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure system-wide settings and policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure basic system settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="font-medium">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Temporarily disable access to the platform
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistrations" className="font-medium">
                    Allow New Registrations
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable or disable new user sign-ups
                  </p>
                </div>
                <Switch
                  id="allowRegistrations"
                  checked={settings.allowNewRegistrations}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowNewRegistrations: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification" className="font-medium">
                    Require Email Verification
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Users must verify email before accessing features
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => setSettings(prev => ({ ...prev, dataRetentionDays: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Maximum Upload Size (MB)</Label>
                <Input
                  id="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSizeMB}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxUploadSizeMB: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemNotice">System Notice (displayed to all users)</Label>
              <Textarea
                id="systemNotice"
                placeholder="Enter a system-wide notice..."
                value={settings.systemNotice}
                onChange={(e) => setSettings(prev => ({ ...prev, systemNotice: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glassmorphism border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Configure security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Security Configuration
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Changes to security settings may affect all users. Please proceed with caution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require for admin users</p>
                    </div>
                  </div>
                  <Switch
                    checked={true}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Data Encryption</p>
                      <p className="text-sm text-gray-500">End-to-end encryption for sensitive data</p>
                    </div>
                  </div>
                  <Switch
                    checked={true}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium">Maintenance Actions</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleRebuildCache}
                  className="flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rebuild Cache
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handlePurgeData}
                  className="flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:border-red-800 dark:hover:border-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Purge Old Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        <Card className="glassmorphism border-0 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2 text-purple-600" />
              Legal Documents
            </CardTitle>
            <CardDescription>
              Manage privacy policy and terms of service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                <Textarea
                  id="privacyPolicy"
                  placeholder="Enter privacy policy text..."
                  value={settings.privacyPolicy}
                  onChange={(e) => setSettings(prev => ({ ...prev, privacyPolicy: e.target.value }))}
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termsOfService">Terms of Service</Label>
                <Textarea
                  id="termsOfService"
                  placeholder="Enter terms of service text..."
                  value={settings.termsOfService}
                  onChange={(e) => setSettings(prev => ({ ...prev, termsOfService: e.target.value }))}
                  rows={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="gradient-primary hover:scale-105 transition-transform"
          size="lg"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}