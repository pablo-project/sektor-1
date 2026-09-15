import React, { useState, useEffect } from 'react';
import { TashkilotDashboard } from './components/TashkilotDashboard';
import { BoshKabinetDashboard } from './components/BoshKabinetDashboard';
import { MahallaDashboard } from './components/MahallaDashboard';
import { MonitorDashboard } from './components/MonitorDashboard';
import { LoginScreen } from './components/LoginScreen';
import { Organization, Appeal, ShtabTask, MahallaTask } from './types';
import { MahallaInfo } from './data/mahallasData';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  LogOut,
  Bot,
  Users,
  Sun,
  Moon,
} from 'lucide-react';

export default function App() {
  // Global Dark / Light Theme state - Default to Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nazorat_global_theme');
      return saved !== 'light';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nazorat_global_theme', next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  };

  // Initialize state from local storage for instant zero-loss loading
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const saved = localStorage.getItem('nazorat_orgs_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appeals, setAppeals] = useState<Appeal[]>(() => {
    try {
      const saved = localStorage.getItem('nazorat_appeals_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState<ShtabTask[]>(() => {
    try {
      const saved = localStorage.getItem('nazorat_tasks_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mahallaTasks, setMahallaTasks] = useState<MahallaTask[]>(() => {
    try {
      const saved = localStorage.getItem('nazorat_mahalla_tasks_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [botStatus, setBotStatus] = useState<{ isActive: boolean; botUsername?: string }>({ isActive: false });

  // Authentication State: Har doim sahifa yangilanganda maxsus parol kiritish ekrani (LoginScreen) chiqadi
  const [userRole, setUserRole] = useState<'guest' | 'tashkilot' | 'bosh_kabinet' | 'mahalla' | 'monitor'>('guest');
  const [authenticatedOrg, setAuthenticatedOrg] = useState<Organization | null>(null);
  const [authenticatedMahalla, setAuthenticatedMahalla] = useState<MahallaInfo | null>(null);

  // Fetch data from backend API with automatic client-server sync
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [orgsRes, appealsRes, tasksRes, mahallaTasksRes, botRes] = await Promise.all([
        fetch('/api/organizations'),
        fetch('/api/appeals'),
        fetch('/api/tasks'),
        fetch('/api/mahalla-tasks'),
        fetch('/api/telegram/status'),
      ]);

      if (orgsRes.ok && appealsRes.ok) {
        const orgsData: Organization[] = await orgsRes.json();
        const appealsData: Appeal[] = await appealsRes.json();

        setOrganizations(orgsData);
        setAppeals(appealsData);

        // Save to client localStorage
        localStorage.setItem('nazorat_orgs_cache', JSON.stringify(orgsData));
        localStorage.setItem('nazorat_appeals_cache', JSON.stringify(appealsData));

        // Keep authenticatedOrg updated only if currently logged in as tashkilot
        setAuthenticatedOrg((prev) => {
          if (!prev) return null;
          const updated = orgsData.find((o) => o.id === prev.id);
          if (updated) {
            localStorage.setItem('nazorat_auth_org', JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        if (tasksData && Array.isArray(tasksData.tasks)) {
          setTasks(tasksData.tasks);
          localStorage.setItem('nazorat_tasks_cache', JSON.stringify(tasksData.tasks));
        }
      }

      if (mahallaTasksRes.ok) {
        const mTasksData = await mahallaTasksRes.json();
        if (mTasksData && Array.isArray(mTasksData.tasks)) {
          setMahallaTasks(mTasksData.tasks);
          localStorage.setItem('nazorat_mahalla_tasks_cache', JSON.stringify(mTasksData.tasks));
        }
      }

      if (botRes.ok) {
        const bData = await botRes.json();
        setBotStatus(bData);
      }
    } catch (err) {
      console.error('Data fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll data every 4 seconds to simulate real-time updates across windows/tabs
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (
    role: 'tashkilot' | 'bosh_kabinet' | 'mahalla' | 'monitor',
    organization?: Organization,
    mahalla?: MahallaInfo
  ) => {
    if (role === 'bosh_kabinet') {
      setUserRole('bosh_kabinet');
      setAuthenticatedOrg(null);
      setAuthenticatedMahalla(null);
      localStorage.setItem('nazorat_auth_role', 'bosh_kabinet');
      localStorage.removeItem('nazorat_auth_org');
      localStorage.removeItem('nazorat_auth_mahalla');
    } else if (role === 'monitor') {
      setUserRole('monitor');
      setAuthenticatedOrg(null);
      setAuthenticatedMahalla(null);
      localStorage.setItem('nazorat_auth_role', 'monitor');
      localStorage.removeItem('nazorat_auth_org');
      localStorage.removeItem('nazorat_auth_mahalla');
    } else if (role === 'tashkilot' && organization) {
      setUserRole('tashkilot');
      setAuthenticatedOrg(organization);
      setAuthenticatedMahalla(null);
      localStorage.setItem('nazorat_auth_role', 'tashkilot');
      localStorage.setItem('nazorat_auth_org', JSON.stringify(organization));
      localStorage.removeItem('nazorat_auth_mahalla');
    } else if (role === 'mahalla' && mahalla) {
      setUserRole('mahalla');
      setAuthenticatedOrg(null);
      setAuthenticatedMahalla(mahalla);
      localStorage.setItem('nazorat_auth_role', 'mahalla');
      localStorage.setItem('nazorat_auth_mahalla', JSON.stringify(mahalla));
      localStorage.removeItem('nazorat_auth_org');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setAuthenticatedOrg(null);
    setAuthenticatedMahalla(null);
    localStorage.removeItem('nazorat_auth_role');
    localStorage.removeItem('nazorat_auth_org');
    localStorage.removeItem('nazorat_auth_mahalla');
  };

  // 1-Tugma: Accept Appeal ("Bajaraman")
  const handleAcceptAppeal = async (appealId: string, operatorName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorName }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error accepting appeal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reject authority ("Mening vakolatimda emas")
  const handleRejectAuthority = async (appealId: string, reason: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/reject-authority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error rejecting authority:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Resolve Appeal (Hulosa + Rasm)
  const handleResolveAppeal = async (appealId: string, resolutionText: string, photoUrl?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionText, resolutionPhotoUrl: photoUrl }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error resolving appeal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2-Tugma: Send Official Explanation to citizen ("Tushuntirish berish")
  const handleSendExplanation = async (appealId: string, text: string, authorName: string, orgName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/explanation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, authorName, organizationName: orgName }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error sending explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3-Tugma: Request Transfer to another Organization ("Tashkilotni o'zgartirish")
  const handleRequestTransfer = async (appealId: string, toOrgId: string, reason: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/request-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toOrgId, reason }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error requesting transfer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Bosh Kabinet Approves Transfer Request
  const handleApproveTransfer = async (appealId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/approve-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error approving transfer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Bosh Kabinet Rejects Transfer Request
  const handleRejectTransfer = async (appealId: string, adminNote?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/reject-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error rejecting transfer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4-Tugma: Invite Co-Assignment ("Men va boshqalarga tegishli")
  const handleInviteCoAssignment = async (appealId: string, targetOrgIds: string[], reason: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/invite-coassignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetOrgIds, reason }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error inviting co-assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Co-assigned Org responds to invitation
  const handleRespondCoAssignment = async (appealId: string, targetOrgId: string, accept: boolean, rejectReason?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/respond-coassignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetOrgId, accept, rejectReason }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error responding to co-assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Co-assigned Org submits their part of resolution
  const handleResolveCoAssignment = async (
    appealId: string,
    orgId: string,
    operatorName: string,
    resolutionText: string,
    photoUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/resolve-coassignment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, operatorName, resolutionText, resolutionPhotoUrl: photoUrl }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error resolving co-assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gemini AI draft response generator
  const handleGenerateAiResponse = async (appealContent: string, orgName: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini/suggest-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealContent, organizationName: orgName }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.suggestedResponse;
      }
    } catch (err) {
      console.error('AI draft generation failed:', err);
    }
    return `Hurmatli fuqaro, sizning murojaatingiz ${orgName} mas'ul xodimlari tomonidan to'liq ko'rib chiqildi hamda belgilangan tartibda ijobiy hal etildi.`;
  };

  // Gemini AI explanation draft generator
  const handleGenerateAiExplanation = async (appealContent: string, orgName: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini/suggest-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealContent, organizationName: orgName }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.suggestedExplanation;
      }
    } catch (err) {
      console.error('AI explanation generation failed:', err);
    }
    return `Hurmatli fuqaro, sizning murojaatingiz ${orgName} mutaxassislari tomonidan nazoratga olingan bo'lib, o'rganish ishlari olib borilmoqda.`;
  };

  // Bosh Kabinet adds new Organization
  const handleAddOrganization = async (orgData: {
    name: string;
    code: string;
    category: string;
    phone: string;
    leader: string;
    password?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error adding organization:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= TASK HANDLERS =================
  const handleSeed7Tasks = async (targetOrgId: string = 'org-1', deadlineDays: number = 15) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks/seed-7-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetOrgId, deadlineDays }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error seeding 7 tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedAllTasks = async (deadlineDays: number = 15) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks/seed-all-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deadlineDays }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error seeding all tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    targetOrgId?: string;
    targetOrgIds?: string[];
    deadline?: string;
    category?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/start`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error starting task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTaskReport = async (
    taskId: string,
    reportText: string,
    executorName?: string,
    pdfUrl?: string,
    pdfFileName?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/submit-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          executorName,
          reportPdfUrl: pdfUrl,
          reportPdfName: pdfFileName,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error submitting task report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTask = async (taskId: string, adminFeedback?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminFeedback }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error approving task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTask = async (taskId: string, adminFeedback?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminFeedback }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error rejecting task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= MAHALLA TASK HANDLERS =================
  const handleSendMahallaTask = async (taskData: {
    title: string;
    description: string;
    targetRole: string;
    mahallaId: string;
    targetOrgId?: string;
    targetOrgName?: string;
    deadline?: string;
    category?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mahalla-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error sending mahalla task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedAllMahallaTasks = async (deadlineDays: number = 15) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mahalla-tasks/seed-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deadlineDays }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error seeding mahalla tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMahallaTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahalla-tasks/${taskId}/start`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error starting mahalla task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMahallaXulosa = async (taskId: string, xulosaText: string, authorName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahalla-tasks/${taskId}/xulosa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xulosaText, authorName }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error saving mahalla xulosa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMahallaTask = async (taskId: string, approverNote?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahalla-tasks/${taskId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverNote }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error approving mahalla task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectMahallaTask = async (taskId: string, approverNote?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahalla-tasks/${taskId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverNote }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error rejecting mahalla task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMahallaTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahalla-tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting mahalla task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Login Portal if not authenticated
  if (userRole === 'guest') {
    return (
      <LoginScreen
        organizations={organizations}
        onLoginSuccess={handleLoginSuccess}
        botStatus={botStatus}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Render Situatsion Monitor (Katta Ekran / TV uchun to'liq interaktiv statistika)
  if (userRole === 'monitor') {
    return (
      <MonitorDashboard
        organizations={organizations}
        appeals={appeals}
        tasks={tasks}
        mahallaTasks={mahallaTasks}
        isLoading={isLoading}
        onRefresh={fetchData}
        onLogout={handleLogout}
        onExitToApp={() => setUserRole('bosh_kabinet')}
      />
    );
  }

  // Render Bosh Kabinet (Matches user's screenshot layout with Left Sidebar & Top Bar)
  if (userRole === 'bosh_kabinet') {
    return (
      <BoshKabinetDashboard
        organizations={organizations}
        appeals={appeals}
        tasks={tasks}
        mahallaTasks={mahallaTasks}
        onAddOrganization={handleAddOrganization}
        onApproveTransfer={handleApproveTransfer}
        onRejectTransfer={handleRejectTransfer}
        onSeed7Tasks={handleSeed7Tasks}
        onSeedAllTasks={handleSeedAllTasks}
        onCreateTask={handleCreateTask}
        onApproveTask={handleApproveTask}
        onRejectTask={handleRejectTask}
        onDeleteTask={handleDeleteTask}
        onSendMahallaTask={handleSendMahallaTask}
        onSeedAllMahallaTasks={handleSeedAllMahallaTasks}
        onApproveMahallaTask={handleApproveMahallaTask}
        onRejectMahallaTask={handleRejectMahallaTask}
        onDeleteMahallaTask={handleDeleteMahallaTask}
        isLoading={isLoading}
        onRefresh={fetchData}
        onLogout={handleLogout}
        onOpenMonitor={() => setUserRole('monitor')}
        botStatus={botStatus}
      />
    );
  }

  // Render Mahalla Dashboard if logged in as a Mahalla
  if (userRole === 'mahalla' && authenticatedMahalla) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-900 text-slate-100'} font-sans antialiased flex flex-col transition-colors duration-200`}>
        {/* Clean Authenticated Header for Mahalla */}
        <header className={`${isDarkMode ? 'bg-slate-950 border-slate-800/90' : 'bg-slate-950 border-slate-800'} border-b sticky top-0 z-40 shadow-xl`}>
          <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-2xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-black text-white tracking-tight flex items-center space-x-1.5 truncate">
                  <span className="truncate">{authenticatedMahalla.name}</span>
                  <span className="shrink-0 text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-mono">
                    {authenticatedMahalla.sector}-sektor
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                  Rais: {authenticatedMahalla.chairman} • {authenticatedMahalla.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
              {/* Tun va Kun Toggle Button */}
              <button
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Kunduzgi (Yorug‘) rejimga o‘tish' : 'Tungi rejimga o‘tish'}
                className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 shadow-sm transition-all cursor-pointer flex items-center space-x-1"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />}
                <span className="text-xs font-bold hidden sm:inline">{isDarkMode ? 'Kun' : 'Tun'}</span>
              </button>

              <button
                onClick={fetchData}
                disabled={isLoading}
                title="Ma'lumotlarni yangilash"
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                title="Tizimdan chiqish"
                className="flex items-center space-x-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] sm:text-xs font-bold px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Mahalla Dashboard */}
        <main className="flex-1">
          <MahallaDashboard
            mahalla={authenticatedMahalla}
            tasks={mahallaTasks}
            appeals={appeals}
            organizations={organizations}
            onStartTask={handleStartMahallaTask}
            onSaveXulosa={handleSaveMahallaXulosa}
            isLoading={isLoading}
          />
        </main>

        <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-500 text-xs py-4 text-center">
          <p>© 2026 Paxtachi Tumani 1-Sektor • 51 ta Mahalla Yettiligi Oflayn O'rganish & Nazorat Tizimi</p>
        </footer>
      </div>
    );
  }

  // Render Tashkilot Dashboard with its dedicated header
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-100 text-slate-900'} font-sans antialiased flex flex-col transition-colors duration-200`}>
      
      {/* Clean Authenticated Header for Tashkilot */}
      <header className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-800'} border-b text-white sticky top-0 z-40 shadow-lg`}>
        <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2">
          
          {/* Active Context Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-white shadow-md bg-indigo-600 shadow-indigo-600/30 shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-extrabold text-slate-100 tracking-tight flex items-center space-x-1.5 truncate">
                <span className="truncate">{authenticatedOrg?.name}</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                Murojaatlarni ijro etish va nazorat paneli
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            {/* Tun va Kun Toggle Button */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Kunduzgi (Yorug‘) rejimga o‘tish' : 'Tungi rejimga o‘tish'}
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 shadow-sm transition-all cursor-pointer flex items-center space-x-1"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />}
              <span className="text-xs font-bold hidden sm:inline">{isDarkMode ? 'Kun' : 'Tun'}</span>
            </button>

            {botStatus.botUsername && (
              <a
                href={`https://t.me/${botStatus.botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>@{botStatus.botUsername}</span>
              </a>
            )}

            <button
              onClick={fetchData}
              disabled={isLoading}
              title="Ma'lumotlarni yangilash"
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="flex items-center space-x-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] sm:text-xs font-bold px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {authenticatedOrg && (() => {
          const currentOrg = organizations.find((o) => o.id === authenticatedOrg.id) || authenticatedOrg;
          if (currentOrg.isLocked) {
            return (
              <div className="max-w-2xl mx-auto my-12 p-8 bg-rose-950/80 border-2 border-rose-500 rounded-3xl shadow-2xl text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-rose-900 border border-rose-500 text-rose-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Tashkilot Paneli Qulflangan
                  </h2>
                  <div className="p-4 bg-rose-900/60 border border-rose-600/70 rounded-2xl text-rose-100 font-bold text-base leading-relaxed">
                    Panel Bosh Kabinet orqali qulflangan, iltimos bosh xodimga murojaat qiling.
                  </div>
                  <p className="text-xs text-rose-200/80 pt-2">
                    Tashkilot: <strong className="text-white">{currentOrg.name}</strong> ({currentOrg.code})
                  </p>
                </div>

                <div className="pt-4 border-t border-rose-500/30 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="text-xs text-slate-300 font-semibold">
                    1-Sektor Bosh Kabinet Shtabi: <strong className="text-amber-300 font-mono">+998 94 062-05-55</strong>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-white hover:bg-slate-100 text-rose-900 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Tizimdan Chiqish
                  </button>
                </div>
              </div>
            );
          }

          return (
            <TashkilotDashboard
              organization={currentOrg}
              organizations={organizations}
              appeals={appeals}
              tasks={tasks}
              onAcceptAppeal={handleAcceptAppeal}
              onRejectAuthority={handleRejectAuthority}
              onResolveAppeal={handleResolveAppeal}
              onSendExplanation={handleSendExplanation}
              onRequestTransfer={handleRequestTransfer}
              onInviteCoAssignment={handleInviteCoAssignment}
              onRespondCoAssignment={handleRespondCoAssignment}
              onResolveCoAssignment={handleResolveCoAssignment}
              onGenerateAiResponse={handleGenerateAiResponse}
              onGenerateAiExplanation={handleGenerateAiExplanation}
              onStartTask={handleStartTask}
              onSubmitTaskReport={handleSubmitTaskReport}
              isLoading={isLoading}
            />
          );
        })()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 text-center">
        <p>
          © 2026 Murojaatlar va Tashkilotlar Boshqaruvi Axborot Tizimi • 120 Soatlik Muddat & Telegram Bot Integratsiyasi
        </p>
      </footer>
    </div>
  );
}
