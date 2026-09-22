import { Memory, Reminder, Insights } from '../types';

export const demoMemories: Memory[] = [
  {
    id: 'm1',
    user_id: 'u1',
    title: 'MacBook Pro M3 Invoice',
    description: 'Purchase receipt for MacBook Pro M3 Max from Apple Store',
    category: 'invoice',
    file_path: '/demo/macbook.pdf',
    thumbnail_path: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    extracted_text: 'Apple Store Bandra Kurla Complex. MacBook Pro 16-inch M3 Max. Total: ₹3,19,900. Date: 15 Oct 2023. Warranty: 1 Year AppleCare included.',
    summary: 'Invoice for MacBook Pro M3 Max purchased from Apple Store BKC for ₹3,19,900.',
    ai_analysis: {
      title: 'MacBook Pro M3 Invoice',
      category: 'Electronics Invoice',
      summary: 'Invoice for MacBook Pro M3 Max purchased from Apple Store BKC for ₹3,19,900.',
      entities: [
        { type: 'product', name: 'Product', value: 'MacBook Pro 16-inch M3 Max' },
        { type: 'amount', name: 'Amount', value: '₹3,19,900' },
        { type: 'merchant', name: 'Merchant', value: 'Apple Store BKC' }
      ],
      importantDates: [
        { date: '2023-10-15', description: 'Purchase Date', type: 'purchase' },
        { date: '2024-10-15', description: 'Warranty Expiry', type: 'expiry' }
      ],
      keywords: ['laptop', 'macbook', 'apple', 'electronics', 'work'],
      warrantyInfo: { expiryDate: '2024-10-15', details: '1 Year AppleCare' }
    },
    created_at: '2023-10-16T10:00:00Z',
    updated_at: '2023-10-16T10:00:00Z',
    metadata: {}
  },
  {
    id: 'm2',
    user_id: 'u1',
    title: 'Train Ticket to Chennai',
    description: 'Vande Bharat Express ticket from Hyderabad to Chennai',
    category: 'ticket',
    file_path: '/demo/ticket.pdf',
    thumbnail_path: 'https://images.unsplash.com/photo-1563299796-b729d0af2df9?w=800&q=80',
    extracted_text: 'IRCTC E-Ticket. PNR: 4234987123. Train: 20701 SC MAS VANDE BHARAT. Secunderabad Jn to MGR Chennai Central. Date of Journey: 25 Sep 2026. Coach: C4, Seat: 42,43.',
    summary: 'Vande Bharat train ticket from Secunderabad to Chennai for Sep 25, 2026.',
    ai_analysis: {
      title: 'Vande Bharat Ticket to Chennai',
      category: 'Travel',
      summary: 'Vande Bharat train ticket from Secunderabad to Chennai for Sep 25, 2026.',
      entities: [
        { type: 'transport_mode', name: 'Train', value: 'Vande Bharat Express' },
        { type: 'origin', name: 'From', value: 'Secunderabad Jn' },
        { type: 'destination', name: 'To', value: 'MGR Chennai Central' },
        { type: 'pnr', name: 'PNR', value: '4234987123' }
      ],
      importantDates: [
        { date: '2026-09-25T06:00:00Z', description: 'Departure', type: 'travel' }
      ],
      keywords: ['train', 'travel', 'chennai', 'trip']
    },
    created_at: '2026-09-10T14:30:00Z',
    updated_at: '2026-09-10T14:30:00Z',
    metadata: {}
  },
  {
    id: 'm3',
    user_id: 'u1',
    title: 'Bawarchi Restaurant Bill',
    description: 'Dinner with friends',
    category: 'receipt',
    file_path: '/demo/bawarchi.jpg',
    thumbnail_path: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    extracted_text: 'Bawarchi Restaurant, RTC X Roads, Hyderabad. 2x Chicken Biryani, 1x Mutton Kebab. Total: ₹950. Date: 12 Aug 2026.',
    summary: 'Restaurant bill from Bawarchi for ₹950.',
    ai_analysis: {
      title: 'Bawarchi Restaurant Bill',
      category: 'Food & Dining',
      summary: 'Restaurant bill from Bawarchi for ₹950.',
      entities: [
        { type: 'merchant', name: 'Restaurant', value: 'Bawarchi' },
        { type: 'amount', name: 'Amount', value: '₹950' },
        { type: 'location', name: 'Location', value: 'Hyderabad' }
      ],
      importantDates: [
        { date: '2026-08-12', description: 'Visit Date', type: 'visit' }
      ],
      keywords: ['food', 'dinner', 'biryani', 'hyderabad']
    },
    created_at: '2026-08-13T09:15:00Z',
    updated_at: '2026-08-13T09:15:00Z',
    metadata: {}
  },
  {
    id: 'm4',
    user_id: 'u1',
    title: 'Dr. Sharma Prescription',
    description: 'Routine checkup and blood work',
    category: 'medical',
    file_path: '/demo/prescription.jpg',
    thumbnail_path: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&q=80',
    extracted_text: 'Apollo Hospitals. Dr. Sharma, General Physician. Patient has mild vitamin D deficiency. Rx: Calciferol 60k IU weekly. Follow up in 3 months.',
    summary: 'Prescription from Dr. Sharma for Vitamin D supplements. Follow up needed in 3 months.',
    ai_analysis: {
      title: 'Dr. Sharma Prescription',
      category: 'Medical',
      summary: 'Prescription from Dr. Sharma for Vitamin D supplements. Follow up needed in 3 months.',
      entities: [
        { type: 'doctor', name: 'Doctor', value: 'Dr. Sharma' },
        { type: 'hospital', name: 'Hospital', value: 'Apollo Hospitals' },
        { type: 'diagnosis', name: 'Diagnosis', value: 'Vitamin D Deficiency' }
      ],
      importantDates: [
        { date: '2026-11-20', description: 'Follow-up Appointment', type: 'appointment' }
      ],
      keywords: ['health', 'doctor', 'checkup', 'prescription']
    },
    created_at: '2026-08-20T11:20:00Z',
    updated_at: '2026-08-20T11:20:00Z',
    metadata: {}
  }
];

export const demoReminders: Reminder[] = [
  {
    id: 'r1',
    user_id: 'u1',
    memory_id: 'm2',
    title: 'Train to Chennai',
    description: 'Departure from Secunderabad Jn',
    reminder_date: '2026-09-25T04:00:00Z',
    status: 'pending',
    created_at: '2026-09-10T14:35:00Z',
    memory: demoMemories[1]
  },
  {
    id: 'r2',
    user_id: 'u1',
    memory_id: 'm1',
    title: 'MacBook Warranty Expires Soon',
    description: 'AppleCare warranty expires on Oct 15',
    reminder_date: '2024-10-01T09:00:00Z',
    status: 'completed',
    created_at: '2023-10-16T10:05:00Z',
    memory: demoMemories[0]
  },
  {
    id: 'r3',
    user_id: 'u1',
    memory_id: 'm4',
    title: 'Follow-up with Dr. Sharma',
    description: 'Schedule appointment at Apollo Hospitals',
    reminder_date: '2026-11-15T09:00:00Z',
    status: 'pending',
    created_at: '2026-08-20T11:25:00Z',
    memory: demoMemories[3]
  }
];

export const demoInsights: Insights = {
  totalMemories: 42,
  categoryCounts: {
    receipt: 15,
    invoice: 8,
    travel: 5,
    medical: 4,
    other: 10
  },
  recentlyAdded: demoMemories,
  upcomingExpiries: demoReminders.filter(r => r.title.includes('Warranty')),
  upcomingReminders: demoReminders.filter(r => r.status === 'pending')
};
