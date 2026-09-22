import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, Image as ImageIcon, FileText, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUpload } from '@/hooks/useUpload';
import { useAppStore } from '@/stores/appStore';

export function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  const { mutateAsync: uploadMemory } = useUpload();
  const { privacySettings, isPaused } = useAppStore();

  const processSteps = [
    "📎 Uploading your memory...",
    "🔍 Extracting text...",
    "🧠 Understanding document...",
    "📅 Finding important dates...",
    "✨ Creating searchable memory..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    if (isPaused) {
      setUploadError('Recall is paused. Resume it in Settings before adding a memory.');
      return;
    }
    const isImage = selectedFile.type.startsWith('image/');
    if ((isImage && !privacySettings.photos) || (!isImage && !privacySettings.documents)) {
      setUploadError('This document type is disabled in Privacy Controls.');
      return;
    }
    setUploadError('');
    setFile(selectedFile);
    setIsProcessing(true);
    setUploadComplete(false);

    // Simulate multi-step processing animation
    const runAnimation = async () => {
      for (let i = 0; i < processSteps.length; i++) {
        setProcessStep(i);
        await new Promise(r => setTimeout(r, 600)); // 600ms per step
      }
    };

    const animPromise = runAnimation();
    
    try {
      // Actually upload
      const result = await uploadMemory(selectedFile);
      await animPromise; // wait for animation to finish
      setResultId(result.id);
      setIsProcessing(false);
      setUploadComplete(true);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setUploadError('Failed to upload memory. Please check the file and try again.');
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full min-h-screen">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold mb-2">Add Memory</h1>
        <p className="text-muted-foreground">Upload a document, receipt, or photo to save it forever.</p>
      </header>

      <AnimatePresence mode="wait">
        {!isProcessing && !uploadComplete ? (
          <motion.div 
            key="upload-options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="cursor-pointer h-full">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Card className="hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Photo</h3>
                      <p className="text-xs text-muted-foreground mt-1">Receipts, bills, snapshots</p>
                    </div>
                  </CardContent>
                </Card>
              </label>

              <label className="cursor-pointer h-full">
                <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                <Card className="hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Document</h3>
                      <p className="text-xs text-muted-foreground mt-1">Invoices, tickets, PDFs</p>
                    </div>
                  </CardContent>
                </Card>
              </label>

              <label className="cursor-pointer h-full md:hidden">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <Card className="hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Camera</h3>
                      <p className="text-xs text-muted-foreground mt-1">Scan right now</p>
                    </div>
                  </CardContent>
                </Card>
              </label>
            </div>

            <div className="hidden md:flex border-2 border-dashed rounded-2xl h-64 items-center justify-center flex-col gap-4 bg-muted/30 relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange} 
              />
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UploadIcon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Drag & Drop</h3>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
            </div>
            {uploadError && <p className="text-sm text-destructive text-center" role="alert">{uploadError}</p>}
          </motion.div>

        ) : isProcessing ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="w-full max-w-md space-y-8">
              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((processStep + 1) / processSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{processSteps[processStep]}</h3>
                <p className="text-muted-foreground text-sm">Please wait while our AI analyzes your document.</p>
              </div>
            </div>
          </motion.div>
          
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-10"
          >
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold mb-2">Memory Saved!</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              {file ? `"${file.name}" has been successfully analyzed, tagged, and safely stored in your memories.` : "Your document has been successfully analyzed, tagged, and safely stored in your memories."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" onClick={() => navigate(`/memory/${resultId}`)}>
                View Memory <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                setFile(null);
                setUploadComplete(false);
              }}>
                Add Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
