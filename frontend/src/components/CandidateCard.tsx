import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Candidate } from '../types';
import ScoreBadge from './ScoreBadge';
import SkillChip from './SkillChip';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  return (
    <Draggable draggableId={candidate._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`glass p-4 mb-3 cursor-grab active:cursor-grabbing group
            ${snapshot.isDragging ? 'shadow-glow-brand ring-1 ring-brand-500 scale-105 z-50' : 'hover:border-white/20 hover:bg-bg-card'}`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-brand-400 transition-colors">
                {candidate.name}
              </h4>
              <p className="text-xs text-slate-400 truncate w-40">{candidate.position || 'Applicant'}</p>
            </div>
            <ScoreBadge score={candidate.matchScore} size="sm" />
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1" title={candidate.email}>
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate w-20">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(candidate.createdAt)}</span>
            </div>
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 line-clamp-2">
              {candidate.skills.slice(0, 3).map((skill, i) => (
                <SkillChip key={`${candidate._id}-skill-${i}`} skill={skill} />
              ))}
              {candidate.skills.length > 3 && (
                <span className="text-[10px] text-slate-500 font-medium bg-slate-800/50 px-1.5 py-0.5 rounded">
                  +{candidate.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CandidateCard;
