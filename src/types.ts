export type AppealStatus = 'yangi' | 'jarayonda' | 'hal_etildi' | 'vakolatda_emas';
export type FeedbackStatus = 'kutilmoqda' | 'roziman' | 'etirozli';

export interface ExplanationRecord {
  id: string;
  text: string;
  authorName: string;
  organizationName: string;
  createdAt: string;
}

export interface TransferRequest {
  fromOrgId: string;
  fromOrgName: string;
  toOrgId?: string;
  toOrgName?: string;
  toOrgIds?: string[];
  toOrgNames?: string[];
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedAt?: string;
}

export interface CoAssignmentInvite {
  id: string;
  targetOrgId: string;
  targetOrgName: string;
  initiatorOrgId: string;
  initiatorOrgName: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: string;
  respondedAt?: string;
}

export interface CoOrgResolution {
  orgId: string;
  orgName: string;
  operatorName?: string;
  resolutionText?: string;
  resolutionPhotoUrl?: string;
  resolvedAt?: string;
  status: 'jarayonda' | 'hal_etildi';
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  category: string;
  phone: string;
  leader: string;
  password?: string;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  lockedAt?: string;
  lastPasswordChangedAt?: string;
  totalAppeals: number;
  resolvedAppeals: number;
  inProgressAppeals: number;
  objectionAppeals: number;
  rejectedAuthorityAppeals: number;
}

export interface Appeal {
  id: string;
  appealNumber: string;
  organizationId: string;
  organizationName: string;
  fullName: string;
  phone: string;
  mahalla?: string;
  address?: string;
  content: string;
  attachmentUrl?: string;
  category: string;
  createdAt: string;
  deadlineAt?: string;
  status: AppealStatus;
  assignedOperator?: string;
  startedAt?: string;
  resolutionText?: string;
  resolutionPhotoUrl?: string;
  resolvedAt?: string;
  feedback: FeedbackStatus;
  objectionText?: string;
  objectionAt?: string;
  aiCategory?: string;
  aiSuggestedResponse?: string;
  telegramChatId?: number;

  source?: 'telegram' | 'bosh_kabinet';
  isFromBoshKabinet?: boolean;

  // New action button features
  explanations?: ExplanationRecord[];
  transferRequest?: TransferRequest;
  coAssignedOrgIds?: string[];
  coAssignedOrgNames?: string[];
  coAssignmentInvites?: CoAssignmentInvite[];
  coOrgResolutions?: CoOrgResolution[];
}

export interface BotStatusInfo {
  isActive: boolean;
  botUsername?: string;
  botFirstName?: string;
}

export type ShtabTaskStatus = 'yangi' | 'jarayonda' | 'tekshiruvda' | 'tasdiqlandi' | 'qaytarildi';

export interface ShtabTaskCompletionReport {
  notes: string;
  submittedAt: string;
  executorName?: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

export interface ShtabTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  targetOrgId: string; // 'all' or specific orgId
  targetOrgName?: string;
  category?: string;
  createdAt: string;
  deadline?: string;
  status: ShtabTaskStatus;
  startedAt?: string;
  reportText?: string;
  reportPhotoUrl?: string;
  reportPdfUrl?: string;
  reportPdfName?: string;
  reportExecutorName?: string;
  reportSubmittedAt?: string;
  completionReport?: ShtabTaskCompletionReport;
  approvedAt?: string;
  adminFeedback?: string;
}

export type MahallaTaskStatus = 'yangi' | 'jarayonda' | 'bajarildi' | 'qaytarildi';

export interface MahallaYettiligiMember {
  role: 'raisi' | 'hokim_yordamchisi' | 'yoshlar_yetakchisi' | 'xotin_qizlar' | 'profilaktika' | 'soliq' | 'ijtimoiy';
  roleTitle: string;
  name: string;
  phone: string;
}

export interface MahallaTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  category?: string;
  mahallaId: string; // 'mfy-1', 'mfy-2', etc.
  mahallaName: string;
  targetRole?: string; // 'Barcha Yettilik a\'zolari', 'Hokim yordamchisi', etc.
  targetOrgId?: string; // e.g. 'org-1' IIB, 'org-2' Bandlik
  targetOrgName?: string;
  createdAt: string;
  deadline?: string;
  status: MahallaTaskStatus;
  startedAt?: string;
  // Offline xulosa matni:
  xulosaText?: string;
  xulosaPreparedAt?: string;
  xulosaAuthor?: string;
  // Tashkilot yoki Bosh Kabinet tasdiqlagan:
  approvedAt?: string;
  approvedByOrgId?: string;
  approvedByOrgName?: string;
  approverNote?: string;
}

export interface MahallaStats {
  totalTasks: number;
  yangiTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export interface SystemStats {
  totalOrganizations: number;
  totalAppeals: number;
  resolvedCount: number;
  inProgressCount: number;
  objectionCount: number;
  rejectedAuthorityCount: number;
  satisfactionRate: number;
  pendingTransferCount?: number;
  coAssignedCount?: number;
}

