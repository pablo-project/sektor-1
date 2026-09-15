import React, { useState, useRef } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  User,
  Phone,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Image,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Upload,
  Trash2,
  MessageSquare,
  Repeat,
  Users,
  Check,
  X,
  FileText,
  HelpCircle,
  Share2,
  Eye,
  ChevronRight,
  Briefcase,
  Play,
  FileCheck2,
  CheckCircle,
  XCircle,
  SendHorizontal,
  Info,
  ListTodo,
  Download,
} from 'lucide-react';
import { Organization, Appeal, ExplanationRecord, CoAssignmentInvite, ShtabTask } from '../types';
import { NON_SHTAB_TASK_ORG_IDS } from '../data/initialData';

interface TashkilotDashboardProps {
  organization: Organization;
  organizations: Organization[];
  appeals: Appeal[];
  tasks?: ShtabTask[];
  onAcceptAppeal: (appealId: string, operatorName: string) => Promise<void>;
  onRejectAuthority: (appealId: string, reason: string) => Promise<void>;
  onResolveAppeal: (appealId: string, resolutionText: string, photoUrl?: string) => Promise<void>;
  onSendExplanation: (appealId: string, text: string, authorName: string, orgName: string) => Promise<void>;
  onRequestTransfer: (appealId: string, toOrgId: string, reason: string) => Promise<void>;
  onInviteCoAssignment: (appealId: string, targetOrgIds: string[], reason: string) => Promise<void>;
  onRespondCoAssignment: (appealId: string, targetOrgId: string, accept: boolean, rejectReason?: string) => Promise<void>;
  onResolveCoAssignment: (appealId: string, orgId: string, operatorName: string, resolutionText: string, photoUrl?: string) => Promise<void>;
  onGenerateAiResponse: (content: string, orgName: string) => Promise<string>;
  onGenerateAiExplanation: (content: string, orgName: string) => Promise<string>;
  onStartTask?: (taskId: string) => Promise<void>;
  onSubmitTaskReport?: (taskId: string, notes: string, executorName: string, pdfUrl?: string, pdfFileName?: string) => Promise<void>;
  isLoading: boolean;
}

type ActionModalTab = 'bajaraman' | 'tushuntirish' | 'ozgartirish' | 'hamkorlik';

