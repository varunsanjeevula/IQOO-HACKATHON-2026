import { Shield, Brain, Download, Trash2, Power, ChevronRight, Check } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useInsights } from '@/hooks/useInsights';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function ProfilePage() {
  const { demoMode, setDemoMode, privacySettings, togglePrivacySetting } = useAppStore();
  const { data: insights } = useInsights();
  const queryClient = useQueryClient();
  const [isPaused, setIsPaused] = useState(false);

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all memories and reminders? This cannot be undone.')) return;
    await api.deleteAllMemories();
    await queryClient.invalidateQueries();
  };

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full min-h-screen space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your memories, privacy, and preferences.</p>
      </header>

      {/* Insights Section */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Memory Insights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{insights?.totalMemories || 0}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Total Memories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{insights?.upcomingExpiries.length || 0}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Expiring Soon</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{insights?.upcomingReminders.length || 0}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Active Reminders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{Object.keys(insights?.categoryCounts || {}).length}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Categories</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Privacy Controls</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="p-6 bg-primary/5 border-b">
              <h3 className="font-semibold mb-2">🔐 Your memories belong to you</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens locally when possible. Select which types of documents the AI is allowed to process and store.
              </p>
            </div>
            
            <div className="divide-y">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium">Photos & Receipts</h4>
                  <p className="text-xs text-muted-foreground">Allow processing of images</p>
                </div>
                <Switch 
                  checked={privacySettings.photos} 
                  onCheckedChange={() => togglePrivacySetting('photos')}
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium">Documents</h4>
                  <p className="text-xs text-muted-foreground">Allow processing of PDFs and Docs</p>
                </div>
                <Switch 
                  checked={privacySettings.documents} 
                  onCheckedChange={() => togglePrivacySetting('documents')}
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium">Screenshots</h4>
                  <p className="text-xs text-muted-foreground">Automatically process screenshots</p>
                </div>
                <Switch 
                  checked={privacySettings.screenshots} 
                  onCheckedChange={() => togglePrivacySetting('screenshots')}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50/50">
                <div>
                  <h4 className="font-medium text-red-900">Sensitive Documents</h4>
                  <p className="text-xs text-red-700">Financial, Medical, Identity documents</p>
                </div>
                <Switch 
                  checked={privacySettings.sensitiveDocuments} 
                  onCheckedChange={() => togglePrivacySetting('sensitiveDocuments')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Demo Mode */}
      <section>
        <Card className={demoMode ? 'border-primary bg-primary/5' : ''}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                Demo Mode {demoMode && <Check className="h-4 w-4 text-primary" />}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Use sample data instead of real backend</p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </CardContent>
        </Card>
      </section>

      {/* Data Actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Data Management</h2>
        <Card>
          <CardContent className="p-0 divide-y">
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors" onClick={() => setIsPaused((paused) => !paused)}>
              <div className="flex items-center gap-3">
                <Power className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <h4 className="font-medium">{isPaused ? 'Resume Recall' : 'Pause Recall'}</h4>
                  <p className="text-xs text-muted-foreground">{isPaused ? 'Uploads are currently paused' : 'Temporarily stop saving memories'}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors" onClick={() => api.exportMemories().catch(() => window.alert('Export failed. Please try again.'))}>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <h4 className="font-medium">Export Memories</h4>
                  <p className="text-xs text-muted-foreground">Download all your data as ZIP</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-destructive" onClick={handleDeleteAll}>
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5" />
                <div className="text-left">
                  <h4 className="font-medium">Delete All Memories</h4>
                  <p className="text-xs opacity-80">This action cannot be undone</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center py-6">
        <div className="flex justify-center mb-2">
          <Brain className="h-6 w-6 text-muted-foreground opacity-50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Recall v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">Your personal memory assistant</p>
      </footer>
    </div>
  );
}
