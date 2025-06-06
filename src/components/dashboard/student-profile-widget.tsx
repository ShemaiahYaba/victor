
"use client";
import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_USER_PROFILE } from '@/lib/mock-data';

export const StudentProfileWidget: FC = () => {
  return (
    <Card className="shadow-xl shadow-primary/25 bg-slate-800 text-slate-100 rounded-xl">
      <CardContent className="p-6 flex flex-col space-y-3">
        <div>
          <h2 className="text-3xl font-semibold font-headline tracking-tight">{MOCK_USER_PROFILE.name}</h2>
          <p className="text-xl text-slate-200 mt-1">{MOCK_USER_PROFILE.degreeMajor}</p>
        </div>
        
        <p className="text-lg text-slate-300 pt-2">{MOCK_USER_PROFILE.department}</p>
        
        <div className="grid grid-cols-4 gap-2 text-center pt-4">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">{MOCK_USER_PROFILE.currentYear}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Year</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">{MOCK_USER_PROFILE.currentSemester}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Semester</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">{MOCK_USER_PROFILE.coursesTaken}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Courses</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">{MOCK_USER_PROFILE.unitsTaken}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Units</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


    