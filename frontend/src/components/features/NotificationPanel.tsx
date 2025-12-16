import { useState, useRef, useEffect } from "react";
import { X, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";


interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Team Invite Accepted",
    message: "Jane Smith has accepted your team invite",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Hackathon Reminder",
    message: "AI Innovation Challenge starts in 2 hours",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Message",
    message: "You have a new message in Code Crusaders team chat",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Profile Incomplete",
    message: "Complete your profile to increase team match rate",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

function formatTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Calculate panel position based on bell icon
  useEffect(() => {
    if (isOpen && bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />,
          document.body
        )
      }


      {/* Notification Bell Button */}
      <Button
        ref={bellButtonRef}
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-blue-600"
          >
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      <div
        className={cn(
          "fixed w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] rounded-lg overflow-hidden transition-all duration-300 ease-out border border-border bg-background",
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible pointer-events-none"
        )}
        style={{
          top: `${panelPosition.top}px`,
          right: `${panelPosition.right}px`,
          transformOrigin: "top right",
          zIndex: 50,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b border-border"
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg bg-primary/10"
            >
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-bold text-xl">Notifications</h2>
            {unreadCount > 0 && (
              <span
                className="ml-1 px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(100vh-14rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div
                className="p-6 rounded-lg mb-4 bg-muted"
              >
                <Bell className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                We'll let you know when something happens
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-5 transition-all cursor-pointer group border-b border-border last:border-b-0",
                    !notification.read && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    {/* Notification Indicator */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-2.5 h-2.5 rounded-full mt-2",
                        !notification.read && "bg-primary"
                      )}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            className={cn(
                              "font-bold text-sm",
                              !notification.read && "text-primary"
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 rounded-lg text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2.5 font-medium">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            className="p-5 flex gap-3 border-t border-border"
          >
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-sm font-semibold rounded-lg"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm font-semibold rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
