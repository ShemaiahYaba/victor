
import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_TIMETABLE_EVENTS } from '@/lib/mock-data';
import { CalendarClock, MapPin, Clock } from 'lucide-react';
import { format, parse,isToday, isFuture } from 'date-fns'; // Using date-fns for robust date manipulation

export const UpcomingEventsWidget: FC = () => {
  const upcomingEvents = MOCK_TIMETABLE_EVENTS
    .map(event => {
      const now = new Date();
      const dayMap: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
      let eventDate = new Date(now);
      // date-fns getDay(): Sunday is 0, Monday is 1 ... Saturday is 6
      const currentDayOfWeek = now.getDay(); 
      const eventDayOfWeek = dayMap[event.day];
      
      let dayDifference = eventDayOfWeek - currentDayOfWeek;
      // If event day has passed this week, or it's today but time has passed, schedule for next week
      if (dayDifference < 0 || (dayDifference === 0 && `${now.getHours()}:${now.getMinutes()}` > event.startTime)) {
        dayDifference += 7;
      }
      
      eventDate.setDate(now.getDate() + dayDifference);
      const [hours, minutes] = event.startTime.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      
      return { ...event, date: eventDate };
    })
    .filter(event => isFuture(event.date) || isToday(event.date)) // Keep today's future events and all future events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <CalendarClock className="mr-2 h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>What's next on your schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <ul className="space-y-3">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="p-3 bg-secondary/30 rounded-md">
                <h4 className="font-medium font-headline text-base mb-1">
                  {event.courseName || `Event for ${event.courseId}`}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground mb-0.5">
                  <Clock className="mr-1.5 h-4 w-4" />
                  <span>{format(event.date, "eeee, MMM d")} at {event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="mr-1.5 h-3 w-3" />
                  {event.location}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">No upcoming events for the rest of the week. Enjoy your free time!</p>
        )}
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href="/timetable">
            View Full Timetable
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};


    