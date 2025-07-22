import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "./../../lib/supabaseClient"
import { Button } from "./../../components/ui/button"
import { Input } from "./../../components/ui/input"
import { Label } from "./../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../../components/ui/select"

interface LoginProps {
    setIsAuthenticated: (value: boolean) => void;
}

function LoginPage({ setIsAuthenticated }: LoginProps) {
    const [activeTab, setActiveTab] = useState("login")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [ngoId, setNgoId] = useState<string | null>(null)
    const [ngos, setNgos] = useState<{ id: string; name: string }[]>([])
    const [fspId, setFspId] = useState<string | null>(null)
    const [fsps, setFsps] = useState<{ id: string; name: string }[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNgos = async () => {
            const trySelect = async (table: string) => {
                const { data, error } = await supabase.from(table).select("id, name")
                if (error) {
                    // Postgres error 42P01 = undefined_table
                    if (error.code === "42P01") return null
                    console.error(`Error fetching from "${table}":`, error.message)
                    return null
                }
                return data
            }
            let results = await trySelect("ngo")
            setNgos(results || [])
        }
        const fetchFsps = async () => {
            const trySelect = async (table: string) => {
                const { data, error } = await supabase.from(table).select("id, name")
                if (error) {
                    // Postgres error 42P01 = undefined_table
                    if (error.code === "42P01") return null
                    console.error(`Error fetching from "${table}":`, error.message)
                    return null
                }
                return data
            }
            let results = await trySelect("fsp")
            setFsps(results || [])
        }
        fetchNgos()
        fetchFsps()

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true)
                navigate("/dashboard")
            }
        })

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true)
                navigate("/dashboard")
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [navigate, setIsAuthenticated])

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(error.message)
        } else {
            setIsAuthenticated(true)
            alert("Logged in successfully!")
            navigate("/dashboard")
        }
        setLoading(false)
    }

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                    ngo_id: ngoId,
                    fsp_id: fspId
                },
            },
        })

        if (error) {
            alert(error.message)
        } else if (data.user) {
            const { error: profileError } = await supabase.from("persons").insert({
                id: data.user.id,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                ngo_id: ngoId,
                fsp_id: fspId
            })

            if (profileError) {
                alert(`Signup successful, but person profile update failed: ${profileError.message}`)
            } else {
                setIsAuthenticated(true)
                console.log("Signed up successfully!")
                navigate("/dashboard")
            }
        }
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setPhoneNumber("")
        setFspId(null)
        setNgoId(null)
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        GeoFencing Portal
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Login or Sign up to access the portal
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <TabsTrigger
                                value="login"
                                className="py-2 font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="py-2 font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white transition"
                            >
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Tab */}
                        <TabsContent value="login" className="mt-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="login-email" className="w-32">
                                        Email
                                    </Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="login-password" className="w-32">
                                        Password
                                    </Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Link to="#" className="text-sm text-blue-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Sign Up Tab */}
                        <TabsContent value="signup" className="mt-4">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="first-name" className="w-32">
                                        First Name
                                    </Label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="last-name" className="w-32">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="signup-email" className="w-32">
                                        Email
                                    </Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="signup-password" className="w-32">
                                        Password
                                    </Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="confirm-password" className="w-32">
                                        Confirm
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="phone-number" className="w-32">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone-number"
                                        placeholder="123-456-789"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="fsp" className="w-32">
                                        FSP
                                    </Label>
                                    <Select onValueChange={setFspId} value={fspId || ""}>
                                        <SelectTrigger id="fsp" className="flex-1">
                                            <SelectValue placeholder="Select your FSP" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fsps.map((fsp) => (
                                                <SelectItem key={fsp.id} value={fsp.id}>
                                                    {fsp.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="ngo" className="w-32">
                                        NGO
                                    </Label>
                                    <Select onValueChange={setNgoId} value={ngoId || ""}>
                                        <SelectTrigger id="ngo" className="flex-1">
                                            <SelectValue placeholder="Select your NGO" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ngos.map((ngo) => (
                                                <SelectItem key={ngo.id} value={ngo.id}>
                                                    {ngo.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {loading ? "Signing up..." : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );


}

export default LoginPage;