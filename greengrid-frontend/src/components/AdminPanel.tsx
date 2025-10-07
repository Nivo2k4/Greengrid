import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Trash2,
  Edit,
  Save,
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

interface NewLeaderForm {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  bio: string;
}

interface Leader {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt?: string;
}

export const AdminPanel: React.FC = () => {
  const { user, register } = useAuth();
  const [activeTab, setActiveTab] = useState("leaders");
  const [isAddingLeader, setIsAddingLeader] = useState(false);
  const [newLeader, setNewLeader] = useState<NewLeaderForm>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [error, setError] = useState("");

  // Only allow admin access
  if (!user || user.role !== "community-leader") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need community leader privileges to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch leaders from Firestore
  const fetchLeaders = async () => {
    const q = query(collection(db, "users"), where("role", "==", "community-leader"));
    const querySnapshot = await getDocs(q);
    setLeaders(
      querySnapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...docSnap.data(),
      })) as Leader[]
    );
  };

  useEffect(() => {
    fetchLeaders();
  }, [isAddingLeader]); // Refresh list after adding leader

  const handleAddLeader = async () => {
    setError("");
    if (!newLeader.fullName || !newLeader.email || !newLeader.password) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      await register({
        fullName: newLeader.fullName,
        email: newLeader.email,
        password: newLeader.password,
        role: "community-leader",
      });
      setNewLeader({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        bio: "",
      });
      setIsAddingLeader(false);
      fetchLeaders();
    } catch (e: any) {
      setError(e.message || "Error adding leader.");
    }
  };

  const handleRemoveLeader = async (uid: string) => {
    if (
      window.confirm("Are you sure you want to remove this community leader? This cannot be undone.")
    ) {
      await deleteDoc(doc(db, "users", uid));
      fetchLeaders();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage community leaders and system settings
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaders" className="gap-2">
              <Users className="w-4 h-4" /> Leaders
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UserPlus className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* LEADERS TAB */}
          <TabsContent value="leaders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Community Leaders</h2>
              <Button onClick={() => setIsAddingLeader(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Add Leader
              </Button>
            </div>
            {isAddingLeader && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Add New Community Leader
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingLeader(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name *</label>
                      <Input
                        value={newLeader.fullName}
                        onChange={(e) =>
                          setNewLeader({ ...newLeader, fullName: e.target.value })
                        }
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        value={newLeader.email}
                        onChange={(e) =>
                          setNewLeader({ ...newLeader, email: e.target.value })
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Password *</label>
                      <Input
                        type="password"
                        value={newLeader.password}
                        onChange={(e) =>
                          setNewLeader({ ...newLeader, password: e.target.value })
                        }
                        placeholder="Secure password"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <Input
                        value={newLeader.phone}
                        onChange={(e) =>
                          setNewLeader({ ...newLeader, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input
                        value={newLeader.location}
                        onChange={(e) =>
                          setNewLeader({ ...newLeader, location: e.target.value })
                        }
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  <label className="text-sm font-medium mb-2 block">Bio</label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none h-24"
                    value={newLeader.bio}
                    onChange={(e) =>
                      setNewLeader({ ...newLeader, bio: e.target.value })
                    }
                    placeholder="Brief description of their role and experience..."
                  />
                  {error && <div style={{ color: "red" }}>{error}</div>}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddLeader} className="gap-2">
                      <Save className="w-4 h-4" /> Add Leader
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingLeader(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {leaders.map((leader) => (
                <Card key={leader.email}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {leader.fullName?.[0]?.toUpperCase() || "L"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{leader.fullName}</h3>
                            <p className="text-muted-foreground">{leader.role}</p>
                          </div>
                          <div className="flex gap-2">
                            {/* Edit and Remove buttons if needed */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveLeader(leader.uid)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{leader.email}</span>
                          </div>
                          {leader.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{leader.phone}</span>
                            </div>
                          )}
                          {leader.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{leader.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Joined {leader.createdAt?.slice(0, 10)}</span>
                          </div>
                        </div>
                        {leader.bio && (
                          <p className="text-sm text-muted-foreground mt-3">{leader.bio}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management features will be implemented here.
                  This would include viewing all registered users, managing their roles,
                  and handling user-related administrative tasks.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  System configuration options will be available here, including community settings, notification preferences, and other administrative configurations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
