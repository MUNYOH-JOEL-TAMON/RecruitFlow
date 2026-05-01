import React, { useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Candidate, PIPELINE_STAGES } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  candidates: Candidate[];
  onMoveCandidate: (candidateId: string, newStatus: string) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates, onMoveCandidate }) => {
  // Group candidates by stage
  const columns = useMemo(() => {
    const cols: Record<string, Candidate[]> = {};
    PIPELINE_STAGES.forEach((stage) => {
      cols[stage] = candidates.filter((c) => c.status === stage).sort((a, b) => {
        // Sort by matchScore desc as secondary sort
        if (a.matchScore !== b.matchScore) {
           return (b.matchScore || 0) - (a.matchScore || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
    return cols;
  }, [candidates]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return; // Dropped in the same column

    onMoveCandidate(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full pb-4 overflow-x-auto snap-x snap-mandatory">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage} className="snap-center h-full">
            <KanbanColumn stage={stage} candidates={columns[stage] || []} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
