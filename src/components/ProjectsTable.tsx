import React, { useState } from 'react';
import { ProjectCard, StageConfig, BoardFilter, ChecklistItem } from '../types';
import { getInitials } from '../utils';
import { Settings, Plus, ChevronDown } from 'lucide-react';

interface ProjectsTableProps {
  projects: ProjectCard[];
  stages: StageConfig[];
  filter: BoardFilter;
  onUpdateCard: (updatedCard: ProjectCard) => void;
  onAddCard: (card: Partial<ProjectCard>) => void;
  onRowClick: (projectId: string) => void;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  stages,
  filter,
  onUpdateCard,
  onAddCard,
  onRowClick,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const [showStageDropdown, setShowStageDropdown] = useState<string | null>(null);
  
  const [newProjectName, setNewProjectName] = useState('');

  const filteredProjects = projects.filter(p => {
    const q = (localSearch || filter.searchQuery).toLowerCase();
    if (!q) return true;
    return (p.clientName || '').toLowerCase().includes(q) || (p.serviceType || '').toLowerCase().includes(q);
  });

  const getProgress = (checklist?: ChecklistItem[]) => {
    if (!checklist || checklist.length === 0) return '0/0';
    const completed = checklist.filter(c => c.completed).length;
    return `${completed}/${checklist.length}`;
  };

  const handleEditStart = (e: React.MouseEvent, id: string, field: string, initialValue: string) => {
    e.stopPropagation();
    setEditingCell({ id, field });
    setEditValue(initialValue);
  };

  const handleEditCommit = (project: ProjectCard) => {
    if (editingCell) {
      if ((project as any)[editingCell.field] !== editValue) {
        onUpdateCard({ ...project, [editingCell.field]: editValue });
      }
      setEditingCell(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, project: ProjectCard) => {
    if (e.key === 'Enter') handleEditCommit(project);
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleStageChange = (e: React.MouseEvent, project: ProjectCard, newStageId: string) => {
    e.stopPropagation();
    onUpdateCard({ ...project, stageId: newStageId });
    setShowStageDropdown(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddCard({
        clientName: newProjectName.trim(),
        stageId: stages[0].id,
      });
      setNewProjectName('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filter projects by client or service..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-64 px-3 py-1.5 text-sm bg-white border border-[oklch(90%_0.01_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)]"
        />
        <button className="p-1.5 rounded-lg hover:bg-[oklch(95%_0.01_95)] text-[oklch(48%_0.01_95)] transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl border border-[oklch(90%_0.01_95)] shadow-xs">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[oklch(98%_0.005_95)] sticky top-0 z-10 text-[oklch(48%_0.01_95)] font-medium">
            <tr>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Client</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Service Type</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Stage</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Next Deliverable</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Collaborators</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => {
              const stage = stages.find(s => s.id === project.stageId);
              return (
                <tr
                  key={project.id}
                  onClick={() => onRowClick(project.id)}
                  className="group hover:bg-[oklch(98%_0.005_95)] transition-colors border-b border-[oklch(95%_0.01_95)] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-medium text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === project.id && editingCell?.field === 'clientName' ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(project)}
                        onKeyDown={(e) => handleEditKeyDown(e, project)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, project.id, 'clientName', project.clientName)} className="hover:bg-white/50 px-1 -mx-1 rounded">
                        {project.clientName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[oklch(48%_0.01_95)] capitalize">{project.serviceType}</td>
                  <td className="px-4 py-2.5 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowStageDropdown(showStageDropdown === project.id ? null : project.id); }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: stage?.chipColor || '#ccc' }}
                    >
                      {stage?.name}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    {showStageDropdown === project.id && (
                      <div className="absolute top-full left-4 mt-1 bg-white border border-[oklch(90%_0.01_95)] shadow-md rounded-lg py-1 z-20 min-w-[140px]">
                        {stages.map(s => (
                          <button
                            key={s.id}
                            onClick={(e) => handleStageChange(e, project, s.id)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)] flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.chipColor }} />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[oklch(48%_0.01_95)] max-w-[200px] truncate">
                    {editingCell?.id === project.id && editingCell?.field === 'nextDeliverable' ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(project)}
                        onKeyDown={(e) => handleEditKeyDown(e, project)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, project.id, 'nextDeliverable', project.nextDeliverable || '')} className="hover:bg-white/50 px-1 -mx-1 rounded truncate">
                        {project.nextDeliverable || <span className="opacity-50 italic">Add deliverable...</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex -space-x-1.5">
                      {(project.collaborators || []).slice(0, 3).map((collab, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-[oklch(90%_0.01_95)] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[oklch(28%_0.01_95)]" title={collab}>
                          {getInitials(collab)}
                        </div>
                      ))}
                      {(project.collaborators || []).length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-[oklch(95%_0.01_95)] border-2 border-white flex items-center justify-center text-[9px] font-bold text-[oklch(48%_0.01_95)]">
                          +{(project.collaborators || []).length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[oklch(48%_0.01_95)] text-xs">
                    {getProgress(project.checklist)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-[oklch(99%_0.005_95)] sticky bottom-0 border-t border-[oklch(90%_0.01_95)]">
            <tr>
              <td colSpan={6} className="p-0">
                <form onSubmit={handleAddSubmit} className="flex items-center px-4 py-2 hover:bg-[oklch(98%_0.005_95)]">
                  <Plus className="w-4 h-4 text-[oklch(48%_0.01_95)] mr-2" />
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="New project..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-[oklch(28%_0.01_95)] placeholder:text-[oklch(68%_0.01_95)] placeholder:font-normal"
                  />
                </form>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
