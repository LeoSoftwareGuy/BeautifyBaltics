import { useState } from "react";
import { Save, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string;
  experience: string;
  address: string;
  city: string;
}

const MasterProfileSettings = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    bio: "Professional barber with over 10 years of experience specializing in classic and modern haircuts.",
    specialties: "Haircuts, Beard Trims, Hot Towel Shaves",
    experience: "10 years",
    address: "123 Main Street",
    city: "New York",
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log("Saving profile:", profile);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload a professional photo for your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Tell clients about your expertise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell clients about yourself and your experience..."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                value={profile.specialties}
                onChange={(e) => handleChange("specialties", e.target.value)}
                placeholder="e.g., Haircuts, Coloring, Styling"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Where clients can find you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default MasterProfileSettings;
