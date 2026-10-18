'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { STAGES, type Stage, type Candidate } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StageBadge } from './StageBadge';
import { toast } from 'sonner';

interface StageSelectorProps {
  candidate: Candidate;
  onStageChange?: (newStage: Stage) => void;
}

export function StageSelector({ candidate, onStageChange }: StageSelectorProps) {
  const [currentStage, setCurrentStage] = useState<Stage>(candidate.stage);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  async function handleStageChange(newStage: Stage) {
    if (newStage === currentStage || updating) return;
    setUpdating(true);
    const prevStage = currentStage;
    setCurrentStage(newStage); // optimistic

    const { error } = await supabase
      .from('candidates')
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', candidate.id);

    if (error) {
      setCurrentStage(prevStage); // revert
      toast.error('Failed to update stage. Please try again.');
    } else {
      // Record stage history
      await supabase.from('candidate_stage_history').insert({
        candidate_id: candidate.id,
        user_id: candidate.user_id,
        from_stage: prevStage,
        to_stage: newStage,
      });
      toast.success(`Stage updated to ${newStage}`);
      onStageChange?.(newStage);
    }

    setUpdating(false);
  }

  return (
    <Select
      value={currentStage}
      onValueChange={(val) => handleStageChange(val as Stage)}
      disabled={updating}
    >
      <SelectTrigger className="w-36 h-8 text-xs" id={`stage-selector-${candidate.id}`}>
        <StageBadge stage={currentStage} />
      </SelectTrigger>
      <SelectContent>
        {STAGES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            <StageBadge stage={s} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
