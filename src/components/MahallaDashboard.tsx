import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  Building2,
  Search,
  Filter,
  CheckSquare,
  Sparkles,
  Phone,
  UserCheck,
  Award,
  Download,
  FileCheck,
  Info,
  Calendar,
  Inbox,
  Eye,
  Check,
  MapPin,
  User,
  AlertTriangle,
  Image as ImageIcon,
  ExternalLink,
  X,
  MessageSquare,
} from 'lucide-react';
import { MahallaInfo } from '../data/mahallasData';
import { MahallaTask, MahallaTaskStatus, Appeal, AppealStatus, Organization } from '../types';

interface MahallaDashboardProps {
  mahalla: MahallaInfo;
  tasks: MahallaTask[];
  appeals?: Appeal[];
  organizations?: Organization[];
  onStartTask: (taskId: string) => Promise<void>;
  onSaveXulosa: (taskId: string, xulosaText: string, authorName: string) => Promise<void>;
  isLoading?: boolean;
}

export const MahallaDashboard: React.FC<MahallaDashboardProps> = ({
  mahalla,
  tasks,
  appeals = [],
  organizations = [],
  onStartTask,
  onSaveXulosa,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'appeals' | 'yettilik' | 'guide'>('tasks');
  const [statusFilter, setStatusFilter] = useState<'all' | MahallaTaskStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Appeals view states (read-only for mahalla)
  const [appealStatusFilter, setAppealStatusFilter] = useState<'all' | AppealStatus | 'etiroz'>('all');
  const [appealSearchQuery, setAppealSearchQuery] = useState<string>('');
  const [selectedAppealForDetail, setSelectedAppealForDetail] = useState<Appeal | null>(null);

  // Editing xulosa modal state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [xulosaInputText, setXulosaInputText] = useState<string>('');
  const [xulosaAuthorInput, setXulosaAuthorInput] = useState<string>(mahalla.chairman);
  const [isSavingXulosa, setIsSavingXulosa] = useState<boolean>(false);

  // Print view for blanka
  const [printTask, setPrintTask] = useState<MahallaTask | null>(null);

  // Filtered tasks for this mahalla
  const mahallaTasks = useMemo(() => {
    return tasks.filter((t) => t.mahallaId === mahalla.id || t.mahallaId === 'all');
  }, [tasks, mahalla.id]);

  const taskStats = useMemo(() => {
    const total = mahallaTasks.length;
    const yangi = mahallaTasks.filter((t) => t.status === 'yangi').length;
    const inProgress = mahallaTasks.filter((t) => t.status === 'jarayonda').length;
    const completed = mahallaTasks.filter((t) => t.status === 'bajarildi').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, yangi, inProgress, completed, percent };
  }, [mahallaTasks]);

  // Filtered appeals for this mahalla
  const mahallaAppeals = useMemo(() => {
    if (!appeals || !Array.isArray(appeals)) return [];
    const mName = mahalla.name.toLowerCase().trim();
    const mClean = mahalla.name.replace(/\s*mfy\s*/gi, '').toLowerCase().trim();

    return appeals.filter((appeal) => {
      if (!appeal) return false;
      const appM = (appeal.mahalla || '').toLowerCase().trim();
      const appMClean = appM.replace(/\s*mfy\s*/gi, '').toLowerCase().trim();
      const appAddr = (appeal.address || '').toLowerCase().trim();

      if (appM && (appM === mName || appMClean === mClean || (mClean.length > 2 && appM.includes(mClean)))) {
        return true;
      }
      if (appAddr && (mClean.length > 2 && appAddr.includes(mClean))) {
        return true;
      }
      return false;
    });
  }, [appeals, mahalla.name]);

  const appealStats = useMemo(() => {
    const total = mahallaAppeals.length;
    const yangi = mahallaAppeals.filter((a) => a.status === 'yangi').length;
    const jarayonda = mahallaAppeals.filter((a) => a.status === 'jarayonda').length;
    const halEtildi = mahallaAppeals.filter((a) => a.status === 'hal_etildi').length;
    const vakolatdaEmas = mahallaAppeals.filter((a) => a.status === 'vakolatda_emas').length;
    const etiroz = mahallaAppeals.filter((a) => a.feedback === 'etirozli' || a.status === 'vakolatda_emas').length;
    const percent = total > 0 ? Math.round((halEtildi / total) * 100) : 0;
    return { total, yangi, jarayonda, halEtildi, vakolatdaEmas, etiroz, percent };
  }, [mahallaAppeals]);

  const displayedTasks = useMemo(() => {
    return mahallaTasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        const matchRole = (task.targetRole || '').toLowerCase().includes(q);
        const matchOrg = (task.targetOrgName || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchRole && !matchOrg) return false;
      }
      return true;
    });
  }, [mahallaTasks, statusFilter, searchQuery]);

  const displayedAppeals = useMemo(() => {
    return mahallaAppeals.filter((appeal) => {
      if (appealStatusFilter === 'etiroz') {
        if (appeal.feedback !== 'etirozli' && appeal.status !== 'vakolatda_emas') return false;
      } else if (appealStatusFilter !== 'all') {
        if (appeal.status !== appealStatusFilter) return false;
      }

      if (appealSearchQuery.trim()) {
        const q = appealSearchQuery.toLowerCase();
        const matchName = appeal.fullName.toLowerCase().includes(q);
        const matchPhone = appeal.phone.toLowerCase().includes(q);
        const matchContent = appeal.content.toLowerCase().includes(q);
        const matchOrg = (appeal.organizationName || '').toLowerCase().includes(q);
        const matchNum = (appeal.appealNumber || '').toLowerCase().includes(q);
        const matchAddr = (appeal.address || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchContent && !matchOrg && !matchNum && !matchAddr) return false;
      }

      return true;
    });
  }, [mahallaAppeals, appealStatusFilter, appealSearchQuery]);

  const handleOpenXulosaModal = (task: MahallaTask) => {
    setEditingTaskId(task.id);
    setXulosaInputText(task.xulosaText || '');
    setXulosaAuthorInput(task.xulosaAuthor || mahalla.chairman);
  };

  const handleSaveXulosaSubmit = async () => {
    if (!editingTaskId || !xulosaInputText.trim()) return;
    setIsSavingXulosa(true);
    try {
      await onSaveXulosa(editingTaskId, xulosaInputText.trim(), xulosaAuthorInput.trim());
      setEditingTaskId(null);
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    } finally {
      setIsSavingXulosa(false);
    }
  };

  const handlePrint = (task: MahallaTask) => {
    setPrintTask(task);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="w-full px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Mahalla Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[11px] sm:text-xs font-bold text-indigo-300">
              <Users className="w-3.5 h-3.5" />
              <span>1-Sektor • Mahalla Yettiligi Ishchi Paneli</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center space-x-2">
                <span>{mahalla.name}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-300 mt-1">
                <span>Raisi: <strong className="text-white font-bold">{mahalla.chairman}</strong></span>
                <span>•</span>
                <span>Aholi: <strong className="text-white font-bold">{mahalla.population.toLocaleString()}</strong></span>
                <span>•</span>
                <a href={`tel:${mahalla.phone}`} className="text-emerald-300 font-bold hover:underline font-mono inline-flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{mahalla.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges (2x2 on mobile, 4x1 on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Shtab Vazifalari</span>
              <span className="text-base sm:text-xl font-black text-white">{taskStats.total} ta</span>
            </div>
            <div className="bg-indigo-950/60 border border-indigo-700/60 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
              <span className="text-[10px] sm:text-[11px] text-indigo-300 block font-medium">📬 Murojaatlar</span>
              <span className="text-base sm:text-xl font-black text-indigo-200">{appealStats.total} ta</span>
            </div>
            <div className="bg-blue-950/50 border border-blue-800/50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
              <span className="text-[10px] sm:text-[11px] text-blue-300 block font-medium">🟡 Jarayonda</span>
              <span className="text-base sm:text-xl font-black text-blue-200">{appealStats.jarayonda + taskStats.inProgress} ta</span>
            </div>
            <div className="bg-emerald-950/50 border border-emerald-800/50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
              <span className="text-[10px] sm:text-[11px] text-emerald-300 block font-medium">🟢 Hal etildi</span>
              <span className="text-base sm:text-xl font-black text-emerald-200">{appealStats.halEtildi} ta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs with touch horizontal scroll */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar smooth-scroll pb-1 border-b border-slate-200 dark:border-slate-800 -mx-1 px-1">
        {/* TAB 1: Tasks */}
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>📌 Vazifalar ({mahallaTasks.length})</span>
          {taskStats.yangi > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full animate-pulse">
              {taskStats.yangi}
            </span>
          )}
        </button>

        {/* TAB 2: Appeals */}
        <button
          onClick={() => setActiveTab('appeals')}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
            activeTab === 'appeals'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          <span>📬 Murojaatlar ({mahallaAppeals.length})</span>
          {appealStats.yangi > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
              {appealStats.yangi}
            </span>
          )}
        </button>

        {/* TAB 3: Yettilik */}
        <button
          onClick={() => setActiveTab('yettilik')}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
            activeTab === 'yettilik'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>👥 Yettilik (7)</span>
        </button>

        {/* TAB 4: Guide */}
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
            activeTab === 'guide'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>ℹ️ Qo‘llanma</span>
        </button>
      </div>

      {/* ================= TAB 1: VAZIFALAR ================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200">
          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Pills with touch horizontal scroll */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar smooth-scroll w-full md:w-auto pb-1 md:pb-0 -mx-1 px-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Barchasi ({mahallaTasks.length})
              </button>
              <button
                onClick={() => setStatusFilter('yangi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  statusFilter === 'yangi'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                }`}
              >
                <span>🆕 Yangi ({taskStats.yangi})</span>
              </button>
              <button
                onClick={() => setStatusFilter('jarayonda')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  statusFilter === 'jarayonda'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                }`}
              >
                <span>🟡 Jarayonda ({taskStats.inProgress})</span>
              </button>
              <button
                onClick={() => setStatusFilter('bajarildi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  statusFilter === 'bajarildi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <span>🟢 Bajarildi ({taskStats.completed})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vazifa yoki tashkilot bo‘yicha qidiruv..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tasks Grid / List */}
          {displayedTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <CheckSquare className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">Ushbu holatda vazifalar topilmadi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Bosh Kabinet tomonidan yuborilgan yangi topshiriqlar shu yerda paydo bo‘ladi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {displayedTasks.map((task) => {
                const isNew = task.status === 'yangi';
                const isInProgress = task.status === 'jarayonda';
                const isCompleted = task.status === 'bajarildi';

                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border transition-all shadow-xs space-y-3 sm:space-y-4 ${
                      isNew
                        ? 'border-amber-300/80 dark:border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10'
                        : isInProgress
                        ? 'border-blue-300/80 dark:border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/10'
                        : 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                    }`}
                  >
                    {/* Top Row: Task Number, Role Tag, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5 sm:pb-3">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black">
                          № {task.taskNumber}
                        </span>
                        {task.targetRole && (
                          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl flex items-center space-x-1">
                            <UserCheck className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                            <span className="truncate">Mas'ul: {task.targetRole}</span>
                          </span>
                        )}
                        {task.targetOrgName && (
                          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
                            <span className="truncate">Tashkilot: {task.targetOrgName}</span>
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isNew && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <Clock className="w-3 h-3" />
                            <span>🆕 Yangi</span>
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <CheckSquare className="w-3 h-3" />
                            <span>🟡 Jarayonda</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>🟢 Bajarildi</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Task Title & Description */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {task.description}
                      </p>
                    </div>

                    {/* Offline Xulosa Preview if saved */}
                    {task.xulosaText && (
                      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1">
                            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Mahalla Xulosasi & Dalolatnomasi</span>
                          </span>
                          <span>Tayyorlagan: <b>{task.xulosaAuthor || mahalla.chairman}</b> ({task.xulosaPreparedAt ? new Date(task.xulosaPreparedAt).toLocaleDateString('uz-UZ') : ''})</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed whitespace-pre-line">
                          "{task.xulosaText}"
                        </p>
                      </div>
                    )}

                    {/* Approver Note if completed */}
                    {isCompleted && task.approvedByOrgName && (
                      <div className="p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span>
                            Tasdiqlovchi: <b>{task.approvedByOrgName}</b>
                            {task.approverNote && ` — "${task.approverNote}"`}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                          {task.approvedAt ? new Date(task.approvedAt).toLocaleDateString('uz-UZ') : 'Tasdiqlangan'}
                        </span>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Muddati: <b className="text-slate-700 dark:text-slate-300">{task.deadline || '15 kun'}</b></span>
                      </div>

                      <div className="grid grid-cols-1 sm:flex sm:items-center gap-2">
                        {/* 1-Button: BAJARAMAN (status: yangi) */}
                        {isNew && (
                          <button
                            onClick={() => onStartTask(task.id)}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-[0.98] min-h-[40px]"
                          >
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>⚡ Bajaraman (Qabul qilish)</span>
                          </button>
                        )}

                        {/* 2-Button: Xulosa Yozish / Tahrirlash */}
                        {(isInProgress || isCompleted) && (
                          <button
                            onClick={() => handleOpenXulosaModal(task)}
                            className="w-full sm:w-auto px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[38px]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{task.xulosaText ? 'Xulosani tahrirlash' : '📝 Xulosa yozish'}</span>
                          </button>
                        )}

                        {/* 3-Button: Print Official Blank */}
                        <button
                          onClick={() => handlePrint(task)}
                          className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[38px]"
                          title="Rasmiy xulosa blankasini chop etish"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          <span>Chop etish (Blanka)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MAHALLA MUROJAATLARI (NEW - READ ONLY MONITORING) ================= */}
      {activeTab === 'appeals' && (
        <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200">
          {/* Read-only Information Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-indigo-950/60 dark:to-slate-900 rounded-2xl p-3.5 sm:p-4 border border-blue-200/80 dark:border-indigo-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-2.5 sm:space-x-3">
              <div className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  "{mahalla.name}" Fuqarolari Murojaatlari Monitoringi (Ko'rish Rejimi)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                  Mahallangizdan tushgan barcha murojaatlar va ularning ijro holati real-vaqtda ko‘rinadi.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 font-bold text-[11px] sm:text-xs rounded-xl shadow-xs flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Monitoring</span>
              </span>
            </div>
          </div>

          {/* Filter and Search Bar for Appeals */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Pills with touch horizontal scroll */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar smooth-scroll w-full md:w-auto pb-1 md:pb-0 -mx-1 px-1">
              <button
                onClick={() => setAppealStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  appealStatusFilter === 'all'
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Barchasi ({mahallaAppeals.length})
              </button>
              <button
                onClick={() => setAppealStatusFilter('yangi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  appealStatusFilter === 'yangi'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                }`}
              >
                <span>🆕 Yangi ({appealStats.yangi})</span>
              </button>
              <button
                onClick={() => setAppealStatusFilter('jarayonda')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  appealStatusFilter === 'jarayonda'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                }`}
              >
                <span>🟡 Jarayonda ({appealStats.jarayonda})</span>
              </button>
              <button
                onClick={() => setAppealStatusFilter('hal_etildi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                  appealStatusFilter === 'hal_etildi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <span>🟢 Hal etildi ({appealStats.halEtildi})</span>
              </button>
              {appealStats.etiroz > 0 && (
                <button
                  onClick={() => setAppealStatusFilter('etiroz')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] flex items-center space-x-1.5 ${
                    appealStatusFilter === 'etiroz'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <span>🔴 E'tirozli ({appealStats.etiroz})</span>
                </button>
              )}
            </div>

            {/* Search Input for Appeals */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appealSearchQuery}
                onChange={(e) => setAppealSearchQuery(e.target.value)}
                placeholder="Fuqaro F.I.Sh, telefon, matn yoki tashkilot..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Appeals List */}
          {displayedAppeals.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Inbox className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">Ushbu holatda murojaatlar mavjud emas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                "{mahalla.name}" hududidan yuborilgan yangi murojaatlar ushbu ro'yxatda real-vaqt rejimida avtomatik yangilanib turadi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {displayedAppeals.map((appeal) => {
                const isNew = appeal.status === 'yangi';
                const isInProgress = appeal.status === 'jarayonda';
                const isResolved = appeal.status === 'hal_etildi';
                const isOutOfScope = appeal.status === 'vakolatda_emas';
                const hasObjection = appeal.feedback === 'etirozli';

                return (
                  <div
                    key={appeal.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border transition-all shadow-xs space-y-3 sm:space-y-4 hover:shadow-md ${
                      isResolved
                        ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                        : hasObjection
                        ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10'
                        : isNew
                        ? 'border-amber-300/80 dark:border-amber-500/40 bg-amber-50/10 dark:bg-amber-950/10'
                        : 'border-blue-200 dark:border-blue-500/30 bg-blue-50/10 dark:bg-blue-950/10'
                    }`}
                  >
                    {/* Card Top: Number, Date, Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5 sm:pb-3">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black">
                          № {appeal.appealNumber}
                        </span>
                        {appeal.category && (
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl">
                            {appeal.category}
                          </span>
                        )}
                        <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(appeal.createdAt).toLocaleDateString('uz-UZ')}</span>
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {isNew && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <Clock className="w-3 h-3" />
                            <span>🆕 Yangi</span>
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <CheckSquare className="w-3 h-3" />
                            <span>🟡 Jarayonda</span>
                          </span>
                        )}
                        {isResolved && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>🟢 Hal etildi</span>
                          </span>
                        )}
                        {isOutOfScope && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
                            <AlertCircle className="w-3 h-3" />
                            <span>⚪ Vakolatda emas</span>
                          </span>
                        )}
                        {hasObjection && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-rose-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>🔴 E'tirozli</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Citizen and Address Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-950/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Fuqaro (Murojaatchi):</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 mt-0.5">
                          <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="truncate">{appeal.fullName}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Telefon raqami:</span>
                        <a
                          href={`tel:${appeal.phone}`}
                          className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1.5 mt-0.5 font-mono"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{appeal.phone}</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Manzil / Hudud:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="truncate">{appeal.address || appeal.mahalla || mahalla.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Assigned Organization & Co-assigned Orgs */}
                    <div className="p-2.5 sm:p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl sm:rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-slate-600 dark:text-slate-300">Mas'ul tashkilot: </span>
                          <strong className="text-indigo-950 dark:text-indigo-200 font-black">{appeal.organizationName}</strong>
                        </div>
                      </div>

                      {appeal.coAssignedOrgNames && appeal.coAssignedOrgNames.length > 0 && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-indigo-800 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-700">
                          <Users className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="truncate">Hamkorlar: <b>{appeal.coAssignedOrgNames.join(', ')}</b></span>
                        </div>
                      )}
                    </div>

                    {/* Citizen's Appeal Content */}
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Murojaat mazmuni:
                      </span>
                      <div className="p-2.5 sm:p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {appeal.content}
                      </div>
                    </div>

                    {/* Appeal Attachment Preview if exists */}
                    {appeal.attachmentUrl && (
                      <div className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ilova:</span>
                        <a
                          href={appeal.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Faylni ko'rish</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Resolution Section if Resolved */}
                    {isResolved && (
                      <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl sm:rounded-2xl space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs border-b border-emerald-200/80 dark:border-emerald-800/60 pb-1.5">
                          <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Tashkilot Ijro Natijasi</span>
                          </span>
                          <span className="text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
                            Ijro sanasi: <b>{appeal.resolvedAt ? new Date(appeal.resolvedAt).toLocaleDateString('uz-UZ') : 'Hal etilgan'}</b>
                          </span>
                        </div>

                        {appeal.resolutionText && (
                          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-line font-medium">
                            {appeal.resolutionText}
                          </p>
                        )}

                        {appeal.assignedOperator && (
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                            Ijrochi mutaxassis: <b>{appeal.assignedOperator}</b>
                          </div>
                        )}

                        {appeal.resolutionPhotoUrl && (
                          <div className="pt-1">
                            <a
                              href={appeal.resolutionPhotoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 shadow-xs"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>📷 Foto hisobotni ochish</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanations section if available */}
                    {appeal.explanations && appeal.explanations.length > 0 && (
                      <div className="p-2.5 sm:p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl sm:rounded-2xl space-y-1.5">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Tushuntirish xatlari ({appeal.explanations.length} ta)</span>
                        </span>
                        <div className="space-y-1.5">
                          {appeal.explanations.map((exp) => (
                            <div key={exp.id} className="text-xs text-amber-950 dark:text-amber-200 bg-white dark:bg-slate-800 p-2 rounded-lg border border-amber-200 dark:border-amber-700">
                              <p className="italic font-medium">"{exp.text}"</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                {exp.authorName} ({exp.organizationName}) • {new Date(exp.createdAt).toLocaleDateString('uz-UZ')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Footer: Deadline & Details Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Ijro muddati:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {appeal.deadlineAt ? new Date(appeal.deadlineAt).toLocaleDateString('uz-UZ') : '120 soat (5 kun)'}
                          </strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedAppealForDetail(appeal)}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 min-h-[38px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Batafsil ma'lumot</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: YETTILIK TARKIBI ================= */}
      {activeTab === 'yettilik' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                "{mahalla.name}" Mahalla Yettiligi Mas'ul Xodimlari
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Har bir yo‘nalish bo‘yicha mas'ul xodimlar ro‘yxati va xizmat telefonlari
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mahalla.yettilik.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-950/80 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 rounded-2xl p-4 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-[11px] font-extrabold rounded-lg">
                      {member.roleTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{member.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{member.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: YO'RIQNOMA ================= */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Mahalla Yettiligi Ish Tartibi va Monitoring Qo‘llanmasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mahalla yettiligi Bosh Kabinetdan topshiriqlarni qabul qilib, o‘rganish natijasini qog‘oz blanka shaklida mas'ul tashkilotga taqdim etadi. Shuningdek, mahalladan yuborilgan fuqarolar murojaatlarining ijro holatini <b>"Mahallamiz Murojaatlari"</b> bo'limida real-vaqtda kuzatib boradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-blue-950 dark:text-blue-200 text-sm">Vazifani Qabul Qilish</h4>
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                Topshiriq kelgach, <b>"Bajaraman"</b> tugmasini bosing. Bosh Kabinetda holat <b>"Jarayonda"</b> deb aks etadi.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-purple-950 dark:text-purple-200 text-sm">Joyida O‘rganish</h4>
              <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                Yettilik a'zolari bilan xonadonlarga chiqib, muammoni amaliy o‘rganing va xulosa matnini shakllantiring.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">Chop Etish & Yetkazish</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <b>"Chop etish"</b> orqali rasmiy dalolatnomani qog‘ozga chiqarib, imzolab, mas'ul sohaviy tashkilotga olib boring.
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">Murojaat Monitoringi</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Fuqarolar murojaatlari qay darajada hal qilinganini "Mahallamiz Murojaatlari" panelida doimiy kuzatib boring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: APPEAL DETAIL MODAL (READ ONLY) ================= */}
      {selectedAppealForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Murojaat № {selectedAppealForDetail.appealNumber}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedAppealForDetail.category} • {new Date(selectedAppealForDetail.createdAt).toLocaleString('uz-UZ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppealForDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Citizen Information Card */}
              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Fuqaro Ma'lumotlari</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">F.I.Sh:</span>
                    <strong className="text-slate-900 dark:text-slate-100 text-sm">{selectedAppealForDetail.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Telefon raqami:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-mono">{selectedAppealForDetail.phone}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Manzil:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedAppealForDetail.address || selectedAppealForDetail.mahalla}</strong>
                  </div>
                </div>
              </div>

              {/* Responsible Org */}
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-800 space-y-1.5">
                <h4 className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Mas'ul Ijrochi Tashkilot</span>
                </h4>
                <p className="text-sm font-black text-indigo-900 dark:text-indigo-300">{selectedAppealForDetail.organizationName}</p>
                {selectedAppealForDetail.coAssignedOrgNames && selectedAppealForDetail.coAssignedOrgNames.length > 0 && (
                  <p className="text-xs text-indigo-800 dark:text-indigo-300">
                    Hamkor tashkilotlar: <b>{selectedAppealForDetail.coAssignedOrgNames.join(', ')}</b>
                  </p>
                )}
              </div>

              {/* Appeal Content */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Murojaat Mazmuni:</h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {selectedAppealForDetail.content}
                </div>
              </div>

              {/* Resolution if exists */}
              {selectedAppealForDetail.status === 'hal_etildi' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Tashkilot Ijro Natijasi</span>
                  </h4>
                  {selectedAppealForDetail.resolutionText && (
                    <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-line font-medium text-xs sm:text-sm">
                      {selectedAppealForDetail.resolutionText}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <span>Ijrochi: <b>{selectedAppealForDetail.assignedOperator || 'Tashkilot mas\'uli'}</b></span>
                    <span>Sana: <b>{selectedAppealForDetail.resolvedAt ? new Date(selectedAppealForDetail.resolvedAt).toLocaleString('uz-UZ') : 'Hal etilgan'}</b></span>
                  </div>
                  {selectedAppealForDetail.resolutionPhotoUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedAppealForDetail.resolutionPhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>📷 Ijro isboti (foto/hujjatni ko'rish)</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedAppealForDetail(null)}
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XULOSA YOZISH ================= */}
      {editingTaskId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Mahalla Xulosasi & Dalolatnoma Matni</span>
              </h3>
              <button
                onClick={() => setEditingTaskId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Xulosa tayyorlagan mas'ul shaxs (F.I.Sh.):
                </label>
                <input
                  type="text"
                  value={xulosaAuthorInput}
                  onChange={(e) => setXulosaAuthorInput(e.target.value)}
                  placeholder="Masalan: M. Fayziyev (Mahalla raisi)"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  O‘rganish natijasi, ko‘rilgan choralar va takliflar:
                </label>
                <textarea
                  rows={6}
                  value={xulosaInputText}
                  onChange={(e) => setXulosaInputText(e.target.value)}
                  placeholder="Ushbu topshiriq yuzasidan o‘tkazilgan o‘rganish natijalari, xatlov ma'lumotlari va xulosani to‘liq yozing..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-indigo-50/50 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                💡 Ushbu matn rasmiy dalolatnoma blankasiga kiritiladi. Saqlaganingizdan so‘ng qog‘ozga chiqarib mas'ul tashkilotga topshirishingiz mumkin.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingTaskId(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSaveXulosaSubmit}
                disabled={isSavingXulosa || !xulosaInputText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingXulosa ? 'Saqlanmoqda...' : 'Saqlash va Blankaga Kiritish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRINTABLE BLANKA (HIDDEN ON SCREEN, VISIBLE ON PRINT) ================= */}
      {printTask && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-[9999] text-black">
          <div className="border-4 border-slate-900 p-8 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-wider">
                O‘zbekiston Respublikasi • Samarqand Viloyati
              </h2>
              <h3 className="text-lg font-bold">
                Paxtachi Tumani 1-Sektor • "{mahalla.name}" Mahalla Yettiligi
              </h3>
              <p className="text-sm font-semibold">
                RASMIY O‘RGANISH XULOSASI VA DALOLATNOMASI
              </p>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p><b>Topshiriq raqami:</b> № {printTask.taskNumber}</p>
                <p><b>Sana:</b> {new Date().toLocaleDateString('uz-UZ')}</p>
                <p><b>Mahalla raisi:</b> {mahalla.chairman}</p>
              </div>
              <div>
                <p><b>Mas'ul yettilik a'zosi:</b> {printTask.targetRole || 'Mahalla Yettiligi'}</p>
                <p><b>Taqdim etiladigan tashkilot:</b> {printTask.targetOrgName || '1-Sektor Shtabi'}</p>
              </div>
            </div>

            {/* Task Title */}
            <div className="border-t border-b border-slate-300 py-3">
              <h4 className="font-bold text-sm">Topshiriq mazmuni:</h4>
              <p className="text-xs mt-1">{printTask.title}</p>
              <p className="text-xs text-slate-700 mt-1">{printTask.description}</p>
            </div>

            {/* Xulosa matni */}
            <div className="space-y-2 min-h-[250px]">
              <h4 className="font-bold text-sm">O‘rganish natijasi va Mahalla Yettiligi xulosasi:</h4>
              <div className="border border-slate-300 p-4 rounded-md text-xs leading-relaxed min-h-[200px]">
                {printTask.xulosaText ? (
                  printTask.xulosaText
                ) : (
                  <p className="text-slate-400 italic">
                    (Ushbu joyga xulosa va ko‘rilgan choralar qayd etiladi)
                  </p>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
              <div>
                <p className="font-bold">Mahalla Yettiligi nomidan:</p>
                <p className="mt-8">F.I.Sh: ______________________ Imzo: _______</p>
                <p className="mt-2 text-[10px] text-slate-500">M.O‘. (Mahalla muhri)</p>
              </div>
              <div>
                <p className="font-bold">Xulosani qabul qiluvchi tashkilot:</p>
                <p className="mt-8">F.I.Sh: ______________________ Imzo: _______</p>
                <p className="mt-2 text-[10px] text-slate-500">M.O‘. (Tashkilot muhri)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
