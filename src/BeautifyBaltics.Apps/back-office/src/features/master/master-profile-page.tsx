import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Star, MapPin, Phone, Mail, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MasterProfile = () => {
  const { masterId } = useParams({ from: '/master/$masterId' });
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Mock data - in real app, fetch based on id
  const master = {
    id: Number(masterId),
    name: "Elena's Barbershop",
    category: "Barber",
    rating: 4.9,
    reviews: 127,
    price: "$$",
    priceValue: 35,
    image: "/placeholder.svg",
    location: { lat: 40.7128, lng: -74.006 },
    address: "123 Main Street, Downtown Manhattan, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "elena@barbershop.com",
    bio: "With over 10 years of experience, Elena specializes in modern haircuts, classic styles, and beard grooming. Her attention to detail and passion for the craft has made her one of the most sought-after barbers in Manhattan.",
    portfolio: [
      { id: 1, url: "/placeholder.svg", alt: "Haircut style 1" },
      { id: 2, url: "/placeholder.svg", alt: "Haircut style 2" },
      { id: 3, url: "/placeholder.svg", alt: "Haircut style 3" },
      { id: 4, url: "/placeholder.svg", alt: "Haircut style 4" },
      { id: 5, url: "/placeholder.svg", alt: "Haircut style 5" },
      { id: 6, url: "/placeholder.svg", alt: "Haircut style 6" },
    ],
    services: [
      { id: 1, name: "Men's Haircut", duration: "45 min", price: 35 },
      { id: 2, name: "Beard Trim", duration: "30 min", price: 20 },
      { id: 3, name: "Haircut + Beard", duration: "60 min", price: 50 },
      { id: 4, name: "Hot Towel Shave", duration: "40 min", price: 40 },
      { id: 5, name: "Hair Color", duration: "90 min", price: 80 },
    ],
    availableSlots: [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ],
  };

  const handleBooking = () => {
    if (selectedTimeSlot && selectedDate) {
      setIsBookingDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/explore' })}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <a href="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
              BeautySpot
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            <img
              src={master.image}
              alt={master.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Master Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{master.category}</Badge>
                <Badge variant="outline">{master.price}</Badge>
              </div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                {master.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{master.rating}</span>
                  <span>({master.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{master.bio}</p>
            </div>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{master.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${master.phone}`} className="hover:text-primary transition-colors">
                    {master.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${master.email}`} className="hover:text-primary transition-colors">
                    {master.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <section className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {master.portfolio.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-muted hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Services & Pricing */}
        <section className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            Services & Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {master.services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <span className="text-xl font-bold text-primary">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Booking Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            Book an Appointment
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Select Date
                </CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a date first"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {master.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className="h-12"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  disabled={!selectedTimeSlot || !selectedDate}
                  onClick={handleBooking}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review your appointment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{selectedDate?.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">{selectedTimeSlot}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{master.name}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => {
              setIsBookingDialogOpen(false);
              // Handle booking confirmation
            }}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterProfile;
