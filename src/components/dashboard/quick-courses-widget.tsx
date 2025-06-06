
import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_COURSES } from '@/lib/mock-data';
import { BookOpenText } from 'lucide-react';

export const QuickCoursesWidget: FC = () => {
  const displayedCourses = MOCK_COURSES.slice(0, 3);

  return (
    <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <BookOpenText className="mr-2 h-5 w-5 text-primary" />
          Your Courses
        </CardTitle>
        <CardDescription>A quick look at your current courses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayedCourses.map((course) => (
            <li key={course.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md hover:bg-secondary/60 transition-colors">
              <div>
                <Link href={`/courses/${course.id}`} className="font-medium hover:underline font-headline">
                  {course.name}
                </Link>
                <p className="text-xs text-muted-foreground">{course.code}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/courses/${course.id}`}>
                  View
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        {MOCK_COURSES.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="link" asChild className="text-sm">
              <Link href="/courses">
                View All Courses ({MOCK_COURSES.length})
              </Link>
            </Button>
          </div>
        )}
         {MOCK_COURSES.length === 0 && (
           <p className="text-muted-foreground text-sm text-center py-4">No courses added yet.</p>
         )}
      </CardContent>
    </Card>
  );
};


    