
'use client';
import * as React from 'react';
import type { FC } from 'react';
import type { TimetableEvent, DayOfWeek } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, Info, Trash2, Pencil } from 'lucide-react'; // Changed MapPin to Info
import { cn } from '@/lib/utils';

interface TimetableGridProps {
  events: TimetableEvent[];
  onEditRequest: (event: TimetableEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => `${String(8 + i).padStart(2, '0')}:00`); // 8 AM to 7 PM (12 slots)

export const TimetableGrid: FC<TimetableGridProps> = ({ events, onEditRequest, onDeleteEvent }) => {
  
  const getEventForSlot = (day: DayOfWeek, time: string): TimetableEvent | undefined => {
    return events.find(event => {
      if (event.day !== day) return false;
      return event.startTime.startsWith(time.substring(0,2)); 
    });
  };
  
  const getEventRowSpan = (event: TimetableEvent): number => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const startMinutes = parseInt(event.startTime.split(':')[1]);
    const endMinutes = parseInt(event.endTime.split(':')[1]);

    let durationInHours = (endHour - startHour);
    if (endMinutes > startMinutes) durationInHours += 0.5; 
    else if (endMinutes < startMinutes && durationInHours > 0) durationInHours -=0.5;
    
    return Math.max(1, Math.ceil(durationInHours));
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <div className="grid gap-px bg-border min-w-[1000px]" 
           style={{ gridTemplateColumns: `6rem repeat(${DAYS_OF_WEEK.length}, 1fr)` }}>
        
        <div className="p-2 bg-card font-medium sticky left-0 z-10 font-headline">Time</div>
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="p-2 text-center bg-card font-medium font-headline">{day}</div>
        ))}

        {TIME_SLOTS.map((time, timeIndex) => (
          <React.Fragment key={`timeslot-row-${time}`}>
            <div className="p-2 bg-card font-medium sticky left-0 z-10 flex items-center justify-center h-[70px]">
              {time}
            </div>
            {DAYS_OF_WEEK.map(day => {
              const event = getEventForSlot(day, time);
              if (event) {
                 const rowSpan = getEventRowSpan(event);
                 if (timeIndex > 0) {
                    for (let i = 1; i < rowSpan; i++) {
                        const prevTimeSlot = TIME_SLOTS[timeIndex-i];
                        if(prevTimeSlot){
                            const spanningEvent = getEventForSlot(day, prevTimeSlot);
                            if (spanningEvent && getEventRowSpan(spanningEvent) > i) {
                                return null; 
                            }
                        }
                    }
                 }

                return (
                  <Card 
                    key={`${day}-${time}-event`} 
                    className={cn(
                      `rounded-none border-0 border-b border-r border-border relative`,
                      event.courseColor || 'bg-primary/20', // Apply event color
                      'hover:ring-2 hover:ring-primary hover:z-[5] transition-all'
                    )}
                    style={{ gridRowEnd: `span ${rowSpan}`, minHeight: `${rowSpan * 70}px` }}
                  >
                    <CardContent className="p-1.5 h-full flex flex-col justify-start items-start">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-full w-full text-left p-1 flex flex-col items-start justify-start text-xs !no-underline focus:ring-0">
                            <strong className={cn("block truncate font-semibold", event.courseColor?.includes('bg-primary') || event.courseColor?.includes('bg-red-500') || event.courseColor?.includes('bg-purple-500') ? 'text-white' : 'text-card-foreground')}>{event.courseName || event.courseId}</strong>
                            <span className={cn("block text-xs truncate", event.courseColor?.includes('bg-primary') || event.courseColor?.includes('bg-red-500') || event.courseColor?.includes('bg-purple-500') ? 'text-gray-200': 'text-muted-foreground')}>{event.description}</span>
                            <span className={cn("block text-xs truncate", event.courseColor?.includes('bg-primary') || event.courseColor?.includes('bg-red-500') || event.courseColor?.includes('bg-purple-500') ? 'text-gray-200': 'text-muted-foreground')}>{event.startTime} - {event.endTime}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 z-20">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none font-headline">{event.courseName || `Event for ${event.courseId}`}</h4>
                            <p className="text-sm text-muted-foreground">
                              Scheduled for {event.day}, {event.startTime} - {event.endTime}.
                            </p>
                            <div className="flex items-center pt-2">
                              <Clock className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Info className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                {event.description}
                              </span>
                            </div>
                            <Button size="sm" className="mt-2 w-full" onClick={() => onEditRequest(event)}>
                              <Pencil className="mr-2 h-4 w-4"/> Edit Event
                            </Button>
                            <Button variant="destructive" size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}>
                              <Trash2 className="mr-2 h-4 w-4"/> Delete Event
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </CardContent>
                  </Card>
                );
              }
              return (
                <div 
                  key={`${day}-${time}-empty`} 
                  className="min-h-[70px] bg-card border-b border-r border-border hover:bg-accent/10 transition-colors"
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
