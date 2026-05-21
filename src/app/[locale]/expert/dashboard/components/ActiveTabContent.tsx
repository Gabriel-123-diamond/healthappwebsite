import React from 'react';
import { AppointmentList, ArticleList, CourseList } from '@/components/expert/ExpertDashboardLists';
import { PatientQueue } from '@/components/expert/PatientQueue';
import { TriageKanbanWidget } from '@/components/expert/dashboard/TriageKanbanWidget';
import { TierGate } from '@/components/expert/dashboard/TierGate';

interface ActiveTabContentProps {
  activeTab: string;
  appointments: any[];
  articles: any[];
  courses: any[];
  isSmartTriageLocked: boolean;
  onCreationAttempt: () => boolean;
}

export const ActiveTabContent: React.FC<ActiveTabContentProps> = ({
  activeTab,
  appointments,
  articles,
  courses,
  isSmartTriageLocked,
  onCreationAttempt,
}) => {
  switch (activeTab) {
    case 'appointments':
      return <AppointmentList appointments={appointments} />;
    case 'kanban':
      return (
        <TierGate isLocked={isSmartTriageLocked} featureName="Smart Triage">
          <TriageKanbanWidget />
        </TierGate>
      );
    case 'queue':
      return <PatientQueue />;
    case 'articles':
      return <ArticleList articles={articles} onCreationAttempt={onCreationAttempt} />;
    case 'courses':
      return <CourseList courses={courses} onCreationAttempt={onCreationAttempt} />;
    default:
      return null;
  }
};
