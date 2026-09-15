import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  User,
  Phone,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Printer,
  Trash2,
  RefreshCw,
  FileCheck2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Info,
} from 'lucide-react';
import { PAXTACHI_MAHALLAS, MahallaInfo, DEFAULT_MAHALLA_YETTILIGI_TASKS } from '../data/mahallasData';
import { MahallaTask, MahallaTaskStatus, Organization } from '../types';

interface MahallaYettiligiSectionProps {
  mahallaTasks: MahallaTask[];
  organizations: Organization[];
  onSendMahallaTask: (taskData: {
    title: string;
    description: string;
    targetRole: string;
    mahallaId: string;
    targetOrgId?: string;
    targetOrgName?: string;
    deadline?: string;
    category?: string;
  }) => Promise<void>;
  onSeedAllMahallaTasks: (deadlineDays?: number) => Promise<void>;
  onApproveMahallaTask: (taskId: string, approverNote?: string) => Promise<void>;
  onRejectMahallaTask: (taskId: string, approverNote?: string) => Promise<void>;
  onDeleteMahallaTask: (taskId: string) => Promise<void>;
  isLoading?: boolean;
}

export const MahallaYettiligiSection: React.FC<MahallaYettiligiSectionProps> = ({
  mahallaTasks = [],
  organizations = [],
  onSendMahallaTask,
  onSeedAllMahallaTasks,
  onApproveMahallaTask,
  onRejectMahallaTask,
  onDeleteMahallaTask,
  isLoading = false,
}) => {
  // Navigation & Drilldown State
  const [selectedMahalla, setSelectedMahalla] = useState<MahallaInfo | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'mahallas' | 'all_tasks' | 'yettilik_roles'>('mahallas');

  // Search & Filter States
  const [mahallaSearch, setMahallaSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | MahallaTaskStatus>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskRoleFilter, setTaskRoleFilter] = useState<string>('all');

  // Modal States
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<MahallaTask | null>(null);
  const [adminFeedbackNote, setAdminFeedbackNote] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTargetRole, setNewTaskTargetRole] = useState('Yettilik tarkibi');
  const [newTaskMahallaId, setNewTaskMahallaId] = useState('all');
  const [newTaskOrgId, setNewTaskOrgId] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Mahalla Yettiligi Vazifasi');

  // Password view map
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedMahallaId, setCopiedMahallaId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Overall Metrics
  const totalTasks = mahallaTasks.length;
  const yangiTasks = mahallaTasks.filter((t) => t.status === 'yangi').length;
  const jarayondaTasks = mahallaTasks.filter((t) => t.status === 'jarayonda').length;
  const bajarildiTasks = mahallaTasks.filter((t) => t.status === 'bajarildi').length;
  const qaytarildiTasks = mahallaTasks.filter((t) => t.status === 'qaytarildi').length;
  const withXulosaTasks = mahallaTasks.filter((t) => !!t.xulosaText).length;

  // 2. Mahallas List with Calculated Task Metrics
  const mahallasWithStats = useMemo(() => {
    return PAXTACHI_MAHALLAS.map((m) => {
      const mTasks = mahallaTasks.filter((t) => t.mahallaId === m.id || t.mahallaId === 'all');
      const total = mTasks.length;
      const yangi = mTasks.filter((t) => t.status === 'yangi').length;
      const jarayonda = mTasks.filter((t) => t.status === 'jarayonda').length;
      const bajarildi = mTasks.filter((t) => t.status === 'bajarildi').length;
      const xulosaCount = mTasks.filter((t) => !!t.xulosaText).length;
      const percent = total > 0 ? Math.round((bajarildi / total) * 100) : 0;

      return {
        ...m,
        totalTasks: total,
        yangiTasks: yangi,
        jarayondaTasks: jarayonda,
        bajarildiTasks: bajarildi,
        xulosaCount,
        percent,
      };
    });
  }, [mahallaTasks]);

  // Filtered Mahallas Grid
  const filteredMahallas = useMemo(() => {
    return mahallasWithStats.filter((m) => {
      if (sectorFilter !== 'all' && m.sector !== Number(sectorFilter)) return false;
      if (mahallaSearch.trim()) {
        const q = mahallaSearch.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchChair = m.chairman.toLowerCase().includes(q);
        const matchPhone = m.phone.includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        if (!matchName && !matchChair && !matchPhone && !matchId) return false;
      }
      return true;
    });
  }, [mahallasWithStats, sectorFilter, mahallaSearch]);

  // Filtered Tasks List
  const filteredTasks = useMemo(() => {
    let list = mahallaTasks;

    if (selectedMahalla) {
      list = list.filter((t) => t.mahallaId === selectedMahalla.id || t.mahallaId === 'all');
    }

    if (taskStatusFilter !== 'all') {
      list = list.filter((t) => t.status === taskStatusFilter);
    }

    if (taskRoleFilter !== 'all') {
      list = list.filter((t) => t.targetRole === taskRoleFilter);
    }

    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.mahallaName.toLowerCase().includes(q) ||
          (t.targetRole && t.targetRole.toLowerCase().includes(q)) ||
          (t.targetOrgName && t.targetOrgName.toLowerCase().includes(q)) ||
          (t.xulosaText && t.xulosaText.toLowerCase().includes(q))
      );
    }

    return list;
  }, [mahallaTasks, selectedMahalla, taskStatusFilter, taskRoleFilter, taskSearch]);

  // Handle Seed All 12 Mahallas with official templates
  const handleSeedAll = async () => {
    if (!window.confirm("1-Sektorning barcha 12 ta mahallasiga 'Mahalla Yettiligi'ning namunaviy asosiy vazifalarini biriktirishni tasdiqlaysizmi?")) {
      return;
    }
    setIsSeeding(true);
    try {
      await onSeedAllMahallaTasks(15);
      showToast("✅ Barcha 12 ta mahallaga namunaviy vazifalar muvaffaqiyatli tarqatildi!");
    } catch (err: any) {
      alert("Xatolik: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle Create Task Submit
  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      alert("Iltimos, vazifa sarlavhasi va mazmunini kiriting.");
      return;
    }

    setIsSubmittingTask(true);
    try {
      const matchedOrg = organizations.find((o) => o.id === newTaskOrgId);
      await onSendMahallaTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        targetRole: newTaskTargetRole,
        mahallaId: newTaskMahallaId,
        targetOrgId: newTaskOrgId || undefined,
        targetOrgName: matchedOrg ? matchedOrg.name : undefined,
        deadline: newTaskDeadline || undefined,
        category: newTaskCategory,
      });

      showToast(
        newTaskMahallaId === 'all'
          ? "✅ Barcha 12 ta mahallaga yangi vazifa yuborildi!"
          : "✅ Mahallaga yangi vazifa muvaffaqiyatli yuborildi!"
      );

      setShowCreateTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDeadline('');
    } catch (err: any) {
      alert("Xatolik: " + err.message);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleCopyPassword = (mahallaId: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedMahallaId(mahallaId);
    showToast(`📋 Kirish paroli nusxalandi: ${pass}`);
    setTimeout(() => setCopiedMahallaId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & OVERVIEW BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black">
              <Users className="w-3.5 h-3.5" />
              <span>1-SEKTOR • 12 TA MAHALLA YETTILIGI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mahalla Yettiligi Boshqaruv & Ijro Paneli
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Paxtachi tumani 1-sektordagi 12 ta mahallada hokim yordamchisi, yoshlar yetakchisi, xotin-qizlar faoli, profilaktika inspektori, soliqchi va ijtimoiy xodimlar faoliyati bo‘yicha topshiriqlar, oflayn o‘rganish xulosalari hamda tashkilotlar tomonidan onlayn tasdiqlash monitoringi.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => {
                setNewTaskMahallaId(selectedMahalla ? selectedMahalla.id : 'all');
                setShowCreateTaskModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Vazifa Qo‘shish</span>
            </button>

            <button
              onClick={handleSeedAll}
              disabled={isSeeding}
              className="flex-1 sm:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              title="12 ta mahallaga asosiy namunaviy 6 ta vazifani tarqatish"
            >
              <Sparkles className={`w-4 h-4 text-amber-400 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Biriktirilmoqda...' : 'Namunaviy Vazifalar (Seed)'}</span>
            </button>
          </div>
        </div>

        {/* Executive Real-Time Mini Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jami Mahallalar</span>
            <span className="text-xl font-black text-white mt-1 block">{PAXTACHI_MAHALLAS.length} ta MFY</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jami Vazifalar</span>
            <span className="text-xl font-black text-indigo-300 mt-1 block">{totalTasks} ta</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Jarayonda (Oflayn)</span>
            <span className="text-xl font-black text-amber-300 mt-1 block">{jarayondaTasks} ta</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Bajarildi (Tasdiqlangan)</span>
            <span className="text-xl font-black text-emerald-300 mt-1 block">{bajarildiTasks} ta</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Yozilgan Xulosalar</span>
            <span className="text-xl font-black text-sky-300 mt-1 block">{withXulosaTasks} ta</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveSubTab('mahallas');
              setSelectedMahalla(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'mahallas' && !selectedMahalla
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>12 ta Mahalla Ro‘yxati ({PAXTACHI_MAHALLAS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('all_tasks');
              setSelectedMahalla(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'all_tasks'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Barcha Vazifalar ({mahallaTasks.length})</span>
            {jarayondaTasks > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
                {jarayondaTasks}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubTab('yettilik_roles');
              setSelectedMahalla(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'yettilik_roles'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Yettilik Lavozimlari & Vakolatlari</span>
          </button>
        </div>

        {selectedMahalla && (
          <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1">
              <span>Tanlangan mahalla:</span>
              <strong className="text-emerald-700 dark:text-emerald-400">{selectedMahalla.name}</strong>
            </span>
            <button
              onClick={() => setSelectedMahalla(null)}
              className="p-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. VIEW MODE A: 51 TA MAHALLALAR RO'YXATI (GRID / DIRECTORY) */}
      {activeSubTab === 'mahallas' && !selectedMahalla && (
        <div className="space-y-4">
          {/* Search & Sector Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={mahallaSearch}
                onChange={(e) => setMahallaSearch(e.target.value)}
                placeholder="Mahalla nomi, raisi yoki telefon raqami bo‘yicha qidirish..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Barcha Sektorlar (51 ta MFY)</option>
                <option value="1">1-Sektor hududidagi MFYlar</option>
              </select>
            </div>
          </div>

          {/* 14 Mahallas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMahallas.map((mfy, idx) => {
              return (
                <div
                  key={mfy.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Index Badge & Sector Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold rounded-md">
                          {mfy.id}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-800">
                        {mfy.sector}-sektor
                      </span>
                    </div>

                    {/* Mahalla Name */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {mfy.name}
                      </h3>
                    </div>

                    {/* Tasks Summary Counters */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">Jami</span>
                        <span className="font-black text-sm text-slate-900 dark:text-slate-100">{mfy.totalTasks} ta</span>
                      </div>
                      <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 rounded-xl p-2.5">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold mb-0.5">Jarayonda</span>
                        <span className="font-black text-sm text-amber-900 dark:text-amber-300">{mfy.jarayondaTasks} ta</span>
                      </div>
                      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-2.5">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold mb-0.5">Bajarildi</span>
                        <span className="font-black text-sm text-emerald-900 dark:text-emerald-300">{mfy.bajarildiTasks} ta</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedMahalla(mfy);
                        setActiveSubTab('all_tasks');
                      }}
                      className="flex-1 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Vazifalari ({mfy.totalTasks})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setNewTaskMahallaId(mfy.id);
                        setShowCreateTaskModal(true);
                      }}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center"
                      title="Ushbu mahallaga yangi vazifa qo'shish"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. VIEW MODE B: VAZIFALAR RO'YXATI (TASKS LIST) */}
      {(activeSubTab === 'all_tasks' || selectedMahalla) && (
        <div className="space-y-4">
          {/* Top Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Vazifa nomi, mahalla, xulosa yoki ijrochi bo‘yicha qidiruv..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">Barcha Holatlar</option>
                <option value="yangi">🔵 Yangi topshiriq</option>
                <option value="jarayonda">⏱️ Jarayonda (Oflayn o‘rganilmoqda)</option>
                <option value="bajarildi">✅ Bajarildi (Tasdiqlangan)</option>
                <option value="qaytarildi">⚠️ Qaytarilgan</option>
              </select>

              <select
                value={taskRoleFilter}
                onChange={(e) => setTaskRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">Barcha Yettilik A'zolari</option>
                <option value="Mahalla raisi">Mahalla raisi</option>
                <option value="Hokim yordamchisi">Hokim yordamchisi</option>
                <option value="Yoshlar yetakchisi">Yoshlar yetakchisi</option>
                <option value="Xotin-qizlar faoli">Xotin-qizlar faoli</option>
                <option value="Profilaktika inspektori">Profilaktika inspektori</option>
                <option value="Soliq inspektori (Soliqchi)">Soliqchi</option>
                <option value="Ijtimoiy xodim">Ijtimoiy xodim</option>
              </select>

              <button
                onClick={() => {
                  setNewTaskMahallaId(selectedMahalla ? selectedMahalla.id : 'all');
                  setShowCreateTaskModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Vazifa Yuborish</span>
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Mahalla vazifalari topilmadi</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Qidiruv shartlarini o‘zgartiring yoki yuqoridagi "Namunaviy Vazifalar (Seed)" tugmasini bosib 12 ta mahallaga asosiy vazifalarni biriktiring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                      task.status === 'bajarildi'
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : task.status === 'jarayonda'
                        ? 'border-amber-300 dark:border-amber-800 bg-amber-50/10 dark:bg-amber-950/20'
                        : task.status === 'qaytarildi'
                        ? 'border-rose-300 dark:border-rose-800 bg-rose-50/10 dark:bg-rose-950/20'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-black flex items-center justify-center">
                            #{task.taskNumber || '•'}
                          </span>
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100 block">
                              {task.mahallaName}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                              👤 {task.targetRole || 'Yettilik tarkibi'}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {task.status === 'bajarildi' && (
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-full text-[11px] flex items-center space-x-1 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Bajarildi</span>
                            </span>
                          )}
                          {task.status === 'jarayonda' && (
                            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold rounded-full text-[11px] flex items-center space-x-1 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Jarayonda (Oflayn)</span>
                            </span>
                          )}
                          {task.status === 'yangi' && (
                            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold rounded-full text-[11px] flex items-center space-x-1 border border-blue-200 dark:border-blue-800">
                              <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Yangi vazifa</span>
                            </span>
                          )}
                          {task.status === 'qaytarildi' && (
                            <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold rounded-full text-[11px] flex items-center space-x-1 border border-rose-200 dark:border-rose-800">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Qaytarildi</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Offline Study Conclusion / Xulosa Box if prepared */}
                      {task.xulosaText ? (
                        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-sky-950 dark:text-sky-200">
                            <span className="flex items-center space-x-1.5">
                              <FileCheck2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                              <span>Mahalla Oflayn Xulosasi:</span>
                            </span>
                            <span className="text-[10px] text-sky-600 dark:text-sky-400">
                              {task.xulosaPreparedAt
                                ? new Date(task.xulosaPreparedAt).toLocaleDateString('uz-UZ')
                                : 'Tayyorlangan'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/50">
                            "{task.xulosaText}"
                          </p>
                          {task.xulosaAuthor && (
                            <div className="text-[10px] text-sky-900 dark:text-sky-300 font-semibold">
                              <strong>Xulosa muallifi:</strong> {task.xulosaAuthor}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>Mahalla panelda "Bajaraman" bosib, oflayn o‘rganish xulosasini kiritadi.</span>
                        </div>
                      )}

                      {/* Approver Note */}
                      {task.approverNote && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-xl p-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                          <span className="font-bold">Tasdiq izohi: </span>
                          <span>{task.approverNote}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Toolbar & Detail / Approval Controls */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedTaskDetail(task);
                          setAdminFeedbackNote(task.approverNote || '');
                        }}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Batafsil & Xulosa</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {task.status !== 'bajarildi' && (
                        <button
                          onClick={async () => {
                            try {
                              await onApproveMahallaTask(
                                task.id,
                                "Bosh Kabinet / Sektor tomonidan oflayn o‘rganish natijalari asosida onlayn tasdiqlandi."
                              );
                              showToast("✅ Mahalla vazifasi onlayn tasdiqlandi (Bajarildi)!");
                            } catch (e: any) {
                              alert("Xatolik: " + e.message);
                            }
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs cursor-pointer"
                          title="Onlayn tasdiqlash"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tasdiqlash</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          if (!window.confirm("Ushbu mahalla vazifasini o‘chirishni tasdiqlaysizmi?")) return;
                          await onDeleteMahallaTask(task.id);
                          showToast("Vazifa o‘chirildi.");
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. VIEW MODE C: YETTILIK ROLES & WORKFLOW GUIDE */}
      {activeSubTab === 'yettilik_roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_MAHALLA_YETTILIGI_TASKS.map((t, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  0{idx + 1}
                </span>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">{t.targetRole}</h4>
                  <span className="text-[10px] text-slate-400">{t.targetOrgName}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.title}</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{t.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                <span>Oflayn ijro shakli:</span>
                <span>Xulosa & Tasdiq</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* CREATE NEW MAHALLA TASK MODAL */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Mahallaga Vazifa Yuborish</h3>
                  <p className="text-xs text-slate-400">Mahalla Yettiligi a'zolariga oflayn o'rganish topshirig'i</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qaysi Mahallaga Yuborilsin? *</label>
                <select
                  value={newTaskMahallaId}
                  onChange={(e) => setNewTaskMahallaId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">🌐 Barcha 12 ta Mahallaga (Umumiy Topshiriq)</option>
                  {PAXTACHI_MAHALLAS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mas'ul Yettilik A'zosi *</label>
                  <select
                    value={newTaskTargetRole}
                    onChange={(e) => setNewTaskTargetRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Yettilik tarkibi">Barcha Yettilik A'zolariga</option>
                    <option value="Mahalla raisi">Mahalla raisi</option>
                    <option value="Hokim yordamchisi">Hokim yordamchisi</option>
                    <option value="Yoshlar yetakchisi">Yoshlar yetakchisi</option>
                    <option value="Xotin-qizlar faoli">Xotin-qizlar faoli</option>
                    <option value="Profilaktika inspektori">Profilaktika inspektori</option>
                    <option value="Soliq inspektori (Soliqchi)">Soliqchi</option>
                    <option value="Ijtimoiy xodim">Ijtimoiy xodim</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tegishli Tashkilot</label>
                  <select
                    value={newTaskOrgId}
                    onChange={(e) => setNewTaskOrgId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tashkilot tanlanmagan</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topshiriq Sarlavhasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Uyushmagan yoshlar ro‘yxatini shakllantirish va o‘rganish"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topshiriq Mazmuni & Ko‘rsatma *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mahalla a'zosi oflayn bajarishi va xulosa yozishi lozim bo‘lgan chora-tadbirlar..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ijro Muddati (ixtiyoriy)</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingTask ? 'Yuborilmoqda...' : 'Topshiriqni Yuborish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAIL & ONLINE APPROVAL MODAL */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-800">
                    {selectedTaskDetail.mahallaName}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">#{selectedTaskDetail.taskNumber}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">{selectedTaskDetail.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mas'ul: {selectedTaskDetail.targetRole}</p>
              </div>
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Content */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Vazifa Mazmuni:</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedTaskDetail.description}</p>
              </div>

              {/* Offline Study Conclusion Box */}
              {selectedTaskDetail.xulosaText ? (
                <div className="bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sky-950 dark:text-sky-200 flex items-center space-x-1.5">
                      <FileCheck2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Mahalla Yettiligining Oflayn O‘rganish Xulosasi:</span>
                    </span>
                    <span className="text-[10px] text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full font-bold">
                      {selectedTaskDetail.xulosaPreparedAt
                        ? new Date(selectedTaskDetail.xulosaPreparedAt).toLocaleString('uz-UZ')
                        : ''}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-sky-100 dark:border-sky-900/50 text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium">
                    {selectedTaskDetail.xulosaText}
                  </div>
                  {selectedTaskDetail.xulosaAuthor && (
                    <div className="text-[11px] text-sky-900 dark:text-sky-300">
                      <strong>Xulosa tayyorlagan mas'ul:</strong> {selectedTaskDetail.xulosaAuthor}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 rounded-2xl text-amber-800 dark:text-amber-300 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>Mahalla hozircha oflayn o‘rganish xulosasini kiritmagan.</span>
                </div>
              )}

              {/* Feedback Note Input */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Onlayn Tasdiqlash / Qaytarish Izohi:
                </label>
                <textarea
                  rows={2}
                  value={adminFeedbackNote}
                  onChange={(e) => setAdminFeedbackNote(e.target.value)}
                  placeholder="Xulosa bo‘yicha izoh yoki qabul qilish xulosasi..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskDetail(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Yopish
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Ushbu mahalla vazifasini tizimdan butunlay o‘chirishni tasdiqlaysizmi?")) return;
                    await onDeleteMahallaTask(selectedTaskDetail.id);
                    showToast("🗑️ Mahalla vazifasi o‘chirildi.");
                    setSelectedTaskDetail(null);
                  }}
                  className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 hover:text-rose-900 font-bold rounded-xl text-xs border border-rose-200 dark:border-rose-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  title="Vazifani o'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>O‘chirish</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!adminFeedbackNote.trim()) {
                      alert("Iltimos, qaytarish sababini yozing.");
                      return;
                    }
                    await onRejectMahallaTask(selectedTaskDetail.id, adminFeedbackNote);
                    showToast("⚠️ Vazifa xulosasi qaytarildi");
                    setSelectedTaskDetail(null);
                  }}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-700 dark:text-rose-300 font-bold rounded-xl text-xs border border-rose-200 dark:border-rose-800 transition-all cursor-pointer"
                >
                  Qayta Ishlashga Qaytarish
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await onApproveMahallaTask(
                      selectedTaskDetail.id,
                      adminFeedbackNote.trim() || "Xulosa ko‘rib chiqildi va onlayn tasdiqlandi."
                    );
                    showToast("✅ Mahalla vazifasi onlayn tasdiqlandi!");
                    setSelectedTaskDetail(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Onlayn Tasdiqlash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 text-xs font-bold animate-in slide-in-from-bottom duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
