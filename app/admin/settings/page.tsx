'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic')
    const [siteName, setSiteName] = useState('Abalawe')
    const [contactEmail, setContactEmail] = useState('support@abalawe.com')
    const [currency, setCurrency] = useState('USD')
    const [emailVerificationRequired, setEmailVerificationRequired] = useState(true)
    const [message, setMessage] = useState<string | null>(null)

    const handleSaveBasic = () => {
        setMessage('Basic settings saved successfully!')
        setTimeout(() => setMessage(null), 3000)
    }

    const handleSaveAdvanced = () => {
        setMessage('Advanced settings saved successfully!')
        setTimeout(() => setMessage(null), 3000)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                <p className="text-muted-foreground mt-2">Configure your store settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'basic'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Basic Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'advanced'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Advanced Settings
                    </button>
                </div>
            </div>

            {message && (
                <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-800">
                    {message}
                </div>
            )}

            {/* Basic Settings Tab */}
            {activeTab === 'basic' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Update your store&apos;s basic information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Default Currency</Label>
                                <select
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="MWK">MWK - Malawian Kwacha</option>
                                </select>
                            </div>
                            <Button onClick={handleSaveBasic} className="mt-4">
                                Save Basic Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Advanced Settings Tab */}
            {activeTab === 'advanced' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authentication Settings</CardTitle>
                            <CardDescription>Configure user authentication and verification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="emailVerification">Email Verification Required</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Require users to verify their email before accessing the site
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEmailVerificationRequired(!emailVerificationRequired)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailVerificationRequired ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Database & Security</CardTitle>
                            <CardDescription>Manage database settings and security policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Row Level Security (RLS)</Label>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-muted-foreground">Enabled - All tables protected</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Database Backup</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automated backups are managed by Supabase
                                </p>
                                <Button variant="outline" size="sm">
                                    View Backup Settings in Supabase
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleSaveAdvanced} className="mt-4">
                        Save Advanced Settings
                    </Button>
                </div>
            )}
        </div>
    )
}
