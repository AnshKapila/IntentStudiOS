import React, { useState, useEffect } from 'react';
import { BoardType, BoardCard, LeadCard, ProjectCard, HiringCard, EarningsCard, BoardFilter } from './types';
import { Briefcase, Layers, Users, DollarSign } from 'lucide-react';
import { LEAD_STAGES, PROJECT_STAGES, HIRING_STAGES, EARNINGS_STAGES, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_HIRING, INITIAL_EARNINGS } from './data/initialData';
import { calculateUrgency, getTodayDateString } from './utils';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Board } from './components/Board';
import { AnimatePresence, motion } from 'framer-motion';

const LOCAL_STORAGE_LEADS_KEY = 'intent_studios_leads_v1';
const LOCAL_STORAGE_PROJECTS_KEY = 'intent_studios_projects_v1';
const LOCAL_STORAGE_HIRING_KEY = 'intent_studios_hiring_v1';
const LOCAL_STORAGE_EARNINGS_KEY = 'intent_studios_earnings_v1';

export default function App() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('leads');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [boardViews, setBoardViews] = useState<Record<string, 'kanban' | 'table'>>({
    leads: 'table',
    projects: 'table',
    hiring: 'kanban',
    earnings: 'table'
  });
  
  // Persistence initialized from localStorage or initial seed
  const [leads, setLeads] = useState<LeadCard[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEADS;
  });

  const [projects, setProjects] = useState<ProjectCard[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROJECTS;
  });

  const [hiring, setHiring] = useState<HiringCard[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_HIRING_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_HIRING;
  });

  const [earnings, setEarnings] = useState<EarningsCard[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_EARNINGS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EARNINGS;
  });

  // Filter & Search State
  const [filter, setFilter] = useState<BoardFilter>({
    searchQuery: '',
    urgencyOnly: false,
    sortBy: 'date',
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HIRING_KEY, JSON.stringify(hiring));
  }, [hiring]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EARNINGS_KEY, JSON.stringify(earnings));
  }, [earnings]);

  // Current active dataset
  const currentCards: BoardCard[] = activeBoard === 'leads' ? leads : activeBoard === 'projects' ? projects : activeBoard === 'hiring' ? hiring : earnings;
  const currentStages = activeBoard === 'leads' ? LEAD_STAGES : activeBoard === 'projects' ? PROJECT_STAGES : activeBoard === 'hiring' ? HIRING_STAGES : EARNINGS_STAGES;

  // Calculate urgent items count across all boards for header badge (if applicable, currently Leads/Projects)
  const urgentCount = currentCards.filter(c => {
    const urgency = calculateUrgency(c, activeBoard);
    return urgency === 'overdue' || urgency === 'today';
  }).length;

  // Handlers
  const handleUpdateCard = (updatedCard: BoardCard) => {
    if (activeBoard === 'leads') {
      setLeads(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as LeadCard) : c));
    } else if (activeBoard === 'projects') {
      setProjects(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as ProjectCard) : c));
    } else if (activeBoard === 'hiring') {
      setHiring(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as HiringCard) : c));
    } else {
      setEarnings(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as EarningsCard) : c));
    }
  };

  const handleAddCard = (card: Omit<BoardCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = (activeBoard === 'leads' ? 'lead-' : activeBoard === 'projects' ? 'proj-' : activeBoard === 'hiring' ? 'hire-' : 'earn-') + Date.now();
    const today = getTodayDateString();
    
    const baseFields = {
      ...card,
      id: newId,
      owner: 'AK',
      shortNotes: 'Newly added card.',
      createdAt: today,
      updatedAt: today,
      checklist: [],
    };

    if (activeBoard === 'leads') {
      setLeads(prev => [...prev, { ...baseFields, rescheduleCount: 0 } as LeadCard]);
    } else if (activeBoard === 'projects') {
      setProjects(prev => [...prev, { ...baseFields, serviceType: 'web', collaborators: ['Alex M.'] } as ProjectCard]);
    } else if (activeBoard === 'hiring') {
      setHiring(prev => [...prev, baseFields as HiringCard]);
    } else {
      setEarnings(prev => [...prev, baseFields as EarningsCard]);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (activeBoard === 'leads') {
      setLeads(prev => prev.filter(c => c.id !== cardId));
    } else if (activeBoard === 'projects') {
      setProjects(prev => prev.filter(c => c.id !== cardId));
    } else if (activeBoard === 'hiring') {
      setHiring(prev => prev.filter(c => c.id !== cardId));
    } else {
      setEarnings(prev => prev.filter(c => c.id !== cardId));
    }
  };

  const handleResetData = () => {
    if (confirm('Reset to initial sample agency data?')) {
      setLeads(INITIAL_LEADS);
      setProjects(INITIAL_PROJECTS);
      setHiring(INITIAL_HIRING);
      setEarnings(INITIAL_EARNINGS);
    }
  };

  const handleExportData = () => {
    const data = { leads, projects, hiring, earnings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intent_studios_backup_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.leads && Array.isArray(parsed.leads)) setLeads(parsed.leads);
        if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
        if (parsed.hiring && Array.isArray(parsed.hiring)) setHiring(parsed.hiring);
        if (parsed.earnings && Array.isArray(parsed.earnings)) setEarnings(parsed.earnings);
        alert('Data successfully imported!');
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleQuickAddTrigger = () => {
    const firstStageId = currentStages[0].id;
    handleAddCard({
      clientName: 'New Client',
      stageId: firstStageId,
    } as any);
  };

  return (
    <div className="min-h-screen bg-[oklch(98%_0.005_95)] text-[oklch(28%_0.01_95)] flex font-sans antialiased selection:bg-[oklch(28%_0.01_95)] selection:text-white">
      
      <Sidebar
        activeBoard={activeBoard}
        onBoardChange={setActiveBoard}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      <div
        className={`flex-1 flex flex-col transition-all ease-out-expo duration-220 min-h-screen relative pb-16 md:pb-0 ${
          isSidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[64px]'
        }`}
      >
          <Header
            activeBoard={activeBoard}
            leadsCount={leads.length}
            projectsCount={projects.length}
            urgentCount={urgentCount}
            filter={filter}
            onFilterChange={setFilter}
            onQuickAdd={handleQuickAddTrigger}
            onResetData={handleResetData}
            onExportData={handleExportData}
            onImportData={handleImportData}
            view={boardViews[activeBoard]}
            onToggleView={() => {
              setBoardViews(prev => ({
                ...prev,
                [activeBoard]: prev[activeBoard] === 'table' ? 'kanban' : 'table'
              }));
            }}
          />

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBoard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col"
            >
              <Board
                boardType={activeBoard}
                stages={currentStages}
                cards={currentCards}
                filter={filter}
                view={boardViews[activeBoard]}
                projects={projects}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onAddCard={handleAddCard}
                onClearFilters={() => setFilter({ searchQuery: '', urgencyOnly: false, sortBy: 'date' })}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[oklch(90%_0.01_95)] flex items-center justify-around px-2 z-50">
        <button
          onClick={() => setActiveBoard('leads')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeBoard === 'leads' ? 'text-[oklch(28%_0.01_95)]' : 'text-[oklch(48%_0.01_95)]'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-medium">Leads</span>
        </button>
        <button
          onClick={() => setActiveBoard('projects')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeBoard === 'projects' ? 'text-[oklch(28%_0.01_95)]' : 'text-[oklch(48%_0.01_95)]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium">Projects</span>
        </button>
        <button
          onClick={() => setActiveBoard('hiring')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeBoard === 'hiring' ? 'text-[oklch(28%_0.01_95)]' : 'text-[oklch(48%_0.01_95)]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Hiring</span>
        </button>
        <button
          onClick={() => setActiveBoard('earnings')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeBoard === 'earnings' ? 'text-[oklch(28%_0.01_95)]' : 'text-[oklch(48%_0.01_95)]'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px] font-medium">Earnings</span>
        </button>
      </nav>
    </div>
  );
}
