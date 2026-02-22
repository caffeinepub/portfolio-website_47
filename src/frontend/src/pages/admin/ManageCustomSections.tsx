import { useState } from 'react';
import { useGetContentSections, useDeleteContentSection } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import CustomSectionForm from '../../components/CustomSectionForm';
import type { ContentSection } from '../../backend';
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

export default function ManageCustomSections() {
  const { data: sections, isLoading } = useGetContentSections();
  const deleteMutation = useDeleteContentSection();

  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Section deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSection(null);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20">Loading...</div>;
  }

  if (showForm) {
    return <CustomSectionForm section={editingSection} onClose={handleFormClose} />;
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
          Add Section
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-gradient mb-8">Manage Custom Sections</h1>

      {!sections || sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No custom sections yet. Add your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const imageUrl = section.image?.getDirectURL();
            const excerpt = section.content.substring(0, 150) + '...';

            return (
              <Card key={section.id}>
                <div className="flex flex-col md:flex-row gap-4">
                  {imageUrl && (
                    <div className="md:w-48 h-48 overflow-hidden">
                      <img src={imageUrl} alt={section.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{excerpt}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(section)}>
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(section.id)}>
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
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
              This action cannot be undone. This will permanently delete the section.
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
