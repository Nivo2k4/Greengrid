import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff, Mail, Lock, Leaf } from "lucide-react";
import { useRouter } from "./RouterProvider";
import { useAuth } from "./AuthProvider";

const LoginPage = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { navigate } = useRouter();
  const { login, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("dashboard");
    } catch (e: any) {
      setError(e.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Login Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to GreenGrid</CardTitle>
          <p>Sign in to access your waste management dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{ marginTop: "4px" }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>

            {/* Error Message */}
            {error && (
              <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              style={{ marginTop: "16px" }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
LoginPage.displayName = "LoginPage";
export default LoginPage;
