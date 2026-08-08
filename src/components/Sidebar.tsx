import React, { useState } from 'react';
import { Briefcase, Layers, Users, DollarSign } from 'lucide-react';
import { BoardType } from '../types';

interface SidebarProps {
  activeBoard: BoardType;
  onBoardChange: (board: BoardType) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeBoard,
  onBoardChange,
  isExpanded,
  onToggleExpand,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isExpanded || isHovered;

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 bottom-0 z-40 bg-[oklch(98%_0.005_95)] flex-col transition-all ease-out-expo duration-220 ${
        expanded ? 'w-[240px]' : 'w-[64px]'
      }`}
      style={{ boxShadow: '1px 0 2px oklch(20% 0 0 / 4%)' }} // Sidebar divider shadow
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center h-16 px-4 shrink-0 overflow-hidden">
        <button
          onClick={() => onBoardChange('leads')}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 bg-[oklch(28%_0.01_95)] rounded-[4px] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[oklch(98%_0.005_95)] rounded-[2px]" />
          </div>
        </button>
        
        <span
          className={`ml-3 title-card text-[oklch(28%_0.01_95)] whitespace-nowrap transition-opacity duration-220 ${
            expanded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Intent StudiOS
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-hidden">
        <button
          onClick={() => onBoardChange('leads')}
          className={`w-full flex items-center h-10 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeBoard === 'leads'
              ? 'bg-white elevation-base text-[oklch(28%_0.01_95)]'
              : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(97%_0.005_95)]'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <Briefcase className="w-[18px] h-[18px]" />
          </div>
          <span
            className={`ml-3 text-[14px] font-medium transition-opacity duration-220 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Leads
          </span>
        </button>

        <button
          onClick={() => onBoardChange('projects')}
          className={`w-full flex items-center h-10 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeBoard === 'projects'
              ? 'bg-white elevation-base text-[oklch(28%_0.01_95)]'
              : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(97%_0.005_95)]'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <Layers className="w-[18px] h-[18px]" />
          </div>
          <span
            className={`ml-3 text-[14px] font-medium transition-opacity duration-220 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Projects
          </span>
        </button>
        
        <button
          onClick={() => onBoardChange('hiring')}
          className={`w-full flex items-center h-10 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeBoard === 'hiring'
              ? 'bg-white elevation-base text-[oklch(28%_0.01_95)]'
              : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(97%_0.005_95)]'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <Users className="w-[18px] h-[18px]" />
          </div>
          <span
            className={`ml-3 text-[14px] font-medium transition-opacity duration-220 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hiring
          </span>
        </button>

        <button
          onClick={() => onBoardChange('earnings')}
          className={`w-full flex items-center h-10 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeBoard === 'earnings'
              ? 'bg-white elevation-base text-[oklch(28%_0.01_95)]'
              : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(97%_0.005_95)]'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <DollarSign className="w-[18px] h-[18px]" />
          </div>
          <span
            className={`ml-3 text-[14px] font-medium transition-opacity duration-220 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Earnings
          </span>
        </button>
      </nav>

      <div className="p-3 shrink-0">
        <button className="w-full flex items-center h-10 px-2 rounded-lg text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(97%_0.005_95)] transition-colors cursor-pointer whitespace-nowrap">
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <div className="w-[20px] h-[20px] rounded-full bg-[oklch(85%_0.01_95)] flex items-center justify-center text-[10px] font-bold text-[oklch(28%_0.01_95)]">
              AK
            </div>
          </div>
          <span
            className={`ml-3 text-[14px] font-medium transition-opacity duration-220 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            My Profile
          </span>
        </button>
      </div>
    </aside>
  );
};
