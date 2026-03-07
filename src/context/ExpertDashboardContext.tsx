'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Article } from '@/types/article';
import { LearningPath } from '@/types/learning';
import { Appointment } from '@/types/appointment';

export interface PatientQueueItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  waitingTime: string;
  status: 'waiting' | 'admitted' | 'reviewed';
}

interface State {
  articles: Article[];
  courses: LearningPath[];
  appointments: Appointment[];
  queue: PatientQueueItem[];
  profile: any;
  loading: boolean;
  activeTab: 'appointments' | 'articles' | 'courses' | 'queue';
}

type Action =
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_COURSES'; payload: LearningPath[] }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_QUEUE'; payload: PatientQueueItem[] }
  | { type: 'SET_PROFILE'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: 'appointments' | 'articles' | 'courses' | 'queue' }
  | { type: 'ADMIT_PATIENT'; payload: string }
  | { type: 'REVIEW_CHART'; payload: string };

const initialState: State = {
  articles: [],
  courses: [],
  appointments: [],
  queue: [
    { id: '1', name: 'John Doe', age: 45, gender: 'Male', condition: 'Hypertension', waitingTime: '15 mins', status: 'waiting' },
    { id: '2', name: 'Jane Smith', age: 32, gender: 'Female', condition: 'Type 2 Diabetes', waitingTime: '8 mins', status: 'waiting' },
    { id: '3', name: 'Robert Brown', age: 58, gender: 'Male', condition: 'Chronic Kidney Disease', waitingTime: '22 mins', status: 'waiting' },
  ],
  profile: null,
  loading: true,
  activeTab: 'appointments',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'SET_COURSES':
      return { ...state, courses: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADMIT_PATIENT':
        return {
          ...state,
          queue: state.queue.map(p => p.id === action.payload ? { ...p, status: 'admitted' } : p)
        };
    case 'REVIEW_CHART':
        return {
          ...state,
          queue: state.queue.map(p => p.id === action.payload ? { ...p, status: 'reviewed' } : p)
        };
    default:
      return state;
  }
}

const ExpertDashboardContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function ExpertDashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ExpertDashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpertDashboardContext.Provider>
  );
}

export function useExpertDashboard() {
  const context = useContext(ExpertDashboardContext);
  if (context === undefined) {
    throw new Error('useExpertDashboard must be used within an ExpertDashboardProvider');
  }
  return context;
}
