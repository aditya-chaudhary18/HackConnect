import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchAllHackathons() {
  const res = await fetch(`${API_URL}/hackathons`);
  if (!res.ok) throw new Error("Failed to load hackathons");
  return res.json();
}

async function fetchUserHackathons(userId: string) {
  const res = await fetch(`${API_URL}/users/${userId}/hackathons`);
  if (!res.ok) throw new Error("Failed to load user hackathons");
  return res.json();
}

export function useDashboardData() {
  const { user, isLoading: isAuthLoading } = useAuth();

  // 1. Fetch All Hackathons (Cached for 5 mins)
  const allHackathonsQuery = useQuery({
    queryKey: ["hackathons", "all"],
    queryFn: fetchAllHackathons,
    staleTime: 1000 * 60 * 5, 
  });

  // 2. Fetch User Hackathons (Cached for 5 mins)
  const myHackathonsQuery = useQuery({
    queryKey: ["hackathons", "user", user?.id],
    queryFn: () => fetchUserHackathons(user!.id),
    enabled: !!user?.id, // Only run if user is logged in
    staleTime: 1000 * 60 * 5,
  });

  return { 
    allHackathons: allHackathonsQuery.data?.documents || [],
    myHackathons: myHackathonsQuery.data?.hackathons || [],
    isLoading: isAuthLoading || allHackathonsQuery.isLoading || (!!user && myHackathonsQuery.isLoading),
    isError: allHackathonsQuery.isError
  };
}
