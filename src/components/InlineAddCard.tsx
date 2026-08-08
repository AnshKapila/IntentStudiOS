import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface InlineAddCardProps {
  stageId: string;
  stageName: string;
  isLead: boolean;
  onAdd: (stageId: string, clientName: string, extraField?: string) => void;
}

export const InlineAddCard: React.FC<InlineAddCardProps> = ({
  stageId,
  stageName,
  isLead,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [extraField, setExtraField] = useState(''); // dealValue or serviceType/nextDeliverable

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientName.trim()) return;

    onAdd(stageId, clientName.trim(), extraField.trim());
    setClientName('');
    setExtraField('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[oklch(98%_0.005_95)] border border-dashed border-[oklch(90%_0.006_95)] text-[13px] font-medium text-[oklch(45%_0.01_95)] hover:bg-white hover:text-[oklch(20%_0.01_95)] hover:border-[oklch(45%_0.01_95)] transition-all cursor-pointer group"
      >
        <Plus className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)] group-hover:text-[oklch(20%_0.01_95)]" />
        <span>+ Quick Add Card</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-lg border border-[oklch(20%_0.01_95)] space-y-2.5 animate-in fade-in duration-150"
    >
      <div>
        <label className="chip-stage text-[oklch(45%_0.01_95)] block mb-1">
          Client Name
        </label>
        <input
          type="text"
          autoFocus
          placeholder="e.g. Acme Corp"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full px-2.5 py-1 text-[13px] font-medium bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] rounded focus:outline-none focus:border-[oklch(20%_0.01_95)] text-[oklch(20%_0.01_95)]"
        />
      </div>

      <div>
        <label className="chip-stage text-[oklch(45%_0.01_95)] block mb-1">
          {isLead ? 'Deal Value (₹ / $)' : 'Next Deliverable / Service'}
        </label>
        <input
          type={isLead ? 'number' : 'text'}
          placeholder={isLead ? 'e.g. 85000' : 'e.g. web, video, app, branding+UIUX'}
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          className="w-full px-2.5 py-1 text-[13px] font-medium bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] rounded focus:outline-none focus:border-[oklch(20%_0.01_95)] text-[oklch(20%_0.01_95)]"
        />
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setClientName('');
            setExtraField('');
          }}
          className="px-2 py-1 text-[#706F6C] hover:text-[#1A1A18] text-[13px] font-medium cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!clientName.trim()}
          className="flex items-center gap-1 px-3 py-1 bg-[oklch(20%_0.01_95)] text-white rounded text-[13px] font-medium hover:bg-[oklch(30%_0.01_95)] disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
};
