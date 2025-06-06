
'use client';

import { useState, useEffect } from 'react';
import type { QuizAttempt, Course, Quiz, QuizQuestion, AnsweredQuestion } from '@/types';
import { MOCK_QUIZ_ATTEMPTS, MOCK_COURSES, MOCK_QUIZZES } from '@/lib/mock-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ClipboardCheck, CheckCircle, XCircle, CalendarDays, BookOpen, Brain, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { QuizView } from '@/components/quizzes/quiz-view';
import { shuffleArray } from '@/lib/utils';

export default function QuizHistoryPage() {
  const { toast } = useToast();
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [isCourseSelectionModalOpen, setIsCourseSelectionModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  useEffect(() => {
    setQuizAttempts(MOCK_QUIZ_ATTEMPTS.sort((a,b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()));
    setCourses(MOCK_COURSES);
  }, []);

  const getCourseNameById = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  const refreshQuizAttempts = () => {
     setQuizAttempts([...MOCK_QUIZ_ATTEMPTS].sort((a,b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()));
  }

  const handleSelectCourseForQuiz = async (selectedCourse: Course) => {
    setIsCourseSelectionModalOpen(false);
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
        title: generatedQuizData.title || `Practice Quiz for ${selectedCourse.name}`,
        description: generatedQuizData.description || `A dynamically generated quiz to test your knowledge on ${selectedCourse.name}.`,
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
      questions: answeredQuestions,
    };
    MOCK_QUIZ_ATTEMPTS.unshift(newAttempt); 
    refreshQuizAttempts();

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} on "${completedQuiz.title}". View details below.`,
    });
    setActiveQuiz(null); 
  };

  if (isGeneratingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">Generating your quiz, please wait...</p>
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setActiveQuiz(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quiz History
        </Button>
        <QuizView quiz={activeQuiz} onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <ClipboardCheck className="mr-3 h-8 w-8 text-primary" />
          Quiz History
        </h1>
        <Button
          variant="default"
          onClick={() => setIsCourseSelectionModalOpen(true)}
        >
          <Brain className="mr-2 h-4 w-4" /> Take a New Quiz
        </Button>
      </header>

      {quizAttempts.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {quizAttempts.map((attempt) => (
            <AccordionItem 
              value={attempt.id} 
              key={attempt.id} 
              className="border-none"
            >
              <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                    <div className="flex-grow mb-2 sm:mb-0">
                      <h3 className="text-lg font-semibold font-headline">{attempt.quizTitle}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <BookOpen className="mr-1.5 h-4 w-4" /> {getCourseNameById(attempt.courseId)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 shrink-0">
                       <Badge variant={attempt.score / attempt.totalQuestions >= 0.5 ? 'default' : 'destructive'} className="text-sm py-1 px-2.5">
                        Score: {attempt.score}/{attempt.totalQuestions}
                      </Badge>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" /> {format(new Date(attempt.attemptedAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 mt-2 pt-4 border-t">
                    <h4 className="text-md font-semibold font-headline mb-2">Questions & Answers:</h4>
                    {attempt.questions.map((q, idx) => (
                      <div 
                        key={q.id} 
                        className={`p-4 rounded-lg border ${q.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}
                      >
                        <p className="font-medium mb-2 text-base">{idx + 1}. {q.text}</p>
                        
                        <div className="mb-2">
                          <span className="text-sm font-semibold">Your Answer: </span>
                          <span className={`text-sm ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {q.options.find(opt => opt.id === q.selectedOptionId)?.text || <span className="italic">Not answered</span>}
                            {q.selectedOptionId && (
                                q.isCorrect 
                                ? <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" /> 
                                : <XCircle className="inline ml-2 h-4 w-4 text-red-600" />
                            )}
                          </span>
                        </div>

                        {!q.isCorrect && q.correctOptionId && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-green-700">Correct Answer: </span>
                            <span className="text-sm text-green-700">
                              {q.options.find(opt => opt.id === q.correctOptionId)?.text}
                            </span>
                          </div>
                        )}
                        {q.explanation && (
                          <div className="mt-2 pt-2 border-t border-dashed">
                            <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="shadow-lg shadow-primary/10">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No Quiz History</h2>
              <p className="mt-1 text-muted-foreground">
                You haven't completed any quizzes yet. Your attempts will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCourseSelectionModalOpen} onOpenChange={setIsCourseSelectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Select a Course for Your Quiz</DialogTitle>
            <DialogDescription>
              Choose a course to generate a new practice quiz.
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
               {courses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No courses available to generate quizzes for.</p>}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCourseSelectionModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
