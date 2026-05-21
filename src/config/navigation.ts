export interface NavLink {
  href: string;
  labelKey: string;
  defaultLabel: string;
  roles?: string[];
}

export const NAVIGATION_LINKS: NavLink[] = [
  { href: '/', labelKey: 'common.search', defaultLabel: 'Search', roles: ['user', 'doctor', 'wellness_practitioner'] },
  { href: '/directory', labelKey: 'common.directory', defaultLabel: 'Directory', roles: ['user', 'doctor', 'wellness_practitioner'] },
  { href: '/institutions', labelKey: 'institution.menuLabel', defaultLabel: 'Institutions', roles: ['user'] },
  { href: '/community', labelKey: 'common.community', defaultLabel: 'Community' },
  { href: '/learning', labelKey: 'common.learn', defaultLabel: 'Courses' },
  { href: '/trends', labelKey: 'trends.menuLabel', defaultLabel: 'Trends' },
  { href: '/chat', labelKey: 'common.chat', defaultLabel: 'Chat' },
];

export const EXPERT_NAV_LINKS: NavLink[] = [
  { href: '/expert/appointments', labelKey: 'common.appointments', defaultLabel: 'Appointments' },
  { href: '/expert/patients', labelKey: 'common.patients', defaultLabel: 'Patients' },
  { href: '/expert/articles', labelKey: 'common.articles', defaultLabel: 'Articles' },
];

export const HOSPITAL_NAV_LINKS: NavLink[] = [
  { href: '/hospital/registry', labelKey: 'hospital.registry', defaultLabel: 'Registry' },
  { href: '/hospital/staff', labelKey: 'hospital.staff', defaultLabel: 'Staff' },
  { href: '/hospital/departments', labelKey: 'hospital.departments', defaultLabel: 'Departments' },
  { href: '/hospital/promote', labelKey: 'hospital.promote', defaultLabel: 'Promote' },
  { href: '/hospital/setup', labelKey: 'hospital.settings', defaultLabel: 'Settings' },
];

