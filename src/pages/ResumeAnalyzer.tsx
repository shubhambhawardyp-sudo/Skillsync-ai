import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppContext } from "@/context/AppContext";
import { Upload, FileText, CheckCircle, Loader2, Sparkles, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { parseResume, parseResumeText } from "@/services/aiService";

export default function ResumeAnalyzer() {
  const { resume, setResume } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const { toast } = useToast();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    toast({
      title: "Analyzing Resume...",
      description: "Extracting skills and experience via AI.",
    });

    try {
      const data = await parseResume(file);
      setResume(data);
      toast({
        title: "Success",
        description: "Resume parsed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse resume.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processPastedText = async () => {
    if (!pastedText.trim()) return;
    if (pastedText.length > 8000) {
      toast({
        title: "Text too long",
        description: "Please paste just the resume text (under 8000 characters). Check for accidental duplicate content.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    toast({
      title: "Analyzing Resume...",
      description: "Extracting skills and experience via AI.",
    });

    try {
      const data = await parseResumeText(pastedText);
      setResume(data);
      toast({
        title: "Success",
        description: "Resume parsed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse resume.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume to extract skills, experience, and parse them into data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div 
            className={`glass-card rounded-2xl p-8 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[300px] ${
              isDragging ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-white mb-1">AI Processing</h3>
                <p className="text-sm text-muted-foreground">Extracting data entities...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop Resume</h3>
                <p className="text-sm text-muted-foreground mb-6">Supports PDF, DOCX (Max 5MB)</p>
                <label className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Browse Files
                  <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileInput} />
                </label>
              </>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white font-medium mb-3">Or paste resume text</h3>
            <p className="text-xs text-muted-foreground mb-3">
              PDF/DOCX text extraction isn't wired up yet — paste your resume text here for the most reliable AI parsing.
            </p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full min-h-[140px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <div className="flex justify-between items-center mt-1.5">
              <span className={`text-xs ${pastedText.length > 8000 ? "text-red-400" : "text-muted-foreground"}`}>
                {pastedText.length.toLocaleString()} / 8,000 characters
              </span>
              {pastedText.length > 0 && (
                <button onClick={() => setPastedText("")} className="text-xs text-muted-foreground hover:text-white">
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={processPastedText}
              disabled={isUploading || !pastedText.trim()}
              className="mt-3 w-full bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? "Analyzing..." : "Analyze Pasted Text"}
            </button>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-white font-medium flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" /> How it works
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                AI scans your document for structural entities
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Maps raw text to standardized industry skills
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Quantifies your years of experience per domain
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {resume ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{resume.name}</h2>
                    <div className="text-muted-foreground">{resume.email}</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Parsed Successfully
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> Extracted Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-primary/20 to-cyan-500/20 text-white border border-white/10 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> Experience
                    </h3>
                    <div className="space-y-6">
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full after:absolute after:left-[3px] after:top-4 after:w-px after:h-full after:bg-white/10 last:after:hidden">
                          <h4 className="text-white font-medium text-lg">{exp.role}</h4>
                          <div className="text-primary mb-2">{exp.company} <span className="text-muted-foreground mx-2">•</span> {exp.years}</div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> Education & Certs
                    </h3>
                    <div className="glass p-4 rounded-xl">
                      <div className="text-white mb-2">{resume.education}</div>
                      {resume.certifications.map(cert => (
                        <div key={cert} className="text-muted-foreground text-sm">{cert}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 glass-card rounded-2xl border border-white/5"
              >
                <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No data yet</h3>
                <p className="text-muted-foreground max-w-sm">Upload a resume to see the extracted data view.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
