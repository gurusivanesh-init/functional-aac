// Starter Phrase Library & Icons for AAC System
// Contains real-world, functional communication phrases categorized by real-life situations

export const SYSTEM_CATEGORIES = [
  { id: 'Home', name: 'Home', icon: 'home', color: '#3b82f6', description: 'Everyday living, food, rest, and comfort' },
  { id: 'School', name: 'School', icon: 'school', color: '#10b981', description: 'Classroom needs, teachers, and classroom items' },
  { id: 'Studies', name: 'Studies', icon: 'book-open', color: '#6366f1', description: 'Homework, assignments, and learning support' },
  { id: 'Work', name: 'Work', icon: 'briefcase', color: '#8b5cf6', description: 'Workplace tasks, questions, and break requests' },
  { id: 'Transportation', name: 'Transportation', icon: 'bus', color: '#f59e0b', description: 'Buses, transit, destinations, and directions' },
  { id: 'Feelings', name: 'Feelings', icon: 'smile', color: '#ec4899', description: 'Emotional states and personal comfort' },
  { id: 'Health', name: 'Health', icon: 'activity', color: '#14b8a6', description: 'Physical symptoms, medicine, and medical care' },
  { id: 'Social', name: 'Social', icon: 'message-circle', color: '#06b6d4', description: 'Greetings, politeness, and conversation' },
  { id: 'Activities', name: 'Activities', icon: 'play-circle', color: '#84cc16', description: 'Recreation, hobbies, and leisure requests' },
  { id: 'Emergency', name: 'Emergency', icon: 'alert-triangle', color: '#ef4444', description: 'Urgent assistance, pain, and emergency contacts' },
];

export const AVAILABLE_ICONS = [
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'food', label: 'Food / Hungry', emoji: '🥪' },
  { id: 'toilet', label: 'Toilet', emoji: '🚻' },
  { id: 'sleep', label: 'Sleep / Rest', emoji: '🛌' },
  { id: 'help', label: 'Help', emoji: '🆘' },
  { id: 'uncomfortable', label: 'Uncomfortable', emoji: '😣' },
  { id: 'outside', label: 'Outside', emoji: '🌳' },
  { id: 'school', label: 'School', emoji: '🏫' },
  { id: 'pencil', label: 'Pencil / Supplies', emoji: '✏️' },
  { id: 'question', label: 'Question', emoji: '❓' },
  { id: 'break', label: 'Break', emoji: '☕' },
  { id: 'book', label: 'Study / Book', emoji: '📖' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'clock', label: 'Time', emoji: '⏱️' },
  { id: 'bus', label: 'Bus / Transit', emoji: '🚌' },
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'ticket', label: 'Ticket', emoji: '🎟️' },
  { id: 'stop', label: 'Stop', emoji: '🛑' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'scared', label: 'Scared', emoji: '😨' },
  { id: 'tired', label: 'Tired', emoji: '🥱' },
  { id: 'pain', label: 'Pain', emoji: '🩹' },
  { id: 'medicine', label: 'Medicine', emoji: '💊' },
  { id: 'doctor', label: 'Doctor', emoji: '🩺' },
  { id: 'breathing', label: 'Breathing', emoji: '🫁' },
  { id: 'phone', label: 'Call', emoji: '📞' },
  { id: 'heart', label: 'Care / Love', emoji: '❤️' },
  { id: 'play', label: 'Play', emoji: '🎮' },
  { id: 'tv', label: 'TV', emoji: '📺' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'draw', label: 'Draw', emoji: '🎨' },
  { id: 'computer', label: 'Computer', emoji: '💻' },
  { id: 'chat', label: 'Chat', emoji: '💬' },
  { id: 'hand', label: 'Wave / Hello', emoji: '👋' },
  { id: 'thumbsup', label: 'Yes / Like', emoji: '👍' },
  { id: 'thumbsdown', label: 'No / Dislike', emoji: '👎' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
];

