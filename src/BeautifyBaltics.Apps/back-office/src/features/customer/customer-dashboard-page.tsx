import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, User, ArrowLeft } from "lucide-react";
import { Link } from '@tanstack/react-router';

interface Booking {
  id: string;
  masterName: string;
  masterPhoto: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
}

const mockBookings: Booking[] = [
  {
    id: "1",
    masterName: "Maria Santos",
    masterPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    service: "Haircut & Styling",
    date: "2024-12-15",
    time: "14:00",
    location: "123 Beauty Ave, Downtown",
    price: 85,
    status: "upcoming",
  },
  {
    id: "2",
    masterName: "Alex Rivera",
    masterPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    service: "Tattoo Session",
    date: "2024-12-20",
    time: "10:00",
    location: "456 Art Studio, Midtown",
    price: 250,
    status: "upcoming",
  },
  {
    id: "3",
    masterName: "Sofia Chen",
    masterPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    service: "Manicure & Pedicure",
    date: "2024-11-28",
    time: "16:00",
    location: "789 Nail Salon, Eastside",
    price: 65,
    status: "completed",
  },
  {
    id: "4",
    masterName: "James Wilson",
    masterPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    service: "Beard Trim",
    date: "2024-11-15",
    time: "11:00",
    location: "321 Barber Shop, Westend",
    price: 35,
    status: "completed",
  },
  {
    id: "5",
    masterName: "Emma Thompson",
    masterPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    service: "Hair Coloring",
    date: "2024-11-10",
    time: "09:00",
    location: "555 Color Studio, Central",
    price: 150,
    status: "cancelled",
  },
];

const CustomerDashboard = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  const filteredBookings = mockBookings
    .filter((booking) => filter === "all" || booking.status === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.price - a.price;
    });

  const upcomingCount = mockBookings.filter((b) => b.status === "upcoming").length;
  const completedCount = mockBookings.filter((b) => b.status === "completed").length;

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/explore">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground text-sm">Manage your appointments</p>
            </div>
          </div>
          <Link to="/explore">
            <Button>Book New Appointment</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Upcoming</p>
                  <p className="text-3xl font-semibold text-foreground">{upcomingCount}</p>
                </div>
                <Calendar className="h-10 w-10 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-3xl font-semibold text-foreground">{completedCount}</p>
                </div>
                <Clock className="h-10 w-10 text-green-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <p className="text-3xl font-semibold text-foreground">
                    ${mockBookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.price, 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">$</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="flex-1">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={booking.masterPhoto}
                      alt={booking.masterName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{booking.service}</h3>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <User className="h-3 w-3" />
                            <span>{booking.masterName}</span>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-semibold text-foreground">${booking.price}</p>
                      {booking.status === "upcoming" && (
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
