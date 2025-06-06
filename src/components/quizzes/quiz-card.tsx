
import type { FC } from 'react';
import type { Quiz } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card className="shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-primary" />
          {quiz.title}
        </CardTitle>
        {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Number of questions: {quiz.questions.length}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onStartQuiz(quiz.id)} className="w-full">
          Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};


    