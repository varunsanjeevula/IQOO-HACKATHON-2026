import { v4 as uuidv4 } from 'uuid';

export function getDemoData() {
  const baseDate = new Date(); // Sept 22, 2026 if run today
  
  function addDays(days: number) {
    const d = new Date(baseDate.getTime());
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  // Pre-generate UUIDs for relationships
  const m1_id = uuidv4();
  const m2_id = uuidv4();
  const m3_id = uuidv4();
  const m4_id = uuidv4();
  const m5_id = uuidv4();
  const m6_id = uuidv4();
  const m7_id = uuidv4();
  const m8_id = uuidv4();
  const m9_id = uuidv4();
  const m10_id = uuidv4();
  const m11_id = uuidv4();
  const m12_id = uuidv4();
  const m13_id = uuidv4();
  const m14_id = uuidv4();
  const m15_id = uuidv4();

  const mockTfIdf = (text: string) => {
    // Generate a naive TF-IDF pseudo-embedding as an array of 512 floats
    const arr = new Array(512).fill(0);
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    for (const w of words) {
      if (!w) continue;
      let hash = 0;
      for (let i = 0; i < w.length; i++) hash = ((hash << 5) - hash) + w.charCodeAt(i);
      arr[Math.abs(hash) % 512] += 1;
    }
    // normalize
    const mag = Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));
    if (mag > 0) {
      for (let i = 0; i < 512; i++) arr[i] /= mag;
    }
    return JSON.stringify(arr);
  };

  const memories = [
    {
      id: m1_id,
      user_id: 'demo-user',
      title: 'Lenovo IdeaPad Slim 5 Laptop Invoice',
      description: 'Invoice for new laptop from Croma',
      category: 'Invoice',
      file_path: '/uploads/demo-laptop-invoice.pdf',
      thumbnail_path: null,
      extracted_text: 'Invoice ₹72,999 Croma, Inorbit Mall, Hyderabad. Purchased Sep 12, 2026. Serial: LEN-2026-HYD-4521 electronics laptop',
      summary: 'Purchased Lenovo IdeaPad Slim 5 for ₹72,999 from Croma, Hyderabad on Sep 12, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Lenovo IdeaPad Slim 5 Laptop Invoice',
        category: 'Invoice',
        summary: 'Purchased Lenovo IdeaPad Slim 5 for ₹72,999 from Croma, Hyderabad on Sep 12, 2026.',
        entities: [
          { type: 'product', name: 'Laptop', value: 'Lenovo IdeaPad Slim 5' },
          { type: 'amount', name: 'Price', value: '72999' },
          { type: 'location', name: 'Store', value: 'Croma, Inorbit Mall, Hyderabad' }
        ],
        importantDates: [addDays(-10)],
        keywords: ['lenovo', 'laptop', 'electronics', 'invoice']
      }),
      embedding: mockTfIdf('lenovo laptop electronics invoice croma hyderabad 72999'),
      created_at: addDays(-10),
      updated_at: addDays(-10),
      metadata: null
    },
    {
      id: m2_id,
      user_id: 'demo-user',
      title: 'Lenovo Laptop Warranty Card',
      description: '1 year warranty for Lenovo IdeaPad',
      category: 'Warranty',
      file_path: '/uploads/demo-warranty.pdf',
      thumbnail_path: null,
      extracted_text: '1 year warranty, expires Sep 12, 2027. Covers manufacturing defects. Service center: Lenovo Authorized, Begumpet, Hyderabad. electronics laptop',
      summary: 'Lenovo laptop warranty valid until Sep 12, 2027.',
      ai_analysis: JSON.stringify({
        title: 'Lenovo Laptop Warranty Card',
        category: 'Warranty',
        summary: 'Lenovo laptop warranty valid until Sep 12, 2027.',
        entities: [
          { type: 'company', name: 'Service Center', value: 'Lenovo Authorized, Begumpet' }
        ],
        importantDates: [addDays(355)],
        keywords: ['warranty', 'lenovo', 'laptop', 'electronics', 'repair']
      }),
      embedding: mockTfIdf('warranty lenovo laptop electronics repair hyderabad expire'),
      created_at: addDays(-10),
      updated_at: addDays(-10),
      metadata: null
    },
    {
      id: m3_id,
      user_id: 'demo-user',
      title: 'iPhone 15 Purchase Receipt',
      description: 'Receipt from Apple Store',
      category: 'Receipt',
      file_path: '/uploads/demo-iphone.pdf',
      thumbnail_path: null,
      extracted_text: '₹79,999 Apple Store, Banjara Hills, Hyderabad. Aug 5, 2026. IMEI: 35XXXXXXXXX electronics phone',
      summary: 'Purchased iPhone 15 for ₹79,999 from Apple Store, Hyderabad.',
      ai_analysis: JSON.stringify({
        title: 'iPhone 15 Purchase Receipt',
        category: 'Receipt',
        summary: 'Purchased iPhone 15 for ₹79,999 from Apple Store, Hyderabad.',
        entities: [
          { type: 'product', name: 'Phone', value: 'iPhone 15' },
          { type: 'amount', name: 'Price', value: '79999' }
        ],
        importantDates: [addDays(-48)],
        keywords: ['iphone', 'apple', 'electronics', 'phone', 'receipt']
      }),
      embedding: mockTfIdf('iphone apple electronics phone receipt 79999 hyderabad banjara hills'),
      created_at: addDays(-48),
      updated_at: addDays(-48),
      metadata: null
    },
    {
      id: m4_id,
      user_id: 'demo-user',
      title: 'Train Ticket Hyderabad to Chennai',
      description: 'Rajdhani Express train ticket',
      category: 'Travel',
      file_path: '/uploads/demo-train.pdf',
      thumbnail_path: null,
      extracted_text: 'Rajdhani Express 12723, Sep 28, 2026, Dep 6:00 PM Secunderabad, Arr 11:30 PM Chennai Central. Coach B4, Seat 32, PNR: 842XXXXXXX. ₹1,850.',
      summary: 'Train ticket to Chennai on Sep 28, 2026 via Rajdhani Express.',
      ai_analysis: JSON.stringify({
        title: 'Train Ticket Hyderabad to Chennai',
        category: 'Travel',
        summary: 'Train ticket to Chennai on Sep 28, 2026 via Rajdhani Express.',
        entities: [
          { type: 'location', name: 'From', value: 'Secunderabad' },
          { type: 'location', name: 'To', value: 'Chennai Central' },
          { type: 'amount', name: 'Price', value: '1850' }
        ],
        importantDates: [addDays(6)],
        keywords: ['train', 'travel', 'chennai', 'hyderabad', 'rajdhani', 'ticket']
      }),
      embedding: mockTfIdf('train travel chennai hyderabad rajdhani ticket journey'),
      created_at: addDays(-2),
      updated_at: addDays(-2),
      metadata: null
    },
    {
      id: m5_id,
      user_id: 'demo-user',
      title: 'Flight Ticket Hyderabad to Delhi',
      description: 'IndiGo flight ticket',
      category: 'Travel',
      file_path: '/uploads/demo-flight.pdf',
      thumbnail_path: null,
      extracted_text: 'IndiGo 6E-204, Oct 15, 2026, Dep 6:30 AM RGIA Hyderabad, Arr 8:45 AM IGI Delhi T1. Seat 14A. Booking ref: IND-HYD-DEL-8842. ₹4,599.',
      summary: 'IndiGo flight to Delhi on Oct 15, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Flight Ticket Hyderabad to Delhi',
        category: 'Travel',
        summary: 'IndiGo flight to Delhi on Oct 15, 2026.',
        entities: [
          { type: 'location', name: 'From', value: 'Hyderabad RGIA' },
          { type: 'location', name: 'To', value: 'Delhi IGI' }
        ],
        importantDates: [addDays(23)],
        keywords: ['flight', 'travel', 'delhi', 'hyderabad', 'indigo', 'ticket']
      }),
      embedding: mockTfIdf('flight travel delhi hyderabad indigo ticket airplane'),
      created_at: addDays(-5),
      updated_at: addDays(-5),
      metadata: null
    },
    {
      id: m6_id,
      user_id: 'demo-user',
      title: 'ABC Rooftop Restaurant',
      description: 'Friend recommended restaurant in Hyderabad',
      category: 'Screenshot',
      file_path: '/uploads/demo-restaurant.png',
      thumbnail_path: null,
      extracted_text: 'Friend recommended. Road No 36, Jubilee Hills, Hyderabad. Rating 4.5/5. Known for rooftop dining, North Indian & Chinese cuisine. Contact: +91 98765 43210',
      summary: 'Rooftop restaurant recommendation in Jubilee Hills, Hyderabad.',
      ai_analysis: JSON.stringify({
        title: 'ABC Rooftop Restaurant',
        category: 'Screenshot',
        summary: 'Rooftop restaurant recommendation in Jubilee Hills, Hyderabad.',
        entities: [
          { type: 'location', name: 'Address', value: 'Road No 36, Jubilee Hills, Hyderabad' },
          { type: 'phone', name: 'Contact', value: '+91 98765 43210' }
        ],
        importantDates: [],
        keywords: ['restaurant', 'food', 'hyderabad', 'jubilee hills', 'rooftop', 'dining']
      }),
      embedding: mockTfIdf('restaurant food hyderabad jubilee hills rooftop dining friend recommended'),
      created_at: addDays(-35),
      updated_at: addDays(-35),
      metadata: null
    },
    {
      id: m7_id,
      user_id: 'demo-user',
      title: 'Taj Club House Chennai Booking',
      description: 'Hotel booking for Chennai trip',
      category: 'Travel',
      file_path: '/uploads/demo-hotel.pdf',
      thumbnail_path: null,
      extracted_text: 'Sep 28-30, 2026, 2 nights. Deluxe Room, ₹8,500/night. Booking ID: TAJ-CHN-2026-1847. Check-in 2 PM, Check-out 12 PM.',
      summary: '2-night stay at Taj Club House Chennai from Sep 28, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Taj Club House Chennai Booking',
        category: 'Travel',
        summary: '2-night stay at Taj Club House Chennai from Sep 28, 2026.',
        entities: [
          { type: 'location', name: 'Hotel', value: 'Taj Club House Chennai' }
        ],
        importantDates: [addDays(6), addDays(8)],
        keywords: ['hotel', 'travel', 'chennai', 'stay', 'taj']
      }),
      embedding: mockTfIdf('hotel travel chennai stay taj booking accommodation'),
      created_at: addDays(-2),
      updated_at: addDays(-2),
      metadata: null
    },
    {
      id: m8_id,
      user_id: 'demo-user',
      title: 'Electricity Bill Sep 2026',
      description: 'Monthly electricity bill',
      category: 'Bill',
      file_path: '/uploads/demo-electricity.pdf',
      thumbnail_path: null,
      extracted_text: 'TS Southern Power, Consumer No: 5012XXXXX. ₹2,340. Due date: Sep 25, 2026. Units consumed: 285.',
      summary: 'Electricity bill of ₹2,340 due on Sep 25, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Electricity Bill Sep 2026',
        category: 'Bill',
        summary: 'Electricity bill of ₹2,340 due on Sep 25, 2026.',
        entities: [
          { type: 'company', name: 'Provider', value: 'TS Southern Power' },
          { type: 'amount', name: 'Bill Amount', value: '2340' }
        ],
        importantDates: [addDays(3)],
        keywords: ['bill', 'electricity', 'utility', 'payment']
      }),
      embedding: mockTfIdf('bill electricity utility payment hyderabad power'),
      created_at: addDays(-3),
      updated_at: addDays(-3),
      metadata: null
    },
    {
      id: m9_id,
      user_id: 'demo-user',
      title: 'Jio Fiber Internet Bill',
      description: 'Monthly internet bill',
      category: 'Bill',
      file_path: '/uploads/demo-internet.pdf',
      thumbnail_path: null,
      extracted_text: 'Plan: ₹999/month, 150 Mbps. Account: JIO-FBR-HYD-XXXX. Due: Oct 1, 2026. Billing period: Sep 1-30, 2026.',
      summary: 'Jio Fiber bill of ₹999 due on Oct 1, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Jio Fiber Internet Bill',
        category: 'Bill',
        summary: 'Jio Fiber bill of ₹999 due on Oct 1, 2026.',
        entities: [
          { type: 'company', name: 'Provider', value: 'Jio' },
          { type: 'amount', name: 'Bill Amount', value: '999' }
        ],
        importantDates: [addDays(9)],
        keywords: ['bill', 'internet', 'jio', 'broadband', 'utility']
      }),
      embedding: mockTfIdf('bill internet jio broadband utility wifi payment'),
      created_at: addDays(-2),
      updated_at: addDays(-2),
      metadata: null
    },
    {
      id: m10_id,
      user_id: 'demo-user',
      title: 'B.Tech Degree Certificate',
      description: 'Graduation certificate',
      category: 'Certificate',
      file_path: '/uploads/demo-degree.pdf',
      thumbnail_path: null,
      extracted_text: 'JNTU Hyderabad, Computer Science & Engineering, Class of 2024. Roll No: 20XXXXXX. CGPA: 8.7/10. Issued June 2024.',
      summary: 'B.Tech CSE Degree Certificate from JNTU Hyderabad.',
      ai_analysis: JSON.stringify({
        title: 'B.Tech Degree Certificate',
        category: 'Certificate',
        summary: 'B.Tech CSE Degree Certificate from JNTU Hyderabad.',
        entities: [
          { type: 'organization', name: 'University', value: 'JNTU Hyderabad' }
        ],
        importantDates: [],
        keywords: ['certificate', 'degree', 'education', 'university', 'jntu', 'college']
      }),
      embedding: mockTfIdf('certificate degree education university jntu btech engineering'),
      created_at: addDays(-800),
      updated_at: addDays(-800),
      metadata: null
    },
    {
      id: m11_id,
      user_id: 'demo-user',
      title: 'Dr. Sharma Prescription',
      description: 'Medical prescription for infection',
      category: 'Medical',
      file_path: '/uploads/demo-prescription.pdf',
      thumbnail_path: null,
      extracted_text: 'Dr. Priya Sharma, Apollo Clinic, Madhapur. Date: Sep 15, 2026. Diagnosis: Upper respiratory infection. Medicines: Amoxicillin 500mg 3x/day 5 days, Cetirizine 10mg 1x/day. Follow-up: Sep 22, 2026.',
      summary: 'Prescription from Dr. Sharma for respiratory infection with follow-up on Sep 22, 2026.',
      ai_analysis: JSON.stringify({
        title: 'Dr. Sharma Prescription',
        category: 'Medical',
        summary: 'Prescription from Dr. Sharma for respiratory infection.',
        entities: [
          { type: 'name', name: 'Doctor', value: 'Dr. Priya Sharma' },
          { type: 'location', name: 'Clinic', value: 'Apollo Clinic, Madhapur' }
        ],
        importantDates: [addDays(0)],
        keywords: ['medical', 'doctor', 'health', 'prescription', 'medicine', 'hospital']
      }),
      embedding: mockTfIdf('medical doctor health prescription medicine hospital infection amoxicillin cetirizine'),
      created_at: addDays(-7),
      updated_at: addDays(-7),
      metadata: null
    },
    {
      id: m12_id,
      user_id: 'demo-user',
      title: 'boAt Airdopes 141 Receipt',
      description: 'Amazon receipt for earbuds',
      category: 'Receipt',
      file_path: '/uploads/demo-earbuds.pdf',
      thumbnail_path: null,
      extracted_text: '₹1,999 from Amazon.in. Order ID: 402-XXXXXXX. Aug 20, 2026. Color: Midnight Black. electronics',
      summary: 'Purchased boAt Airdopes 141 for ₹1,999 from Amazon.',
      ai_analysis: JSON.stringify({
        title: 'boAt Airdopes 141 Receipt',
        category: 'Receipt',
        summary: 'Purchased boAt Airdopes 141 for ₹1,999 from Amazon.',
        entities: [
          { type: 'product', name: 'Item', value: 'boAt Airdopes 141' },
          { type: 'amount', name: 'Price', value: '1999' }
        ],
        importantDates: [addDays(-33)],
        keywords: ['electronics', 'audio', 'earbuds', 'amazon', 'receipt', 'boat']
      }),
      embedding: mockTfIdf('electronics audio earbuds amazon receipt boat 1999'),
      created_at: addDays(-33),
      updated_at: addDays(-33),
      metadata: null
    },
    {
      id: m13_id,
      user_id: 'demo-user',
      title: 'HDFC Ergo Health Insurance',
      description: 'Health insurance policy document',
      category: 'Insurance',
      file_path: '/uploads/demo-insurance.pdf',
      thumbnail_path: null,
      extracted_text: 'Policy: HDFC-ERG-2026-XXXXX. Coverage: ₹5,00,000. Premium: ₹12,000/year. Valid: Apr 1, 2026 - Mar 31, 2027. Covers: Hospitalization, Day care, Pre/Post hospitalization.',
      summary: 'HDFC Ergo Health Insurance policy valid until Mar 31, 2027.',
      ai_analysis: JSON.stringify({
        title: 'HDFC Ergo Health Insurance',
        category: 'Insurance',
        summary: 'HDFC Ergo Health Insurance policy valid until Mar 31, 2027.',
        entities: [
          { type: 'company', name: 'Provider', value: 'HDFC Ergo' }
        ],
        importantDates: [addDays(190)],
        keywords: ['insurance', 'health', 'policy', 'medical', 'hdfc']
      }),
      embedding: mockTfIdf('insurance health policy medical hdfc coverage hospital'),
      created_at: addDays(-174),
      updated_at: addDays(-174),
      metadata: null
    },
    {
      id: m14_id,
      user_id: 'demo-user',
      title: 'Amazon Order Laptop Stand',
      description: 'Receipt for laptop stand',
      category: 'Receipt',
      file_path: '/uploads/demo-stand.pdf',
      thumbnail_path: null,
      extracted_text: 'AmazonBasics Laptop Stand, ₹1,499. Order: 403-XXXXXXX. Delivered Sep 14, 2026. For use with Lenovo laptop. electronics',
      summary: 'Purchased AmazonBasics Laptop Stand for ₹1,499.',
      ai_analysis: JSON.stringify({
        title: 'Amazon Order Laptop Stand',
        category: 'Receipt',
        summary: 'Purchased AmazonBasics Laptop Stand for ₹1,499.',
        entities: [
          { type: 'product', name: 'Item', value: 'Laptop Stand' },
          { type: 'amount', name: 'Price', value: '1499' }
        ],
        importantDates: [addDays(-8)],
        keywords: ['laptop', 'stand', 'amazon', 'electronics', 'accessory', 'receipt']
      }),
      embedding: mockTfIdf('laptop stand amazon electronics accessory receipt 1499 lenovo'),
      created_at: addDays(-8),
      updated_at: addDays(-8),
      metadata: null
    },
    {
      id: m15_id,
      user_id: 'demo-user',
      title: 'New Apartment Address',
      description: 'Saved address for new flat',
      category: 'Screenshot',
      file_path: '/uploads/demo-address.png',
      thumbnail_path: null,
      extracted_text: 'Flat 402, Sunshine Residency, Road No 12, Madhapur, Hyderabad - 500081. Near Inorbit Mall. Saved Aug 25, 2026.',
      summary: 'New apartment address in Madhapur, Hyderabad.',
      ai_analysis: JSON.stringify({
        title: 'New Apartment Address',
        category: 'Screenshot',
        summary: 'New apartment address in Madhapur, Hyderabad.',
        entities: [
          { type: 'location', name: 'Address', value: 'Flat 402, Sunshine Residency, Madhapur' }
        ],
        importantDates: [],
        keywords: ['address', 'home', 'apartment', 'hyderabad', 'madhapur', 'location']
      }),
      embedding: mockTfIdf('address home apartment hyderabad madhapur location flat residence'),
      created_at: addDays(-28),
      updated_at: addDays(-28),
      metadata: null
    }
  ];

  const relationships = [
    { id: uuidv4(), memory_id: m1_id, related_memory_id: m2_id, relationship_type: 'same_product', confidence: 0.95 },
    { id: uuidv4(), memory_id: m1_id, related_memory_id: m14_id, relationship_type: 'related_product', confidence: 0.80 },
    { id: uuidv4(), memory_id: m2_id, related_memory_id: m14_id, relationship_type: 'related_product', confidence: 0.70 },
    { id: uuidv4(), memory_id: m4_id, related_memory_id: m7_id, relationship_type: 'same_trip', confidence: 0.90 },
    { id: uuidv4(), memory_id: m4_id, related_memory_id: m5_id, relationship_type: 'same_category', confidence: 0.60 },
    { id: uuidv4(), memory_id: m3_id, related_memory_id: m12_id, relationship_type: 'same_category', confidence: 0.65 },
    { id: uuidv4(), memory_id: m8_id, related_memory_id: m9_id, relationship_type: 'same_category', confidence: 0.70 },
  ];

  const reminders = [
    { id: uuidv4(), user_id: 'demo-user', memory_id: m8_id, title: 'Pay Electricity Bill', description: 'Bill due on Sep 25', reminder_date: addDays(3), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m4_id, title: 'Train to Chennai', description: 'Rajdhani Express', reminder_date: addDays(6), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m7_id, title: 'Hotel Check-in', description: 'Taj Club House', reminder_date: addDays(6), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m5_id, title: 'Flight to Delhi', description: 'IndiGo flight', reminder_date: addDays(23), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m2_id, title: 'Laptop Warranty Expiry', description: 'Warranty expires soon', reminder_date: addDays(355), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m13_id, title: 'Insurance Renewal', description: 'HDFC Ergo health insurance', reminder_date: addDays(190), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m11_id, title: 'Doctor Follow-up', description: 'Follow up with Dr. Sharma', reminder_date: addDays(0), status: 'pending', created_at: baseDate.toISOString() },
    { id: uuidv4(), user_id: 'demo-user', memory_id: m9_id, title: 'Pay Jio Bill', description: 'Internet bill due', reminder_date: addDays(9), status: 'pending', created_at: baseDate.toISOString() }
  ];

  return { memories, relationships, reminders };
}
