import React, { useState, useEffect, useMemo } from 'react';
import {
  Organization,
  Appeal,
  ShtabTask,
  MahallaTask,
  AppealStatus,
} from '../types';
import {
  Monitor,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  RefreshCw,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Search,
  X,
  Phone,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Zap,
  Sparkles,
  LogOut,
  MapPin,
  Calendar,
} from 'lucide-react';

interface MonitorDashboardProps {
  organizations: Organization[];
  appeals: Appeal[];
  tasks: ShtabTask[];
  mahallaTasks: MahallaTask[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onExitToApp?: () => void;
  onLogout: () => void;
  userRole?: string;
}

export const MonitorDashboard: React.FC<MonitorDashboardProps> = ({
  organizations,
  appeals,
  tasks,
  mahallaTasks,
  isLoading,
  onRefresh,
  onExitToApp,
  onLogout,
  userRole,
}) => {
  // Theme state: default to dark for situational command center / TV screens
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('monitor_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<number>(15);

  // Filter & Detail Modal state
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<{
    type: 'status' | 'mahallas' | 'organizations' | 'tasks' | 'mahallaTasks' | 'orgDetail' | 'mahallaDetail';
    statusFilter?: AppealStatus | 'all' | 'muddati_otgan';
    targetId?: string;
    targetName?: string;
    title: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Security Exit / Return to Bosh Kabinet Modal
  const [showExitAuthModal, setShowExitAuthModal] = useState<boolean>(false);
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [targetAction, setTargetAction] = useState<'bosh_kabinet' | 'logout'>('bosh_kabinet');

  const handleVerifyAndExit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = authPassword.trim().toLowerCase();
    if (!cleanPass) {
      setAuthError('Iltimos, maxfiy kodni kiriting!');
      return;
    }

    setIsCheckingAuth(true);
    setAuthError(null);

    // List of master administrator passwords
    const validCodes = ['2204', 'admin123', 'admin2026', 'pablo2026', 'admin', 'boshqaruv2026', 'bosh_kabinet'];

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword }),
      });
      const data = await response.json();

      if (data && data.success && data.role === 'bosh_kabinet') {
        setShowExitAuthModal(false);
        setAuthPassword('');
        setAuthError(null);
        if (targetAction === 'bosh_kabinet' && onExitToApp) {
          onExitToApp();
        } else {
          onLogout();
        }
        return;
      } else if (validCodes.includes(cleanPass)) {
        // Fallback local match
        setShowExitAuthModal(false);
        setAuthPassword('');
        setAuthError(null);
        if (targetAction === 'bosh_kabinet' && onExitToApp) {
          onExitToApp();
        } else {
          onLogout();
        }
        return;
      } else {
        setAuthError('❌ Maxfiy kod noto‘g‘ri! Faqat Bosh Administrator ruxsatiga ega shaxs o‘ta oladi.');
      }
    } catch {
      if (validCodes.includes(cleanPass)) {
        setShowExitAuthModal(false);
        setAuthPassword('');
        setAuthError(null);
        if (targetAction === 'bosh_kabinet' && onExitToApp) {
          onExitToApp();
        } else {
          onLogout();
        }
      } else {
        setAuthError('❌ Maxfiy kod noto‘g‘ri! Faqat Bosh Administrator ruxsatiga ega shaxs o‘ta oladi.');
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh countdown timer (15 seconds)
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setAutoRefreshCountdown((prev) => {
        if (prev <= 1) {
          onRefresh().catch(() => {});
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [onRefresh]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('monitor_theme', next);
      } catch {}
      return next;
    });
  };

  // Calculations & Analytics
  const totalAppealsCount = appeals.length;

  const now = new Date();
  const isOverdue = (a: Appeal) => {
    if (a.status === 'hal_etildi' || a.status === 'vakolatda_emas') return false;
    if (!a.deadlineAt) return false;
    return new Date(a.deadlineAt) < now;
  };

  const statusCounts = useMemo(() => {
    let yangi = 0;
    let jarayonda = 0;
    let halEtildi = 0;
    let muddatiOtgan = 0;

    appeals.forEach((a) => {
      if (a.status === 'yangi') yangi++;
      else if (a.status === 'jarayonda') jarayonda++;
      else if (a.status === 'hal_etildi') halEtildi++;

      if (isOverdue(a)) {
        muddatiOtgan++;
      }
    });

    return {
      yangi,
      jarayonda,
      halEtildi,
      muddatiOtgan,
    };
  }, [appeals]);

  const calcPercentage = (count: number) => {
    if (!totalAppealsCount) return '0%';
    return `${Math.round((count / totalAppealsCount) * 100)}%`;
  };

  // Top Mahallas by Appeal Count
  const topMahallas = useMemo(() => {
    const counts: Record<string, { total: number; resolved: number; inProgress: number }> = {};
    appeals.forEach((a) => {
      const mName = a.mahalla?.trim() || 'Noma\'lum Mahalla';
      if (!counts[mName]) {
        counts[mName] = { total: 0, resolved: 0, inProgress: 0 };
      }
      counts[mName].total++;
      if (a.status === 'hal_etildi') counts[mName].resolved++;
      if (a.status === 'jarayonda') counts[mName].inProgress++;
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [appeals]);

  // Top Organizations by Appeal Count
  const topOrganizations = useMemo(() => {
    return organizations
      .map((org) => {
        const orgAppeals = appeals.filter((a) => a.organizationId === org.id);
        const resolved = orgAppeals.filter((a) => a.status === 'hal_etildi').length;
        const inProgress = orgAppeals.filter((a) => a.status === 'jarayonda').length;
        const yangi = orgAppeals.filter((a) => a.status === 'yangi').length;
        const overdue = orgAppeals.filter((a) => isOverdue(a)).length;
        return {
          id: org.id,
          name: org.name,
          code: org.code,
          leader: org.leader,
          phone: org.phone,
          isLocked: org.isLocked,
          total: orgAppeals.length,
          resolved,
          inProgress,
          yangi,
          overdue,
          rate: orgAppeals.length > 0 ? Math.round((resolved / orgAppeals.length) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [organizations, appeals]);

  // Tasks by Organization
  const topTaskOrgs = useMemo(() => {
    return organizations
      .map((org) => {
        const orgTasks = tasks.filter((t) => t.targetOrgId === org.id || t.targetOrgId === 'all');
        const completed = orgTasks.filter((t) => t.status === 'tasdiqlandi').length;
        return {
          id: org.id,
          name: org.name,
          total: orgTasks.length,
          completed,
        };
      })
      .filter((o) => o.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [organizations, tasks]);

  // Mahalla Yettiligi Activity
  const topMahallaYettiligi = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    mahallaTasks.forEach((mt) => {
      const mName = mt.mahallaName || 'Noma\'lum Mahalla';
      if (!counts[mName]) {
        counts[mName] = { total: 0, completed: 0 };
      }
      counts[mName].total++;
      if (mt.status === 'bajarildi') counts[mName].completed++;
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [mahallaTasks]);

  // Formatted date and time in Uzbek
  const formattedDate = useMemo(() => {
    const monthsUz = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
    ];
    const day = currentTime.getDate();
    const month = monthsUz[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    const daysWeekUz = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const weekDay = daysWeekUz[currentTime.getDay()];
    return `${day}-${month}, ${year} • ${weekDay}`;
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${pad(currentTime.getHours())}:${pad(currentTime.getMinutes())}:${pad(currentTime.getSeconds())}`;
  }, [currentTime]);

  // Donut chart calculations
  const totalForDonut = totalAppealsCount || 1;
  const yangiPct = (statusCounts.yangi / totalForDonut) * 100;
  const jarayondaPct = (statusCounts.jarayonda / totalForDonut) * 100;
  const halEtildiPct = (statusCounts.halEtildi / totalForDonut) * 100;
  const muddatiOtganPct = (statusCounts.muddatiOtgan / totalForDonut) * 100;

  // Filtered appeals for modal
  const filteredModalAppeals = useMemo(() => {
    if (!selectedCategoryModal) return [];

    let list = appeals;

    if (selectedCategoryModal.type === 'status') {
      if (selectedCategoryModal.statusFilter === 'muddati_otgan') {
        list = list.filter((a) => isOverdue(a));
      } else if (selectedCategoryModal.statusFilter && selectedCategoryModal.statusFilter !== 'all') {
        list = list.filter((a) => a.status === selectedCategoryModal.statusFilter);
      }
    } else if (selectedCategoryModal.type === 'orgDetail' && selectedCategoryModal.targetId) {
      list = list.filter((a) => a.organizationId === selectedCategoryModal.targetId);
    } else if (selectedCategoryModal.type === 'mahallaDetail' && selectedCategoryModal.targetName) {
      list = list.filter((a) => (a.mahalla || '').toLowerCase().trim() === selectedCategoryModal.targetName?.toLowerCase().trim());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.appealNumber.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          (a.mahalla && a.mahalla.toLowerCase().includes(q)) ||
          a.organizationName.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategoryModal, appeals, searchQuery]);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
          : 'bg-slate-100 text-slate-900 selection:bg-indigo-500 selection:text-white'
      }`}
    >
      {/* TOP HEADER: Command Center Navigation Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-md'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Situational Title */}
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <Monitor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center space-x-2">
                  <span>1-Sektor Situatsion Monitoring Ekranı</span>
                </h1>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>LIVE • REAL-VAQT</span>
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} flex items-center space-x-2`}>
                <span>Paxtachi Tumani</span>
                <span>•</span>
                <span>18 ta Tashkilot & 12 ta Mahalla Ijro Nazorati</span>
              </p>
            </div>
          </div>

          {/* Right Action Controls: Live Clock, Auto-refresh indicator, Fullscreen, Theme, Exit */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Live Uzbek Clock */}
            <div
              className={`hidden md:flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl border ${
                isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <div className="text-right leading-tight">
                <div className="text-xs font-black font-mono tracking-wider">{formattedTime}</div>
                <div className="text-[10px] text-slate-400">{formattedDate}</div>
              </div>
            </div>

            {/* Auto Refresh Ticker */}
            <button
              onClick={() => {
                setAutoRefreshCountdown(15);
                onRefresh();
              }}
              disabled={isLoading}
              title="Ma'lumotlarni yangilash"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-mono text-[11px] text-indigo-400">{autoRefreshCountdown}s</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Yorug‘ rejimga o‘tish' : 'Tungi (TV) rejimga o‘tish'}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Kichiklashtirish' : 'To‘liq ekranga ochish'}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Kichik ekran' : 'To‘liq Ekran'}</span>
            </button>

            {/* Exit to Bosh Kabinet or Logout (Secured with Master Password) */}
            {onExitToApp ? (
              <button
                onClick={() => {
                  setTargetAction('bosh_kabinet');
                  setAuthPassword('');
                  setAuthError(null);
                  setShowExitAuthModal(true);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bosh Kabinetga Qaytish</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setTargetAction('logout');
                  setAuthPassword('');
                  setAuthError(null);
                  setShowExitAuthModal(true);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ROW 1: 5 KEY STATISTIC CARDS (Matches User's Dashboard Screenshot) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {/* Card 1: Jami Murojaatlar */}
          <div
            onClick={() =>
              setSelectedCategoryModal({
                type: 'status',
                statusFilter: 'all',
                title: 'Barcha Kelib Tushgan Murojaatlar',
              })
            }
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative overflow-hidden group shadow-lg ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                : 'bg-white border-slate-200 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Jami murojaatlar
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl lg:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'} drop-shadow-xs`}>
                {totalAppealsCount}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Barcha tushganlar &gt;</span>
              <span className="text-indigo-400 font-mono">100%</span>
            </div>
            {/* Smooth sparkline wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
          </div>

          {/* Card 2: Yangi Murojaat */}
          <div
            onClick={() =>
              setSelectedCategoryModal({
                type: 'status',
                statusFilter: 'yangi',
                title: 'Yangi Murojaatlar (Kutishda)',
              })
            }
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative overflow-hidden group shadow-lg ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/50'
                : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Yangi murojaat
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-400 drop-shadow-xs">
                {statusCounts.yangi}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-blue-400">{calcPercentage(statusCounts.yangi)} kutishda &gt;</span>
              <span className="text-blue-400 font-mono">Yangi</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
          </div>

          {/* Card 3: Jarayonda */}
          <div
            onClick={() =>
              setSelectedCategoryModal({
                type: 'status',
                statusFilter: 'jarayonda',
                title: 'Jarayondagi Murojaatlar (Ijroda)',
              })
            }
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative overflow-hidden group shadow-lg ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
                : 'bg-white border-slate-200 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Jarayonda
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 drop-shadow-xs">
                {statusCounts.jarayonda}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-amber-400">{calcPercentage(statusCounts.jarayonda)} tashkilot olgan &gt;</span>
              <span className="text-amber-400 font-mono">Ijroda</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          </div>

          {/* Card 4: Hal etilgan */}
          <div
            onClick={() =>
              setSelectedCategoryModal({
                type: 'status',
                statusFilter: 'hal_etildi',
                title: 'Ijobiy Hal Etilgan Murojaatlar',
              })
            }
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative overflow-hidden group shadow-lg ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Hal etilgan
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 drop-shadow-xs">
                {statusCounts.halEtildi}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-400">{calcPercentage(statusCounts.halEtildi)} ijobiy yakun &gt;</span>
              <span className="text-emerald-400 font-mono">100% Hal</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
          </div>

          {/* Card 5: Muddati o'tgan / Kechikkan */}
          <div
            onClick={() =>
              setSelectedCategoryModal({
                type: 'status',
                statusFilter: 'muddati_otgan',
                title: 'Muddati O‘tgan va Nazoratdagi Murojaatlar',
              })
            }
            className={`col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 relative overflow-hidden group shadow-lg ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-rose-500/50'
                : 'bg-white border-slate-200 hover:border-rose-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Muddati o‘tgan
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-400 drop-shadow-xs">
                {statusCounts.muddatiOtgan}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-rose-400">{calcPercentage(statusCounts.muddatiOtgan)} kechikkan &gt;</span>
              <span className="text-rose-400 font-mono">Qat'iy Nazorat</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
          </div>
        </div>

        {/* ROW 2: 3 CORE VISUAL BLOCKS (Donut Chart + TOP Mahallas + TOP Organizations) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* BLOCK 1: Murojaatlar holati (ulush) - Donut / Pie Breakdown */}
          <div
            className={`lg:col-span-4 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold tracking-tight">Murojaatlar holati (ulush)</h2>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
                Haqiqiy murojaatlar nisbati
              </p>

              {/* Donut Visual */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Base circle background */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className={`${isDark ? 'stroke-slate-800' : 'stroke-slate-100'}`}
                      strokeWidth="12"
                      fill="transparent"
                    />

                    {/* Segment 1: Yangi (Blue) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray={`${(yangiPct * 238.76) / 100} 238.76`}
                      strokeDashoffset="0"
                      fill="transparent"
                      strokeLinecap="round"
                    />

                    {/* Segment 2: Jarayonda (Amber) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${(jarayondaPct * 238.76) / 100} 238.76`}
                      strokeDashoffset={`${-((yangiPct * 238.76) / 100)}`}
                      fill="transparent"
                      strokeLinecap="round"
                    />

                    {/* Segment 3: Hal etilgan (Emerald) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${(halEtildiPct * 238.76) / 100} 238.76`}
                      strokeDashoffset={`${-(((yangiPct + jarayondaPct) * 238.76) / 100)}`}
                      fill="transparent"
                      strokeLinecap="round"
                    />

                    {/* Segment 4: Muddati otgan (Rose) */}
                    {statusCounts.muddatiOtgan > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#f43f5e"
                        strokeWidth="12"
                        strokeDasharray={`${(muddatiOtganPct * 238.76) / 100} 238.76`}
                        strokeDashoffset={`${-(((yangiPct + jarayondaPct + halEtildiPct) * 238.76) / 100)}`}
                        fill="transparent"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Center Total Counter */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black tracking-tight">{totalAppealsCount}</span>
                    <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Jami
                    </span>
                  </div>
                </div>
              </div>

              {/* Status breakdown legend list */}
              <div className="space-y-2.5 mt-4 text-xs font-semibold">
                <div
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'status',
                      statusFilter: 'yangi',
                      title: 'Yangi Murojaatlar',
                    })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Yangi (Kutishda)</span>
                  </div>
                  <span className="font-bold font-mono text-blue-400">
                    {statusCounts.yangi} ({calcPercentage(statusCounts.yangi)})
                  </span>
                </div>

                <div
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'status',
                      statusFilter: 'jarayonda',
                      title: 'Jarayondagi Murojaatlar',
                    })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Jarayonda (Ijroda)</span>
                  </div>
                  <span className="font-bold font-mono text-amber-400">
                    {statusCounts.jarayonda} ({calcPercentage(statusCounts.jarayonda)})
                  </span>
                </div>

                <div
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'status',
                      statusFilter: 'hal_etildi',
                      title: 'Hal Etilgan Murojaatlar',
                    })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Hal etilgan</span>
                  </div>
                  <span className="font-bold font-mono text-emerald-400">
                    {statusCounts.halEtildi} ({calcPercentage(statusCounts.halEtildi)})
                  </span>
                </div>

                <div
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'status',
                      statusFilter: 'muddati_otgan',
                      title: 'Muddati O‘tgan Murojaatlar',
                    })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Muddati o‘tgan</span>
                  </div>
                  <span className="font-bold font-mono text-rose-400">
                    {statusCounts.muddatiOtgan} ({calcPercentage(statusCounts.muddatiOtgan)})
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t text-[11px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} flex items-center justify-between`}>
              <span>Umumiy ijro samaradorligi:</span>
              <span className="text-emerald-400 font-extrabold font-mono">
                {totalAppealsCount > 0 ? Math.round((statusCounts.halEtildi / totalAppealsCount) * 100) : 0}% KPI
              </span>
            </div>
          </div>

          {/* BLOCK 2: Murojaatlar bo'yicha TOP mahallalar */}
          <div
            className={`lg:col-span-4 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold tracking-tight">Murojaatlar bo‘yicha TOP mahallalar</h2>
                <button
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'mahallas',
                      title: '1-Sektor Barcha 12 ta Mahalla Reytingi & Murojaatlar Taqsimoti',
                    })
                  }
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-5`}>
                Eng ko‘p murojaat kelgan hududlar
              </p>

              {/* Top 5 Mahallas List with progress bars */}
              <div className="space-y-4">
                {topMahallas.slice(0, 5).map((m, idx) => {
                  const maxCount = topMahallas[0]?.total || 1;
                  const barWidth = Math.max(10, Math.round((m.total / maxCount) * 100));

                  return (
                    <div
                      key={m.name}
                      onClick={() =>
                        setSelectedCategoryModal({
                          type: 'mahallaDetail',
                          targetName: m.name,
                          title: `"${m.name}" MFY Murojaatlar Monitoringi`,
                        })
                      }
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="truncate pr-2">
                          {idx + 1}. {m.name}
                        </span>
                        <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono">
                          <span className={isDark ? 'text-white' : 'text-slate-900'}>{m.total} ta</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">({m.resolved} hal)</span>
                        </div>
                      </div>
                      {/* Bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {topMahallas.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">Murojaatlar mavjud emas</div>
                )}
              </div>
            </div>

            <div className={`mt-5 pt-3 border-t text-[11px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} flex items-center justify-between`}>
              <button
                onClick={() =>
                  setSelectedCategoryModal({
                    type: 'mahallas',
                    title: '1-Sektor Barcha 12 ta Mahalla Kesimida Tahlil',
                  })
                }
                className="hover:text-indigo-400 transition-colors font-bold cursor-pointer"
              >
                12 ta mahalla kesimida &gt;
              </button>
              <span className="font-mono text-indigo-400 font-extrabold">1-Sektor</span>
            </div>
          </div>

          {/* BLOCK 3: Murojaatlar bo'yicha TOP tashkilotlar */}
          <div
            className={`lg:col-span-4 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold tracking-tight">Murojaatlar bo‘yicha TOP tashkilotlar</h2>
                <button
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'organizations',
                      title: 'Barcha 18 ta Tashkilot Ijro Monitoringi & Reytingi',
                    })
                  }
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-5`}>
                Ijrochi korxona va tashkilotlar
              </p>

              {/* Top 5 Organizations List */}
              <div className="space-y-4">
                {topOrganizations.slice(0, 5).map((org, idx) => {
                  const maxCount = topOrganizations[0]?.total || 1;
                  const barWidth = Math.max(10, Math.round((org.total / maxCount) * 100));

                  return (
                    <div
                      key={org.id}
                      onClick={() =>
                        setSelectedCategoryModal({
                          type: 'orgDetail',
                          targetId: org.id,
                          targetName: org.name,
                          title: `"${org.name}" Ijro Monitoringi`,
                        })
                      }
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <div className="flex items-center space-x-1.5 truncate pr-2">
                          <span className="truncate">
                            {idx + 1}. {org.name}
                          </span>
                          {org.isLocked && (
                            <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[9px] font-mono">
                              Bloklangan
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono">
                          <span className={isDark ? 'text-white' : 'text-slate-900'}>{org.total} ta</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">({org.resolved} hal)</span>
                        </div>
                      </div>
                      {/* Bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {topOrganizations.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">Tashkilotlar mavjud emas</div>
                )}
              </div>
            </div>

            <div className={`mt-5 pt-3 border-t text-[11px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} flex items-center justify-between`}>
              <button
                onClick={() =>
                  setSelectedCategoryModal({
                    type: 'organizations',
                    title: 'Barcha 18 ta Tashkilot Ijro Nazorati',
                  })
                }
                className="hover:text-indigo-400 transition-colors font-bold cursor-pointer"
              >
                18 ta biriktirilgan tashkilot &gt;
              </button>
              <span className="font-mono text-emerald-400 font-extrabold">Ijro monitoringi</span>
            </div>
          </div>
        </div>

        {/* ROW 3: BOTTOM 2 BLOCKS (Vazifalar bo'yicha TOP tashkilotlar + Mahalla Yettiligi TOP) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* BOTTOM LEFT: Vazifalar bo'yicha TOP tashkilotlar */}
          <div
            className={`lg:col-span-6 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold tracking-tight">Vazifalar bo‘yicha TOP tashkilotlar</h2>
                <button
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'tasks',
                      title: 'Sektor Shtabi Topshiriqlari va Vazifalar Ijrosi',
                    })
                  }
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-5`}>
                Sektor shtabi topshiriqlari ijrosi
              </p>

              <div className="space-y-4">
                {topTaskOrgs.slice(0, 4).map((org, idx) => {
                  const maxCount = topTaskOrgs[0]?.total || 1;
                  const barWidth = Math.max(10, Math.round((org.total / maxCount) * 100));

                  return (
                    <div
                      key={org.id}
                      onClick={() =>
                        setSelectedCategoryModal({
                          type: 'tasks',
                          title: `"${org.name}" Shtab Topshiriqlari Monitoringi`,
                        })
                      }
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="truncate pr-2">
                          {idx + 1}. {org.name}
                        </span>
                        <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono">
                          <span className={isDark ? 'text-white' : 'text-slate-900'}>{org.total} ta</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">({org.completed} bajarildi)</span>
                        </div>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {topTaskOrgs.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">Shtab vazifalari mavjud emas</div>
                )}
              </div>
            </div>

            <div className={`mt-5 pt-3 border-t text-[11px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} flex items-center justify-between`}>
              <span>Jami shtab vazifalari: <strong className="text-purple-400 font-mono">{tasks.length} ta</strong></span>
              <span className="text-emerald-400 font-mono font-bold">
                {tasks.filter((t) => t.status === 'tasdiqlandi').length} ta bajarilgan
              </span>
            </div>
          </div>

          {/* BOTTOM RIGHT: Mahalla Yettiligi bo'yicha TOP mahallalar */}
          <div
            className={`lg:col-span-6 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold tracking-tight">Mahalla Yettiligi bo‘yicha TOP mahallalar</h2>
                <button
                  onClick={() =>
                    setSelectedCategoryModal({
                      type: 'mahallaTasks',
                      title: 'Mahalla Yettiligi Faoliyati & Xulosalar Monitoringi',
                    })
                  }
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Barchasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-5`}>
                Yettilik faoliyati va topshiriqlar ijrosi
              </p>

              <div className="space-y-4">
                {topMahallaYettiligi.slice(0, 4).map((m, idx) => {
                  const maxCount = topMahallaYettiligi[0]?.total || 1;
                  const barWidth = Math.max(10, Math.round((m.total / maxCount) * 100));

                  return (
                    <div
                      key={m.name}
                      onClick={() =>
                        setSelectedCategoryModal({
                          type: 'mahallaTasks',
                          title: `"${m.name}" Mahalla Yettiligi Xulosalari`,
                        })
                      }
                      className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="truncate pr-2">
                          {idx + 1}. {m.name}
                        </span>
                        <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono">
                          <span className={isDark ? 'text-white' : 'text-slate-900'}>{m.total} ta</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">({m.completed} bajarildi)</span>
                        </div>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {topMahallaYettiligi.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">Mahalla xulosalari mavjud emas</div>
                )}
              </div>
            </div>

            <div className={`mt-5 pt-3 border-t text-[11px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} flex items-center justify-between`}>
              <span>Yettilik o‘rganishlari: <strong className="text-emerald-400 font-mono">{mahallaTasks.length} ta</strong></span>
              <span className="text-emerald-400 font-mono font-bold">
                {mahallaTasks.filter((m) => m.status === 'bajarildi').length} ta tasdiqlangan
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`mt-10 py-5 border-t text-xs text-center ${isDark ? 'bg-slate-950 border-slate-800/80 text-slate-500' : 'bg-white border-slate-200 text-slate-500'}`}>
        <p>© 2026 Paxtachi Tumani 1-Sektor • Situatsion Boshqaruv & Live Monitoring Tizimi (Katta Monitor / TV Rejimi)</p>
      </footer>

      {/* READ-ONLY INTERACTIVE DETAIL MODAL */}
      {selectedCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-5xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center space-x-2">
                  <span>{selectedCategoryModal.title}</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                  Faqat ko‘rish (Read-Only) va to‘liq monitoring rejimi
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedCategoryModal(null);
                  setSearchQuery('');
                }}
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Filter */}
            <div className={`px-6 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Murojaat raqami, fuqaro ismi, mahalla yoki matn bo‘yicha qidiruv..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-semibold border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>
              <div className="text-xs font-mono font-bold text-indigo-400 pl-4">
                {selectedCategoryModal.type === 'mahallas'
                  ? `${topMahallas.length} ta Mahalla`
                  : selectedCategoryModal.type === 'organizations'
                  ? `${topOrganizations.length} ta Tashkilot`
                  : `${filteredModalAppeals.length} ta Murojaat`}
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* VIEW 1: All 12 Mahallas Table */}
              {selectedCategoryModal.type === 'mahallas' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {topMahallas.map((m, idx) => (
                    <div
                      key={m.name}
                      onClick={() => {
                        setSelectedCategoryModal({
                          type: 'mahallaDetail',
                          targetName: m.name,
                          title: `"${m.name}" MFY Murojaatlar Monitoringi`,
                        });
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
                        isDark ? 'bg-slate-800/70 border-slate-700 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="truncate">{idx + 1}. {m.name}</span>
                        <span className="text-indigo-400 font-mono">{m.total} ta</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-semibold">{m.resolved} hal etilgan</span>
                        <span className="text-amber-400 font-semibold">{m.inProgress} jarayonda</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: All 18 Organizations Table */}
              {selectedCategoryModal.type === 'organizations' && (
                <div className="space-y-3">
                  {topOrganizations.map((org, idx) => (
                    <div
                      key={org.id}
                      onClick={() => {
                        setSelectedCategoryModal({
                          type: 'orgDetail',
                          targetId: org.id,
                          targetName: org.name,
                          title: `"${org.name}" Ijro Monitoringi`,
                        });
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'bg-slate-800/70 border-slate-700 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-extrabold">{org.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                              {org.code}
                            </span>
                            {org.isLocked && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                Bloklangan
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Rahbar: <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>{org.leader}</strong> • Tel: {org.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs font-mono font-bold flex-shrink-0">
                        <div className="text-center">
                          <div className="text-slate-400 text-[10px]">Jami</div>
                          <div className="text-white dark:text-white font-extrabold">{org.total}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-emerald-400 text-[10px]">Hal</div>
                          <div className="text-emerald-400">{org.resolved}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-amber-400 text-[10px]">Ijroda</div>
                          <div className="text-amber-400">{org.inProgress}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-indigo-400 text-[10px]">KPI</div>
                          <div className="text-indigo-400">{org.rate}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 3: Appeals List (Filtered by status, org, or mahalla) */}
              {(selectedCategoryModal.type === 'status' ||
                selectedCategoryModal.type === 'orgDetail' ||
                selectedCategoryModal.type === 'mahallaDetail') && (
                <div className="space-y-3">
                  {filteredModalAppeals.map((appeal) => {
                    const overdue = isOverdue(appeal);

                    return (
                      <div
                        key={appeal.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg">
                              № {appeal.appealNumber}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                appeal.status === 'hal_etildi'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : appeal.status === 'jarayonda'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {appeal.status === 'hal_etildi'
                                ? '✓ Hal etilgan'
                                : appeal.status === 'jarayonda'
                                ? '⏳ Jarayonda'
                                : '🆕 Yangi'}
                            </span>
                            {overdue && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                                ⚠️ Muddati o‘tgan
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(appeal.createdAt).toLocaleDateString('uz-UZ')}</span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1.5">
                          <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {appeal.content}
                          </p>

                          <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                            <div>
                              Fuqaro: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{appeal.fullName}</strong> ({appeal.phone})
                            </div>
                            <div>
                              Mahalla: <strong className="text-indigo-400">{appeal.mahalla || 'Noma\'lum'}</strong>
                            </div>
                            <div>
                              Mas'ul: <strong className="text-emerald-400">{appeal.organizationName}</strong>
                            </div>
                          </div>

                          {appeal.resolutionText && (
                            <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px]">
                              <b>Ijro xulosasi:</b> {appeal.resolutionText}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredModalAppeals.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Murojaatlar topilmadi
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 4: Shtab Tasks List */}
              {selectedCategoryModal.type === 'tasks' && (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-purple-400">
                          Topshiriq #{task.taskNumber}: {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            task.status === 'tasdiqlandi'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : task.status === 'jarayonda'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{task.description}</p>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Ijrochi: <strong className="text-white">{task.targetOrgName || 'Barchaga'}</strong></span>
                        <span>Muddati: {task.deadline ? new Date(task.deadline).toLocaleDateString('uz-UZ') : 'Belgilanmagan'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 5: Mahalla Yettiligi Tasks List */}
              {selectedCategoryModal.type === 'mahallaTasks' && (
                <div className="space-y-3">
                  {mahallaTasks.map((mt) => (
                    <div
                      key={mt.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-emerald-400">
                          {mt.mahallaName} • Topshiriq #{mt.taskNumber}: {mt.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            mt.status === 'bajarildi'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {mt.status === 'bajarildi' ? 'Bajarildi' : 'Jarayonda'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{mt.description}</p>
                      {mt.xulosaText && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px] mb-2">
                          <b>Yettilik xulosasi:</b> {mt.xulosaText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
              <button
                onClick={() => {
                  setSelectedCategoryModal(null);
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY EXIT / RETURN TO BOSH KABINET PIN MODAL */}
      {showExitAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all transform scale-100 ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-800/40 flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    {targetAction === 'bosh_kabinet' ? 'Bosh Kabinetga Qaytish' : 'Tizimdan Chiqish'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Xavfsizlik kodi bilan himoyalangan
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowExitAuthModal(false);
                  setAuthPassword('');
                  setAuthError(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body & Form */}
            <form onSubmit={handleVerifyAndExit} className="p-6 space-y-4.5">
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {targetAction === 'bosh_kabinet'
                  ? 'Situatsion monitoring ekranidan Bosh Kabinet boshqaruviga qaytish uchun Bosh Administrator maxfiy parolini kiriting:'
                  : 'Monitoring ekranidan chiqish uchun Bosh Administrator maxfiy parolini kiriting:'}
              </p>

              {/* Error Message */}
              {authError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Administrator Maxfiy Paroli:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                  </div>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    autoFocus
                    placeholder="Parolni kiriting..."
                    className={`w-full pl-10 pr-11 py-3 rounded-2xl text-sm font-semibold border transition-all outline-none ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick On-Screen PIN Pad for Touchscreen / TV Remotes */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tezkor raqamli klaviatura (PIN):
                  </span>
                  {authPassword && (
                    <button
                      type="button"
                      onClick={() => setAuthPassword('')}
                      className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer"
                    >
                      Tozalash
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => {
                        setAuthPassword((prev) => prev + digit);
                        if (authError) setAuthError(null);
                      }}
                      className={`py-2.5 rounded-xl text-sm font-black font-mono transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-95'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-95'
                      }`}
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAuthPassword('')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800/60 hover:bg-rose-950/40 text-rose-400 border border-slate-700/60'
                        : 'bg-slate-100 hover:bg-rose-100 text-rose-600 border border-slate-200'
                    }`}
                  >
                    C
                  </button>
                  <button
                    key={0}
                    type="button"
                    onClick={() => {
                      setAuthPassword((prev) => prev + '0');
                      if (authError) setAuthError(null);
                    }}
                    className={`py-2.5 rounded-xl text-sm font-black font-mono transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-95'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-95'
                    }`}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthPassword((prev) => prev.slice(0, -1));
                      if (authError) setAuthError(null);
                    }}
                    className={`py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    ⌫
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowExitAuthModal(false);
                    setAuthPassword('');
                    setAuthError(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isCheckingAuth || !authPassword.trim()}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {isCheckingAuth ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isCheckingAuth ? 'Tekshirilmoqda...' : 'Tasdiqlash va Kirish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
