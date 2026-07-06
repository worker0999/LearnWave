import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Monitor, Loader2, PanelBottom, PanelLeft, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';

export function Settings() {
    const { user, token, updateUser } = useAuth();
    const { navType, setNavType } = useUI();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        usn: ''
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size exceeds 2MB limit.');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const response = await fetch('/api/student/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                const resData = await response.json();
                updateUser({ avatarUrl: resData.avatarUrl });
                alert('Profile picture updated!');
            } else {
                const err = await response.json();
                alert(err.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarRemove = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;

        setUploading(true);
        try {
            const response = await fetch('/api/student/profile/avatar', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                updateUser({ avatarUrl: undefined });
                alert('Profile picture removed!');
            } else {
                alert('Failed to remove profile picture');
            }
        } catch (error) {
            console.error('Error removing avatar:', error);
            alert('An error occurred.');
        } finally {
            setUploading(false);
        }
    };

    const [notifications, setNotifications] = useState({
        emailNotifs: true,
        pushNotifs: false,
        announcementNotifs: true,
        assignmentNotifs: true
    });

    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                usn: user.usn || ''
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/student/settings/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notifications)
            });

            if (response.ok) {
                alert('Notification preferences updated!');
            }
        } catch (error) {
            console.error('Notification update error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (password.newPassword !== password.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/student/settings/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword
                })
            });

            if (response.ok) {
                alert('Password changed successfully!');
                setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Preferences</p>
                <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Settings</h3>
                <p className="text-[#8A919B] text-sm mt-1">Manage your account preferences and application settings</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card className="bg-white border-[#DDE3EA] shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#D4E4C8] rounded-xl text-[#1E1E1E]">
                                <User size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-base text-[#1E1E1E]">Account Information</CardTitle>
                                <CardDescription className="text-[#8A919B]">Update your personal details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-6 border-b border-[#DDE3EA]">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-[24px] border-2 border-[#DDE3EA] bg-[#F4F6F8] shadow-inner flex items-center justify-center text-[#1E1E1E] text-2xl font-black overflow-hidden z-10 shrink-0 transform hover:scale-102 transition-all">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        user?.name
                                            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                            : '??'
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-2.5">
                                <h4 className="text-sm font-extrabold text-[#1E1E1E]">Profile Picture</h4>
                                <p className="text-xs text-[#8A919B]">Upload a high-resolution PNG or JPEG. Max size 2MB.</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="avatar-upload"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                        disabled={uploading}
                                        className="h-9 px-4 bg-[#1E1E1E] hover:bg-[#333] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Camera size={14} />
                                                Upload Photo
                                            </>
                                        )}
                                    </Button>
                                    {user?.avatarUrl && (
                                        <Button
                                            type="button"
                                            onClick={handleAvatarRemove}
                                            disabled={uploading}
                                            variant="outline"
                                            className="h-9 px-4 border-[#DDE3EA] text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl shadow-sm transition-all"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-[#1E1E1E]">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#1E1E1E]">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[#1E1E1E]">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="usn" className="text-[#1E1E1E]">USN</Label>
                                <Input
                                    id="usn"
                                    value={formData.usn}
                                    disabled
                                    className="border-[#DDE3EA] bg-[#F4F6F8]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="bg-[#1E1E1E] hover:bg-[#333] text-white"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Change */}
                <Card className="bg-white border-[#DDE3EA] shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#E5F0A0] rounded-xl text-[#1E1E1E]">
                                <Lock size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-base text-[#1E1E1E]">Change Password</CardTitle>
                                <CardDescription className="text-[#8A919B]">Update your password to keep your account secure</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-[#1E1E1E]">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={password.currentPassword}
                                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                                className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-[#1E1E1E]">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={password.newPassword}
                                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-[#1E1E1E]">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={password.confirmPassword}
                                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleChangePassword}
                                disabled={saving}
                                className="bg-[#1E1E1E] hover:bg-[#333] text-white"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Change Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="bg-white border-[#DDE3EA] shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#E8EDF3] rounded-xl text-[#1E1E1E]">
                                <Bell size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-base text-[#1E1E1E]">Notifications</CardTitle>
                                <CardDescription className="text-[#8A919B]">Configure how you want to be notified</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm text-[#1E1E1E]">Email Notifications</Label>
                                <p className="text-xs text-[#8A919B]">Receive daily summaries and important alerts</p>
                            </div>
                            <Switch
                                checked={notifications.emailNotifs}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifs: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm text-[#1E1E1E]">Push Notifications</Label>
                                <p className="text-xs text-[#8A919B]">Get real-time updates on your devices</p>
                            </div>
                            <Switch
                                checked={notifications.pushNotifs}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifs: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm text-[#1E1E1E]">Announcement Notifications</Label>
                                <p className="text-xs text-[#8A919B]">Get notified about new announcements</p>
                            </div>
                            <Switch
                                checked={notifications.announcementNotifs}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, announcementNotifs: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm text-[#1E1E1E]">Assignment Notifications</Label>
                                <p className="text-xs text-[#8A919B]">Get reminders for assignment deadlines</p>
                            </div>
                            <Switch
                                checked={notifications.assignmentNotifs}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, assignmentNotifs: checked })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveNotifications}
                                disabled={saving}
                                className="bg-[#1E1E1E] hover:bg-[#333] text-white"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Preferences
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* UI Appearance */}
                <Card className="bg-white border-[#DDE3EA] shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#D4E4C8] rounded-xl text-[#1E1E1E]">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-base text-[#1E1E1E]">UI Appearance</CardTitle>
                                <CardDescription className="text-[#8A919B]">Personalize your workspace layout</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setNavType('bottom')}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                                    navType === 'bottom'
                                        ? 'border-[#1E1E1E] bg-[#F4F6F8]'
                                        : 'border-[#DDE3EA] hover:border-[#8A919B] bg-white'
                                }`}
                            >
                                <div className={`p-4 rounded-2xl ${navType === 'bottom' ? 'bg-[#1E1E1E] text-white' : 'bg-[#F4F6F8] text-[#1E1E1E]'}`}>
                                    <PanelBottom size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#1E1E1E] text-sm">Bottom Dock</p>
                                    <p className="text-xs text-[#8A919B] mt-1">Floating centered navigation</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setNavType('side')}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                                    navType === 'side'
                                        ? 'border-[#1E1E1E] bg-[#F4F6F8]'
                                        : 'border-[#DDE3EA] hover:border-[#8A919B] bg-white'
                                }`}
                            >
                                <div className={`p-4 rounded-2xl ${navType === 'side' ? 'bg-[#1E1E1E] text-white' : 'bg-[#F4F6F8] text-[#1E1E1E]'}`}>
                                    <PanelLeft size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#1E1E1E] text-sm">Side Sidebar</p>
                                    <p className="text-xs text-[#8A919B] mt-1">Classic vertical navigation</p>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
