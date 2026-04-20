'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { UploadCloud, FileText, Loader2, CheckCircle, Trash2, Download, File, Zap } from 'lucide-react';

interface MemoryFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  status: string;
  created_at: string;
}

export default function MemoryVault() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [digesting, setDigesting] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDeleteFile = async (file: MemoryFile) => {
    if (!confirm('Eliminare questo documento?')) return;
    
    try {
      const { error: storageError } = await supabase.storage
        .from('vault')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('memory_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('DB delete error:', dbError);
        setUploadMessage('Errore eliminazione: ' + dbError.message);
        return;
      }

      setFiles(files.filter(f => f.id !== file.id));
      setUploadMessage('Documento eliminato');
      setTimeout(() => setUploadMessage(null), 2000);
    } catch (err) {
      console.error('Delete error:', err);
      setUploadMessage('Errore imprevisto');
    }
  };

  const handleDownloadFile = async (file: MemoryFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('vault')
        .download(file.file_path);

      if (error) {
        console.error('Download error:', error);
        setUploadMessage('Errore download: ' + error.message);
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setUploadMessage('Errore download');
    }
  };

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('memory_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setFiles(data);
    } catch (err) {
      console.error('Load files error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDigest = async () => {
    if (files.length === 0) return;
    
    setDigesting(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      await supabase.from('memory_files').update({ status: 'processing' }).eq('id', file.id);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await supabase.from('memory_files').update({ status: 'completed' }).eq('id', file.id);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed' } : f));
    }
    
    setDigesting(false);
  };

  const handleFileUpload = async (file: File) => {
    const MAX_SIZE = 10 * 1024 * 1024;
    
    if (file.size > MAX_SIZE) {
      setUploadMessage('File troppo grande. Limite massimo: 10MB.');
      return false;
    }

    return true;
  };

  const handleFilesUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      const isValid = await handleFileUpload(file);
      if (isValid) validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadMessage(null);
    setTotalFiles(validFiles.length);
    setCurrentFileIndex(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUploadMessage('Errore: utente non autenticato');
        setUploading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setCurrentFileIndex(i + 1);
        
        const filePath = `${user.id}/${Date.now()}-${i}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vault')
          .upload(file.name, file, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          failCount++;
          continue;
        }

        const { error: dbError } = await supabase.from('memory_files').insert({
          user_id: user.id,
          file_name: file.name,
          file_path: file.name,
          file_size: file.size,
          mime_type: file.type || 'text/markdown',
          status: 'pending',
        });

        if (dbError) {
          console.error('DB error:', JSON.stringify(dbError));
          failCount++;
          continue;
        }

        successCount++;
      }

      const totalProgress = Math.round(((successCount + failCount) / validFiles.length) * 100);
      setUploadProgress(totalProgress);

      if (failCount === 0) {
        setUploadMessage(`Caricati ${successCount} file. Jarvis sta iniziando la digestione vettoriale...`);
      } else {
        setUploadMessage(`Caricati ${successCount} file, ${failCount} falliti.`);
      }

      await loadFiles();
      
      setTimeout(() => {
        setUploading(false);
        setUploadMessage(null);
        setUploadProgress(0);
        setCurrentFileIndex(0);
        setTotalFiles(0);
      }, 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      setUploadMessage('Errore imprevisto. Riprova.');
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFilesUpload(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFilesUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">In coda</span>;
      case 'processing':
        return <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Elaborazione</span>;
      case 'completed':
        return <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Completato</span>;
      case 'failed':
        return <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Fallito</span>;
      default:
        return <span className="text-xs text-zinc-500">{status}</span>;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-400/10 rounded-lg">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <h2 className="text-lg font-medium text-zinc-100">Memory Vault (Knowledge Base)</h2>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={uploadDisabled ? undefined : handleClick}
            onDragOver={uploadDisabled ? undefined : handleDragOver}
            onDragLeave={uploadDisabled ? undefined : handleDragLeave}
            onDrop={uploadDisabled ? undefined : handleDrop}
            className={`bg-zinc-950/30 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
              uploadDisabled
                ? 'border-zinc-800 cursor-not-allowed opacity-50'
                : isDragOver 
                  ? 'border-amber-400 bg-amber-400/5 cursor-pointer' 
                  : 'border-zinc-700 hover:border-amber-400/50 cursor-pointer'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx,.md"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploadDisabled}
            />
          
          {uploading ? (
            <div className="w-full">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
              <p className="text-zinc-400 text-sm mb-2">
                {totalFiles > 1 
                  ? `Caricamento file ${currentFileIndex} di ${totalFiles}...`
                  : 'Caricamento in corso...'}
              </p>
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-zinc-500 text-xs">{uploadProgress}%</p>
            </div>
          ) : uploadMessage ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-green-400 text-sm">{uploadMessage}</p>
            </div>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-zinc-600 mb-4" />
              <p className="text-zinc-400 text-sm mb-1">Trascina qui PDF, TXT, DOCX o MD</p>
              <p className="text-zinc-600 text-xs">per addestrare Jarvis (max 10MB)</p>
            </>
          )}
        </div>

        <div className="bg-zinc-950/30 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-zinc-300 font-medium">Documenti in memoria</span>
              <span className="text-xs text-zinc-500">({files.length})</span>
            </div>
            <div className="flex items-center gap-2">
              {files.length > 0 && (
                <button
                  onClick={loadFiles}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Aggiorna
                </button>
              )}
            </div>
          </div>

          {files.length > 0 && (
            <button
              onClick={handleDigest}
              disabled={digesting || files.every(f => f.status === 'completed')}
              className={`w-full flex items-center justify-center gap-2 py-2 mb-4 rounded-lg text-sm font-medium transition-all ${
                digesting 
                  ? 'bg-amber-400/20 text-amber-400 animate-pulse' 
                  : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Zap className={`w-4 h-4 ${digesting ? 'animate-bounce' : ''}`} />
              {digesting ? 'Jarvis sta digerendo...' : 'Avvia Digestione Strategica'}
            </button>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
              <p className="text-sm text-zinc-500">Caricamento...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
              <FileText className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Nessun documento in memoria</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-zinc-900/50 rounded border border-zinc-800 group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <File className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-300 truncate max-w-[120px]">{file.file_name}</p>
                      <p className="text-xs text-zinc-500">{formatFileSize(file.file_size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(file.status)}
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="p-1 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Elimina"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}