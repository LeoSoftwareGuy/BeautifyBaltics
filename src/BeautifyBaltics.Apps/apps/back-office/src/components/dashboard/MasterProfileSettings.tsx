import { useState } from 'react';
import {
  Button, Card, CardSection, Input, InputLabel, Paper, Text, Textarea,
} from '@mantine/core';
import { Save, Upload } from 'lucide-react';

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

function MasterProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    bio: 'Professional barber with over 10 years of experience specializing in classic and modern haircuts.',
    specialties: 'Haircuts, Beard Trims, Hot Towel Shaves',
    experience: '10 years',
    address: '123 Main Street',
    city: 'New York',
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving profile:', profile);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardSection>
          <Text>Profile Photo</Text>
          <Text>Upload a professional photo for your profile</Text>
        </CardSection>
        <Paper>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </Paper>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardSection>
          <Text>Personal Information</Text>
          <Text>Update your personal details</Text>
        </CardSection>
        <Paper className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <InputLabel htmlFor="firstName">First Name</InputLabel>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <InputLabel htmlFor="lastName">Last Name</InputLabel>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <InputLabel htmlFor="phone">Phone Number</InputLabel>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>
        </Paper>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardSection>
          <Text>Professional Information</Text>
          <Text>Tell clients about your expertise</Text>
        </CardSection>
        <Paper className="space-y-4">
          <div className="space-y-2">
            <InputLabel htmlFor="bio">Bio</InputLabel>
            <Textarea
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell clients about yourself and your experience..."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <InputLabel htmlFor="specialties">Specialties</InputLabel>
              <Input
                id="specialties"
                value={profile.specialties}
                onChange={(e) => handleChange('specialties', e.target.value)}
                placeholder="e.g., Haircuts, Coloring, Styling"
              />
            </div>
            <div className="space-y-2">
              <InputLabel htmlFor="experience">Years of Experience</InputLabel>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>
        </Paper>
      </Card>

      {/* Location */}
      <Card>
        <CardSection>
          <Text>Location</Text>
          <Text>Where clients can find you</Text>
        </CardSection>
        <Paper className="space-y-4">
          <div className="space-y-2">
            <InputLabel htmlFor="address">Address</InputLabel>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <InputLabel htmlFor="city">City</InputLabel>
            <Input
              id="city"
              value={profile.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
        </Paper>
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
}

export default MasterProfileSettings;
