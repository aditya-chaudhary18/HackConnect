import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { UserProfile } from "@/components/features/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HackathonCard } from "@/components/features/HackathonCard";
import { Edit, Share2, Settings, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileDialog } from "@/components/features/EditProfileDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileSkeleton } from "@/components/ui/page-skeleton";

/*
const mockUser = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  name: "John Doe",
  bio: "Full-stack developer passionate about Web3 and AI. Love building innovative solutions at hackathons.",
  skills: ["React", "TypeScript", "Python", "Node.js", "Solidity", "Machine Learning"],
  techStack: ["React", "Next.js", "TailwindCSS", "PostgreSQL", "AWS", "Docker"],
  githubUrl: "https://github.com/johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  portfolioUrl: "https://johndoe.dev",
  xp: 2450,
  level: 12,
  badges: [
    { id: "1", name: "First Hackathon", description: "Completed your first hackathon", icon: "🎉", earnedAt: new Date() },
    { id: "2", name: "Team Player", description: "Worked in 5+ teams", icon: "🤝", earnedAt: new Date() },
    { id: "3", name: "Winner", description: "Won a hackathon", icon: "🏆", earnedAt: new Date() },
    { id: "4", name: "Mentor", description: "Mentored other hackers", icon: "🧑‍🏫", earnedAt: new Date() },
  ],
  hackathonsParticipated: 15,
  hackathonsWon: 3,
  reputationScore: 98,
  createdAt: new Date("2023-01-15"),
};
*/

const projects = [
  {
    id: "1",
    title: "DecentraID",
    description: "Decentralized identity verification using blockchain",
    hackathon: "ETHGlobal Paris 2023",
    placement: "1st Place",
    techStack: ["Solidity", "React", "IPFS"],
  },
  {
    id: "2",
    title: "CodeReview AI",
    description: "AI-powered code review assistant for GitHub",
    hackathon: "AI Builders Hackathon",
    placement: "2nd Place",
    techStack: ["Python", "OpenAI", "GitHub API"],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: authUser, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const { profileQuery, hackathonQuery } = useProfile(id, authUser?.id, authUser);
  const viewedUser = profileQuery.data;
  const participatedHackathons = hackathonQuery.data || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleShare = async () => {
    if (!viewedUser) return;
    
    const url = `${window.location.origin}/profile/${viewedUser.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (profileQuery.isLoading || (!id && authLoading)) {
    return (
      <div className="p-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (profileQuery.isError || !viewedUser) return <div>User not found</div>;

  const isOwnProfile = !id || (authUser && authUser.id === viewedUser.id);

  return (
    <div className="p-8">
      {/* Header Actions */}
      <div className="flex justify-end gap-3 mb-6">
        <Button variant="outline" className="gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          Share Profile
        </Button>
        
        {isOwnProfile && (
          <>
            <EditProfileDialog user={viewedUser} />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

          {/* User Profile */}
          <UserProfile user={viewedUser} variant="full" />

          {/* Tabs */}
          <Tabs defaultValue="hackathons" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons">
              <div className="grid md:grid-cols-2 gap-4">
                {participatedHackathons.length > 0 ? (
                  participatedHackathons.map((hackathon: any) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} variant="compact" />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No hackathons participated yet.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <span className="text-sm font-medium text-primary">{project.placement}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <p className="text-xs text-muted-foreground mb-3">{project.hackathon}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Activity feed coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Logout Button */}
          {isOwnProfile && (
            <div className="mt-8 flex justify-end">
              <Button 
                variant="destructive" 
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          )}
        </div>
  );
}
