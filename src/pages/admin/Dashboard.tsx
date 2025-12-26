import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, FileText, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [categories, papers, notifications] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('papers').select('id', { count: 'exact' }),
        supabase.from('notifications').select('id', { count: 'exact' }),
      ]);
      
      return {
        categories: categories.count || 0,
        papers: papers.count || 0,
        notifications: notifications.count || 0,
      };
    },
  });

  const statCards = [
    { label: 'Categories', value: stats?.categories, icon: FolderOpen, color: 'text-blue-500' },
    { label: 'Papers', value: stats?.papers, icon: FileText, color: 'text-green-500' },
    { label: 'Notifications', value: stats?.notifications, icon: Bell, color: 'text-yellow-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
