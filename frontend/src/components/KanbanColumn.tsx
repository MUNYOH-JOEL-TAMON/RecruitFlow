import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { PipelineStage, STAGE_CONFIG, Candidate } from '../types';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  stage: PipelineStage;
  candidates: Candidate[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, candidates }) => {
  const config = STAGE_CONFIG[stage];

  return (
    <div className="flex-shrink-0 w-[300px] flex flex-col glass overflow-hidden max-h-full">
      <div className={`p-4 border-b ${config.border} ${config.bg} flex justify-between items-center shrink-0`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`}></div>
          <h3 className={`font-semibold text-sm ${config.color}`}>{config.label}</h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-black/20 px-2 py-0.5 rounded-full">
          {candidates.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-none">
        <Droppable droppableId={stage}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`min-h-[150px] transition-colors duration-200 rounded-lg ${
                snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 p-1' : ''
              }`}
            >
              {candidates.map((candidate, index) => (
                <CandidateCard key={candidate._id} candidate={candidate} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default KanbanColumn;
