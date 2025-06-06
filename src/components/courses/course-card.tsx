
import type { FC } from 'react';
import Link from 'next/link';
import type { Course } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  BookOpen, // Changed from PlayCircle
  ChevronRight,
  Dot,
  FileText as DefaultIcon,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: FC<CourseCardProps> = ({ course }) => {
  const CourseIcon = course.icon || DefaultIcon; // Fallback icon

  return (
    <Card className={cn(
      "flex flex-col h-full shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden", 
      course.topBorderColor ? `border-t-4 ${course.topBorderColor}` : 'border-t-4 border-transparent'
    )}>
      <CardHeader className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {course.icon && (
              <div className={cn("p-2 rounded-lg flex items-center justify-center", course.iconBgColor || 'bg-muted')}>
                <CourseIcon className={cn("h-6 w-6", course.iconBgColor?.includes('dark') ? 'text-white' : 'text-primary')} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{course.code}</span>
              </div>
              <h3 className="text-lg font-semibold font-headline leading-tight mt-0.5">{course.name}</h3>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow space-y-4">
        {typeof course.progress === 'number' && (
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-sm font-medium text-foreground">
                <TrendingUp className="h-4 w-4 mr-1.5 text-primary" />
                Progress
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-1.5 h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-xs text-center p-2">
                      <p className="text-xs">This progress bar reflects your engagement—based on how often you study and complete quizzes for each course note.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm font-semibold text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        <div className="space-y-2 text-sm">
          {course.nextClassTime && (
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                <span>Next Class</span>
              </div>
              <span className="font-medium text-foreground">{course.nextClassTime}</span>
            </div>
          )}
        </div>

      </CardContent>

      <CardFooter className="p-4 flex flex-col items-stretch gap-3 border-t border-border/50 mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/courses/${course.id}`}>
            <BookOpen className="mr-2 h-5 w-5" /> 
            Continue Learning
            <ChevronRight className="ml-auto h-5 w-5" />
          </Link>
        </Button>
        {course.notification && (
          <div className="p-2.5 bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300 rounded-md text-sm flex items-center">
            <Dot className="h-5 w-5 mr-1 flex-shrink-0 text-green-500 dark:text-green-400" />
            <span>{course.notification}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
