import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchUserData(userId: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = await res.json();

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    name: data.name,
    role: data.role || "participant",
    avatar: data.avatar_url,
    bio: data.bio,
    skills: data.skills || [],
    techStack: data.tech_stack || [],
    githubUrl: data.github_url,
    portfolioUrl: data.portfolio_url,
    xp: data.xp || 0,
    level: Math.floor((data.xp || 0) / 1000) + 1,
    badges: [],
    hackathonsParticipated: data.hackathons_participated || 0,
    hackathonsWon: data.hackathons_won || 0,
    reputationScore: data.reputation_score || 0,
    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
  };
}

async function fetchUserHackathons(userId: string) {
  const res = await fetch(`${API_URL}/users/${userId}/hackathons`);
  if (!res.ok) throw new Error("Failed to fetch hackathons");
  const data = await res.json();
  
  if (data.success && data.hackathons) {
    return data.hackathons.map((h: any) => ({
      id: h.$id || h.id,
      title: h.name,
      shortDescription: h.tagline || h.description?.substring(0, 100) || "",
      coverImage: h.image_url || "https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1200&auto=format&fit=crop",
      startDate: new Date(h.start_date),
      location: { type: h.mode === 'online' ? 'online' : 'in-person', city: h.location },
      totalPrizePool: parseInt(h.prize_pool) || 0,
      currency: "USD",
      status: h.status,
      my_team: h.my_team
    }));
  }
  return [];
}

export function useProfile(userId: string | undefined, authUserId: string | undefined) {
  // Determine which ID to use (URL param or Logged in User)
  const targetId = userId || authUserId;

  const profileQuery = useQuery({
    queryKey: ["user", targetId],
    queryFn: () => fetchUserData(targetId!),
    enabled: !!targetId, // Only run if we have an ID
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes (NO RE-FETCHING)
  });

  const hackathonQuery = useQuery({
    queryKey: ["user-hackathons", targetId],
    queryFn: () => fetchUserHackathons(targetId!),
    enabled: !!targetId,
    staleTime: 1000 * 60 * 5, 
  });

  return { profileQuery, hackathonQuery };
}
