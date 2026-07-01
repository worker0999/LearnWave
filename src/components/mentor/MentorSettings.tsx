'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
    User,
    Bell,
    Lock,
    Loader2,
    ShieldCheck,
    Mail,
    Globe,
    Save,
    Camera
} from 'lucide-react'

export function MentorSettings() {
    const { user, token, updateUser } = useAuth()
    const { toast } = useToast()
    const [isSaving, setIsSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: 'Error', description: 'File size exceeds 2MB limit.', variant: 'destructive' })
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
                toast({ title: 'Success', description: 'Profile picture updated.' })
            } else {
                const err = await response.json();
                toast({ title: 'Error', description: err.error || 'Failed to upload image.', variant: 'destructive' })
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast({ title: 'Error', description: 'An error occurred during upload.', variant: 'destructive' })
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
                toast({ title: 'Success', description: 'Profile picture removed.' })
            } else {
                toast({ title: 'Error', description: 'Failed to remove profile picture.', variant: 'destructive' })
            }
        } catch (error) {
            console.error('Error removing avatar:', error);
            toast({ title: 'Error', description: 'An error occurred.', variant: 'destructive' })
        } finally {
            setUploading(false);
        }
    };

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
    })

    // Notifications State
    const [notifications, setNotifications] = useState({
        notifications: true,
        emailUpdates: true,
        publicProfile: true,
    })

    // Security State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            })
            // Fetch current settings from API if needed
        }
    }, [user])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const response = await fetch('/api/student/profile', { // Using shared profile endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            })

            if (response.ok) {
                toast({ title: 'Success', description: 'Account information updated.' })
            } else {
                throw new Error('Update failed')
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/mentor/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(notifications)
            })

            if (response.ok) {
                toast({ title: 'Success', description: 'Preferences saved.' })
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' })
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/student/settings/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            })

            if (response.ok) {
                toast({ title: 'Success', description: 'Password changed successfully.' })
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Update failed')
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-black text-[#335765] tracking-tight">Settings</h1>
                <p className="text-[#74A8A4] font-medium mt-1">Control your account, security, and notification preferences.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-[#DBE2DC] p-1 rounded-2xl border border-[#B6D9E0]">
                    <TabsTrigger value="account" className="rounded-xl px-6 data-[state=active]:bg-[#335765] data-[state=active]:text-white text-[#74A8A4] transition-all font-bold">
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 data-[state=active]:bg-[#335765] data-[state=active]:text-white text-[#74A8A4] transition-all font-bold">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 data-[state=active]:bg-[#335765] data-[state=active]:text-white text-[#74A8A4] transition-all font-bold">
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account">
                    <Card className="bg-white border-[#B6D9E0] rounded-[32px] shadow-sm overflow-hidden min-h-[400px]">
                        <CardHeader className="p-8 border-b border-[#DBE2DC] bg-[#DBE2DC]/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#335765]">
                                    <User size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-[#335765]">Account Information</CardTitle>
                                    <CardDescription className="text-[#74A8A4]">Update your login and contact details.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                {/* Avatar Upload Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-6 border-b border-[#DBE2DC]/60">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-[24px] border-2 border-[#B6D9E0] bg-[#DBE2DC]/20 shadow-inner flex items-center justify-center text-[#335765] text-2xl font-black overflow-hidden z-10 shrink-0 transform hover:scale-102 transition-all">
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
                                        <h4 className="text-sm font-extrabold text-[#335765]">Profile Picture</h4>
                                        <p className="text-xs text-[#74A8A4]">Upload a high-resolution PNG or JPEG. Max size 2MB.</p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="mentor-avatar-upload"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => document.getElementById('mentor-avatar-upload')?.click()}
                                                disabled={uploading}
                                                className="h-10 px-5 bg-[#335765] hover:bg-[#7F543D] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
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
                                                    className="h-10 px-5 border-[#B6D9E0] text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl shadow-sm transition-all"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Full Name</Label>
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Email Address</Label>
                                        <Input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/50 rounded-xl text-[#335765]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Phone Number</Label>
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                                    />
                                </div>
                                <div className="pt-4 border-t border-[#B6D9E0]/50 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-[#335765] hover:bg-[#7F543D] text-white rounded-xl px-8 h-12 font-bold shadow-md transition-all"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                                        Save Profile
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <Card className="bg-white border-[#B6D9E0] rounded-[32px] shadow-sm overflow-hidden">
                        <CardHeader className="p-8 border-b border-[#DBE2DC] bg-[#DBE2DC]/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#335765]">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-[#335765]">Notification Centers</CardTitle>
                                    <CardDescription className="text-[#74A8A4]">Choose how you want to be alerted for your sessions.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-[#DBE2DC]/30 rounded-2xl border border-[#B6D9E0]">
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-[#335765] flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-[#74A8A4]" /> Push Notifications
                                        </Label>
                                        <p className="text-sm text-[#74A8A4] font-medium">Get desktop alerts for new bookings and student messages.</p>
                                    </div>
                                    <Switch
                                        checked={notifications.notifications}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, notifications: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-[#DBE2DC]/30 rounded-2xl border border-[#B6D9E0]">
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-[#335765] flex items-center gap-2">
                                            <Mail size={18} className="text-[#335765]" /> Email Updates
                                        </Label>
                                        <p className="text-sm text-[#74A8A4] font-medium">Receive meeting links and daily summaries via email.</p>
                                    </div>
                                    <Switch
                                        checked={notifications.emailUpdates}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-[#DBE2DC]/30 rounded-2xl border border-[#B6D9E0]">
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-[#335765] flex items-center gap-2">
                                            <Globe size={18} className="text-[#B6D9E0]" /> Public Profile
                                        </Label>
                                        <p className="text-sm text-[#74A8A4] font-medium">Make your mentor profile visible in the "Find Mentors" list.</p>
                                    </div>
                                    <Switch
                                        checked={notifications.publicProfile}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, publicProfile: checked })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#B6D9E0]/50 flex justify-end">
                                <Button
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                    className="bg-[#335765] hover:bg-[#7F543D] text-white rounded-xl px-8 h-12 font-bold transition-all"
                                >
                                    {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Preferences"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card className="bg-white border-[#B6D9E0] rounded-[32px] shadow-sm overflow-hidden">
                        <CardHeader className="p-8 border-b border-[#DBE2DC] bg-[#DBE2DC]/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#335765]">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-[#335765]">Password & Security</CardTitle>
                                    <CardDescription className="text-[#74A8A4]">Keep your account safe with a strong password.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765]"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-black hover:bg-[#335765] text-white rounded-xl px-8 h-12 font-bold transition-all"
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
