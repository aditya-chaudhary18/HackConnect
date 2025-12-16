import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/features/HackathonCard";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";

export default function MyHackathons() {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyHackathons = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
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
            setHackathons(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch my hackathons", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyHackathons();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Hackathons</h1>
        </div>
        <p className="text-muted-foreground">
          Manage and track all the hackathons you are participating in.
        </p>
      </div>

      {/* Content */}
      {hackathons.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/30">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Hackathons Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven't registered for any hackathons yet. Explore upcoming events and join the competition!
          </p>
          <Link to="/explore">
            <Button size="lg" className="gap-2">
              <Calendar className="h-4 w-4" />
              Explore Hackathons
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
