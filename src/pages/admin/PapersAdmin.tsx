import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Paper {
  id: string;
  title: string;
  year: number;
  description: string | null;
  paper_url: string | null;
  marking_scheme_url: string | null;
  category_id: string;
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const PapersAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    description: '',
    paper_url: '',
    marking_scheme_url: '',
    category_id: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: papers, isLoading } = useQuery({
    queryKey: ['admin-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('papers')
        .select('*, categories(name)')
        .order('year', { ascending: false });
      if (error) throw error;
      return data as Paper[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('papers').insert([{
        ...data,
        paper_url: data.paper_url || null,
        marking_scheme_url: data.marking_scheme_url || null,
        description: data.description || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-papers'] });
      toast({ title: 'Paper created successfully' });
      handleClose();
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('papers').update({
        ...data,
        paper_url: data.paper_url || null,
        marking_scheme_url: data.marking_scheme_url || null,
        description: data.description || null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-papers'] });
      toast({ title: 'Paper updated successfully' });
      handleClose();
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('papers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-papers'] });
      toast({ title: 'Paper deleted successfully' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingPaper(null);
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      description: '',
      paper_url: '',
      marking_scheme_url: '',
      category_id: '',
    });
  };

  const handleEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      year: paper.year,
      description: paper.description || '',
      paper_url: paper.paper_url || '',
      marking_scheme_url: paper.marking_scheme_url || '',
      category_id: paper.category_id,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category_id) return;

    if (editingPaper) {
      updateMutation.mutate({ id: editingPaper.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Papers</h1>
            <p className="text-muted-foreground mt-1">Manage exam papers</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleClose()}>
                <Plus className="h-4 w-4" />
                Add Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingPaper ? 'Edit Paper' : 'Add Paper'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-input border-border"
                      placeholder="e.g. Paper I"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-foreground">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="bg-input border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-input border-border"
                    placeholder="Optional description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paper_url" className="text-foreground">Paper URL</Label>
                  <Input
                    id="paper_url"
                    value={formData.paper_url}
                    onChange={(e) => setFormData({ ...formData, paper_url: e.target.value })}
                    className="bg-input border-border"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marking_scheme_url" className="text-foreground">Marking Scheme URL</Label>
                  <Input
                    id="marking_scheme_url"
                    value={formData.marking_scheme_url}
                    onChange={(e) => setFormData({ ...formData, marking_scheme_url: e.target.value })}
                    className="bg-input border-border"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingPaper ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Year</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : papers?.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No papers found. Add your first paper.
                    </TableCell>
                  </TableRow>
                ) : (
                  papers?.map((paper) => (
                    <TableRow key={paper.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{paper.title}</TableCell>
                      <TableCell className="text-muted-foreground">{paper.categories?.name}</TableCell>
                      <TableCell className="text-foreground">{paper.year}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(paper)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteMutation.mutate(paper.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PapersAdmin;
