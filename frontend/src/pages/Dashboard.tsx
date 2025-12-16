import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HackathonCard } from "@/components/features/HackathonCard";
import { TeamCard } from "@/components/features/TeamCard";
import { useAuth } from "@/hooks/useAuth";
import { useHackathons } from "@/hooks/useHackathons";
import {
  Calendar,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Bell,
  Clock,
  TrendingUp,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const myTeam = {
  id: "1",
  name: "Code Crusaders",
  members: [
    { userId: "1", username: "johndoe", name: "John Doe", role: "leader" as const, skills: ["React", "TypeScript"], joinedAt: new Date() },
    { userId: "2", username: "janedoe", name: "Jane Smith", role: "member" as const, skills: ["Python", "ML"], joinedAt: new Date() },
    { userId: "3", username: "bobsmith", name: "Bob Smith", role: "member" as const, skills: ["Design", "UI/UX"], joinedAt: new Date() },
  ],
  maxSize: 4,
  techStack: ["React", "Python", "TensorFlow"],
  status: "competing" as const,
};

const recentActivity = [
  { id: 1, type: "team_join", message: "Jane Smith joined your team", time: "2 hours ago", icon: Users },
  { id: 2, type: "hackathon_start", message: "AI Innovation Challenge starts tomorrow", time: "5 hours ago", icon: Calendar },
  { id: 3, type: "message", message: "New message in Code Crusaders", time: "1 day ago", icon: MessageSquare },
  { id: 4, type: "xp_earned", message: "You earned 150 XP", time: "2 days ago", icon: Zap },
];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { fetchHackathons } = useHackathons();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [myHackathons, setMyHackathons] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 initially
  const isOrganizer = user?.role === 'organizer';

  useEffect(() => {
    const loadHackathons = async () => {
      const result = await fetchHackathons();
      if (result.success) {
        setHackathons(result.data);
      }
    };
    loadHackathons();
  }, [fetchHackathons]);

  useEffect(() => {
    const fetchMyHackathons = async () => {
      if (!user?.id) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
        const response = await fetch(`${API_URL}/users/${user.id}/hackathons`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.hackathons) {
            const mapped = data.hackathons.map((h: any) => ({
              id: h.$id || h.id,
              title: h.name,
              shortDescription: h.tagline || h.description?.substring(0, 100) || "",
              coverImage: h.image_url || "https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1200&auto=format&fit=crop",
              startDate: new Date(h.start_date),
              location: { type: h.mode === 'online' ? 'online' : 'in-person', city: h.location },
              totalPrizePool: parseInt(h.prize_pool) || 0,
              currency: "USD",
              status: h.status,
            }));
            setMyHackathons(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch my hackathons", error);
      }
    };
    fetchMyHackathons();
  }, [user]);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const mappedHackathons = hackathons.map((h) => ({
    id: h.$id || h.id, // Appwrite uses $id
    title: h.name,
    shortDescription: h.description,
    coverImage: h.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80",
    startDate: new Date(h.start_date),
    location: { type: "hybrid" as const, city: h.location },
    totalPrizePool: parseInt(h.prize_pool || "0"),
    currency: "USD",
    status: new Date(h.end_date) < new Date() ? "ended" : new Date(h.start_date) > new Date() ? "upcoming" : "ongoing",
    organizer_id: h.organizer_id,
  }));

  const managedHackathons = mappedHackathons.filter(h => h.organizer_id === user?.id);
  // If no managed hackathons (e.g. new organizer), maybe show empty state or all for demo?
  // For now, let's use managedHackathons if available, otherwise empty.
  
  // For participant view, show all as upcoming/recommended
  const upcomingHackathons = mappedHackathons;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isOrganizer) {
    return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Organizer {user?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-muted-foreground">Manage your hackathons and community</p>
          </div>
          <div className="flex items-center gap-3">
            
            <Link to="/create-hackathon">
              <Button variant="neon">
                <Zap className="h-4 w-4 mr-2" />
                Create Hackathon
              </Button>
            </Link>
          </div>
        </div>

        {/* Organizer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Hackathons</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold neon-text">1,240</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Managed Hackathons */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Managed Hackathons</h2>
                <Link to="/my-hackathons">
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {managedHackathons.slice(0, visibleCount).length > 0 ? (
                  managedHackathons.slice(0, visibleCount).map((hackathon) => (
                    <HackathonCard 
                      key={hackathon.id}
                      hackathon={hackathon as any} 
                      variant="compact" 
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No hackathons created yet.
                  </div>
                )}
              </div>
              {managedHackathons.length > visibleCount && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={handleViewMore}>
                    View More
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">New participant joined Web3 Summit</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      10 mins ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">New question in General channel</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      1 hour ago
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/create-hackathon" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Create Hackathon
                  </Button>
                </Link>
                <Link to="/manage-participants" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Participants
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Hacker"}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your hackathons</p>
        </div>
        <div className="flex items-center gap-3">
          
          <Link to="/explore">
            <Button variant="neon">
              Find Hackathons
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Hackathons</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold neon-text">{user?.xp?.toLocaleString() || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hackathons Won</p>
                    <p className="text-2xl font-bold">{user?.hackathonsWon || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6"> as any
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="text-2xl font-bold">{myTeam.members.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Hackathons */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Hackathons</h2>
                  <Link to="/my-hackathons">
                    <Button variant="ghost" size="sm" className="group">
                      View All
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {myHackathons.length > 0 ? (
                    myHackathons.slice(0, visibleCount).map((hackathon) => (
                      <HackathonCard key={hackathon.id} hackathon={hackathon as any} variant="compact" />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                      <p className="mb-2">You haven't joined any hackathons yet.</p>
                      <Link to="/explore">
                        <Button variant="link" className="text-primary">Explore Hackathons</Button>
                      </Link>
                    </div>
                  )}
                </div>
                {myHackathons.length > visibleCount && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={handleViewMore}>
                      View More
                    </Button>
                  </div>
                )}
              </section>

              {/* My Team */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Team</h2>
                  <Link to="/teams">
                    <Button variant="ghost" size="sm" className="group">
                      Manage Team
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <Card variant="neon">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{myTeam.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {myTeam.members.length}/{myTeam.maxSize} members
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {myTeam.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {myTeam.members.map((member, i) => (
                          <Avatar
                            key={member.userId}
                            className="h-10 w-10 border-2 border-card"
                            style={{ zIndex: myTeam.members.length - i }}
                          >
                            <AvatarFallback className="bg-muted text-sm">
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center text-primary">
                          +
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {myTeam.techStack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Recommended For You */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Recommended For You</h2>
                  </div>
                  <Link to="/explore">
                    <Button variant="ghost" size="sm" className="group">
                      Explore
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingHackathons.slice(0, 4).map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon as any} />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/teams/lobby" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Find Teammates
                    </Button>
                  </Link>
                  <Link to="/explore" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Browse Hackathons
                    </Button>
                  </Link>
                  <Link to="/chat" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Team Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Level Progress */}
              <Card variant="neon">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">12</span>
                    </div>
                    <div>
                      <p className="font-semibold">Level 12</p>
                      <p className="text-sm text-muted-foreground">Rising Star</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2,450 XP</span>
                      <span className="text-muted-foreground">3,000 XP</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-primary animate-pulse-neon" />
                    </div>
                    <p className="text-xs text-muted-foreground">550 XP to Level 13</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  );
}
