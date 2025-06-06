
'use client'; // <-- Add this line to make it a client component

import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation'; // <-- Import usePathname

// Metadata cannot be exported from a client component,
// so we define it outside or handle it differently if needed for dynamic metadata.
// For simple static metadata, it can remain here, but Next.js might show a warning
// or it might not be applied as expected. For now, we'll leave it.
// export const metadata: Metadata = { // This might cause issues with 'use client'
// title: 'StudyU',
// description: 'Your modern student dashboard for managing academic life.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const authPaths = ['/auth/login', '/auth/signup'];
  const showNavbar = !authPaths.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Metadata can be placed directly in head for client components if static */}
        <title>StudyU</title>
        <meta name="description" content="Your modern student dashboard for managing academic life." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen bg-background">
          {showNavbar && <Navbar />}
          <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