export const TashkilotDashboard: React.FC<TashkilotDashboardProps> = ({
  organization,
  organizations,
  appeals,
  tasks = [],
  onAcceptAppeal,
  onRejectAuthority,
  onResolveAppeal,
  onSendExplanation,
  onRequestTransfer,
  onInviteCoAssignment,
  onRespondCoAssignment,
  onResolveCoAssignment,
  onGenerateAiResponse,
  onGenerateAiExplanation,
  onStartTask,
  onSubmitTaskReport,
  isLoading,
}) => {
  // Check if this organization is a Shtab member with tasks
  const isShtabMember = !NON_SHTAB_TASK_ORG_IDS.includes(organization.id);

  // Main view tab (Murojaatlar vs Sektor Vazifalari)
  const [mainActiveTab, setMainActiveTab] = useState<'appeals' | 'tasks'>('appeals');

  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'yangi' | 'jarayonda' | 'hal_etildi' | 'etirozli' | 'hamkorlik'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalTab, setModalTab] = useState<ActionModalTab>('bajaraman');

  // Tasks specific states
  const [taskFilter, setTaskFilter] = useState<'all' | 'yangi' | 'jarayonda' | 'tekshiruvda' | 'tasdiqlandi' | 'qaytarildi'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [reportModalTask, setReportModalTask] = useState<ShtabTask | null>(null);
  const [reportNotes, setReportNotes] = useState('');
  const [reportExecutorName, setReportExecutorName] = useState(organization.leader || '');
  const [taskPdfFileUrl, setTaskPdfFileUrl] = useState<string | null>(null);
  const [taskPdfFileName, setTaskPdfFileName] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [detailModalTask, setDetailModalTask] = useState<ShtabTask | null>(null);
  const [taskToastMessage, setTaskToastMessage] = useState<string | null>(null);
  const taskFileInputRef = useRef<HTMLInputElement | null>(null);

  const showTaskToast = (msg: string) => {
    setTaskToastMessage(msg);
    setTimeout(() => setTaskToastMessage(null), 4000);
  };

  // 1. Bajaraman states
  const [operatorName, setOperatorName] = useState(organization.leader || 'Inspektor B. Qodirov');
  const [resolutionText, setResolutionText] = useState('');
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Tushuntirish berish states
  const [explanationText, setExplanationText] = useState('');
  const [explanationAuthor, setExplanationAuthor] = useState(organization.leader || 'Mas\'ul mutaxassis');
  const [isGeneratingExplanationAi, setIsGeneratingExplanationAi] = useState(false);
  const [explanationSuccessNotice, setExplanationSuccessNotice] = useState(false);

  // 3. Tashkilotni o'zgartirish states
  const [transferTargetOrgIds, setTransferTargetOrgIds] = useState<string[]>([]);
  const [transferReason, setTransferReason] = useState('');
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  // 4. Men va boshqalarga tegishli (Hamkorlik) states
  const [coAssignSelectedOrgIds, setCoAssignSelectedOrgIds] = useState<string[]>([]);
  const [coAssignReason, setCoAssignReason] = useState('');
  const [coAssignSubmitted, setCoAssignSubmitted] = useState(false);

  // Filter appeals for this organization (main assignment or co-assigned)
  const orgAppeals = appeals.filter(
    (a) => a.organizationId === organization.id || a.coAssignedOrgIds?.includes(organization.id)
  );

  // Tasks for this organization (assigned specifically to this org or to 'all')
  const myTasks = tasks.filter(
    (t) => t.targetOrgId === 'all' || t.targetOrgId === organization.id
  );

  const filteredMyTasks = myTasks.filter((t) => {
    if (taskFilter !== 'all' && t.status !== taskFilter) return false;
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const taskStats = {
    total: myTasks.length,
    yangi: myTasks.filter((t) => t.status === 'yangi').length,
    jarayonda: myTasks.filter((t) => t.status === 'jarayonda').length,
    tekshiruvda: myTasks.filter((t) => t.status === 'tekshiruvda').length,
    tasdiqlandi: myTasks.filter((t) => t.status === 'tasdiqlandi').length,
    qaytarildi: myTasks.filter((t) => t.status === 'qaytarildi').length,
  };

  // Pending Co-assignment invitations for this organization
  const pendingInvites = appeals
    .map((a) => {
      const invite = a.coAssignmentInvites?.find(
        (i) => i.targetOrgId === organization.id && i.status === 'pending'
      );
      return invite ? { appeal: a, invite } : null;
    })
    .filter((item): item is { appeal: Appeal; invite: CoAssignmentInvite } => item !== null);

  const filteredAppeals = orgAppeals.filter((a) => {
    if (activeFilter === 'yangi' && a.status !== 'yangi') return false;
    if (activeFilter === 'jarayonda' && a.status !== 'jarayonda') return false;
    if (activeFilter === 'hal_etildi' && a.status !== 'hal_etildi') return false;
    if (activeFilter === 'etirozli' && a.feedback !== 'etirozli') return false;
    if (activeFilter === 'hamkorlik' && !(a.coAssignedOrgIds && a.coAssignedOrgIds.length > 0)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.appealNumber.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.address && a.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenDetail = (appeal: Appeal, defaultTab: ActionModalTab = 'bajaraman') => {
    setSelectedAppeal(appeal);
    setModalTab(defaultTab);
    
    // Reset resolution
    const myCoRes = appeal.coOrgResolutions?.find((r) => r.orgId === organization.id);
    setResolutionText(myCoRes?.resolutionText || appeal.resolutionText || '');
    setResolutionPhotoUrl(myCoRes?.resolutionPhotoUrl || appeal.resolutionPhotoUrl || '');
    setPhotoFileName('');
    setExplanationText('');
    setExplanationSuccessNotice(false);
    setTransferTargetOrgIds([]);
    setTransferReason('');
    setTransferSubmitted(false);
    setCoAssignSelectedOrgIds([]);
    setCoAssignReason('');
    setCoAssignSubmitted(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Rasm hajmi 10MB dan oshmasligi kerak');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setResolutionPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setResolutionPhotoUrl('');
    setPhotoFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 1-Tugma: Bajaraman
  const handleAccept = async () => {
    if (!selectedAppeal) return;
    await onAcceptAppeal(selectedAppeal.id, operatorName);
    setSelectedAppeal((prev) => (prev ? { ...prev, status: 'jarayonda', assignedOperator: operatorName } : null));
  };

  const handleResolveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal || !resolutionText.trim()) return;

    // Check if this is a co-assigned org or primary org
    const isCoAssignedOnly = selectedAppeal.organizationId !== organization.id && selectedAppeal.coAssignedOrgIds?.includes(organization.id);

    if (isCoAssignedOnly) {
      await onResolveCoAssignment(selectedAppeal.id, organization.id, operatorName, resolutionText, resolutionPhotoUrl);
    } else {
      await onResolveAppeal(selectedAppeal.id, resolutionText, resolutionPhotoUrl);
    }
    setSelectedAppeal(null);
  };

  const handleGenerateAi = async () => {
    if (!selectedAppeal) return;
    setIsGeneratingAi(true);
    try {
      const text = await onGenerateAiResponse(selectedAppeal.content, organization.name);
      setResolutionText(text);
    } catch (e) {
      alert('AI javobini shakllantirishda xatolik yuz berdi');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // 2-Tugma: Tushuntirish berish
  const handleSendExplanationAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal || !explanationText.trim()) return;

    await onSendExplanation(selectedAppeal.id, explanationText, explanationAuthor, organization.name);
    setExplanationSuccessNotice(true);
    setExplanationText('');
    setTimeout(() => setExplanationSuccessNotice(false), 4000);
  };

  const handleGenerateExplanationAi = async () => {
    if (!selectedAppeal) return;
    setIsGeneratingExplanationAi(true);
    try {
      const text = await onGenerateAiExplanation(selectedAppeal.content, organization.name);
      setExplanationText(text);
    } catch (e) {
      alert('AI tushuntirish matnini shakllantirishda xatolik yuz berdi');
    } finally {
      setIsGeneratingExplanationAi(false);
    }
  };

  // 3-Tugma: Tashkilotni o'zgartirish
  const handleToggleTransferOrg = (orgId: string) => {
    setTransferTargetOrgIds((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const handleRequestTransferAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal || transferTargetOrgIds.length === 0 || !transferReason.trim()) return;

    await onRequestTransfer(selectedAppeal.id, transferTargetOrgIds.join(','), transferReason);
    setTransferSubmitted(true);
    setTimeout(() => {
      setSelectedAppeal(null);
    }, 2000);
  };

  // 4-Tugma: Men va boshqalarga tegishli (Hamkorlik)
  const handleToggleCoAssignOrg = (orgId: string) => {
    setCoAssignSelectedOrgIds((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const handleInviteCoAssignmentAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal || coAssignSelectedOrgIds.length === 0) return;

    await onInviteCoAssignment(selectedAppeal.id, coAssignSelectedOrgIds, coAssignReason);
    setCoAssignSubmitted(true);
  };

  // Task actions for Tashkilot
  const handleStartTaskAction = async (task: ShtabTask) => {
    if (!onStartTask) return;
    try {
      await onStartTask(task.id);
      showTaskToast(`🚀 "${task.title}" vazifasi ijroga olindi!`);
    } catch (err: any) {
      alert("Xatolik: " + err.message);
    }
  };

  const handleTaskPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert("Fayl hajmi 15MB dan oshmasligi kerak!");
      return;
    }

    setTaskPdfFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setTaskPdfFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReportForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalTask || !reportNotes.trim()) {
      alert("Iltimos, bajarilgan ishlar to‘g‘risida hisobot / xulosa matnini kiriting");
      return;
    }
    if (!onSubmitTaskReport) return;
    setIsSubmittingReport(true);
    try {
      await onSubmitTaskReport(
        reportModalTask.id,
        reportNotes.trim(),
        reportExecutorName.trim() || organization.leader || "Mas'ul xodim",
        taskPdfFileUrl || undefined,
        taskPdfFileName || undefined
      );
      showTaskToast("✅ Xulosa va hisobot hujjati Bosh Kabinetga muvaffaqiyatli yuborildi!");
      setReportModalTask(null);
      setReportNotes('');
      setTaskPdfFileUrl(null);
      setTaskPdfFileName('');
    } catch (err: any) {
      alert("Xatolik: " + err.message);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // 120-Hour SLA Calculation Helper
  const getSlaInfo = (createdAt: string, deadlineAt?: string, status?: string) => {
    if (status === 'hal_etildi') {
      return { isOverdue: false, text: '✅ Hal etildi', className: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold' };
    }

    const deadlineMs = deadlineAt
      ? new Date(deadlineAt).getTime()
      : new Date(createdAt).getTime() + 120 * 60 * 60 * 1000;

    const diffMs = deadlineMs - Date.now();

    if (diffMs <= 0) {
      return { isOverdue: true, text: '🚨 120 soat o\'tdi (Muddati buzilgan)', className: 'bg-rose-600 text-white font-black animate-pulse' };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let countdownStr = '';
    if (days > 0) {
      countdownStr = `⏱️ ${days} kun ${remainingHours} soat ${minutes} daq`;
    } else {
      countdownStr = `⏱️ ${remainingHours} soat ${minutes} daq`;
    }

    return {
      isOverdue: false,
      text: countdownStr,
      className: totalHours < 24 
        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold' 
        : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-bold',
    };
  };

  const otherOrganizations = organizations.filter((o) => o.id !== organization.id);

  return (
    <div className="w-full px-2 sm:px-6 lg:px-8 py-2.5 sm:py-6 space-y-3 sm:space-y-6">
      
      {/* Organization Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
          <div className="p-2 sm:p-3.5 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-lg sm:rounded-2xl shadow-md text-white shrink-0">
            <Building2 className="w-4 h-4 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h2 className="text-xs sm:text-xl font-bold text-slate-100 truncate">{organization.name}</h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-[9px] sm:text-xs px-1.5 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full font-mono border border-indigo-500/30 shrink-0">
                {organization.code}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
              Soha: <strong className="text-slate-200 font-semibold">{organization.category}</strong> • Mas'ul: <strong className="text-slate-200 font-semibold">{organization.leader}</strong> • <a href={`tel:${organization.phone}`} className="hover:underline text-indigo-300 font-mono">{organization.phone}</a>
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className={`grid grid-cols-2 ${isShtabMember ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-1.5 sm:gap-2 w-full md:w-auto shrink-0`}>
          <button
            onClick={() => setMainActiveTab('appeals')}
            className={`p-1.5 sm:p-3 rounded-lg sm:rounded-2xl text-center border transition-all cursor-pointer ${
              mainActiveTab === 'appeals'
                ? 'bg-slate-800 border-indigo-400 text-white shadow-xs'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <span className="text-[9px] sm:text-xs text-slate-400 block font-medium">Jami Murojaat</span>
            <span className="text-xs sm:text-lg font-black text-slate-100">{orgAppeals.length}</span>
          </button>
          <div className="bg-blue-950/60 border border-blue-800/50 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl text-center">
            <span className="text-[9px] sm:text-xs text-blue-300 block font-medium">Jarayonda</span>
            <span className="text-xs sm:text-lg font-black text-blue-400">
              {orgAppeals.filter((a) => a.status === 'yangi' || a.status === 'jarayonda').length}
            </span>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800/50 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl text-center">
            <span className="text-[9px] sm:text-xs text-emerald-300 block font-medium">Hal Etildi</span>
            <span className="text-xs sm:text-lg font-black text-emerald-400">
              {orgAppeals.filter((a) => a.status === 'hal_etildi').length}
            </span>
          </div>
          {isShtabMember && (
            <button
              onClick={() => setMainActiveTab('tasks')}
              className={`p-1.5 sm:p-3 rounded-lg sm:rounded-2xl text-center border transition-all cursor-pointer ${
                mainActiveTab === 'tasks'
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30'
                  : 'bg-purple-950/60 border-purple-800/50 hover:bg-purple-900/80 text-purple-300'
              }`}
            >
              <span className="text-[9px] sm:text-xs block font-medium flex items-center justify-center space-x-1">
                <span>Topshiriqlar</span>
                {taskStats.yangi > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </span>
              <span className="text-xs sm:text-lg font-black text-purple-200">
                {myTasks.length} ta
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode Navigation Switcher */}
      {isShtabMember && (
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/90 dark:bg-slate-900 rounded-2xl border border-slate-300/50 dark:border-slate-800">
          <button
            onClick={() => setMainActiveTab('appeals')}
            className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mainActiveTab === 'appeals'
                ? 'bg-slate-900 text-white dark:bg-indigo-600 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">📋 Murojaatlar ({orgAppeals.length})</span>
          </button>

          <button
            onClick={() => setMainActiveTab('tasks')}
            className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl font-bold text-xs transition-all cursor-pointer relative ${
              mainActiveTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">📌 Topshiriqlar ({myTasks.length})</span>
            {taskStats.yangi > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[9px] font-black rounded-full shadow shrink-0">
                {taskStats.yangi}
              </span>
            )}
          </button>
        </div>
      )}

      {/* MAIN VIEW 1: SEKTOR VAZIFALARI VIEW */}
      {mainActiveTab === 'tasks' && isShtabMember && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Tasks Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              onClick={() => setTaskFilter('all')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-500 shadow-md'
                  : 'bg-white dark:bg-[#0c1628] hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-75">Barcha Vazifalar</span>
              <span className="text-xl font-black mt-1 block">{taskStats.total}</span>
            </div>

            <div
              onClick={() => setTaskFilter('yangi')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'yangi'
                  ? 'bg-blue-600 text-white shadow-md border-blue-600'
                  : 'bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-950/60 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-80">🔵 Yangi (Kutilmoqda)</span>
              <span className="text-xl font-black mt-1 block">{taskStats.yangi}</span>
            </div>

            <div
              onClick={() => setTaskFilter('jarayonda')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'jarayonda'
                  ? 'bg-amber-500 text-white shadow-md border-amber-500'
                  : 'bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-50 dark:hover:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-80">⏱️ Ijro Jarayonida</span>
              <span className="text-xl font-black mt-1 block">{taskStats.jarayonda}</span>
            </div>

            <div
              onClick={() => setTaskFilter('tekshiruvda')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'tekshiruvda'
                  ? 'bg-purple-600 text-white shadow-md border-purple-600'
                  : 'bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-50 dark:hover:bg-purple-950/60 border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-300'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-80">📝 Tekshiruvda</span>
              <span className="text-xl font-black mt-1 block">{taskStats.tekshiruvda}</span>
            </div>

            <div
              onClick={() => setTaskFilter('tasdiqlandi')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'tasdiqlandi'
                  ? 'bg-emerald-600 text-white shadow-md border-emerald-600'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-80">✅ Bajarildi (Tasdiq)</span>
              <span className="text-xl font-black mt-1 block">{taskStats.tasdiqlandi}</span>
            </div>

            <div
              onClick={() => setTaskFilter('qaytarildi')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                taskFilter === 'qaytarildi'
                  ? 'bg-rose-600 text-white shadow-md border-rose-600'
                  : 'bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300'
              }`}
            >
              <span className="text-[11px] font-bold block opacity-80">⚠️ Qaytarilgan</span>
              <span className="text-xl font-black mt-1 block">{taskStats.qaytarildi}</span>
            </div>
          </div>

          {/* Task Search Bar */}
          <div className="bg-white dark:bg-[#0c1628] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                placeholder="Vazifa nomi yoki mazmuni bo‘yicha qidirish..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
              Topildi: <strong className="text-slate-800 dark:text-slate-200">{filteredMyTasks.length}</strong> ta vazifa
            </span>
          </div>

          {/* Tasks Grid */}
          {filteredMyTasks.length === 0 ? (
            <div className="bg-white dark:bg-[#0c1628] rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <Briefcase className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Ushbu parametr bo‘yicha vazifalar mavjud emas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bosh Kabinet tomonidan berilgan topshiriqlar shu yerda aks etadi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMyTasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-[#0c1628] rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                            #{task.taskNumber || '•'}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                              {task.category || 'Sektor Maxsus Vazifasi'}
                            </span>
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1 leading-snug">
                              {task.title}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          {task.status === 'tasdiqlandi' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Tasdiqlandi</span>
                            </span>
                          )}
                          {task.status === 'tekshiruvda' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center space-x-1">
                              <FileCheck2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              <span>Tekshiruvda</span>
                            </span>
                          )}
                          {task.status === 'jarayonda' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Jarayonda</span>
                            </span>
                          )}
                          {task.status === 'qaytarildi' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Qaytarildi</span>
                            </span>
                          )}
                          {task.status === 'yangi' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center space-x-1">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Yangi Topshiriq</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 line-clamp-3">
                        {task.description}
                      </p>

                      {/* Admin Feedback Notice if any */}
                      {task.adminFeedback && (
                        <div className={`mt-2.5 p-2.5 rounded-xl border text-xs ${
                          task.status === 'qaytarildi'
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        }`}>
                          <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                            <Info className="w-3.5 h-3.5" />
                            <span>Bosh Kabinet Ko‘rsatmasi:</span>
                          </div>
                          <p className="text-[11px]">{task.adminFeedback}</p>
                        </div>
                      )}

                      {/* Completion report summary if submitted */}
                      {task.completionReport && (
                        <div className="mt-2.5 p-2.5 bg-purple-50/70 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-900/60 rounded-xl text-xs text-purple-950 dark:text-purple-200">
                          <span className="font-bold block text-[10px] text-purple-700 dark:text-purple-400">Yuborilgan Hisobot:</span>
                          <p className="text-[11px] line-clamp-2 mt-0.5">
                            "{task.completionReport.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setDetailModalTask(task)}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tafsilotlar</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        {task.status === 'yangi' && (
                          <button
                            onClick={() => handleStartTaskAction(task)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Ijroga Olish (Boshlash)</span>
                          </button>
                        )}

                        {(task.status === 'jarayonda' || task.status === 'qaytarildi') && (
                          <button
                            onClick={() => {
                              setReportModalTask(task);
                              setReportNotes('');
                              setReportExecutorName(organization.leader || '');
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Hisobot Topshirish</span>
                          </button>
                        )}

                        {task.status === 'tekshiruvda' && (
                          <button
                            onClick={() => {
                              setReportModalTask(task);
                              setReportNotes(task.completionReport?.notes || '');
                              setReportExecutorName(task.completionReport?.executorName || organization.leader || '');
                            }}
                            className="px-3.5 py-2 bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>Hisobotni Tahrirlash</span>
                          </button>
                        )}

                        {task.status === 'tasdiqlandi' && (
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Bajarilgan</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MAIN VIEW 2: MUROJAATLAR VIEW */}
      {(mainActiveTab === 'appeals' || !isShtabMember) && (
        <div className="space-y-6 animate-in fade-in duration-200">
      {/* Pending Co-assignment Invitations Banner */}
      {pendingInvites.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-950/20 border-2 border-amber-400 dark:border-amber-600/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                📬 Sizga {pendingInvites.length} ta yangi hamkorlik taklifi kelib tushdi!
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300/90">
                Boshqa tashkilot murojaatni birgalikda ("Men va boshqalarga tegishli") hal etish uchun sizni hamkorlikka taklif qildi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingInvites.map(({ appeal, invite }) => (
              <div
                key={invite.id}
                className="bg-white dark:bg-[#0c1628] p-4 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                      {appeal.appealNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {new Date(invite.invitedAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                    Taklif etuvchi: <strong className="text-indigo-600 dark:text-indigo-400">{invite.initiatorOrgName}</strong>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 bg-slate-50 dark:bg-slate-950/70 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{appeal.content}"
                  </p>
                  <div className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-xl border border-amber-200 dark:border-amber-900/60 mt-2 font-medium">
                    📌 <strong>Hamkorlik vazifasi:</strong> {invite.reason}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onRespondCoAssignment(appeal.id, organization.id, true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow flex items-center justify-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Hamkorlikni qabul qilish</span>
                  </button>
                  <button
                    onClick={() => onRespondCoAssignment(appeal.id, organization.id, false, 'Tashkilot vakolatida emas')}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/80 hover:text-rose-700 dark:hover:text-rose-300 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Rad etish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#0c1628] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Filter Pills with touch-friendly horizontal scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar smooth-scroll pb-1 md:pb-0 -mx-1 px-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-indigo-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Barchasi ({orgAppeals.length})
          </button>
          <button
            onClick={() => setActiveFilter('yangi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'yangi'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Yangi ({orgAppeals.filter((a) => a.status === 'yangi').length})
          </button>
          <button
            onClick={() => setActiveFilter('jarayonda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'jarayonda'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Jarayonda ({orgAppeals.filter((a) => a.status === 'jarayonda').length})
          </button>
          <button
            onClick={() => setActiveFilter('hal_etildi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'hal_etildi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Hal Etildi ({orgAppeals.filter((a) => a.status === 'hal_etildi').length})
          </button>
          <button
            onClick={() => setActiveFilter('hamkorlik')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'hamkorlik'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            👥 Hamkorlik ({orgAppeals.filter((a) => a.coAssignedOrgIds && a.coAssignedOrgIds.length > 0).length})
          </button>
          <button
            onClick={() => setActiveFilter('etirozli')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'etirozli'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🔴 E'tirozlar ({orgAppeals.filter((a) => a.feedback === 'etirozli').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-full sm:min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, raqam yoki matn..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950"
          />
        </div>

      </div>

      {/* Appeals List Container */}
      <div className="space-y-3">
        {filteredAppeals.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1628] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center text-slate-400 dark:text-slate-500">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ushbu bo'limda murojaatlar mavjud emas</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW (Cards layout for small screens) */}
            <div className="block md:hidden space-y-3">
              {filteredAppeals.map((appeal) => {
                const sla = getSlaInfo(appeal.createdAt, appeal.deadlineAt, appeal.status);
                const isCoAssigned = appeal.coAssignedOrgIds && appeal.coAssignedOrgIds.length > 0;
                const hasExplanations = appeal.explanations && appeal.explanations.length > 0;
                const isTransferPending = appeal.transferRequest && appeal.transferRequest.status === 'pending';

                return (
                  <div
                    key={appeal.id}
                    onClick={() => handleOpenDetail(appeal)}
                    className="bg-white dark:bg-[#0c1628] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all space-y-3 cursor-pointer"
                  >
                    {/* Top Row: Number, SLA and Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                          {appeal.appealNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(appeal.createdAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {appeal.status === 'yangi' && (
                          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            Yangi
                          </span>
                        )}
                        {appeal.status === 'jarayonda' && (
                          <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Jarayonda
                          </span>
                        )}
                        {appeal.status === 'hal_etildi' && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Hal Etildi
                          </span>
                        )}
                        {appeal.status === 'vakolatda_emas' && (
                          <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                            Vakolatda Emas
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Citizen Details */}
                    <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{appeal.fullName}</span>
                        </div>
                        {appeal.address && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            📍 {appeal.address}
                          </div>
                        )}
                      </div>

                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${appeal.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-mono font-bold shrink-0 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{appeal.phone}</span>
                      </a>
                    </div>

                    {/* Appeal Content */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {appeal.content}
                      </p>
                      {appeal.attachmentUrl && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-md text-[10px] font-bold">
                            <Image className="w-3 h-3" />
                            <span>Fotosurat ilova qilingan</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SLA and Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold ${sla.className}`}>
                        ⏱️ {sla.text}
                      </span>

                      {isCoAssigned && (
                        <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                          👥 Hamkorlikda
                        </span>
                      )}
                      {hasExplanations && (
                        <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                          💬 Tushuntirish berilgan
                        </span>
                      )}
                      {isTransferPending && (
                        <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                          🔄 O'tkazish so'ralgan
                        </span>
                      )}
                      {appeal.feedback === 'etirozli' && (
                        <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md animate-pulse">
                          E'tiroz Bor!
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(appeal);
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer min-h-[42px]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ko'rish / Ijro etish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP VIEW (Full Table layout for tablets & computers) */}
            <div className="hidden md:block bg-white dark:bg-[#0c1628] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-3.5">Murojaat №</th>
                      <th className="p-3.5">Fuqaro</th>
                      <th className="p-3.5">Telefon / Manzil</th>
                      <th className="p-3.5 max-w-xs">Murojaat Mazmuni</th>
                      <th className="p-3.5">120 Soatlik Muddat (5 kun)</th>
                      <th className="p-3.5">Holati & Belgilar</th>
                      <th className="p-3.5 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredAppeals.map((appeal) => {
                      const sla = getSlaInfo(appeal.createdAt, appeal.deadlineAt, appeal.status);
                      const isCoAssigned = appeal.coAssignedOrgIds && appeal.coAssignedOrgIds.length > 0;
                      const hasExplanations = appeal.explanations && appeal.explanations.length > 0;
                      const isTransferPending = appeal.transferRequest && appeal.transferRequest.status === 'pending';

                      return (
                        <tr
                          key={appeal.id}
                          onClick={() => handleOpenDetail(appeal)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                              {appeal.appealNumber}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{appeal.fullName}</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-slate-600 dark:text-slate-300">
                            <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{appeal.phone}</div>
                            {appeal.address && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                📍 {appeal.address}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5 max-w-sm text-slate-700 dark:text-slate-300">
                            <p
                              className="line-clamp-2 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              title={appeal.content}
                            >
                              {appeal.content}
                            </p>
                            {appeal.content && appeal.content.length > 70 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDetail(appeal);
                                }}
                                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold mt-0.5 inline-flex items-center space-x-0.5 cursor-pointer"
                              >
                                <span>Batafsil ko‘rish</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            {appeal.attachmentUrl && (
                              <div className="mt-1">
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-md text-[10px] font-bold">
                                  <Image className="w-3 h-3" />
                                  <span>Foto ilova</span>
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] border ${sla.className}`}>
                              {sla.text}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap space-y-1">
                            <div>
                              {appeal.status === 'yangi' && (
                                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                  Yangi
                                </span>
                              )}
                              {appeal.status === 'jarayonda' && (
                                <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                  Jarayonda
                                </span>
                              )}
                              {appeal.status === 'hal_etildi' && (
                                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                  Hal Etildi
                                </span>
                              )}
                              {appeal.status === 'vakolatda_emas' && (
                                <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                                  Vakolatda Emas
                                </span>
                              )}
                            </div>

                            {/* Additional status badges */}
                            <div className="flex flex-wrap gap-1">
                              {isCoAssigned && (
                                <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                                  👥 Hamkorlikda ({appeal.coAssignedOrgNames?.join(', ')})
                                </span>
                              )}
                              {hasExplanations && (
                                <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                                  💬 Tushuntirish berilgan
                                </span>
                              )}
                              {isTransferPending && (
                                <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                                  🔄 O'tkazish so'ralgan
                                </span>
                              )}
                              {appeal.feedback === 'etirozli' && (
                                <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md animate-pulse">
                                  E'tiroz Bor!
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(appeal);
                              }}
                              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 ml-auto cursor-pointer group-hover:scale-105"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ko'rish / Ochish</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appeal Detail & Action Modal with 4 Functional Tabs */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0c1628] rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-5 my-4 sm:my-8 max-h-[94vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-md">
                    {selectedAppeal.appealNumber}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {new Date(selectedAppeal.createdAt).toLocaleString('uz-UZ')}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                  Murojaatchi: {selectedAppeal.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer text-lg leading-none shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Citizen Request Info Box */}
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <div>
                  Telefon: <a href={`tel:${selectedAppeal.phone}`} className="text-indigo-600 dark:text-indigo-400 font-mono font-bold underline ml-1">{selectedAppeal.phone}</a>
                </div>
                <div>Asosiy Tashkilot: <strong className="text-slate-900 dark:text-slate-100">{selectedAppeal.organizationName}</strong></div>
                <div className="col-span-1 sm:col-span-2">Manzil: <strong className="text-slate-900 dark:text-slate-100">{selectedAppeal.address || 'Kiritilmagan'}</strong></div>
                <div className="col-span-1 sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                  <span>120 Soatlik Muddat:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs border font-bold ${getSlaInfo(selectedAppeal.createdAt, selectedAppeal.deadlineAt, selectedAppeal.status).className}`}>
                    {getSlaInfo(selectedAppeal.createdAt, selectedAppeal.deadlineAt, selectedAppeal.status).text}
                  </span>
                </div>
              </div>

              {/* Co-assigned organizations info */}
              {selectedAppeal.coAssignedOrgNames && selectedAppeal.coAssignedOrgNames.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 rounded-xl p-3 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                  <span className="font-bold flex items-center space-x-1">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Biriktirilgan hamkor tashkilotlar:</span>
                  </span>
                  <p className="font-semibold text-purple-800 dark:text-purple-300">
                    {selectedAppeal.coAssignedOrgNames.join(', ')}
                  </p>
                  {selectedAppeal.coOrgResolutions && selectedAppeal.coOrgResolutions.length > 0 && (
                    <div className="mt-2 space-y-1.5 pt-2 border-t border-purple-200 dark:border-purple-800">
                      {selectedAppeal.coOrgResolutions.map((res) => (
                        <div key={res.orgId} className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg text-[11px]">
                          <strong>{res.orgName}:</strong> {res.status === 'hal_etildi' ? `✅ Xulosa topshirilgan ("${res.resolutionText}")` : '⏳ Ijro jarayonida'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Transfer Request Banner if pending */}
              {selectedAppeal.transferRequest && selectedAppeal.transferRequest.status === 'pending' && (
                <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-900/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-950 dark:text-amber-100">
                    <Repeat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Bosh Kabinetga o'tkazish so'rovi yuborilgan:</span>
                  </div>
                  <p className="mt-1">
                    Yangi tashkilot: <strong>{selectedAppeal.transferRequest.toOrgName}</strong><br />
                    Sababi: <em>"{selectedAppeal.transferRequest.reason}"</em>
                  </p>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block mt-1">
                    Bosh Kabinet tasdiqlagach, murojaat avtomatik tarzda yangi tashkilotga ko'chiriladi.
                  </span>
                </div>
              )}

              {/* Explanations History */}
              {selectedAppeal.explanations && selectedAppeal.explanations.length > 0 && (
                <div className="bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/60 rounded-xl p-3 text-xs text-teal-900 dark:text-teal-200 space-y-2">
                  <span className="font-bold flex items-center space-x-1 text-teal-950 dark:text-teal-100">
                    <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Fuqaroga yuborilgan rasmiy tushuntirishlar:</span>
                  </span>
                  <div className="space-y-1.5">
                    {selectedAppeal.explanations.map((exp) => (
                      <div key={exp.id} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-teal-100 dark:border-teal-900/50 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[10px]">
                          <span>{exp.authorName} ({exp.organizationName})</span>
                          <span>{new Date(exp.createdAt).toLocaleString('uz-UZ')}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">"{exp.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Murojaat Mazmuni:
                </span>
                <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed font-medium whitespace-pre-wrap break-words max-h-56 sm:max-h-72 overflow-y-auto">
                  {selectedAppeal.content}
                </p>
              </div>

              {selectedAppeal.attachmentUrl && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 p-3 sm:p-3.5 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-950 dark:text-sky-200 uppercase tracking-wider flex items-center space-x-1.5">
                        <Image className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>Fuqaro fotosurati:</span>
                      </span>
                      <span className="px-2 py-0.5 bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full font-bold text-[10px]">
                        📷 Ilova
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-sky-100 dark:border-sky-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedAppeal.attachmentUrl}
                          alt="Murojaat fotosurati"
                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                          onClick={() => window.open(selectedAppeal.attachmentUrl, '_blank')}
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Murojaat fotosurati</div>
                          <div className="text-[11px] text-slate-400">Tekshirish va yuklab olish uchun</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <a
                          href={selectedAppeal.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ko‘rish</span>
                        </a>
                        <a
                          href={selectedAppeal.attachmentUrl}
                          download={`Murojaat_${selectedAppeal.appealNumber}_rasm.jpg`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Yuklab olish</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* THE 4 ACTION BUTTONS NAVIGATION TABS */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Qabul qilish va ijro etish amallari:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab('bajaraman')}
                  className={`py-2 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 border cursor-pointer min-h-[44px] ${
                    modalTab === 'bajaraman'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-center">1. Bajaraman</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('tushuntirish')}
                  className={`py-2 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 border cursor-pointer min-h-[44px] ${
                    modalTab === 'tushuntirish'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-center">2. Tushuntirish</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('ozgartirish')}
                  className={`py-2 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 border cursor-pointer min-h-[44px] ${
                    modalTab === 'ozgartirish'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-center">3. O'zgartirish</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('hamkorlik')}
                  className={`py-2 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 border cursor-pointer min-h-[44px] ${
                    modalTab === 'hamkorlik'
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-center">4. Hamkorlik</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: BAJARAMAN */}
            {modalTab === 'bajaraman' && (
              <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 p-3.5 sm:p-5 rounded-2xl space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>1-Variant: Ijroga qabul qilish va xulosa</span>
                  </h4>
                </div>

                {selectedAppeal.status === 'yangi' && (
                  <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-3">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      Ushbu yangi murojaatni ijroga qabul qilasizmi? Mas'ul xodim ismini tasdiqlang:
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={operatorName}
                        onChange={(e) => setOperatorName(e.target.value)}
                        placeholder="Mas'ul ijrochi ismi..."
                        className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                      />
                      <button
                        id="btn-tashkilot-accept-appeal"
                        type="button"
                        onClick={handleAccept}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer min-h-[42px]"
                      >
                        <Check className="w-4 h-4" />
                        <span>Ijroga Qabul Qilish</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Resolution Form (When in progress or resolving) */}
                <form onSubmit={handleResolveAction} className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Ijro Xulosasi va Bajarilgan Ish Matni *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAi}
                      disabled={isGeneratingAi}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingAi ? 'AI yozmoqda...' : 'AI bilan yozish'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Murojaat bo'yicha amalda bajarilgan ishlar va rasmiy xulosa matnini kiriting..."
                    required
                    className="w-full text-xs p-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                  />

                  {/* Photo Proof Upload from Computer Device */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                        <Image className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>📷 Bajarilgan ish foto-isboti (Kompyuterdan yuklash):</span>
                      </label>
                      {resolutionPhotoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center space-x-1 font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Rasmni o'chirish</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="tashkilot-photo-upload"
                    />

                    {!resolutionPhotoUrl ? (
                      <label
                        htmlFor="tashkilot-photo-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-950 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 rounded-2xl p-4 cursor-pointer transition-all"
                      >
                        <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kompyuterdan foto-hisobot rasmini tanlang</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">PNG, JPG, JPEG (Maksimal 10MB)</span>
                      </label>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center group">
                        <img
                          src={resolutionPhotoUrl}
                          alt="Hisobot rasmi"
                          className="w-full max-h-48 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <label
                            htmlFor="tashkilot-photo-upload"
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow"
                          >
                            Boshqa rasm tanlash
                          </label>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                          >
                            O'chirish
                          </button>
                        </div>
                        {photoFileName && (
                          <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow border border-slate-200 dark:border-slate-700">
                            📷 {photoFileName}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Resolution */}
                  <div className="pt-3 flex items-center justify-between border-t border-blue-200 dark:border-blue-900/60">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Mas'ul ijrochi: <strong className="text-slate-900 dark:text-slate-200">{selectedAppeal.assignedOperator || operatorName}</strong>
                    </div>

                    <button
                      id="btn-tashkilot-submit-resolve"
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow flex items-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Xulosani fuqaro va Botga yuborish (Hal qilish)</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB CONTENT 2: TUSHUNTIRISH BERISH */}
            {modalTab === 'tushuntirish' && (
              <form onSubmit={handleSendExplanationAction} className="bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wider flex items-center space-x-1.5">
                      <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>2-Variant: Murojaatchiga Rasmiy Tushuntirish / Xabar Yozish</span>
                    </h4>
                    <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">
                      Yozgan tushuntirish xatingiz fuqaroning Telegram botiga darhol rasmiy bildirishnoma sifatida yuboriladi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateExplanationAi}
                    disabled={isGeneratingExplanationAi}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 hover:bg-teal-200 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-lg transition-colors border border-teal-300 dark:border-teal-800 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingExplanationAi ? 'AI yozmoqda...' : 'AI bilan tushuntirish'}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mas'ul xodim:</label>
                  <input
                    type="text"
                    value={explanationAuthor}
                    onChange={(e) => setExplanationAuthor(e.target.value)}
                    placeholder="Mas'ul xodim F.I.Sh..."
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tushuntirish matni (Rasmiy javob xati):</label>
                  <textarea
                    rows={4}
                    value={explanationText}
                    onChange={(e) => setExplanationText(e.target.value)}
                    placeholder="Fuqaroga murojaati yuzasidan o'rganish ishlari, zarur talablar yoki tushuntirish tafsilotlarini yozing..."
                    required
                    className="w-full text-xs p-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                {explanationSuccessNotice && (
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>✅ Rasmiy tushuntirish fuqaroning Telegram botiga muvaffaqiyatli yetkazildi!</span>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-teal-200 dark:border-teal-900/60">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow flex items-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Fuqaroga Tushuntirish Yuborish</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT 3: TASHKILOTNI O'ZGARTIRISH */}
            {modalTab === 'ozgartirish' && (
              <form onSubmit={handleRequestTransferAction} className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-5 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <Repeat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>3-Variant: Tashkilotni O'zgartirish (Boshqa Tashkilot(lar)ga Yo'naltirish)</span>
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                    🛡️ <strong>Nazorat qoidasi:</strong> Tashkilot o'zidan-o'zi murojaatni boshqa tashkilotga yuklamasligi uchun so'rov avval <strong>Bosh Kabinet (Super Admin)</strong> tasdig'iga yuboriladi. Bosh Kabinet tasdiqlagach, murojaat sizning paneldan o'chib yangi tashkilot(lar)ga o'tadi.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Murojaatni qaysi tashkilot(lar)ga o'tkazmoqchisiz? (Bitta yoki bir nechta tanlash mumkin) *</label>
                    {transferTargetOrgIds.length > 0 && (
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                        {transferTargetOrgIds.length} ta tanlandi
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                    {otherOrganizations.map((org) => {
                      const isChecked = transferTargetOrgIds.includes(org.id);
                      return (
                        <label
                          key={org.id}
                          className={`flex items-center space-x-2.5 p-2 rounded-lg cursor-pointer transition-colors border text-xs font-medium ${
                            isChecked
                              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTransferOrg(org.id)}
                            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <div className="truncate">
                            <div className="truncate font-semibold">{org.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{org.category}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nima sababdan ushbu tashkilot(lar)ga yo'naltirilmoqda? *</label>
                  <textarea
                    rows={3}
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="Ushbu masala nima uchun tanlangan tashkilot(lar) vakolatiga taalluqli ekanligini asoslab bering..."
                    required
                    className="w-full text-xs p-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                {transferSubmitted ? (
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>✅ O'tkazish so'rovi Bosh Kabinetga tasdiqlash uchun yuborildi!</span>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2 border-t border-amber-200 dark:border-amber-900/60">
                    <button
                      type="submit"
                      disabled={transferTargetOrgIds.length === 0 || !transferReason.trim()}
                      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow flex items-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Bosh Kabinetga Tasdiqlash Uchun Yuborish</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* TAB CONTENT 4: MEN VA BOSHQALARGA TEGISHLI */}
            {modalTab === 'hamkorlik' && (
              <form onSubmit={handleInviteCoAssignmentAction} className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-5 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>4-Variant: Men va Boshqalarga Tegishli (Hamkorlikda Ijro Etish)</span>
                  </h4>
                  <p className="text-xs text-purple-800 dark:text-purple-300 mt-1">
                    👥 <strong>Birgalikda hal qilish:</strong> Agar murojaat bir nechta sohaga tegishli bo'lsa (masalan, yo'l va elektr, suv va gaz), boshqa mas'ul tashkilot(lar)ni hamkor sifatida biriktirasiz. Ular o'z kabinetida qabul qilgach, murojaat har ikkala panelda ko'rinadi va har biri alohida o'z xulosasini topshiradi.
                  </p>
                </div>

                {/* Persistent notification if cooperation invites have already been sent or just sent */}
                {((selectedAppeal.coAssignmentInvites && selectedAppeal.coAssignmentInvites.length > 0) || (selectedAppeal.coAssignedOrgIds && selectedAppeal.coAssignedOrgIds.length > 0) || coAssignSubmitted) && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>✅ Hamkorlik taklifi boshqa tashkilot(lar) kabinetiga yuborilgan!</span>
                    </div>
                    
                    {/* List of active or invited co-orgs */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedAppeal.coAssignmentInvites?.map((inv) => (
                        <span key={inv.id} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                          🏢 {inv.targetOrgName} ({inv.status === 'accepted' ? 'Qabul qilindi' : inv.status === 'rejected' ? 'Rad etildi' : 'Kutilmoqda'})
                        </span>
                      ))}
                      {selectedAppeal.coAssignedOrgNames?.map((name, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200">
                          🏢 {name} (Faol hamkor)
                        </span>
                      ))}
                    </div>

                    {/* Crucial Instruction: Continue doing own part */}
                    <div className="mt-2 pt-2 border-t border-emerald-200/80 dark:border-emerald-800 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium">
                      <p className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Davom eting: Ushbu murojaatning o'zingizga tegishli qismini bajarishda davom eting!</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        Boshqa tashkilotga hamkorlik yuborilgan bo'lsa-da, murojaat sizning zimmangizda ham qoladi. O'z sohangizga oid qismini bajarib, <button type="button" onClick={() => setModalTab('bajaraman')} className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-800">1. Bajaraman</button> bo'limida yakuniy hisobot/xulosa yozishda davom eting.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hamkor sifatida biriktiriladigan tashkilot(lar)ni belgilang: *</label>
                    {coAssignSelectedOrgIds.length > 0 && (
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                        {coAssignSelectedOrgIds.length} ta tanlandi
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                    {otherOrganizations.map((org) => {
                      const isChecked = coAssignSelectedOrgIds.includes(org.id);
                      return (
                        <label
                          key={org.id}
                          className={`flex items-center space-x-2.5 p-2 rounded-lg cursor-pointer transition-colors border text-xs font-medium ${
                            isChecked
                              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-200 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCoAssignOrg(org.id)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="truncate">{org.name}</span>
                        </label>
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Tanlandi: {coAssignSelectedOrgIds.length} ta hamkor tashkilot
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hamkor tashkilotga topshiriq / vazifa tavsifi:</label>
                  <textarea
                    rows={3}
                    value={coAssignReason}
                    onChange={(e) => setCoAssignReason(e.target.value)}
                    placeholder="Murojaatning qaysi qismini ushbu tashkilot ko'rib chiqishi kerakligini yozing..."
                    className="w-full text-xs p-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-purple-200 dark:border-purple-900/60">
                  <button
                    type="submit"
                    disabled={coAssignSelectedOrgIds.length === 0}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow flex items-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Hamkor Tashkilotlarga Taklif Yuborish</span>
                  </button>
                </div>
              </form>
            )}

            {/* Display Feedback if present */}
            {selectedAppeal.feedback !== 'kutilmoqda' && (
              <div className={`p-4 rounded-2xl border ${
                selectedAppeal.feedback === 'roziman'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  {selectedAppeal.feedback === 'roziman' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Fuqaro Bahosi: ROZIMAN (Qanoatlandi)</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Fuqaro Bahosi: E'TIROZIM BOR!</span>
                    </>
                  )}
                </h4>

                {selectedAppeal.objectionText && (
                  <p className="text-xs bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 mt-2 font-medium text-slate-800 dark:text-slate-200">
                    E'tiroz sababi: "{selectedAppeal.objectionText}"
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

        </div>
      )}

      {/* REPORT SUBMISSION MODAL FOR TASK */}
      {reportModalTask && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0c1628] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl ring-4 ring-amber-50/50 dark:ring-amber-900/30">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Vazifa Bo‘yicha Xulosa va Hisobot Topshirish</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">#{reportModalTask.taskNumber}: {reportModalTask.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setReportModalTask(null);
                  setTaskPdfFileUrl(null);
                  setTaskPdfFileName('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="block font-bold text-slate-900 dark:text-slate-100 mb-1">Topshiriq Mazmuni:</strong>
              {reportModalTask.description}
            </div>

            <form onSubmit={handleSubmitReportForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hisobot Topshiruvchi Mas'ul Rahbar / Xodim *
                </label>
                <input
                  type="text"
                  value={reportExecutorName}
                  onChange={(e) => setReportExecutorName(e.target.value)}
                  placeholder="Masalan: B. Qodirov (Bosh mutaxassis)"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Xulosa / Amalga Oshirilgan Ishlar To‘g‘risida Batafsil Hisobot *
                </label>
                <textarea
                  rows={4}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Ushbu vazifa doirasida o'tkazilgan chora-tadbirlar, amaliy ko'mak choralari va erishilgan aniq natijalar to'g'risida xulosa..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* PDF & Document File Upload Section */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Hisobot Fayli (PDF / Hujjat)
                </label>
                <input
                  type="file"
                  ref={taskFileInputRef}
                  onChange={handleTaskPdfUpload}
                  accept=".pdf,.doc,.docx,image/*"
                  className="hidden"
                />

                {taskPdfFileName ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-200 font-bold truncate">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{taskPdfFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTaskPdfFileUrl(null);
                        setTaskPdfFileName('');
                        if (taskFileInputRef.current) taskFileInputRef.current.value = '';
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 font-bold text-xs cursor-pointer"
                      title="Faylni o'chirish"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => taskFileInputRef.current?.click()}
                    className="w-full py-3 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 bg-slate-50 dark:bg-slate-950 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>PDF yoki Hujjat Faylini Biriktirish</span>
                  </button>
                )}
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  * Tashkilot tomonidan tayyorlangan rasmiy xulosa PDF yoki skanerlangan hisobot hujjatini yuklang.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setReportModalTask(null);
                    setTaskPdfFileUrl(null);
                    setTaskPdfFileName('');
                  }}
                  disabled={isSubmittingReport}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportNotes.trim()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg shadow-amber-500/30 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReport ? 'Yuborilmoqda...' : 'Bosh Kabinetga Yuborish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAILS MODAL */}
      {detailModalTask && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0c1628] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                  #{detailModalTask.taskNumber || '•'}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">{detailModalTask.title}</h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{detailModalTask.category || 'Sektor Maxsus Vazifasi'}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailModalTask(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Topshiriq Vazifasi:</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{detailModalTask.description}</p>
              </div>

              {detailModalTask.adminFeedback && (
                <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold block text-[11px]">Bosh Kabinet Ko‘rsatmasi:</span>
                  <p>{detailModalTask.adminFeedback}</p>
                </div>
              )}

              {(detailModalTask.completionReport || detailModalTask.reportText) && (
                <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 p-3.5 rounded-2xl text-purple-900 dark:text-purple-200 space-y-2">
                  <span className="font-bold block text-[11px] flex items-center space-x-1.5">
                    <FileCheck2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Tashkilotning Bajarilgan Ishlar Xulosasi:</span>
                  </span>
                  <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50">
                    {detailModalTask.completionReport?.notes || detailModalTask.reportText}
                  </p>

                  {(detailModalTask.completionReport?.pdfUrl || detailModalTask.reportPdfUrl) && (
                    <a
                      href={detailModalTask.completionReport?.pdfUrl || detailModalTask.reportPdfUrl}
                      download={detailModalTask.completionReport?.pdfFileName || detailModalTask.reportPdfName || 'hisobot.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        Yuklangan Hisobot PDF: {detailModalTask.completionReport?.pdfFileName || detailModalTask.reportPdfName || 'hisobot.pdf'}
                      </span>
                    </a>
                  )}

                  <span className="block text-[10px] text-purple-700 dark:text-purple-300 font-semibold mt-1">
                    Mas'ul: {detailModalTask.completionReport?.executorName || detailModalTask.reportExecutorName || organization.leader} (
                    {new Date(
                      detailModalTask.completionReport?.submittedAt || detailModalTask.reportSubmittedAt || detailModalTask.createdAt
                    ).toLocaleDateString('uz-UZ')}
                    )
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setDetailModalTask(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION FOR TASHKILOT */}
      {taskToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in slide-in-from-bottom duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{taskToastMessage}</span>
          <button
            onClick={() => setTaskToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
