// ─── Fee Structures ────────────────────────────────────────────────────────
export const MOCK_FEE_STRUCTURES = [
  { id: 1, class_section: "Grade 10-A", monthly_fee: 15000 },
  { id: 2, class_section: "Grade 10-B", monthly_fee: 15000 },
  { id: 3, class_section: "Grade 9-A", monthly_fee: 12000 },
  { id: 4, class_section: "Grade 9-B", monthly_fee: 12000 },
  { id: 5, class_section: "Grade 8-A", monthly_fee: 10000 },
  { id: 6, class_section: "Grade 8-B", monthly_fee: 10000 },
];

// ─── Fee Records ──────────────────────────────────────────────────────────
export const MOCK_FEES = [
  {
    id: 1,
    student_id: 1,
    student_name: "Zain Ahmed",
    roll_number: "#22091",
    class_section: "Grade 10-A",
    original_amount: 15000,
    scholarship_percentage: 25,
    amount: 11250,
    amount_paid: 11250,
    status: "paid",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: "2023-08-05",
  },
  {
    id: 2,
    student_id: 2,
    student_name: "Ayesha Khan",
    roll_number: "#22095",
    class_section: "Grade 9-B",
    original_amount: 12000,
    scholarship_percentage: 0,
    amount: 12000,
    amount_paid: 0,
    status: "overdue",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: null,
  },
  {
    id: 3,
    student_id: 3,
    student_name: "Omar Farooq",
    roll_number: "#22088",
    class_section: "Grade 10-A",
    original_amount: 15000,
    scholarship_percentage: 100,
    amount: 0,
    amount_paid: 0,
    status: "waived",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: null,
  },
  {
    id: 4,
    student_id: 4,
    student_name: "Fatima Malik",
    roll_number: "#22102",
    class_section: "Grade 10-B",
    original_amount: 15000,
    scholarship_percentage: 0,
    amount: 15000,
    amount_paid: 5000,
    status: "partial",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: null,
  },
  {
    id: 5,
    student_id: 5,
    student_name: "Bilal Sheikh",
    roll_number: "#22115",
    class_section: "Grade 9-A",
    original_amount: 12000,
    scholarship_percentage: 50,
    amount: 6000,
    amount_paid: 6000,
    status: "paid",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: "2023-08-08",
  },
  {
    id: 6,
    student_id: 6,
    student_name: "Sara Ahmed",
    roll_number: "#22120",
    class_section: "Grade 8-A",
    original_amount: 10000,
    scholarship_percentage: 0,
    amount: 10000,
    amount_paid: 0,
    status: "pending",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: null,
  },
  {
    id: 7,
    student_id: 7,
    student_name: "Hamid Raza",
    roll_number: "#22133",
    class_section: "Grade 8-B",
    original_amount: 10000,
    scholarship_percentage: 25,
    amount: 7500,
    amount_paid: 7500,
    status: "paid",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: "2023-08-06",
  },
  {
    id: 8,
    student_id: 8,
    student_name: "Zara Qureshi",
    roll_number: "#22140",
    class_section: "Grade 10-B",
    original_amount: 15000,
    scholarship_percentage: 0,
    amount: 15000,
    amount_paid: 0,
    status: "overdue",
    month: "2023-08-01",
    due_date: "2023-08-10",
    paid_date: null,
  },
];

// ─── Class Options ────────────────────────────────────────────────────────
export const MOCK_CLASS_OPTIONS = [
  { value: 'all', label: 'All Classes' },
  { value: 'Grade 10-A', label: 'Grade 10-A' },
  { value: 'Grade 10-B', label: 'Grade 10-B' },
  { value: 'Grade 9-A', label: 'Grade 9-A' },
  { value: 'Grade 9-B', label: 'Grade 9-B' },
  { value: 'Grade 8-A', label: 'Grade 8-A' },
  { value: 'Grade 8-B', label: 'Grade 8-B' },
];

// ─── Status Options ──────────────────────────────────────────────────────
export const FEE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'partial', label: 'Partial' },
  { value: 'waived', label: 'Waived' },
];

// ─── Scholarship Options ─────────────────────────────────────────────────
export const SCHOLARSHIP_OPTIONS = [
  { value: 'all', label: 'All Scholarships' },
  { value: '0', label: '0%' },
  { value: '25', label: '25%' },
  { value: '50', label: '50%' },
  { value: '100', label: '100%' },
];

// ─── Stats Helper ────────────────────────────────────────────────────────
export const getFeeStats = (fees) => {
  const total = fees.length;
  const paid = fees.filter(f => f.status === 'paid').length;
  const overdue = fees.filter(f => f.status === 'overdue').length;
  const partial = fees.filter(f => f.status === 'partial').length;
  const waived = fees.filter(f => f.status === 'waived').length;
  const totalRevenue = fees.reduce((sum, f) => sum + (f.amount_paid || 0), 0);
  return { total, paid, overdue, partial, waived, totalRevenue };
};