
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added import

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    console.log({ email, matricNumber, username, password });
    setTimeout(() => {
      setIsLoading(false);
      router.push('/'); // Redirect to dashboard
    }, 2000);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-3 flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Sign up</CardTitle>
          <CardDescription className="!mt-2">Don't just study hard - study smart.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="matricNumber">Matric Number</Label>
              <Input 
                id="matricNumber" 
                type="text" 
                placeholder="E.g., 21010301016" 
                required 
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Choose a username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-3 h-12 mt-2" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
