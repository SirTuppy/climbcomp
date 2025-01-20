import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PlusCircle, GripVertical, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface Round {
  id?: string;
  name: string;
  order: number;
  round_type: 'Qualifiers' | 'Semi-Finals' | 'Finals' | 'Super-Finals';
  max_problems?: number | null;
  scoring_rules?: Record<string, unknown>;
  qualification_rules?: Record<string, unknown>;
}

// Type for the mutation input
interface RoundMutationInput extends Pick<Round, 'name' | 'order' | 'round_type'> {
  id: string;
  max_problems?: number | null;
  scoring_rules?: Record<string, unknown>;
  qualification_rules?: Record<string, unknown>;
}

interface RoundManagerProps {
  competitionId: string;
  onUpdate?: () => void;
}

export function RoundManager({ competitionId, onUpdate }: RoundManagerProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = React.useState(false);

  // Fetch existing rounds
  const { data: rounds = [], isLoading } = useQuery({
    queryKey: ['competition-rounds', competitionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competition_rounds')
        .select('*')
        .eq('competition_id', competitionId)
        .order('order');
      
      if (error) throw error;
      return data as Round[];
    },
  });

  const getDefaultRoundType = (order: number): Round['round_type'] => {
    switch (order) {
      case 0: return 'Qualifiers';
      case 1: return 'Semi-Finals';
      case 2: return 'Finals';
      default: return 'Super-Finals';
    }
  };

  // Add new round
  const addRoundMutation = useMutation({
    mutationFn: async (newRound: Omit<Round, 'id' | 'order' | 'round_type'>) => {
      const nextOrder = rounds.length;
      const { data, error } = await supabase
        .from('competition_rounds')
        .insert([{
          ...newRound,
          competition_id: competitionId,
          order: nextOrder,
          round_type: getDefaultRoundType(nextOrder)
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition-rounds', competitionId] });
      onUpdate?.();
      toast({
        title: 'Round added',
        description: 'New round has been added successfully.',
      });
    },
  });

  // Update round
  const updateRoundMutation = useMutation({
    mutationFn: async (round: RoundMutationInput) => {
      const { data, error } = await supabase
        .from('competition_rounds')
        .update(round)
        .eq('id', round.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition-rounds', competitionId] });
      onUpdate?.();
    },
  });

  // Delete round
  const deleteRoundMutation = useMutation({
    mutationFn: async (roundId: string) => {
      const { error } = await supabase
        .from('competition_rounds')
        .delete()
        .eq('id', roundId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition-rounds', competitionId] });
      onUpdate?.();
      toast({
        title: 'Round deleted',
        description: 'Round has been removed successfully.',
      });
    },
  });

  const handleAddRound = () => {
    const roundName = rounds.length === 0 ? 'Qualifiers' : 
                     rounds.length === 1 ? 'Semi-Finals' :
                     rounds.length === 2 ? 'Finals' : 'Super-Finals';
    
    addRoundMutation.mutate({
      name: roundName,
      scoring_rules: {},
      qualification_rules: {}
    });
  };

  const handleUpdateRound = (round: Round) => {
    if (!round.id) return;
    updateRoundMutation.mutate(round);
  };

  const handleDeleteRound = (roundId: string) => {
    deleteRoundMutation.mutate(roundId);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    const newRounds = [...rounds];
    const [movedRound] = newRounds.splice(sourceIndex, 1);
    newRounds.splice(targetIndex, 0, movedRound);

    // Update order for all affected rounds
    const updates = newRounds.map((round, index) => {
      if (!round.id) return Promise.resolve(); // Skip rounds without ID
      
      return updateRoundMutation.mutate({ 
        id: round.id,
        order: index,
        round_type: getDefaultRoundType(index), // Update round type based on new order
        name: round.name // Include required fields
      });
    });

    await Promise.all(updates);
    setIsDragging(false);
  };

  if (isLoading) {
    return <div>Loading rounds...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Competition Rounds</h3>
        <Button 
          onClick={handleAddRound}
          disabled={addRoundMutation.isPending || rounds.length >= 4}
          size="sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Round
        </Button>
      </div>

      <div className="space-y-2">
        {rounds.map((round, index) => (
          <div
            key={round.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-4 border rounded-lg ${isDragging ? 'cursor-move' : ''}`}
          >
            <div className="flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={round.name}
                    onChange={(e) => handleUpdateRound({ ...round, name: e.target.value })}
                    className="max-w-xs"
                  />
                  
                  <select
                    value={round.round_type}
                    onChange={(e) => handleUpdateRound({ 
                      ...round, 
                      round_type: e.target.value as Round['round_type']
                    })}
                    className="p-2 border rounded"
                  >
                    <option value="Qualifiers">Qualifiers</option>
                    <option value="Semi-Finals">Semi-Finals</option>
                    <option value="Finals">Finals</option>
                    <option value="Super-Finals">Super-Finals</option>
                  </select>

                  <Input
                    type="number"
                    value={round.max_problems || ''}
                    onChange={(e) => handleUpdateRound({ 
                      ...round, 
                      max_problems: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    placeholder="Max problems"
                    className="w-32"
                  />

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => round.id && handleDeleteRound(round.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {rounds.length === 0 && (
          <div className="text-center p-4 border rounded-lg text-gray-500">
            No rounds added yet. Start by adding qualifiers!
          </div>
        )}
      </div>
    </div>
  );
}