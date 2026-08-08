import { StageConfig, LeadCard, ProjectCard, HiringCard, EarningsCard } from '../types';

export const LEAD_STAGES: StageConfig[] = [
  { id: 'outreach', name: 'Outreach', chipColor: 'oklch(85% 0.005 95)' },
  { id: 'discovery_done', name: 'Discovery Done', chipColor: 'oklch(68% 0.08 250)' },
  { id: 'quotation_sent', name: 'Quotation Sent', chipColor: 'oklch(78% 0.09 80)' },
  { id: 'won', name: 'Won', chipColor: 'oklch(72% 0.10 145)' },
  { id: 'lost', name: 'Lost', chipColor: 'oklch(63% 0.08 25)' },
];

export const PROJECT_STAGES: StageConfig[] = [
  { id: 'onboarding', name: 'Onboarding', chipColor: 'oklch(85% 0.005 95)' },
  { id: 'allocation', name: 'Allocation', chipColor: 'oklch(68% 0.08 250)' },
  { id: 'in_progress', name: 'In Progress', chipColor: 'oklch(78% 0.09 80)' },
  { id: 'client_review', name: 'Client Review', chipColor: 'oklch(68% 0.08 250)' },
  { id: 'revisions', name: 'Revisions', chipColor: 'oklch(78% 0.09 80)' },
  { id: 'handoff', name: 'Handoff', chipColor: 'oklch(72% 0.10 145)' },
];

export const HIRING_STAGES: StageConfig[] = [
  { id: 'applied', name: 'Applied', chipColor: 'oklch(85% 0.005 95)' },
  { id: 'interview', name: 'Interview', chipColor: 'oklch(68% 0.08 250)' },
  { id: 'offer', name: 'Offer', chipColor: 'oklch(78% 0.09 80)' },
  { id: 'hired', name: 'Hired', chipColor: 'oklch(72% 0.10 145)' },
  { id: 'rejected', name: 'Rejected', chipColor: 'oklch(63% 0.08 25)' },
];

export const EARNINGS_STAGES: StageConfig[] = [
  { id: 'pending_invoice', name: 'Pending Invoice', chipColor: 'oklch(85% 0.005 95)' },
  { id: 'partially_paid', name: 'Partially Paid', chipColor: 'oklch(78% 0.09 80)' },
  { id: 'paid', name: 'Paid', chipColor: 'oklch(72% 0.10 145)' },
  { id: 'overdue', name: 'Overdue', chipColor: 'oklch(63% 0.08 25)' },
];

export const INITIAL_HIRING: HiringCard[] = [];
export const INITIAL_EARNINGS: EarningsCard[] = [];

export const INITIAL_LEADS: LeadCard[] = [
  {
    id: 'lead-1',
    clientName: 'Aura Health Tech',
    contact: 'sarah@aurahealth.co | +1 (555) 234-8901',
    dealValue: 85000,
    nextFollowUpDate: '2026-08-12', // Wed
    rescheduleCount: 0,
    stageId: 'quotation_sent',
    owner: 'AK',
    shortNotes: 'Discussing scope adjustments for mobile design system and brand refresh.',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-07',
    checklist: [
      { id: 'c1', text: 'Send revised scope breakdown', completed: true },
      { id: 'c2', text: 'Confirm final budget approval with Sarah', completed: false }
    ]
  },
  {
    id: 'lead-2',
    clientName: 'Nexus AI Systems',
    contact: 'marcus@nexusai.io | Telegram: @marcus_nexus',
    dealValue: 120000,
    nextFollowUpDate: '2026-08-08', // Today
    rescheduleCount: 2, // Amber badge
    stageId: 'discovery_done',
    owner: 'AK',
    shortNotes: 'Completed technical discovery. Preparing multi-agent UI proposal.',
    createdAt: '2026-08-03',
    updatedAt: '2026-08-06',
    checklist: [
      { id: 'c1', text: 'Follow up on architecture diagram feedback', completed: false },
      { id: 'c2', text: 'Prepare benchmark case studies', completed: true }
    ]
  },
  {
    id: 'lead-3',
    clientName: 'Veloce Logistics',
    contact: 'david.c@velocelogistics.com',
    dealValue: 45000,
    nextFollowUpDate: '2026-08-07', // Overdue
    rescheduleCount: 4, // Red badge: "4th delay - close or hold"
    stageId: 'outreach',
    owner: 'AK',
    shortNotes: 'Delayed 4 times due to internal budget re-allocations.',
    createdAt: '2026-07-15',
    updatedAt: '2026-08-05',
    checklist: [
      { id: 'c1', text: 'Send final call decision email', completed: false }
    ]
  },
  {
    id: 'lead-4',
    clientName: 'Solis Energy',
    contact: 'helen@solisenergy.de',
    dealValue: 65000,
    nextFollowUpDate: '2026-08-10',
    rescheduleCount: 1, // Neutral gray text
    stageId: 'outreach',
    owner: 'AK',
    shortNotes: 'Inbound inquiry for full web rebrand and webgl viewer.',
    createdAt: '2026-08-07',
    updatedAt: '2026-08-07',
    checklist: []
  },
  {
    id: 'lead-5',
    clientName: 'Meridian Capital',
    contact: 'investments@meridiancap.com',
    dealValue: 95000,
    nextFollowUpDate: '2026-08-04',
    rescheduleCount: 3, // Orange badge
    stageId: 'won',
    owner: 'AK',
    shortNotes: 'Contract signed! Deposit invoice settled. Transitioning to project kickoff.',
    createdAt: '2026-07-20',
    updatedAt: '2026-08-04',
    checklist: [
      { id: 'c1', text: 'Receive deposit confirmation', completed: true },
      { id: 'c2', text: 'Setup shared Figma workspace', completed: true }
    ]
  },
  {
    id: 'lead-6',
    clientName: 'Kroma Consumer App',
    contact: 'team@kroma.app',
    dealValue: 30000,
    nextFollowUpDate: '2026-08-02',
    rescheduleCount: 1,
    stageId: 'lost',
    owner: 'AK',
    shortNotes: 'Client postponed budget cycle to Q4.',
    createdAt: '2026-07-15',
    updatedAt: '2026-08-02',
    checklist: []
  }
];

