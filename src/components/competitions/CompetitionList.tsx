import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Clock } from 'lucide-react';

interface CompetitionListProps {
  onEdit?: (id: string) => void;
  onCreateNew?: () => void;
  showTemplates?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Registration':
      return 'bg-blue-100 text-blue-800';
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Complete':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function CompetitionList({ onEdit, onCreateNew, showTemplates = false }: CompetitionListProps) {
  const supabase = createClient();
  
  const { data: competitions, isLoading } = useQuery({
    queryKey: ['competitions', { templates: showTemplates }],
    queryFn: async () => {
      const query = supabase
        .from('competitions')
        .select('*')
        .eq('is_template', showTemplates)
        .order('created_at', { ascending: false });
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading competitions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {showTemplates ? 'Competition Templates' : 'Competitions'}
        </h2>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            Create New {showTemplates ? 'Template' : 'Competition'}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {competitions?.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{competition.name}</span>
                <span className="text-sm font-normal px-2 py-1 rounded bg-gray-100">
                  {competition.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {competition.description || 'No description provided'}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(competition.start_date).toLocaleDateString()} - 
                      {new Date(competition.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(competition.status)}`}>
                    {competition.status}
                  </span>
                  
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(competition.id)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!competitions?.length && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              No {showTemplates ? 'templates' : 'competitions'} found
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}