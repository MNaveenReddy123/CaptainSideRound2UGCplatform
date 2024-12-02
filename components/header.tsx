"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, Home, UploadCloud, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function VideoIcon({ className }: { className?: string }) {
  return <Video className={className} />;
}

export default function Header() {
  const { setTheme, theme: currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Handle initial theme setup and detect system preference
  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ensure the theme is correctly initialized
  useEffect(() => {
    if (mounted && currentTheme) {
      setTheme(currentTheme);  // Apply the initial theme
    }
  }, [mounted, currentTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <VideoIcon className="h-6 w-6" />
            <span className="font-bold text-lg">VidShare</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {user && (
            <>
              <Link
                href="/upload"
                className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload</span>
              </Link>
              <Link
                href="/my-videos"
                className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
              >
                <Video className="h-4 w-4" />
                <span>My Videos</span>
              </Link>
            </>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newTheme = currentTheme === "light" ? "dark" : "light";
              setTheme(newTheme);
            }}
          >
            {currentTheme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <Button
              variant="ghost"
              onClick={() => supabase.auth.signOut()}
              className="flex items-center space-x-2"
            >
              <User className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="default" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className="flex md:hidden justify-between px-4 pb-2 pt-2 border-t bg-background text-sm font-medium">
        <Link
          href="/"
          className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        {user && (
          <>
            <Link
              href="/upload"
              className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
            >
              <UploadCloud className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            <Link
              href="/my-videos"
              className="flex items-center space-x-1 transition-colors hover:text-foreground/80"
            >
              <Video className="h-5 w-5" />
              <span>My Videos</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
