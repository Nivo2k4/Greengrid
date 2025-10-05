import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, Users, Leaf } from 'lucide-react';
import { useRouter } from './RouterProvider';
import { useAuth } from './AuthProvider';

const RegisterPage = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeToTerms: false,
    emailNotifications: true,
    smsNotifications: false,
    communityUpdates: true,
    dataProcessing: false
  });
  const [error, setError] = useState('');
  const { navigate } = useRouter();
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }
    if (!formData.dataProcessing) {
      setError('Please consent to data processing');
      return;
    }
    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    try {
      const success = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'resident' | 'community-leader',
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        communityUpdates: formData.communityUpdates
      });

      if (success) {
        navigate('dashboard');
      }
      // If register throws an error, it will be caught below
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      text: "Real-time waste collection tracking"
    },
    {
      icon: <Users className="w-5 h-5 text-green-600" />,
      text: "Connect with your community"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      text: "Report issues and get quick responses"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Register Card */}
        <Card className="lg:col-span-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your GreenGrid Account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Join us in building a cleaner community
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name 👤
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address ✉️
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password 🔒
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password 🔒
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Resident
                      </div>
                    </SelectItem>
                    <SelectItem value="community-leader">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Community Leader
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                  className="mt-1 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  ✅ I agree to the{' '}
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                    onClick={() => console.log('Terms clicked')}
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                    onClick={() => console.log('Privacy clicked')}
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              {/* Data Processing Consent */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataProcessing"
                  checked={formData.dataProcessing}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, dataProcessing: checked as boolean }))
                  }
                  className="mt-1 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="dataProcessing" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  🔒 I consent to the processing of my personal data for account management and service delivery *
                </Label>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">📧 Notification Preferences</h4>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, emailNotifications: checked as boolean }))
                    }
                    className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="emailNotifications" className="text-sm text-gray-600 dark:text-gray-400">
                    📧 Receive email notifications about waste collection updates
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, smsNotifications: checked as boolean }))
                    }
                    className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="smsNotifications" className="text-sm text-gray-600 dark:text-gray-400">
                    📱 Receive SMS notifications for urgent updates
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="communityUpdates"
                    checked={formData.communityUpdates}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, communityUpdates: checked as boolean }))
                    }
                    className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="communityUpdates" className="text-sm text-gray-600 dark:text-gray-400">
                    🌱 Receive community updates and sustainability tips
                  </Label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create GreenGrid Account'
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('login')}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-2">
              Why Join GreenGrid?
            </CardTitle>
            <p className="text-green-100 text-sm">
              Be part of the sustainable future
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                  {benefit.icon}
                </div>
                <p className="text-sm text-green-50 leading-relaxed">
                  {benefit.text}
                </p>
              </div>
            ))}

            <div className="pt-4 border-t border-green-500/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10,000+</div>
                <div className="text-green-100 text-xs">Active Community Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

RegisterPage.displayName = 'RegisterPage';

export { RegisterPage };
