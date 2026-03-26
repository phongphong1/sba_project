import { addDays, format, startOfMonth } from 'date-fns'

const currentMonthStart = startOfMonth(new Date())

const members = [
  { id: 'member-1', name: 'Ava Stone', role: 'Product Lead', avatar: 'AS', color: '#EEF2FF' },
  { id: 'member-2', name: 'Liam Park', role: 'Frontend Dev', avatar: 'LP', color: '#DBEAFE' },
  { id: 'member-3', name: 'Noah Kim', role: 'Backend Dev', avatar: 'NK', color: '#DCFCE7' },
  { id: 'member-4', name: 'Mia Chen', role: 'UI Designer', avatar: 'MC', color: '#FCE7F3' },
  { id: 'member-5', name: 'Ethan Reed', role: 'QA Engineer', avatar: 'ER', color: '#FEF3C7' },
]

function toIsoDate(date) {
  return format(date, 'yyyy-MM-dd')
}

export const MOCK_TIMELINE_DATA = {
  members,
  tasks: [
    {
      id: 1,
      title: 'UI Design',
      assignee: members[3],
      startDate: toIsoDate(addDays(currentMonthStart, 0)),
      dueDate: toIsoDate(addDays(currentMonthStart, 9)),
      color: '#5051F9',
      progress: 60,
    },
    {
      id: 2,
      title: 'Design review and copy polish',
      assignee: members[0],
      startDate: toIsoDate(addDays(currentMonthStart, 4)),
      dueDate: toIsoDate(addDays(currentMonthStart, 13)),
      color: '#7C3AED',
      progress: 78,
    },
    {
      id: 3,
      title: 'Frontend implementation',
      assignee: members[1],
      startDate: toIsoDate(addDays(currentMonthStart, 8)),
      dueDate: toIsoDate(addDays(currentMonthStart, 20)),
      color: '#06B6D4',
      progress: 42,
    },
    {
      id: 4,
      title: 'API contract alignment',
      assignee: members[2],
      startDate: toIsoDate(addDays(currentMonthStart, 10)),
      dueDate: toIsoDate(addDays(currentMonthStart, 17)),
      color: '#10B981',
      progress: 70,
    },
    {
      id: 5,
      title: 'QA walkthrough',
      assignee: members[4],
      startDate: toIsoDate(addDays(currentMonthStart, 18)),
      dueDate: toIsoDate(addDays(currentMonthStart, 25)),
      color: '#F59E0B',
      progress: 25,
    },
    {
      id: 6,
      title: 'Launch readiness and handoff',
      assignee: members[0],
      startDate: toIsoDate(addDays(currentMonthStart, 22)),
      dueDate: toIsoDate(addDays(currentMonthStart, 29)),
      color: '#EF4444',
      progress: 15,
    },
  ],
}
