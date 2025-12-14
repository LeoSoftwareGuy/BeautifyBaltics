import { useState } from "react";
import { Calendar as CalendarIcon, Clock, DollarSign, Users, Image, Settings, Plus, Trash2 } from "lucide-react";
import MasterProfileSettings from "@/components/dashboard/MasterProfileSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MasterDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<{ [key: string]: string[] }>({
    [new Date().toDateString()]: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  });
  const [newSlotTime, setNewSlotTime] = useState("");

  const mockBookings = [
    { id: 1, client: "Sarah Johnson", service: "Haircut", time: "10:00 AM", date: "Today", status: "confirmed" },
    { id: 2, client: "Mike Brown", service: "Beard Trim", time: "2:00 PM", date: "Today", status: "confirmed" },
    { id: 3, client: "Emma Davis", service: "Hair Color", time: "11:00 AM", date: "Tomorrow", status: "pending" },
  ];

  const mockStats = [
    { label: "Today's Bookings", value: "5", icon: CalendarIcon, color: "text-blue-500" },
    { label: "This Week", value: "23", icon: Clock, color: "text-green-500" },
    { label: "Revenue", value: "$1,250", icon: DollarSign, color: "text-purple-500" },
    { label: "Total Clients", value: "127", icon: Users, color: "text-orange-500" },
  ];

  const handleAddTimeSlot = () => {
    if (!selectedDate || !newSlotTime) return;
    
    const dateKey = selectedDate.toDateString();
    const currentSlots = timeSlots[dateKey] || [];
    
    if (!currentSlots.includes(newSlotTime)) {
      setTimeSlots({
        ...timeSlots,
        [dateKey]: [...currentSlots, newSlotTime].sort(),
      });
      setNewSlotTime("");
    }
  };

  const handleDeleteTimeSlot = (time: string) => {
    if (!selectedDate) return;
    
    const dateKey = selectedDate.toDateString();
    const currentSlots = timeSlots[dateKey] || [];
    
    setTimeSlots({
      ...timeSlots,
      [dateKey]: currentSlots.filter(slot => slot !== time),
    });
  };

  const selectedDateSlots = selectedDate ? timeSlots[selectedDate.toDateString()] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Master Dashboard</h1>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Manage your appointments and client bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{booking.client}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{booking.time}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose a date to manage time slots</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slots Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Time Slots</CardTitle>
                  <CardDescription>
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Select a date'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Time Slot */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="time-slot">Add Time Slot</Label>
                      <Input
                        id="time-slot"
                        type="time"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        placeholder="09:00"
                      />
                    </div>
                    <Button 
                      onClick={handleAddTimeSlot}
                      disabled={!selectedDate || !newSlotTime}
                      className="mt-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Time Slots List */}
                  <div className="space-y-2">
                    <Label>Available Slots ({selectedDateSlots.length})</Label>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {selectedDateSlots.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No time slots available</p>
                        </div>
                      ) : (
                        selectedDateSlots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{slot}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTimeSlot(slot)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your work to attract more clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Image className="h-12 w-12 mx-auto opacity-50" />
                    <p>Portfolio management coming soon</p>
                    <Button>Upload Images</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <MasterProfileSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MasterDashboard;
