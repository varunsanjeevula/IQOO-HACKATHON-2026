import { Bell, Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRelativeTime, formatDate } from '@/lib/utils';

export function RemindersPage() {
  const { data: reminders, isLoading } = useReminders();
  const queryClient = useQueryClient();
  const updateReminder = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' | 'dismissed' }) => api.updateReminder(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });
  const deleteReminder = useMutation({
    mutationFn: (id: string) => api.deleteReminder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });

  const pending = reminders?.filter(r => r.status === 'pending') || [];
  const completed = reminders?.filter(r => r.status === 'completed') || [];

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold mb-1">Reminders</h1>
        <p className="text-muted-foreground">Stay on top of important dates from your documents.</p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="animate-pulse bg-muted rounded-2xl h-24" />)}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Upcoming ({pending.length})
            </h2>
            
            {pending.length > 0 ? (
              <div className="space-y-4">
                {pending.map(reminder => (
                  <Card key={reminder.id} className="border-l-4 border-l-primary overflow-hidden">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className="p-4 sm:p-6 flex-1 flex gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{reminder.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{reminder.description}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              <Clock className="h-3 w-3 mr-1" /> {getRelativeTime(reminder.reminder_date)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(reminder.reminder_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 sm:p-6 flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                        <Button variant="default" size="sm" className="w-full sm:w-auto" onClick={() => updateReminder.mutate({ id: reminder.id, status: 'completed' })} disabled={updateReminder.isPending}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Done
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground" onClick={() => updateReminder.mutate({ id: reminder.id, status: 'dismissed' })} disabled={updateReminder.isPending}>
                          Dismiss
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground">No upcoming reminders.</p>
              </div>
            )}
          </section>

          {completed.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5" /> Completed ({completed.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {completed.map(reminder => (
                  <Card key={reminder.id} className="bg-muted/50 border-none shadow-none">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold line-through decoration-muted-foreground/50">{reminder.title}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(reminder.reminder_date)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteReminder.mutate(reminder.id)} disabled={deleteReminder.isPending} aria-label={`Delete ${reminder.title}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
