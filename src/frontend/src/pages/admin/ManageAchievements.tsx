import { useState } from 'react';
import { useGetAchievements, useDeleteAchievement } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import AchievementForm from '../../components/AchievementForm';
import type { Achievement } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function ManageAchievements() {
  const { data: achievements, isLoading } = useGetAchievements();
  const deleteMutation = useDeleteAchievement();

  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Achievement deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAchievement(null);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20">Loading...</div>;
  }

  if (showForm) {
    return <AchievementForm achievement={editingAchievement} onClose={handleFormClose} />;
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin">
          <Button variant="ghost">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" />
          Add Achievement
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-gradient mb-8">Manage Achievements</h1>

      {!achievements || achievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No achievements yet. Add your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const imageUrl = achievement.image?.getDirectURL() || '/assets/generated/achievement-placeholder.dim_600x400.png';
            const date = new Date(Number(achievement.date) / 1000000);

            return (
              <Card key={achievement.id}>
                <div className="h-48 overflow-hidden">
                  <img src={imageUrl} alt={achievement.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{achievement.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(achievement)}>
                      <Pencil size={14} className="mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(achievement.id)}>
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the achievement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
