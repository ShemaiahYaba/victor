"use client";
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USER_PROFILE } from '@/lib/mock-data';
import Image from 'next/image';

export const GreetingWidget: FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl">{`${getGreeting()}, ${MOCK_USER_PROFILE.name.split(' ')[0]}!`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Image 
            src="https://placehold.co/400x200.png" 
            alt="Campus illustration" 
            width={200} 
            height={100} 
            className="rounded-lg object-cover"
            data-ai-hint="campus university"
          />
          <div>
            <p className="text-muted-foreground mb-2">
              Ready to conquer your day? Here's a quick overview of your academic life.
            </p>
            <p className="text-sm text-muted-foreground">
              Currently at: <span className="font-semibold text-foreground">{MOCK_USER_PROFILE.university}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
