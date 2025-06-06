
'use client';
import { useState, useEffect } from 'react';
import { TimetableGrid } from '@/components/timetable/timetable-grid';
import { MOCK_TIMETABLE_EVENTS } from '@/lib/mock-data';
import type { TimetableEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarDays, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Added Textarea
import { cn } from '@/lib/utils';

const colorOptions = [
  { name: 'Primary', value: 'bg-primary', previewClass: 'bg-primary' },
  { name: 'Accent', value: 'bg-accent', previewClass: 'bg-accent' },
  { name: 'Green', value: 'bg-green-500', previewClass: 'bg-green-500' },
  { name: 'Orange', value: 'bg-orange-500', previewClass: 'bg-orange-500' },
  { name: 'Purple', value: 'bg-purple-500', previewClass: 'bg-purple-500' },
  { name: 'Red', value: 'bg-red-500', previewClass: 'bg-red-500' },
];

const initialAddEventFormData: Partial<TimetableEvent> = {
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  courseColor: colorOptions[0].value,
  courseName: '',
  description: '', // Changed from location
};

export default function TimetablePage() {
  const [events, setEvents] = useState<TimetableEvent[]>(MOCK_TIMETABLE_EVENTS);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [addEventFormData, setAddEventFormData] = useState<Partial<TimetableEvent>>(initialAddEventFormData);

  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimetableEvent | null>(null);
  const [editEventFormData, setEditEventFormData] = useState<Partial<TimetableEvent>>({});

  const { toast, dismiss: dismissToast } = useToast();
  const [eventPendingUndo, setEventPendingUndo] = useState<TimetableEvent | null>(null);

  useEffect(() => {
    setEvents(MOCK_TIMETABLE_EVENTS);
  }, []);


  const handleOpenAddEventModal = () => {
    setAddEventFormData(initialAddEventFormData);
    setIsAddEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    if (!addEventFormData.courseName || !addEventFormData.description || !addEventFormData.day || !addEventFormData.startTime || !addEventFormData.endTime || !addEventFormData.courseColor) {
      toast({ title: "Missing Information", description: "Please fill all fields for the new event.", variant: "destructive" });
      return;
    }
    const completeEvent: TimetableEvent = {
      id: `event-${Date.now()}`,
      courseId: addEventFormData.courseId || `custom-${Date.now()}`,
      courseName: addEventFormData.courseName,
      description: addEventFormData.description,
      day: addEventFormData.day as TimetableEvent['day'],
      startTime: addEventFormData.startTime,
      endTime: addEventFormData.endTime,
      courseColor: addEventFormData.courseColor
    };
    
    MOCK_TIMETABLE_EVENTS.push(completeEvent);
    setEvents(prev => [...prev, completeEvent]); 

    setIsAddEventModalOpen(false);
    toast({ title: "Event Added!", description: `"${completeEvent.courseName}" added to timetable.` });
  };

  const handleOpenEditModal = (event: TimetableEvent) => {
    setEventToEdit(event);
    setEditEventFormData({ ...event });
    setIsEditEventModalOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!eventToEdit || !editEventFormData.courseName || !editEventFormData.description || !editEventFormData.day || !editEventFormData.startTime || !editEventFormData.endTime || !editEventFormData.courseColor) {
      toast({ title: "Missing Information", description: "Please fill all fields for the event.", variant: "destructive" });
      return;
    }

    const updatedEvent: TimetableEvent = {
      ...eventToEdit,
      ...editEventFormData,
      description: editEventFormData.description as string,
      day: editEventFormData.day as TimetableEvent['day'], 
    };

    const eventIndexInMock = MOCK_TIMETABLE_EVENTS.findIndex(e => e.id === updatedEvent.id);
    if (eventIndexInMock > -1) {
      MOCK_TIMETABLE_EVENTS[eventIndexInMock] = updatedEvent;
    }
    
    setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    
    setIsEditEventModalOpen(false);
    setEventToEdit(null);
    toast({ title: "Event Updated!", description: `"${updatedEvent.courseName}" has been updated.` });
  };


  const handleUndoDelete = () => {
    if (eventPendingUndo) {
      MOCK_TIMETABLE_EVENTS.push(eventPendingUndo); 
      setEvents(prevEvents => [...prevEvents, eventPendingUndo]);
      toast({
        title: "Deletion Undone",
        description: `"${eventPendingUndo.courseName}" has been restored.`,
      });
      setEventPendingUndo(null); 
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (!eventToDelete) return;

    setEvents(prev => prev.filter(event => event.id !== eventId));
    setEventPendingUndo(eventToDelete); 

    const { id: undoToastId } = toast({
      title: "Event Deleted",
      description: `"${eventToDelete.courseName}" removed.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => {
          handleUndoDelete(); 
          dismissToast(undoToastId); 
        }}>
          Undo
        </Button>
      ),
      duration: 7000, 
      onOpenChange: (open) => {
        if (!open && eventPendingUndo && eventPendingUndo.id === eventId) {
          const mockIndexPostUndo = MOCK_TIMETABLE_EVENTS.findIndex(e => e.id === eventId);
          if (mockIndexPostUndo > -1 && eventPendingUndo.id === eventId) { 
             MOCK_TIMETABLE_EVENTS.splice(mockIndexPostUndo, 1);
          }
          setEventPendingUndo(null); 
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <CalendarDays className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold font-headline">Timetable</h1>
        </div>
        <Button onClick={handleOpenAddEventModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Event to Timetable
        </Button>
      </div>

      <TimetableGrid 
        events={events} 
        onEditRequest={handleOpenEditModal} 
        onDeleteEvent={handleDeleteEvent} 
      />

      {/* Add Event Modal */}
      <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Add New Timetable Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="addEventName">Event/Course Name</Label>
              <Input id="addEventName" value={addEventFormData.courseName || ''} onChange={e => setAddEventFormData({...addEventFormData, courseName: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="addEventDescription">Description</Label>
              <Textarea 
                id="addEventDescription" 
                rows={3} 
                value={addEventFormData.description || ''} 
                onChange={e => setAddEventFormData({...addEventFormData, description: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="addEventDay">Day</Label>
              <Select value={addEventFormData.day} onValueChange={value => setAddEventFormData({...addEventFormData, day: value as TimetableEvent['day']})}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as TimetableEvent['day'][]).map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addEventStartTime">Start Time</Label>
                <Input id="addEventStartTime" type="time" value={addEventFormData.startTime} onChange={e => setAddEventFormData({...addEventFormData, startTime: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="addEventEndTime">End Time</Label>
                <Input id="addEventEndTime" type="time" value={addEventFormData.endTime} onChange={e => setAddEventFormData({...addEventFormData, endTime: e.target.value})} />
              </div>
            </div>
            <div>
              <Label htmlFor="addEventColorPicker">Event Color</Label>
              <div id="addEventColorPicker" className="flex flex-wrap gap-2 mt-1">
                {colorOptions.map(color => (
                  <button
                    key={`add-${color.value}`}
                    type="button"
                    onClick={() => setAddEventFormData({ ...addEventFormData, courseColor: color.value })}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                      color.previewClass,
                      addEventFormData.courseColor === color.value && "ring-2 ring-ring ring-offset-2"
                    )}
                    aria-label={`Select ${color.name} color`}
                  >
                    {addEventFormData.courseColor === color.value && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleCreateEvent} className="w-full">Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={isEditEventModalOpen} onOpenChange={setIsEditEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Timetable Event</DialogTitle>
            <DialogDescription>
              Modify the details for "{eventToEdit?.courseName}".
            </DialogDescription>
          </DialogHeader>
          {eventToEdit && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editEventName">Event/Course Name</Label>
                <Input id="editEventName" value={editEventFormData.courseName || ''} onChange={e => setEditEventFormData({...editEventFormData, courseName: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="editEventDescription">Description</Label>
                <Textarea 
                  id="editEventDescription" 
                  rows={3} 
                  value={editEventFormData.description || ''} 
                  onChange={e => setEditEventFormData({...editEventFormData, description: e.target.value})} 
                />
              </div>
              <div>
                <Label htmlFor="editEventDay">Day</Label>
                <Select value={editEventFormData.day} onValueChange={value => setEditEventFormData({...editEventFormData, day: value as TimetableEvent['day']})}>
                  <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                  <SelectContent>
                    {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as TimetableEvent['day'][]).map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editEventStartTime">Start Time</Label>
                  <Input id="editEventStartTime" type="time" value={editEventFormData.startTime} onChange={e => setEditEventFormData({...editEventFormData, startTime: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="editEventEndTime">End Time</Label>
                  <Input id="editEventEndTime" type="time" value={editEventFormData.endTime} onChange={e => setEditEventFormData({...editEventFormData, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <Label htmlFor="editEventColorPicker">Event Color</Label>
                <div id="editEventColorPicker" className="flex flex-wrap gap-2 mt-1">
                  {colorOptions.map(color => (
                    <button
                      key={`edit-${color.value}`}
                      type="button"
                      onClick={() => setEditEventFormData({ ...editEventFormData, courseColor: color.value })}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                        color.previewClass,
                        editEventFormData.courseColor === color.value && "ring-2 ring-ring ring-offset-2"
                      )}
                      aria-label={`Select ${color.name} color`}
                    >
                      {editEventFormData.courseColor === color.value && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleUpdateEvent} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
