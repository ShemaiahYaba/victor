
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import type { Quiz, QuizQuestion, AnsweredQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface QuizViewProps {
  quiz: Quiz;
  onQuizComplete: (score: number, totalQuestions: number, quiz: Quiz, answeredQuestions: AnsweredQuestion[]) => void;
}

export const QuizView: FC<QuizViewProps> = ({ quiz, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // Stores { questionId: selectedOptionId }
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    let score = 0;
    const answeredQuestionsResult: AnsweredQuestion[] = quiz.questions.map(q => {
      const selectedOptionId = selectedAnswers[q.id];
      const isCorrect = selectedOptionId === q.correctOptionId;
      if (isCorrect) {
        score++;
      }
      return {
        ...q,
        selectedOptionId: selectedOptionId,
        isCorrect: isCorrect,
      };
    });
    onQuizComplete(score, quiz.questions.length, quiz, answeredQuestionsResult);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    // Potentially call a prop to notify parent about restart if needed
  };
  
  if (showResults) {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score++;
      }
    });

    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Quiz Results: {quiz.title}</CardTitle>
          <CardDescription>You scored {score} out of {quiz.questions.length}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.questions.map(q => {
            const userAnswerId = selectedAnswers[q.id];
            const isCorrect = userAnswerId === q.correctOptionId;
            return (
              <div key={q.id} className={`p-3 rounded-md border ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                <p className="font-medium">{q.text}</p>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Your answer: {q.options.find(opt => opt.id === userAnswerId)?.text || <span className="italic">Not answered</span>}
                  {userAnswerId && (isCorrect 
                    ? <CheckCircle className="inline ml-1 h-4 w-4" /> 
                    : <XCircle className="inline ml-1 h-4 w-4" />)}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-green-700">Correct answer: {q.options.find(opt => opt.id === q.correctOptionId)?.text}</p>
                )}
                {q.explanation && <p className="text-xs mt-1 text-muted-foreground italic">{q.explanation}</p>}
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button onClick={handleRestart}>
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{quiz.title}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
        <RadioGroup
          value={selectedAnswers[currentQuestion.id] || ''}
          onValueChange={(value) => handleOptionSelect(currentQuestion.id, value)}
          className="space-y-2"
        >
          {currentQuestion.options.map(option => (
            <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/10">
              <RadioGroupItem value={option.id} id={`${currentQuestion.id}-${option.id}`} />
              <Label htmlFor={`${currentQuestion.id}-${option.id}`} className="flex-1 cursor-pointer text-base">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
