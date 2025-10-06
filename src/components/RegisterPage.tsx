import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "./RouterProvider";
import { useAuth } from "./AuthProvider";

const RegisterPage = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "resident",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const { navigate } = useRouter();
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    if (!formData.role) {
      setError("Please select your role.");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate("dashboard");
    } catch (e: any) {
      setError(e.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Register Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your GreenGrid Account</CardTitle>
          <p>Join us in building a cleaner community</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />

            {/* Email Field */}
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />

            {/* Password Field */}
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <Button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>

            {/* Confirm Password Field */}
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <Button type="button" onClick={() => setShowConfirmPassword((s) => !s)}>
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </Button>

            {/* Role Selection */}
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="community-leader">Community Leader</SelectItem>
              </SelectContent>
            </Select>

            {/* Terms Checkbox */}
            <Label htmlFor="agreeToTerms">
            <Checkbox
              id="agreeToTerms"
              name="agreeToTerms"
              checked={!!formData.agreeToTerms}
              // The value from onCheckedChange may be boolean, or may be 'indeterminate' (null for Radix UI)
                onCheckedChange={(checked: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: Boolean(checked),
                  }))
                }
              disabled={isLoading}
            />{" "}
              I agree to the Terms & Conditions
            </Label>

            {/* Error Message */}
            {error && (
              <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              style={{ marginTop: "16px" }}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
RegisterPage.displayName = "RegisterPage";
export default RegisterPage;
