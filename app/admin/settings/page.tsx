'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Store, CreditCard, Bell, Shield, Globe,
    Save, RefreshCw
} from 'lucide-react'

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000))

        setLoading(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your store configuration and preferences
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Basic information about your store
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="store-name">Store Name</Label>
                                <Input
                                    id="store-name"
                                    placeholder="Abalawe Store"
                                    defaultValue="Abalawe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-email">Contact Email</Label>
                                <Input
                                    id="store-email"
                                    type="email"
                                    placeholder="contact@store.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-description">Store Description</Label>
                            <Textarea
                                id="store-description"
                                placeholder="Tell customers about your store..."
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="store-phone">Phone Number</Label>
                                <Input
                                    id="store-phone"
                                    type="tel"
                                    placeholder="+261 XX XXX XXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-address">Address</Label>
                                <Input
                                    id="store-address"
                                    placeholder="Store address"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            <CardTitle>Payment Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Configure payment gateways and options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded">
                                    <CreditCard className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">PayChangu</p>
                                    <p className="text-sm text-muted-foreground">Accept mobile money payments</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Active
                                </span>
                                <Button variant="outline" size="sm">Configure</Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="default-currency">Default Currency</Label>
                            <select
                                id="default-currency"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="MWK">MWK - Malawi Kwacha</option>
                                <option value="MWK">MWK - Malawian Kwacha</option>
                                <option value="ZMW">ZMW - Zambian Kwacha</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="tax-enabled"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                            />
                            <Label htmlFor="tax-enabled" className="font-normal cursor-pointer">
                                Enable tax calculation
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                            <Input
                                id="tax-rate"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue="16.5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Email & Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <CardTitle>Email & Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Control how you receive notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Order Notifications</p>
                                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Product Low Stock Alerts</p>
                                    <p className="text-sm text-muted-foreground">Alert when products run low</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Customer Sign-ups</p>
                                    <p className="text-sm text-muted-foreground">Notify about new customer registrations</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="smtp-host">SMTP Server</Label>
                            <Input
                                id="smtp-host"
                                placeholder="smtp.example.com"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="smtp-user">SMTP Username</Label>
                                <Input id="smtp-user" placeholder="user@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smtp-password">SMTP Password</Label>
                                <Input id="smtp-password" type="password" placeholder="••••••••" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle>Security Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Enhance your store&apos;s security
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Session Timeout</p>
                                <p className="text-sm text-muted-foreground">Currently: 30 minutes</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="force-https"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked
                            />
                            <Label htmlFor="force-https" className="font-normal cursor-pointer">
                                Force HTTPS for all connections
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* SEO & Marketing */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            <CardTitle>SEO & Marketing</CardTitle>
                        </div>
                        <CardDescription>
                            Optimize your store for search engines
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="site-title">Site Title</Label>
                            <Input
                                id="site-title"
                                placeholder="Abalawe - Your Store Name"
                                defaultValue="Abalawe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta-description">Meta Description</Label>
                            <Textarea
                                id="meta-description"
                                placeholder="Describe your store for search engines..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta-keywords">Meta Keywords</Label>
                            <Input
                                id="meta-keywords"
                                placeholder="ecommerce, products, shop"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="google-analytics">Google Analytics ID</Label>
                            <Input
                                id="google-analytics"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save All Settings
                            </>
                        )}
                    </Button>
                    {saved && (
                        <span className="text-sm text-green-600 font-medium">
                            ✓ Settings saved successfully
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}
