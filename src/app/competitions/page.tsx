'use client';

import React from 'react';
import { CompetitionList } from '../../components/competitions/CompetitionList';
import { CompetitionForm } from '../../components/competitions/CompetitionForm';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { useAuth } from '../../components/providers/AuthProvider';

export default function CompetitionsPage() {
  const { userDetails } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const isAdmin = userDetails?.roles?.includes('admin');

  const handleCreateNew = () => {
    setIsCreateOpen(true);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsCreateOpen(true);
  };

  const handleFormClose = () => {
    setIsCreateOpen(false);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Show active competitions first */}
        <CompetitionList 
          onEdit={isAdmin ? handleEdit : undefined}
          onCreateNew={isAdmin ? handleCreateNew : undefined}
          showTemplates={false}
        />

        {/* Show templates if user is admin */}
        {isAdmin && (
          <CompetitionList 
            onEdit={handleEdit}
            onCreateNew={handleCreateNew}
            showTemplates={true}
          />
        )}
      </div>

      {/* Form Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingId ? 'Edit Competition' : 'Create New Competition'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CompetitionForm
              competitionId={editingId ?? undefined}
              onSuccess={handleFormClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}