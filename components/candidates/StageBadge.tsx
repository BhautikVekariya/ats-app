import { cn } from '@/lib/utils';
import type { Stage } from '@/types';

interface StageBadgeProps {
  stage: Stage;
  className?: string;
}

const stageConfig: Record<Stage, { label: string; className: string }> = {
  Applied: {
    label: 'Applied',
    className: 'bg-gray-100 text-gray-700 ring-gray-200',
  },
  Screening: {
    label: 'Screening',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  Interview: {
    label: 'Interview',
    className: 'bg-purple-50 text-purple-700 ring-purple-200',
  },
  Offer: {
    label: 'Offer',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  Hired: {
    label: 'Hired',
    className: 'bg-green-50 text-green-700 ring-green-200',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
};

export function StageBadge({ stage, className }: StageBadgeProps) {
  const config = stageConfig[stage] ?? stageConfig['Applied'];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
