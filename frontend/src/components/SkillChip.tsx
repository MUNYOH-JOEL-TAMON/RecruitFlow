import React from 'react';

interface SkillChipProps {
  skill: string;
}

const SkillChip: React.FC<SkillChipProps> = ({ skill }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 whitespace-nowrap">
      {skill}
    </span>
  );
};

export default SkillChip;