export const INITIAL_SYSTEM_PHRASES = [
  // HOME
  { id: 'sys_home_1', text: 'I am hungry.', category: 'Home', ageGroup: 'All Ages', priority: 'Normal', icon: 'food', enabled: true, isCustom: false },
  { id: 'sys_home_2', text: 'I want water.', category: 'Home', ageGroup: 'All Ages', priority: 'Important', icon: 'water', enabled: true, isCustom: false },
  { id: 'sys_home_3', text: 'I need to use the toilet.', category: 'Home', ageGroup: 'All Ages', priority: 'Important', icon: 'toilet', enabled: true, isCustom: false },
  { id: 'sys_home_4', text: 'I want to sleep.', category: 'Home', ageGroup: 'All Ages', priority: 'Normal', icon: 'sleep', enabled: true, isCustom: false },
  { id: 'sys_home_5', text: 'I need help.', category: 'Home', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_home_6', text: 'I am uncomfortable.', category: 'Home', ageGroup: 'All Ages', priority: 'Important', icon: 'uncomfortable', enabled: true, isCustom: false },
  { id: 'sys_home_7', text: "I don't feel well.", category: 'Home', ageGroup: 'All Ages', priority: 'Important', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_home_8', text: 'I want to go outside.', category: 'Home', ageGroup: 'All Ages', priority: 'Normal', icon: 'outside', enabled: true, isCustom: false },

  // SCHOOL (Specifically tailored for Children and Teenagers in classroom settings)
  { id: 'sys_sch_1', text: 'I need help.', category: 'School', ageGroup: 'Children', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_sch_2', text: "I don't understand.", category: 'School', ageGroup: 'Children', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_sch_3', text: 'Please explain again.', category: 'School', ageGroup: 'Children', priority: 'Normal', icon: 'chat', enabled: true, isCustom: false },
  { id: 'sys_sch_4', text: 'I finished my work.', category: 'School', ageGroup: 'Children', priority: 'Normal', icon: 'thumbsup', enabled: true, isCustom: false },
  { id: 'sys_sch_5', text: 'I need a break.', category: 'School', ageGroup: 'Children', priority: 'Important', icon: 'break', enabled: true, isCustom: false },
  { id: 'sys_sch_6', text: 'I want to use the toilet.', category: 'School', ageGroup: 'Children', priority: 'Important', icon: 'toilet', enabled: true, isCustom: false },
  { id: 'sys_sch_7', text: 'I need a pencil.', category: 'School', ageGroup: 'Children', priority: 'Normal', icon: 'pencil', enabled: true, isCustom: false },
  { id: 'sys_sch_8', text: 'I have a question.', category: 'School', ageGroup: 'Children', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_sch_9', text: "I don't feel well.", category: 'School', ageGroup: 'Children', priority: 'Important', icon: 'pain', enabled: true, isCustom: false },

  // STUDIES
  { id: 'sys_stu_1', text: 'I need help with this.', category: 'Studies', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_stu_2', text: 'I don\'t understand this topic.', category: 'Studies', ageGroup: 'All Ages', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_stu_3', text: 'Please explain it again.', category: 'Studies', ageGroup: 'All Ages', priority: 'Normal', icon: 'chat', enabled: true, isCustom: false },
  { id: 'sys_stu_4', text: 'I have completed the assignment.', category: 'Studies', ageGroup: 'All Ages', priority: 'Normal', icon: 'thumbsup', enabled: true, isCustom: false },
  { id: 'sys_stu_5', text: 'I need more time.', category: 'Studies', ageGroup: 'All Ages', priority: 'Normal', icon: 'clock', enabled: true, isCustom: false },
  { id: 'sys_stu_6', text: 'Can you help me?', category: 'Studies', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },

  // WORK
  { id: 'sys_wrk_1', text: 'I need help.', category: 'Work', ageGroup: 'Adults', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_wrk_2', text: 'I have finished this task.', category: 'Work', ageGroup: 'Adults', priority: 'Normal', icon: 'thumbsup', enabled: true, isCustom: false },
  { id: 'sys_wrk_3', text: 'I need more time.', category: 'Work', ageGroup: 'Adults', priority: 'Normal', icon: 'clock', enabled: true, isCustom: false },
  { id: 'sys_wrk_4', text: 'I have a question.', category: 'Work', ageGroup: 'Adults', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_wrk_5', text: 'I need a break.', category: 'Work', ageGroup: 'Adults', priority: 'Important', icon: 'break', enabled: true, isCustom: false },
  { id: 'sys_wrk_6', text: "I don't feel well.", category: 'Work', ageGroup: 'Adults', priority: 'Important', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_wrk_7', text: 'Please explain the task again.', category: 'Work', ageGroup: 'Adults', priority: 'Normal', icon: 'chat', enabled: true, isCustom: false },

  // TRANSPORTATION
  { id: 'sys_trn_1', text: 'I want to go home.', category: 'Transportation', ageGroup: 'All Ages', priority: 'Important', icon: 'home', enabled: true, isCustom: false },
  { id: 'sys_trn_2', text: 'I want to go to school.', category: 'Transportation', ageGroup: 'Children', priority: 'Normal', icon: 'school', enabled: true, isCustom: false },
  { id: 'sys_trn_3', text: 'Where are we going?', category: 'Transportation', ageGroup: 'All Ages', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_trn_4', text: 'Please stop here.', category: 'Transportation', ageGroup: 'All Ages', priority: 'Important', icon: 'stop', enabled: true, isCustom: false },
  { id: 'sys_trn_5', text: 'I need help.', category: 'Transportation', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_trn_6', text: 'How much is the ticket?', category: 'Transportation', ageGroup: 'Teenagers', priority: 'Normal', icon: 'ticket', enabled: true, isCustom: false },
  { id: 'sys_trn_7', text: 'I have lost my ticket.', category: 'Transportation', ageGroup: 'All Ages', priority: 'Important', icon: 'ticket', enabled: true, isCustom: false },
  { id: 'sys_trn_8', text: 'I am feeling uncomfortable.', category: 'Transportation', ageGroup: 'All Ages', priority: 'Important', icon: 'uncomfortable', enabled: true, isCustom: false },

  // FEELINGS
  { id: 'sys_fel_1', text: 'I am happy.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Normal', icon: 'happy', enabled: true, isCustom: false },
  { id: 'sys_fel_2', text: 'I am sad.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Normal', icon: 'sad', enabled: true, isCustom: false },
  { id: 'sys_fel_3', text: 'I am angry.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Normal', icon: 'angry', enabled: true, isCustom: false },
  { id: 'sys_fel_4', text: 'I am scared.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Important', icon: 'scared', enabled: true, isCustom: false },
  { id: 'sys_fel_5', text: 'I am tired.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Normal', icon: 'tired', enabled: true, isCustom: false },
  { id: 'sys_fel_6', text: 'I am confused.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Normal', icon: 'question', enabled: true, isCustom: false },
  { id: 'sys_fel_7', text: 'I am uncomfortable.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Important', icon: 'uncomfortable', enabled: true, isCustom: false },
  { id: 'sys_fel_8', text: 'I am worried.', category: 'Feelings', ageGroup: 'All Ages', priority: 'Important', icon: 'scared', enabled: true, isCustom: false },

  // HEALTH
  { id: 'sys_hlt_1', text: 'I am in pain.', category: 'Health', ageGroup: 'All Ages', priority: 'Emergency', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_hlt_2', text: 'I feel sick.', category: 'Health', ageGroup: 'All Ages', priority: 'Important', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_hlt_3', text: 'I feel dizzy.', category: 'Health', ageGroup: 'All Ages', priority: 'Important', icon: 'uncomfortable', enabled: true, isCustom: false },
  { id: 'sys_hlt_4', text: 'I need medicine.', category: 'Health', ageGroup: 'All Ages', priority: 'Important', icon: 'medicine', enabled: true, isCustom: false },
  { id: 'sys_hlt_5', text: 'I need to see a doctor.', category: 'Health', ageGroup: 'All Ages', priority: 'Emergency', icon: 'doctor', enabled: true, isCustom: false },
  { id: 'sys_hlt_6', text: 'I need help.', category: 'Health', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_hlt_7', text: 'I am having difficulty breathing.', category: 'Health', ageGroup: 'All Ages', priority: 'Emergency', icon: 'breathing', enabled: true, isCustom: false },

  // SOCIAL
  { id: 'sys_soc_1', text: 'Hello.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'hand', enabled: true, isCustom: false },
  { id: 'sys_soc_2', text: 'Goodbye.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'hand', enabled: true, isCustom: false },
  { id: 'sys_soc_3', text: 'Thank you.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'thumbsup', enabled: true, isCustom: false },
  { id: 'sys_soc_4', text: 'Please.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'heart', enabled: true, isCustom: false },
  { id: 'sys_soc_5', text: 'I want to talk.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'chat', enabled: true, isCustom: false },
  { id: 'sys_soc_6', text: "I don't want to talk.", category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'stop', enabled: true, isCustom: false },
  { id: 'sys_soc_7', text: 'Can you help me?', category: 'Social', ageGroup: 'All Ages', priority: 'Important', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_soc_8', text: 'I like this.', category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'thumbsup', enabled: true, isCustom: false },
  { id: 'sys_soc_9', text: "I don't like this.", category: 'Social', ageGroup: 'All Ages', priority: 'Normal', icon: 'thumbsdown', enabled: true, isCustom: false },

  // ACTIVITIES
  { id: 'sys_act_1', text: 'I want to play.', category: 'Activities', ageGroup: 'Children', priority: 'Normal', icon: 'play', enabled: true, isCustom: false },
  { id: 'sys_act_2', text: 'I want to watch TV.', category: 'Activities', ageGroup: 'All Ages', priority: 'Normal', icon: 'tv', enabled: true, isCustom: false },
  { id: 'sys_act_3', text: 'I want to listen to music.', category: 'Activities', ageGroup: 'All Ages', priority: 'Normal', icon: 'music', enabled: true, isCustom: false },
  { id: 'sys_act_4', text: 'I want to go outside.', category: 'Activities', ageGroup: 'All Ages', priority: 'Normal', icon: 'outside', enabled: true, isCustom: false },
  { id: 'sys_act_5', text: 'I want to draw.', category: 'Activities', ageGroup: 'Children', priority: 'Normal', icon: 'draw', enabled: true, isCustom: false },
  { id: 'sys_act_6', text: 'I want to rest.', category: 'Activities', ageGroup: 'All Ages', priority: 'Normal', icon: 'sleep', enabled: true, isCustom: false },
  { id: 'sys_act_7', text: 'I want to use the computer.', category: 'Activities', ageGroup: 'All Ages', priority: 'Normal', icon: 'computer', enabled: true, isCustom: false },

  // EMERGENCY (High urgency phrases, visually distinct)
  { id: 'sys_emg_1', text: 'I need help.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'help', enabled: true, isCustom: false },
  { id: 'sys_emg_2', text: 'I am hurt.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_emg_3', text: 'I am in pain.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_emg_4', text: 'I feel sick.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'pain', enabled: true, isCustom: false },
  { id: 'sys_emg_5', text: 'I cannot breathe properly.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'breathing', enabled: true, isCustom: false },
  { id: 'sys_emg_6', text: 'Call my parent.', category: 'Emergency', ageGroup: 'Children', priority: 'Emergency', icon: 'phone', enabled: true, isCustom: false },
  { id: 'sys_emg_7', text: 'Call my caregiver.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'phone', enabled: true, isCustom: false },
  { id: 'sys_emg_8', text: 'Call emergency services.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'phone', enabled: true, isCustom: false },
  { id: 'sys_emg_9', text: 'Please stay with me.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'heart', enabled: true, isCustom: false },
  { id: 'sys_emg_10', text: 'I am lost.', category: 'Emergency', ageGroup: 'All Ages', priority: 'Emergency', icon: 'help', enabled: true, isCustom: false }
];

export const INITIAL_CUSTOM_PHRASES = [
  {
    id: 'cust_1',
    text: 'I want my mother.',
    category: 'Home',
    ageGroup: 'Children',
    priority: 'Important',
    icon: 'family',
    enabled: true,
    isCustom: true,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'cust_2',
    text: 'I need my blue bag.',
    category: 'School',
    ageGroup: 'Children',
    priority: 'Normal',
    icon: 'pencil',
    enabled: true,
    isCustom: true,
    createdAt: Date.now() - 2500000
  },
  {
    id: 'cust_3',
    text: 'I want to go to the park.',
    category: 'Activities',
    ageGroup: 'Children',
    priority: 'Normal',
    icon: 'outside',
    enabled: true,
    isCustom: true,
    createdAt: Date.now() - 1000000
  }
];
