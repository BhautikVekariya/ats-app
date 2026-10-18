import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  description?: string;
  trend?: number; // percentage change
  icon: React.ReactNode;
  colorClass?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  colorClass = 'bg-blue-50 text-blue-600',
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-100 rounded-lg" />
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded mb-2" />
        <div className="w-32 h-3 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 tabular-nums">{value.toLocaleString()}</p>
      {(description || trend !== undefined) && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend !== undefined && (
            <>
              {trend > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              ) : trend < 0 ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
                )}
              >
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </>
          )}
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
