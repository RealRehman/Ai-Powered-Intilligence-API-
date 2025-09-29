import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Brain,
  Home,
  History,
  Bookmark,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  LogOut,
  FileText,
  Lightbulb,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "New Analysis", url: "/dashboard/analyze", icon: FileText },
  { title: "Chat", url: "/dashboard/chat", icon: MessageSquare },
  { title: "History", url: "/dashboard/history", icon: History },
  { title: "Bookmarks", url: "/dashboard/bookmarks", icon: Bookmark },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const { state, logout, toggleTheme } = useAppContext();
  const currentPath = location.pathname;
  const collapsed = sidebarState === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-item-active" : "sidebar-item";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
            <Brain className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-gradient">AI Education</h2>
              <p className="text-xs text-muted-foreground">Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state.currentAnalysis && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard/results" className="sidebar-item">
                      <Lightbulb className="h-5 w-5" />
                      {!collapsed && <span>Current Results</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex-1"
          >
            {state.theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {!collapsed && (
              <span className="ml-2">
                {state.theme === 'light' ? 'Dark' : 'Light'}
              </span>
            )}
          </Button>
        </div>

        {state.user && (
          <div className="space-y-2">
            {!collapsed && (
              <div className="px-2 py-1">
                <p className="text-sm font-medium truncate">{state.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {state.user.email}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}