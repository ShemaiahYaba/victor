
'use client';

import { useState, useEffect } from 'react';
import { StudentProfileWidget } from '@/components/dashboard/student-profile-widget';
import { QuickCoursesWidget } from '@/components/dashboard/quick-courses-widget';
import { UpcomingEventsWidget } from '@/components/dashboard/upcoming-events-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Brain, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Course, Quiz, QuizAttempt, QuizQuestion, AnsweredQuestion } from '@/types';
import { MOCK_COURSES, MOCK_QUIZZES, MOCK_QUIZ_ATTEMPTS } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizView } from '@/components/quizzes/quiz-view';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { useRouter } from 'next/navigation';
import { shuffleArray } from '@/lib/utils';

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [isCourseSelectionModalOpen, setIsCourseSelectionModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const [isQuizCompletionModalOpen, setIsQuizCompletionModalOpen] = useState(false);
  const [completedQuizDetails, setCompletedQuizDetails] = useState<{ score: number; totalQuestions: number; quizTitle: string } | null>(null);


  useEffect(() => {
    setCourses(MOCK_COURSES);
    setQuizzes(MOCK_QUIZZES);
  }, []);

  const handleSelectCourseForQuiz = async (selectedCourse: Course) => {
    setIsCourseSelectionModalOpen(false);
    const existingQuiz = quizzes.find(q => q.courseId === selectedCourse.id);

    if (existingQuiz) {
      const shuffledExistingQuiz = {
        ...existingQuiz,
        questions: shuffleArray(existingQuiz.questions)
      };
      setActiveQuiz(shuffledExistingQuiz);
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const generatedQuizData = await generateQuiz({
        courseName: selectedCourse.name,
        courseDescription: selectedCourse.description,
        numQuestions: 5, 
      });

      const newQuizId = `dynamic-quiz-${selectedCourse.id}-${Date.now()}`;
      const transformedQuestions: QuizQuestion[] = generatedQuizData.questions.map((q, qIndex) => {
        const optionsWithIds = q.options.map((opt, optIndex) => ({
          id: `opt-${newQuizId}-${qIndex}-${optIndex}`,
          text: opt.text,
        }));
        const correctOpt = optionsWithIds.find(opt => opt.text === q.correctOptionText);
        
        if (!correctOpt) {
          console.error("Correct option text did not match any generated option for question:", q.text, "Options:", q.options.map(o => o.text));
          const fallbackCorrectOptionId = optionsWithIds.length > 0 ? optionsWithIds[0].id : `opt-fallback-${qIndex}`;
          toast({ title: "Quiz Generation Warning", description: `Could not perfectly match correct answer for question: "${q.text}". Defaulting.`, variant: "default"});
          return {
            id: `q-${newQuizId}-${qIndex}`,
            text: q.text,
            options: optionsWithIds,
            correctOptionId: fallbackCorrectOptionId,
            explanation: q.explanation || "Explanation not available due to matching issue.",
          };
        }

        return {
          id: `q-${newQuizId}-${qIndex}`,
          text: q.text,
          options: optionsWithIds,
          correctOptionId: correctOpt.id,
          explanation: q.explanation,
        };
      });

      const dynamicQuiz: Quiz = {
        id: newQuizId,
        courseId: selectedCourse.id,
        title: generatedQuizData.title || `Quiz for ${selectedCourse.name}`,
        description: generatedQuizData.description,
        questions: shuffleArray(transformedQuestions), // Shuffle here
      };
      setActiveQuiz(dynamicQuiz);
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Quiz Generation Failed",
        description: error.message || "Could not generate a quiz for this course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number, completedQuiz: Quiz, answeredQuestions: AnsweredQuestion[]) => {
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: completedQuiz.id,
      courseId: completedQuiz.courseId,
      quizTitle: completedQuiz.title,
      attemptedAt: new Date().toISOString(),
      score,
      totalQuestions,
      questions: answeredQuestions, // Store questions in the order they were answered
    };
    MOCK_QUIZ_ATTEMPTS.unshift(newAttempt); 

    setCompletedQuizDetails({ score, totalQuestions, quizTitle: completedQuiz.title });
    setIsQuizCompletionModalOpen(true);
  };

  const closeCompletionModalAndDashboard = () => {
    setIsQuizCompletionModalOpen(false);
    setActiveQuiz(null);
    setCompletedQuizDetails(null);
  };

  if (isGeneratingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Generating your quiz, please wait...</p>
      </div>
    );
  }

  if (activeQuiz && !isQuizCompletionModalOpen) { 
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setActiveQuiz(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <QuizView quiz={activeQuiz} onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentProfileWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickCoursesWidget />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/my-notes">
                  <FileText className="mr-2 h-4 w-4" /> Create a Note
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsCourseSelectionModalOpen(true)}
              >
                <Brain className="mr-2 h-4 w-4" /> Take a Quiz
              </Button>
            </CardContent>
          </Card>
          <UpcomingEventsWidget />
        </div>
      </div>

      <Dialog open={isCourseSelectionModalOpen} onOpenChange={setIsCourseSelectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Select a Course for Your Quiz</DialogTitle>
            <DialogDescription>
              Choose a course to start a quiz. If a pre-made quiz isn't available, we'll generate one for you!
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2 pr-3">
              {courses.map(course => (
                <Button
                  key={course.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleSelectCourseForQuiz(course)}
                >
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.code}</p>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCourseSelectionModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuizCompletionModalOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
            closeCompletionModalAndDashboard();
        } else {
            setIsQuizCompletionModalOpen(true);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Quiz Completed!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You’ve just finished the quiz: <span className="font-semibold">"{completedQuizDetails?.quizTitle}"</span>.
              <br />
              Your score: <span className="font-semibold">{completedQuizDetails?.score}/{completedQuizDetails?.totalQuestions}</span>.
              <br /><br />
              Want to review how you did?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={() => {
              router.push('/quiz-history');
              closeCompletionModalAndDashboard();
            }}>
              View My Quiz History
            </Button>
            <Button variant="outline" onClick={closeCompletionModalAndDashboard}>
              Stay on Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
