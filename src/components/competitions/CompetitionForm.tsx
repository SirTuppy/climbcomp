import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { Calendar } from 'lucide-react';
import { RoundManager } from './RoundManager';

interface CompetitionFormProps {
  competitionId?: string;
  onSuccess?: () => void;
}

interface CompetitionFormData {
  name: string;
  description: string;
  type: 'Boulder' | 'Lead' | 'Speed';
  status: 'Draft' | 'Registration' | 'Active' | 'Complete';
  start_date: string;
  end_date: string;
  scoring_rules?: any;
  custom_fields?: any;
  is_template?: boolean;
}

export function CompetitionForm({ competitionId, onSuccess }: CompetitionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [formData, setFormData] = React.useState<CompetitionFormData>({
    name: '',
    description: '',
    type: 'Boulder',
    status: 'Draft',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  // Fetch competition data if editing
  const { data: competition, isLoading } = useQuery({
    queryKey: ['competition', competitionId],
    queryFn: async () => {
      if (!competitionId) return null;
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', competitionId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!competitionId,
  });

  // Update form data when competition data is loaded
  React.useEffect(() => {
    if (competition) {
      setFormData({
        name: competition.name,
        description: competition.description || '',
        type: competition.type,
        status: competition.status,
        start_date: new Date(competition.start_date).toISOString().split('T')[0],
        end_date: new Date(competition.end_date).toISOString().split('T')[0],
        scoring_rules: competition.scoring_rules || {},
        custom_fields: competition.custom_fields || {},
        is_template: competition.is_template,
      });
    }
  }, [competition]);

  const mutation = useMutation({
    mutationFn: async (data: CompetitionFormData) => {
      if (competitionId) {
        const { error } = await supabase
          .from('competitions')
          .update(data)
          .eq('id', competitionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('competitions')
          .insert([{ ...data, status: 'Draft' }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      if (competitionId) {
        queryClient.invalidateQueries({ queryKey: ['competition', competitionId] });
      }
      toast({
        title: `Competition ${competitionId ? 'updated' : 'created'} successfully`,
        description: `${formData.name} has been ${competitionId ? 'updated' : 'created'}.`,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{competitionId ? 'Edit Competition' : 'Create Competition'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Competition Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full p-2 border rounded"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CompetitionFormData['type'] })}
                required
              >
                <option value="Boulder">Boulder</option>
                <option value="Lead">Lead</option>
                <option value="Speed">Speed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full p-2 border rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CompetitionFormData['status'] })}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Registration">Registration Open</option>
                <option value="Active">Active</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <div className="relative">
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
                <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <div className="relative">
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
                <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_template"
              checked={formData.is_template}
              onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
            />
            <Label htmlFor="is_template">Save as Template</Label>
          </div>
          {competitionId && (
            <div className="mt-8 pt-4 border-t">
              <RoundManager competitionId={competitionId} />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : competitionId ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}