export const INITIAL_PROJECTS: ProjectCard[] = [
  {
    id: 'proj-1',
    clientName: 'Meridian Capital',
    serviceType: 'branding+UIUX',
    collaborators: ['Alex M.', 'Elena R.'],
    nextDeliverable: 'Brand Identity & Figma Design System v1',
    deliverableDueDate: '2026-08-10',
    stageId: 'in_progress',
    owner: 'AK',
    shortNotes: 'Component library structure complete. Finalizing token palette and typography scale.',
    createdAt: '2026-08-04',
    updatedAt: '2026-08-07',
    checklist: [
      { id: 'p1', text: 'Export SVG icon set', completed: true },
      { id: 'p2', text: 'Build responsive grid specs', completed: true },
      { id: 'p3', text: 'Prepare Loom video walkthrough', completed: false }
    ]
  },
  {
    id: 'proj-2',
    clientName: 'Zephyr Mobility Platform',
    serviceType: 'app',
    collaborators: ['Alex M.'],
    nextDeliverable: 'Interactive Mobile Prototype',
    deliverableDueDate: '2026-08-08',
    stageId: 'client_review',
    owner: 'AK',
    shortNotes: 'Awaiting founder signoff on onboarding flow animation and micro-interactions.',
    createdAt: '2026-07-25',
    updatedAt: '2026-08-06',
    checklist: [
      { id: 'p1', text: 'Upload Framer preview link', completed: true },
      { id: 'p2', text: 'Collect async feedback comments', completed: false }
    ]
  },
  {
    id: 'proj-3',
    clientName: 'Pulse Wearables',
    serviceType: 'web',
    collaborators: ['Elena R.'],
    nextDeliverable: '3D Product Web Page Layouts',
    deliverableDueDate: '2026-08-15',
    stageId: 'allocation',
    owner: 'AK',
    shortNotes: 'Asset gathering phase. Access requested for product analytics and research.',
    createdAt: '2026-08-06',
    updatedAt: '2026-08-06',
    checklist: [
      { id: 'p1', text: 'Send kickoff agenda deck', completed: true },
      { id: 'p2', text: 'Setup shared Slack channel', completed: true }
    ]
  },
  {
    id: 'proj-4',
    clientName: 'Hyperion Cloud',
    serviceType: 'video',
    collaborators: [],
    nextDeliverable: 'Final Explainer Video Assets',
    deliverableDueDate: '2026-08-01',
    stageId: 'handoff',
    owner: 'AK',
    shortNotes: 'Successfully delivered 4K renders and source project files.',
    createdAt: '2026-07-01',
    updatedAt: '2026-08-01',
    checklist: [
      { id: 'p1', text: 'Deliver Google Drive folder handover', completed: true },
      { id: 'p2', text: 'Send final invoice', completed: true }
    ]
  }
];
