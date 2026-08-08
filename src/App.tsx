import React, { useState, useEffect } from 'react';
import { BoardType, BoardCard, LeadCard, ProjectCard, BoardFilter } from './types';
import { LEAD_STAGES, PROJECT_STAGES, INITIAL_LEADS, INITIAL_PROJECTS } from './data/initialData';
import { calculateUrgency, getTodayDateString } from './utils';
import { Header } from './components/Header';
import { UrgencyBanner } from './components/UrgencyBanner';
import { Board } from './components/Board';
import { InlineCardDetail } from './components/InlineCardDetail';

const LOCAL_STORAGE_LEADS_KEY = 'intent_studios_leads_v1';
const LOCAL_STORAGE_PROJECTS_KEY = 'intent_studios_projects_v1';

export default function App() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('leads');
  
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

  // Selected Card for Inline Side Panel Detail
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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

  // Current active dataset
  const currentCards: BoardCard[] = activeBoard === 'leads' ? leads : projects;
  const currentStages = activeBoard === 'leads' ? LEAD_STAGES : PROJECT_STAGES;

  // Find selected card object
  const selectedCard = currentCards.find(c => c.id === selectedCardId) || null;

  // Calculate urgent items count across both boards for header badge
  const isLeadBoard = activeBoard === 'leads';
  const urgentCount = currentCards.filter(c => {
    const urgency = calculateUrgency(c, isLeadBoard);
    return urgency === 'overdue' || urgency === 'today';
  }).length;

  // Handlers
  const handleMoveCard = (cardId: string, newStageId: string) => {
    if (activeBoard === 'leads') {
      setLeads(prev => prev.map(c => c.id === cardId ? { ...c, stageId: newStageId, updatedAt: getTodayDateString() } : c));
    } else {
      setProjects(prev => prev.map(c => c.id === cardId ? { ...c, stageId: newStageId, updatedAt: getTodayDateString() } : c));
    }
  };

  const handleUpdateCard = (updatedCard: BoardCard) => {
    if (activeBoard === 'leads') {
      setLeads(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as LeadCard) : c));
    } else {
      setProjects(prev => prev.map(c => c.id === updatedCard.id ? (updatedCard as ProjectCard) : c));
    }
  };

  const handleAddCard = (stageId: string, clientName: string, extraField?: string) => {
    const newId = (activeBoard === 'leads' ? 'lead-' : 'proj-') + Date.now();
    const today = getTodayDateString();

    if (activeBoard === 'leads') {
      const dealValue = extraField ? Number(extraField) || 0 : 10000;
      const newLead: LeadCard = {
        id: newId,
        clientName,
        stageId,
        contact: '',
        dealValue,
        nextFollowUpDate: today,
        rescheduleCount: 0,
        owner: 'AK',
        shortNotes: 'Newly added lead.',
        createdAt: today,
        updatedAt: today,
        checklist: [],
      };
      setLeads(prev => [...prev, newLead]);
      setSelectedCardId(newId);
    } else {
      const nextDeliverable = extraField || 'Initial Setup & Brief';
      const newProject: ProjectCard = {
        id: newId,
        clientName,
        stageId,
        serviceType: 'web',
        owner: 'AK',
        collaborators: ['Alex M.'],
        nextDeliverable,
        deliverableDueDate: today,
        shortNotes: 'Newly added project.',
        createdAt: today,
        updatedAt: today,
        checklist: [],
      };
      setProjects(prev => [...prev, newProject]);
      setSelectedCardId(newId);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (activeBoard === 'leads') {
      setLeads(prev => prev.filter(c => c.id !== cardId));
    } else {
      setProjects(prev => prev.filter(c => c.id !== cardId));
    }
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    }
  };

  const handleResetData = () => {
    if (confirm('Reset to initial sample agency data?')) {
      setLeads(INITIAL_LEADS);
      setProjects(INITIAL_PROJECTS);
      setSelectedCardId(null);
    }
  };

  const handleExportData = () => {
    const data = { leads, projects, exportedAt: new Date().toISOString() };
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
        if (parsed.leads && Array.isArray(parsed.leads)) {
          setLeads(parsed.leads);
        }
        if (parsed.projects && Array.isArray(parsed.projects)) {
          setProjects(parsed.projects);
        }
        alert('Data successfully imported!');
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleQuickAddTrigger = () => {
    const firstStageId = currentStages[0].id;
    handleAddCard(firstStageId, 'New Agency Client');
  };

  return (
    <div className="min-h-screen bg-[oklch(98%_0.005_95)] text-[oklch(20%_0.01_95)] flex flex-col font-sans antialiased selection:bg-[oklch(20%_0.01_95)] selection:text-white">
      
      {/* Top Header */}
      <Header
        activeBoard={activeBoard}
        onBoardChange={(board) => {
          setActiveBoard(board);
          setSelectedCardId(null);
        }}
        leadsCount={leads.length}
        projectsCount={projects.length}
        urgentCount={urgentCount}
        filter={filter}
        onFilterChange={setFilter}
        onQuickAdd={handleQuickAddTrigger}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* 2-Second Urgency Scan Summary Strip */}
      <UrgencyBanner
        cards={currentCards}
        boardType={activeBoard}
        onSelectCard={(id) => setSelectedCardId(id)}
      />

      {/* Main Board Primitive Rendering Area */}
      <main className="flex-1 relative flex flex-col">
        <Board
          boardType={activeBoard}
          stages={currentStages}
          cards={currentCards}
          selectedCardId={selectedCardId}
          filter={filter}
          onSelectCard={(id) => setSelectedCardId(id === selectedCardId ? null : id)}
          onMoveCard={handleMoveCard}
          onAddCard={handleAddCard}
          onClearFilters={() => setFilter({ searchQuery: '', urgencyOnly: false, sortBy: 'date' })}
        />

        {/* Right Side Drawer for Detailed Inline Editing */}
        {selectedCard && (
          <InlineCardDetail
            card={selectedCard}
            boardType={activeBoard}
            stages={currentStages}
            onClose={() => setSelectedCardId(null)}
            onUpdate={handleUpdateCard}
            onDelete={handleDeleteCard}
          />
        )}
      </main>

      {/* High Density Footer */}
      <footer className="border-t border-[oklch(90%_0.006_95)] py-2.5 px-6 bg-[oklch(98%_0.005_95)] flex justify-between items-center text-metadata font-mono uppercase tracking-widest">
        <span>Intent Studios OS</span>
        <span>Internal Design Tool</span>
      </footer>

    </div>
  );
}
