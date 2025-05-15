
import { useState } from "react";
import { Bell, Search, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const DashboardHeader = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const clearNotifications = () => {
    setUnreadNotifications(0);
    toast.success("All notifications marked as read");
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages and meetings..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto py-0 px-2 text-xs"
                      onClick={clearNotifications}
                    >
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="font-medium">Meeting in 15 minutes</span>
                  <span className="text-xs text-slate-500 block">Weekly team sync</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="font-medium">3 new Slack messages</span>
                  <span className="text-xs text-slate-500 block">From Sarah in #project-alpha</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="font-medium">Important email from client</span>
                  <span className="text-xs text-slate-500 block">Needs response today</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Integrations</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-semibold">
            ME
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
