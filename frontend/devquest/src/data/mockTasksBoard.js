export const MOCK_TASKS_DATA = {
  board: {
    id: 'board-1',
    title: 'Project Discovery Call',
    description: 'Cross-functional preparation board for the kickoff and client discovery phase.',
  },
  onlineMembers: [
    { id: 1, name: 'Ava Stone', role: 'Product Lead', avatar: 'AS', color: '#EEF2FF' },
    { id: 2, name: 'Liam Park', role: 'Frontend Dev', avatar: 'LP', color: '#DBEAFE' },
    { id: 3, name: 'Noah Kim', role: 'Backend Dev', avatar: 'NK', color: '#DCFCE7' },
    { id: 4, name: 'Mia Chen', role: 'UI Designer', avatar: 'MC', color: '#FCE7F3' },
    { id: 5, name: 'Ethan Reed', role: 'QA Engineer', avatar: 'ER', color: '#FEF3C7' },
  ],
  columns: [
    { id: 'col-1', title: 'To Do', position: 1 },
    { id: 'col-2', title: 'In Progress', position: 2 },
    { id: 'col-3', title: 'Review', position: 3 },
    { id: 'col-4', title: 'Done', position: 4 },
  ],
  tasks: [
    {
      id: 'task-1',
      columnId: 'col-1',
      title: 'Map client pain points before discovery',
      priority: 'HIGH',
      position: 1000,
      dueDate: 'Today',
      progress: 30,
      assignee: { id: 1, name: 'Ava Stone', avatar: 'AS', color: '#EEF2FF' },
      description:
        'Summarize current user pain points, missing integrations, and business blockers before the discovery workshop.',
      checklist: [
        { id: 'chk-1', text: 'Review sales notes', done: true },
        { id: 'chk-2', text: 'Collect support tickets', done: false },
        { id: 'chk-3', text: 'Draft discovery prompts', done: false },
      ],
      comments: [
        { id: 'com-1', author: 'Mia Chen', avatar: 'MC', color: '#FCE7F3', message: 'I can add a flow sketch after the notes are ready.', time: '20m ago' },
        { id: 'com-2', author: 'Liam Park', avatar: 'LP', color: '#DBEAFE', message: 'Need clarity on current onboarding drop-off events.', time: '10m ago' },
      ],
      attachments: [
        { id: 'att-1', name: 'client-brief.pdf', meta: '1.4 MB' },
        { id: 'att-2', name: 'support-summary.docx', meta: '420 KB' },
      ],
    },
    {
      id: 'task-2',
      columnId: 'col-1',
      title: 'Prepare technical question list',
      priority: 'MEDIUM',
      position: 2000,
      dueDate: 'Tomorrow',
      progress: 55,
      assignee: { id: 3, name: 'Noah Kim', avatar: 'NK', color: '#DCFCE7' },
      description:
        'List technical discovery questions around auth, data sync, event tracking, and external dependencies.',
      checklist: [
        { id: 'chk-4', text: 'Draft API questions', done: true },
        { id: 'chk-5', text: 'Confirm integration list', done: true },
        { id: 'chk-6', text: 'Ask about audit logging', done: false },
      ],
      comments: [
        { id: 'com-3', author: 'Noah Kim', avatar: 'NK', color: '#DCFCE7', message: 'Need to confirm whether they rely on SSO.', time: '35m ago' },
      ],
      attachments: [{ id: 'att-3', name: 'technical-discovery.md', meta: '12 KB' }],
    },
    {
      id: 'task-3',
      columnId: 'col-2',
      title: 'Design workshop agenda and breakout flow',
      priority: 'HIGH',
      position: 1000,
      dueDate: 'Thu, 02:00 PM',
      progress: 80,
      assignee: { id: 4, name: 'Mia Chen', avatar: 'MC', color: '#FCE7F3' },
      description:
        'Build a workshop agenda with timeboxes, breakout exercises, and a clean facilitation path for stakeholders.',
      checklist: [
        { id: 'chk-7', text: 'Define session goals', done: true },
        { id: 'chk-8', text: 'Prepare FigJam board', done: true },
        { id: 'chk-9', text: 'Add decision checkpoints', done: false },
      ],
      comments: [
        { id: 'com-4', author: 'Ava Stone', avatar: 'AS', color: '#EEF2FF', message: 'Please keep a 15-minute segment for prioritization.', time: '1h ago' },
      ],
      attachments: [
        { id: 'att-4', name: 'agenda-v3.fig', meta: '5.2 MB' },
        { id: 'att-5', name: 'facilitation-notes.md', meta: '18 KB' },
      ],
    },
    {
      id: 'task-4',
      columnId: 'col-2',
      title: 'Prototype note-taking panel for workshop',
      priority: 'LOW',
      position: 2000,
      dueDate: 'Fri, 10:00 AM',
      progress: 45,
      assignee: { id: 2, name: 'Liam Park', avatar: 'LP', color: '#DBEAFE' },
      description:
        'Create a lightweight notes panel prototype so stakeholders can validate the live capture workflow.',
      checklist: [
        { id: 'chk-10', text: 'Wire frame state', done: true },
        { id: 'chk-11', text: 'Add empty state', done: false },
        { id: 'chk-12', text: 'Connect sample data', done: false },
      ],
      comments: [
        { id: 'com-5', author: 'Ethan Reed', avatar: 'ER', color: '#FEF3C7', message: 'I will add a small QA pass once it is interactive.', time: '2h ago' },
      ],
      attachments: [{ id: 'att-6', name: 'notes-panel.png', meta: '860 KB' }],
    },
    {
      id: 'task-5',
      columnId: 'col-3',
      title: 'Review stakeholder questionnaire copy',
      priority: 'MEDIUM',
      position: 1000,
      dueDate: 'Fri, 01:00 PM',
      progress: 90,
      assignee: { id: 5, name: 'Ethan Reed', avatar: 'ER', color: '#FEF3C7' },
      description:
        'Review all questionnaire prompts for clarity, duplication, and sequencing before sending externally.',
      checklist: [
        { id: 'chk-13', text: 'Check tone and readability', done: true },
        { id: 'chk-14', text: 'Remove repeated prompts', done: true },
        { id: 'chk-15', text: 'Approve final order', done: false },
      ],
      comments: [
        { id: 'com-6', author: 'Mia Chen', avatar: 'MC', color: '#FCE7F3', message: 'Copy is almost there, just simplify the last section.', time: '45m ago' },
      ],
      attachments: [{ id: 'att-7', name: 'questionnaire-copy.docx', meta: '240 KB' }],
    },
    {
      id: 'task-6',
      columnId: 'col-4',
      title: 'Confirm attendee list and meeting logistics',
      priority: 'LOW',
      position: 1000,
      dueDate: 'Done',
      progress: 100,
      assignee: { id: 1, name: 'Ava Stone', avatar: 'AS', color: '#EEF2FF' },
      description:
        'Finalize attendee list, calendar invite, room details, and backup contact information for the session.',
      checklist: [
        { id: 'chk-16', text: 'Confirm stakeholder names', done: true },
        { id: 'chk-17', text: 'Send invite', done: true },
        { id: 'chk-18', text: 'Share meeting notes link', done: true },
      ],
      comments: [
        { id: 'com-7', author: 'Ava Stone', avatar: 'AS', color: '#EEF2FF', message: 'All core attendees confirmed.', time: 'Yesterday' },
      ],
      attachments: [{ id: 'att-8', name: 'invite-list.csv', meta: '9 KB' }],
    },
  ],
}
