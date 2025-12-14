import { useState } from "react";
import { useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Scissors } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'master'>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just route based on selected role (no actual auth)
    if (selectedRole === 'master') {
      navigate({ to: '/master-dashboard' });
    } else {
      navigate({ to: '/explore' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                
                <div className="space-y-3">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={selectedRole === "customer" ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setSelectedRole("customer")}
                    >
                      <UserCircle className="h-6 w-6" />
                      <span>Customer</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === "master" ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setSelectedRole("master")}
                    >
                      <Scissors className="h-6 w-6" />
                      <span>Master</span>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required />
                </div>
                
                <div className="space-y-3">
                  <Label>I want to be a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={selectedRole === "customer" ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setSelectedRole("customer")}
                    >
                      <UserCircle className="h-6 w-6" />
                      <span>Customer</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === "master" ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setSelectedRole("master")}
                    >
                      <Scissors className="h-6 w-6" />
                      <span>Master</span>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
