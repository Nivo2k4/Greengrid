import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginError {
    field?: string;
    message: string;
}

const SimpleLogin: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LoginError | null>(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    // Validation function (currently unused but kept for future use)
    // const validateForm = (): boolean => {
    //     if (!formData.email) {
    //         setError({ field: 'email', message: 'Email is required' });
    //         return false;
    //     }
    //     if (!formData.email.includes('@')) {
    //         setError({ field: 'email', message: 'Please enter a valid email address' });
    //         return false;
    //     }
    //     if (!formData.password) {
    //         setError({ field: 'password', message: 'Password is required' });
    //         return false;
    //     }
    //     if (formData.password.length < 6) {
    //         setError({ field: 'password', message: 'Password must be at least 6 characters' });
    //         return false;
    //     }
    //     return true;
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({ message: 'This login is disabled. Please use the Firebase login page.' });
        return;
    };

    const handleTestBackend = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/health');
            const data = await response.json();
            console.log('✅ Backend Response:', data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('❌ Backend Error:', err);
            setError({ message: 'Backend connection failed. Please check if the server is running.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🌱</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            Welcome to GreenGrid
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Sign in to your account to manage your community's waste
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {error && !success && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        {formData.email ? 'Login successful! Redirecting...' : 'Backend connection successful!'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`pl-10 h-11 ${error?.field === 'email' ? 'border-red-300 focus:border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 h-11 ${error?.field === 'password' ? 'border-red-300 focus:border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    disabled={isLoading}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <div className="w-full flex items-center">
                                <div className="flex-1 border-t border-gray-200"></div>
                                <span className="px-3 text-sm text-gray-500">or</span>
                                <div className="flex-1 border-t border-gray-200"></div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleTestBackend}
                                className="w-full h-11 border-gray-200 hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    'Test Backend Connection'
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    className="text-green-600 hover:text-green-700 font-medium"
                                    onClick={() => window.location.hash = '#register'}
                                    disabled={isLoading}
                                >
                                    Sign up
                                </button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Backend: http://localhost:5000 • Frontend: http://localhost:3001</p>
                </div>
            </div>
        </div>
    );
};

export default SimpleLogin;