
'use client';
import type { FC } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { GraduationCap, LayoutDashboard, CalendarDays, Menu, Settings, UserCircle, FileText, ClipboardCheck, LogOut } from 'lucide-react'; // Added LogOut
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_USER_PROFILE } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: GraduationCap },
  { href: '/my-notes', label: 'My Notes', icon: FileText },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/quiz-history', label: 'Quizzes', icon: ClipboardCheck },
];

export const Navbar: FC = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const handleLogout = () => {
    // Add any actual logout logic here (e.g., clearing session, tokens)
    router.push('/auth/signup'); // Redirect to Sign-Up page
  };

  const renderNavLinks = (isMobile: boolean = false) =>
    navItems.map((item) => (
      <Button
        key={item.label}
        variant="ghost"
        asChild
        className={cn(
          "justify-start text-sm font-medium",
          pathname === item.href ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
          isMobile ? "w-full text-base py-3" : ""
        )}
      >
        <Link href={item.href} className="flex items-center gap-2">
          <item.icon className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
          {item.label}
        </Link>
      </Button>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">StudyU</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
            {renderNavLinks()}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={MOCK_USER_PROFILE.avatarUrl} alt={MOCK_USER_PROFILE.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{MOCK_USER_PROFILE.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none font-headline">{MOCK_USER_PROFILE.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {MOCK_USER_PROFILE.major}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> 
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-4">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <GraduationCap className="h-7 w-7 text-primary" />
                  <span className="font-headline text-xl font-bold text-primary">StudyU</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  {renderNavLinks(true)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
