import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { BoardType } from '../types';

interface InlineAddCardProps {
  stageId: string;
  stageName: string;
  boardType: BoardType;
  onAdd: (stageId: string, clientName: string, extraField?: string, currency?: string) => void;
}

export const InlineAddCard: React.FC<InlineAddCardProps> = ({
  stageId,
  stageName,
  boardType,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [extraField, setExtraField] = useState(''); // dealValue or serviceType/nextDeliverable
  const [currency, setCurrency] = useState('INR');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientName.trim()) return;

    onAdd(stageId, clientName.trim(), extraField.trim(), currency);
    setClientName('');
    setExtraField('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[oklch(98%_0.005_95)] text-[13px] font-medium text-[oklch(48%_0.01_95)] hover:bg-white hover:text-[oklch(28%_0.01_95)] hover:elevation-base transition-all cursor-pointer group border-0"
      >
        <Plus className="w-3.5 h-3.5 text-[oklch(48%_0.01_95)] group-hover:text-[oklch(28%_0.01_95)]" />
        <span>Quick Add Card</span>
      </button>
    );
  }

  const getPrimaryLabel = () => {
    if (boardType === 'hiring') return 'Candidate Name';
    return 'Client Name';
  };

  const getPrimaryPlaceholder = () => {
    if (boardType === 'hiring') return 'e.g. Jane Doe';
    return 'e.g. Acme Corp';
  };

  const getSecondaryLabel = () => {
    if (boardType === 'leads') return 'Deal Value';
    if (boardType === 'projects') return 'Next Deliverable / Service';
    if (boardType === 'hiring') return 'Role Applied For';
    if (boardType === 'earnings') return 'Amount';
    return '';
  };

  const getSecondaryPlaceholder = () => {
    if (boardType === 'leads') return 'e.g. 85000';
    if (boardType === 'projects') return 'e.g. web, video, app';
    if (boardType === 'hiring') return 'e.g. Senior Developer';
    if (boardType === 'earnings') return 'e.g. 5000';
    return '';
  };

  const isNumberField = boardType === 'leads' || boardType === 'earnings';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-xl elevation-base space-y-2.5 animate-in fade-in duration-150"
    >
      <div>
        <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
          {getPrimaryLabel()}
        </label>
        <input
          type="text"
          autoFocus
          placeholder={getPrimaryPlaceholder()}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full px-3 py-1.5 text-[14px] font-medium bg-[oklch(98%_0.005_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] focus:bg-white text-[oklch(28%_0.01_95)] transition-all"
        />
      </div>

      <div>
        <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
          {getSecondaryLabel()}
        </label>
        <div className="flex gap-2">
          {isNumberField && (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-24 px-2 py-1.5 text-[14px] font-medium bg-[oklch(96%_0.01_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] text-[oklch(28%_0.01_95)] transition-all"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          )}
          <input
            type={isNumberField ? 'number' : 'text'}
            placeholder={getSecondaryPlaceholder()}
            value={extraField}
            onChange={(e) => setExtraField(e.target.value)}
            className="flex-1 px-3 py-1.5 text-[14px] font-medium bg-[oklch(98%_0.005_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] focus:bg-white text-[oklch(28%_0.01_95)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setClientName('');
            setExtraField('');
          }}
          className="px-3 py-1.5 text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(98%_0.005_95)] rounded-lg text-[13px] font-medium cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!clientName.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] disabled:opacity-50 cursor-pointer elevation-base transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
};
