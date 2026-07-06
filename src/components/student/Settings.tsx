import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Monitor, Loader2, PanelBottom, PanelLeft, Camera, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LEVEL_REWARDS } from '@/lib/level-rewards';

const colleges = [
  "ACHARYA INSTITUTE OF TECHNOLOGY",
  "ACHARYA'S NRV SCHOOL OF ARCHITECTURE",
  "ACHUTHA INSTITUTE OF TECHNOLOGY",
  "ACS COLLEGE OF ENGINEERING",
  "ADITYA ACADEMY OF ARCHITECTURE & DESIGN",
  "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY",
  "AKASH INSTITUTE OF ENGINEERING & TECHNOLOGY",
  "AKSHAYA INSTITUTE OF TECHNOLOGY",
  "AMRUTA INSTITUTE OF ENGINEERING & MANAGEMENT SCIENCES",
  "APS COLLEGE OF ENGINEERING",
  "BANGALORE COLLEGE OF ENGINEERING AND TECHNOLOGY",
  "BANGALORE TECHNOLOGICAL INSTITUTE",
  "BGS COLLEGE OF ENGINEERING AND TECHNOLOGY (BGSCET)",
  "BMS COLLEGE OF ARCHITECTURE, DESIGN AND PLANNING, BENGALURU",
  "BMS SCHOOL OF ARCHITECTURE",
  "BRINDAVAN COLLEGE OF ENGINEERING",
  "C BYREGOWDA INSTITUTE OF TECHNOLOGY",
  "CAMBRIDGE INSTITUTE OF TECHNOLOGY NORTH CAMPUS",
  "CHANNABASAVESHWARA INSTITUTE OF TECHNOLOGY",
  "CITY ENGINEERING COLLEGE",
  "CMR INSTITUTE OF TECHNOLOGY",
  "DAYANANDA SAGAR COLLEGE OF ARCHITECTURE",
  "DR H N NATIONAL COLLEGE OF ENGINEERING",
  "DR SRI SRI SRI SHIVAKUMARA MAHASWAMY COLLEGE OF ENGINEERING",
  "DR. T . THIMMAIAH INSTITUTE OF TECHNOLOGY",
  "EAST WEST COLLEGE OF ENGINEERING",
  "EAST WEST SCHOOL OF ARCHITECTURE",
  "GHOUSIA COLLEGE OF ENGINEERING",
  "GHOUSIA INSTITUTE OF TECHNOLOGY FOR WOMEN",
  "GOPALAN COLLEGE OF ENGINEERING AND MANGEMENT",
  "GOPALAN SCHOOL OF ARCHITECTURE AND PLANNING",
  "GOVERNMENT ENGINEERING COLLEGE, RAMANAGARA",
  "GOVERNMENT SRI KRISHNARAJENDRA SILVER JUBILEE TECHNOLOGICAL INSTITUTE",
  "GOVT. TOOL ROOM & TRAINING CENTRE",
  "SRI SIDDHARTHA SCHOOL OF ENGINEERING (H M S INSTITUTE OF TECHNOLOGY)",
  "HKBK COLLEGE OF ENGINEERING",
  "H M S SCHOOL OF ARCHITECTURE",
  "IMPACT COLLEGE OF ENGINEERING AND APPLIED SCIENCES",
  "IMPACT SCHOOL OF ARCHITECTURE",
  "JNANAVIKAS INSTITUTE OF TECHNOLOGY",
  "JSS ACADEMY OF TECHNICAL EDUCATION, BANGALORE",
  "JYOTHY INSTITUTE OF TECHNOLOGY",
  "K N S INSTITUTE OF TECHNOLOGY",
  "K S SCHOOL OF ARCHITECTURE",
  "K S SCHOOL OF ENGINEERING AND MANAGEMENT",
  "KALPATARU INSTITUTE OF TECHNOLOGY",
  "M S ENGINEERING COLLEGE",
  "NITTE SCHOOL OF ARCHITECTURE PLANNING & DESIGN",
  "R V COLLEGE OF ARCHITECTURE",
  "R.L. JALAPPA INSTITUTE OF TECHNOLOGY",
  "RAJIV GANDHI INSTITUTE OF TECHNOLOGY",
  "RNS SCHOOL OF ARCHITECTURE",
  "RV INSTITUTE OF TECHNOLOGY AND MANAGEMENT",
  "S. E. A. COLLEGE OF ENGINEERING & TECHNOLOGY",
  "SAI VIDYA INSTITUTE OF TECHNOLOGY",
  "SAMBHRAM INSTITUTE OF TECHNOLOGY",
  "SAMPOORNA INSTITUTE OF TECHNOLOGY AND RESEARCH",
  "SHA-SHIB COLLEGE OF ENGINEERING",
  "SHRIDEVI INSTITUTE OF ENGINEERING AND TECHNOLOGY TUMAKURU",
  "SIR M V SCHOOL OF ARCHITECTURE",
  "SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY",
  "SJB SCHOOL OF ARCHITECTURE & PLANNING",
  "SRI BASAVESHWARA INSTITUTE OF TECHNOLOGY",
  "SRI KRISHNA INSTITUTE OF TECHNOLOGY",
  "SRI REVANA SIDDESHWARA INSTITUTE OF TECHNOLOGY",
  "SRI SAIRAM COLLEGE OF ENGINEERING",
  "T. JOHN INSTITUTE OF TECHNOLOGY",
  "THE OXFORD COLLEGE OF ENGINEERING",
  "THE OXFORD SCHOOL OF ARCHITECTURE (TOSA)",
  "VEMANA INSTITUTE OF TECHNOLOGY",
  "VIJAYA VITTALA INSTITUTE OF TECHNOLOGY, BANGALORE",
  "VIVEKANANDA INSTITUTE OF TECHNOLOGY"
];

