import { Users, UserCheck, Activity, DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalMasters: 156,
    totalUsers: 2_847,
    dailyActiveUsers: 423,
    avgRevenuePerMaster: 1_250,
    lowestRevenue: 120,
    highestRevenue: 8_450,
  };

  const topMasters = [
    { id: 1, name: "Anna Smith", specialty: "Hair Styling", clients: 89, revenue: 8_450 },
    { id: 2, name: "John Davis", specialty: "Barbering", clients: 76, revenue: 6_230 },
    { id: 3, name: "Maria Garcia", specialty: "Nail Art", clients: 64, revenue: 5_120 },
    { id: 4, name: "Alex Johnson", specialty: "Tattoo", clients: 45, revenue: 4_890 },
    { id: 5, name: "Sarah Wilson", specialty: "Makeup", clients: 58, revenue: 4_210 },
  ];

  const recentActivity = [
    { id: 1, event: "New master registered", name: "Emma Brown", time: "2 hours ago" },
    { id: 2, event: "New booking", name: "Client → Anna Smith", time: "3 hours ago" },
    { id: 3, event: "New user signup", name: "Michael Lee", time: "4 hours ago" },
    { id: 4, event: "Booking completed", name: "Client → John Davis", time: "5 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform analytics and management</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Masters</CardTitle>
              <UserCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMasters.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Service providers on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailyActiveUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active today</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Revenue/Master</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgRevenuePerMaster.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lowest Revenue</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.lowestRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.highestRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Masters Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Masters</CardTitle>
              <CardDescription>Ranked by monthly revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead className="text-right">Clients</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topMasters.map((master) => (
                    <TableRow key={master.id}>
                      <TableCell className="font-medium">{master.name}</TableCell>
                      <TableCell className="text-muted-foreground">{master.specialty}</TableCell>
                      <TableCell className="text-right">{master.clients}</TableCell>
                      <TableCell className="text-right">${master.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{activity.event}</p>
                      <p className="text-sm text-muted-foreground">{activity.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