export function Settings() {
    const { user, token, updateUser } = useAuth();
    const { navType, setNavType } = useUI();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeSettingTab, setActiveSettingTab] = useState<'profile' | 'cosmetics' | 'security' | 'notifications' | 'appearance'>('profile');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        usn: '',
        university: '',
        college: ''
    });

    const [unlockedFrames, setUnlockedFrames] = useState<any[]>([]);
    const [selectedTitle, setSelectedTitle] = useState(user?.equippedTitle || 'Newcomer');
    const [selectedFrame, setSelectedFrame] = useState(user?.equippedFrame || '');

    useEffect(() => {
        if (user) {
            setSelectedTitle(user.equippedTitle || 'Newcomer');
            setSelectedFrame(user.equippedFrame || '');
            fetchUnlockedFrames();
        }
    }, [user]);

    const fetchUnlockedFrames = async () => {
        try {
            const response = await fetch('/api/student/profile/frame', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUnlockedFrames(data.frames || []);
            }
        } catch (error) {
            console.error('Error fetching unlocked frames:', error);
        }
    };

    const handleEquipTitle = async (title: string) => {
        try {
            const response = await fetch('/api/student/profile/title', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            });
            if (response.ok) {
                setSelectedTitle(title);
                updateUser({ equippedTitle: title });
                alert('Title equipped successfully!');
            }
        } catch (error) {
            console.error('Error equipping title:', error);
        }
    };

    const handleEquipFrame = async (frameKey: string) => {
        try {
            const response = await fetch('/api/student/profile/frame', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ frameKey })
            });
            if (response.ok) {
                setSelectedFrame(frameKey);
                updateUser({ equippedFrame: frameKey || null });
                alert('Frame updated successfully!');
            }
        } catch (error) {
            console.error('Error equipping frame:', error);
        }
    };

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
                usn: user.usn || '',
                university: user.university || '',
                college: user.college || ''
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
                const data = await response.json();
                updateUser(data.user);
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

    const eligibleTitles = LEVEL_REWARDS.filter(r => r.level <= (user?.level || 1));

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DDE3EA] pb-6">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Preferences</p>
                    <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Settings</h3>
                    <p className="text-[#8A919B] text-sm mt-1">Manage your account preferences and application settings</p>
                </div>
            </div>

            {/* Top Pill Navigation Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                    { id: 'profile', label: 'Profile Info', icon: <User size={16} /> },
                    { id: 'cosmetics', label: 'Customization', icon: <Award size={16} /> },
                    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
                    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
                    { id: 'appearance', label: 'UI Appearance', icon: <Monitor size={16} /> }
                ].map((tab) => {
                    const isActive = activeSettingTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSettingTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap border shrink-0 ${
                                isActive 
                                    ? 'bg-[#1E1E1E] border-[#1E1E1E] text-white shadow-lg shadow-black/5 scale-[1.02]' 
                                    : 'bg-white border-[#DDE3EA] text-[#8A919B] hover:text-[#1E1E1E] hover:border-[#1E1E1E]'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="mt-4 animate-in fade-in duration-300">
                {activeSettingTab === 'profile' && (
                    <Card className="bg-white border-[#DDE3EA] shadow-none rounded-[2rem] p-4 sm:p-8">
                        <CardHeader className="px-0 pt-0">
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
                        <CardContent className="px-0 pb-0 space-y-6">
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
                                    <Label htmlFor="fullName" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usn" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">USN (Student ID)</Label>
                                    <Input
                                        id="usn"
                                        value={formData.usn}
                                        disabled
                                        className="border-[#DDE3EA] bg-[#F4F6F8] rounded-xl h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="university" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">University</Label>
                                    <Select 
                                        value={formData.university} 
                                        onValueChange={(val) => setFormData({ ...formData, university: val })}
                                    >
                                        <SelectTrigger className="border-[#DDE3EA] focus:border-[#1E1E1E] bg-white rounded-xl h-10">
                                            <SelectValue placeholder="Select University" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#DDE3EA]">
                                            <SelectItem value="VTU">Visvesvaraya Technological University (VTU)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="college" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Affiliated College</Label>
                                    <Select 
                                        value={formData.college} 
                                        onValueChange={(val) => setFormData({ ...formData, college: val })}
                                        disabled={formData.university !== 'VTU'}
                                    >
                                        <SelectTrigger className="border-[#DDE3EA] focus:border-[#1E1E1E] bg-white rounded-xl h-10">
                                            <SelectValue placeholder="Select College" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#DDE3EA] max-h-60 overflow-y-auto">
                                            {colleges.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-[#DDE3EA]">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="bg-[#1E1E1E] hover:bg-[#333] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSettingTab === 'cosmetics' && (
                    <Card className="bg-white border-[#DDE3EA] shadow-none rounded-[2rem] p-4 sm:p-8">
                        <CardHeader className="px-0 pt-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#CBD5E1] rounded-xl text-[#1E1E1E]">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-[#1E1E1E]">Avatar & Title Customization</CardTitle>
                                    <CardDescription className="text-[#8A919B]">Customize your profile appearance with unlocked frames and titles</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 pb-0 space-y-6">
                            {/* Title Selector */}
                            <div className="space-y-2">
                                <Label className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Equipped Title</Label>
                                <Select 
                                    value={selectedTitle} 
                                    onValueChange={handleEquipTitle}
                                >
                                    <SelectTrigger className="border-[#DDE3EA] focus:border-[#1E1E1E] bg-white rounded-xl h-10">
                                        <SelectValue placeholder="Select Title" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-[#DDE3EA]">
                                        <SelectItem value="Newcomer">🎖️ Newcomer (Level 1)</SelectItem>
                                        {eligibleTitles.map((t) => (
                                            <SelectItem key={t.title} value={t.title}>
                                                🎖️ {t.title} (Level {t.level})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-[#8A919B]">Reach higher levels to unlock premium scholar titles.</p>
                            </div>

                            {/* Frame Selector */}
                            <div className="space-y-4">
                                <Label className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Avatar Frames</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {/* Default / No Frame Option */}
                                    <div 
                                        onClick={() => handleEquipFrame('')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 text-center ${
                                            !selectedFrame ? 'border-[#1E1E1E] bg-[#F4F6F8]' : 'border-[#DDE3EA] hover:border-[#1E1E1E] bg-white'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-[16px] border-2 border-[#DDE3EA] flex items-center justify-center text-xs font-black bg-[#F4F6F8]">
                                            Default
                                        </div>
                                        <span className="text-xs font-bold text-[#1E1E1E]">No Frame</span>
                                    </div>

                                    {unlockedFrames.map((uf) => {
                                        const frame = uf.cosmetics;
                                        const isEquipped = selectedFrame === frame.key;
                                        return (
                                            <div 
                                                key={frame.key}
                                                onClick={() => handleEquipFrame(frame.key)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 text-center ${
                                                    isEquipped ? 'border-[#1E1E1E] bg-[#F4F6F8]' : 'border-[#DDE3EA] hover:border-[#1E1E1E] bg-white'
                                                }`}
                                            >
                                                <div className="w-12 h-12 rounded-[16px] border-2 border-cyan-500 bg-[#E8EDF3] flex items-center justify-center text-[10px] font-black uppercase text-cyan-600">
                                                    {frame.name.split(' ')[0]}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-black text-[#1E1E1E] truncate max-w-[150px]">{frame.name}</p>
                                                    <span className="text-[9px] text-cyan-600 font-extrabold uppercase">{frame.rarity}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {unlockedFrames.length === 0 && (
                                    <p className="text-xs text-[#8A919B]">You haven't unlocked any avatar frames yet. Level up to claim bronze, silver, or gold frames!</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSettingTab === 'security' && (
                    <Card className="bg-white border-[#DDE3EA] shadow-none rounded-[2rem] p-4 sm:p-8">
                        <CardHeader className="px-0 pt-0">
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
                        <CardContent className="px-0 pb-0 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={password.currentPassword}
                                    onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                                    className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={password.newPassword}
                                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                        className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-[#1E1E1E] font-bold text-xs uppercase tracking-wider">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={password.confirmPassword}
                                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                        className="border-[#DDE3EA] focus:border-[#1E1E1E] rounded-xl h-10"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-[#DDE3EA] mt-6">
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    className="bg-[#1E1E1E] hover:bg-[#333] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSettingTab === 'notifications' && (
                    <Card className="bg-white border-[#DDE3EA] shadow-none rounded-[2rem] p-4 sm:p-8">
                        <CardHeader className="px-0 pt-0">
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
                        <CardContent className="px-0 pb-0 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-[#1E1E1E] font-bold">Email Notifications</Label>
                                    <p className="text-xs text-[#8A919B]">Receive daily summaries and important alerts</p>
                                </div>
                                <Switch
                                    checked={notifications.emailNotifs}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifs: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-[#1E1E1E] font-bold">Push Notifications</Label>
                                    <p className="text-xs text-[#8A919B]">Get real-time updates on your devices</p>
                                </div>
                                <Switch
                                    checked={notifications.pushNotifs}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifs: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-[#1E1E1E] font-bold">Announcement Notifications</Label>
                                    <p className="text-xs text-[#8A919B]">Get notified about new announcements</p>
                                </div>
                                <Switch
                                    checked={notifications.announcementNotifs}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, announcementNotifs: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-[#1E1E1E] font-bold">Assignment Notifications</Label>
                                    <p className="text-xs text-[#8A919B]">Get reminders for assignment deadlines</p>
                                </div>
                                <Switch
                                    checked={notifications.assignmentNotifs}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, assignmentNotifs: checked })}
                                />
                            </div>
                            <div className="flex justify-end pt-4 border-t border-[#DDE3EA] mt-4">
                                <Button
                                    onClick={handleSaveNotifications}
                                    disabled={saving}
                                    className="bg-[#1E1E1E] hover:bg-[#333] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSettingTab === 'appearance' && (
                    <Card className="bg-white border-[#DDE3EA] shadow-none rounded-[2rem] p-4 sm:p-8">
                        <CardHeader className="px-0 pt-0">
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
                        <CardContent className="px-0 pb-0 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                )}
            </div>
        </div>
    );
}
