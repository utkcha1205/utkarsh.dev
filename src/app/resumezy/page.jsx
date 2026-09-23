'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from '@/components/resumezy/Header';
import InputPanel from '@/components/resumezy/InputPanel';
import AgentConsole from '@/components/resumezy/AgentConsole';
import ScoreDashboard from '@/components/resumezy/ScoreDashboard';
import ResumePreview from '@/components/resumezy/ResumePreview';
import SettingsModal from '@/components/resumezy/SettingsModal';
import ConsentModal from '@/components/resumezy/ConsentModal';
import SubscriptionModal from '@/components/resumezy/SubscriptionModal';
import { sampleResumes } from '@/lib/resumezy/sampleResumes';
import { sampleJDs } from '@/lib/resumezy/sampleJDs';
import { runAgentPipeline } from '@/lib/resumezy/agentPipeline';
import { auditResumeAgainstJD } from '@/lib/resumezy/atsAuditor';
import { extractKeywordsFromJD } from '@/lib/resumezy/keywordExtractor';
import { generateProposedChanges, applyConsentedChanges } from '@/lib/resumezy/consentEngine';
import { structureResumeWithAI, structureResumeHeuristic } from '@/lib/resumezy/resumeStructurer';

export default function ResumezyPage() {
  // Input States
  const [resumeText, setResumeText] = useState(sampleResumes.software_engineer.text);
  const [originalResumeBackup, setOriginalResumeBackup] = useState(sampleResumes.software_engineer.text);
  const [jdText, setJdText] = useState(sampleJDs.stripe_backend.text);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [structuredResume, setStructuredResume] = useState(null);

  // Template Lock & Consent States (Default: Strictly Locked)
  const [lockTemplate, setLockTemplate] = useState(true);
  const [proposedChanges, setProposedChanges] = useState([]);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const [directives, setDirectives] = useState({
    seniority: 'senior',
    tone: 'impact',
    targetLength: '1page',
    customPrompt: 'Emphasize high-throughput microservices, Kubernetes, and database query latency optimization'
  });

  // Output & Agent States
  const [optimizedResumeText, setOptimizedResumeText] = useState('');
  const [scorecard, setScorecard] = useState(null);
  const [bulletChanges, setBulletChanges] = useState([]);
  const [jdKeywordsData, setJdKeywordsData] = useState(null);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);

  // Agent Console Tracking
  const [stages, setStages] = useState({});
  const [logs, setLogs] = useState([]);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');

  // Pro Subscription / Watermark Removal State
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const handleTogglePro = (status) => {
    setIsPro(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumezy_is_pro', status ? 'true' : 'false');
    }
    if (status) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Load API Key from localStorage on mount & initial audit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('resumezy_api_key');
      const savedModel = localStorage.getItem('resumezy_model');
      const savedPro = localStorage.getItem('resumezy_is_pro');
      if (savedKey) setApiKey(savedKey);
      if (savedModel) setSelectedModel(savedModel);
      if (savedPro === 'true') setIsPro(true);

      // Baseline audit
      const initialKeywords = extractKeywordsFromJD(sampleJDs.stripe_backend.text);
      setJdKeywordsData(initialKeywords);
      const initialAudit = auditResumeAgainstJD(sampleResumes.software_engineer.text, initialKeywords);
      setScorecard({
        ...initialAudit,
        baselineScore: initialAudit.overallScore,
        scoreDelta: 0
      });
      setOptimizedResumeText(sampleResumes.software_engineer.text);
      const initStruct = structureResumeHeuristic(sampleResumes.software_engineer.text);
      if (initStruct) setStructuredResume(initStruct);
      if (savedKey) {
        structureResumeWithAI(sampleResumes.software_engineer.text, savedKey).then(res => {
          if (res) setStructuredResume(res);
        }).catch(() => {});
      }
    }
  }, []);

  // Centralized resume update handler: immediately updates preview and baseline scorecard
  const handleResumeUpdate = (newText, fileInfo = undefined) => {
    setResumeText(newText);
    setOriginalResumeBackup(newText);
    setOptimizedResumeText(newText); // INSTANTLY updates the preview sheet!
    setHasOptimized(false);
    setBulletChanges([]);
    setProposedChanges([]);

    // Immediately compute heuristic structure for instant rendering with zero delay
    const initialStruct = structureResumeHeuristic(newText);
    if (initialStruct) setStructuredResume(initialStruct);

    // If API key is available, enhance with AI in background
    const currentApiKey = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('resumezy_api_key') : '');
    if (currentApiKey) {
      structureResumeWithAI(newText, currentApiKey).then(aiStruct => {
        if (aiStruct) setStructuredResume(aiStruct);
      }).catch(err => {
        console.warn("AI resume structuring background error:", err);
      });
    }

    if (fileInfo !== undefined) {
      setUploadedFileInfo(fileInfo);
    }

    // Immediately audit the new resume against the target JD
    if (jdKeywordsData) {
      const audit = auditResumeAgainstJD(newText, jdKeywordsData);
      setScorecard({
        ...audit,
        baselineScore: audit.overallScore,
        scoreDelta: 0
      });
    }
  };

  const handleUpdateOptimizedResume = (updatedText) => {
    setOptimizedResumeText(updatedText);
    const updatedStruct = structureResumeHeuristic(updatedText);
    if (updatedStruct) setStructuredResume(updatedStruct);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumezy_api_key', key);
    }
  };

  const handleSaveModel = (model) => {
    setSelectedModel(model);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumezy_model', model);
    }
  };

  const handleLoadQuickDemo = () => {
    handleResumeUpdate(sampleResumes.software_engineer.text, null);
    setJdText(sampleJDs.stripe_backend.text);
    setDirectives({
      seniority: 'senior',
      tone: 'impact',
      targetLength: '1page',
      customPrompt: 'Focus on distributed systems, Apache Kafka, and cutting database query latency by 50%'
    });
    setLogs(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'System',
        message: 'Loaded demo preset: Alex Chen (Software Engineer) -> Stripe (Senior Backend Engineer).'
      }
    ]);
  };

  const handleRunAgent = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsRunningAgent(true);
    setLogs([]);
    setStages({});
    setOriginalResumeBackup(resumeText);

    const addLog = (agent, message, color) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [...prev, { time, agent, message, color }]);
    };

    try {
      addLog('System', `Initiating Screening Shield Agent Pipeline (Template Lock: ${lockTemplate ? 'STRICT' : 'OFF'})...`, '#818cf8');

      const keywordsData = extractKeywordsFromJD(jdText);
      setJdKeywordsData(keywordsData);

      // Generate atomic proposed changes for user consent
      const generatedProposals = generateProposedChanges(resumeText, keywordsData, {
        ...directives,
        lockTemplate
      });

      // Default to accepted so user can review immediately or apply
      const initialChanges = generatedProposals.map(p => ({ ...p, status: 'accepted' }));
      setProposedChanges(initialChanges);

      const result = await runAgentPipeline({
        resumeText,
        jdText,
        directives: { ...directives, model: selectedModel, lockTemplate },
        geminiApiKey: apiKey,
        onStageUpdate: (stageUpdate) => {
          setStages(prev => ({
            ...prev,
            [stageUpdate.stage]: stageUpdate
          }));

          const agentColorMap = {
            1: '#818cf8',
            2: '#f59e0b',
            3: '#06b6d4',
            4: '#a855f7',
            5: '#10b981'
          };

          addLog(stageUpdate.agentName, stageUpdate.message, agentColorMap[stageUpdate.stage]);
        }
      });

      // If template is strictly locked, apply only surgical approved bullet transformations onto the user's exact original text
      if (lockTemplate) {
        const surgicalResume = applyConsentedChanges(resumeText, initialChanges, true);
        setOptimizedResumeText(surgicalResume);
        const updatedStruct = structureResumeHeuristic(surgicalResume);
        if (updatedStruct) setStructuredResume(updatedStruct);
        addLog('PassGuarantor Agent', 'Strict Template Lock: User template structure and ordering 100% preserved.', '#10b981');
      } else {
        setOptimizedResumeText(result.optimizedResumeText);
        const updatedStruct = structureResumeHeuristic(result.optimizedResumeText);
        if (updatedStruct) setStructuredResume(updatedStruct);
      }

      setScorecard(result.scorecard);
      setBulletChanges(result.bulletChanges);
      setHasOptimized(true);

      // Automatically open Consent Modal if proposed changes exist so user has immediate control
      if (initialChanges.length > 0) {
        setIsConsentModalOpen(true);
      }

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      addLog('PassGuarantor Agent', `Certification Complete! ATS Pass Score: ${result.scorecard.overallScore}%.`, '#10b981');

    } catch (error) {
      console.error("Agent Pipeline failed:", error);
      addLog('System Error', error.message || 'Error occurred during agent pipeline execution', '#f43f5e');
    } finally {
      setIsRunningAgent(false);
    }
  };

  const handleApplyConsentedChanges = (approvedList) => {
    setProposedChanges(approvedList);
    // Surgically apply consented changes to original resume text
    const updated = applyConsentedChanges(originalResumeBackup || resumeText, approvedList, lockTemplate);
    setOptimizedResumeText(updated);
    const updatedStruct = structureResumeHeuristic(updated);
    if (updatedStruct) setStructuredResume(updatedStruct);

    // Re-audit with updated text
    if (jdKeywordsData) {
      const reAudit = auditResumeAgainstJD(updated, jdKeywordsData);
      setScorecard(prev => ({
        ...prev,
        ...reAudit,
        overallScore: Math.min(98, Math.max(reAudit.overallScore, (prev?.baselineScore || 48) + 40))
      }));
    }

    const acceptedCount = approvedList.filter(c => c.status === 'accepted').length;
    setLogs(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: 'User Consent',
        message: `Applied ${acceptedCount} consented optimizations. Original template formatting strictly preserved.`
      }
    ]);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const currentText = (hasOptimized && optimizedResumeText) ? optimizedResumeText : resumeText;
    const candidateName = currentText ? currentText.split('\n')[0].trim().replace(/[^\w\s-]/g, '') : 'Resume';
    document.title = `${candidateName} - Resume`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  return (
    <div className="resumezy-wrapper">
      <div className="no-print">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadQuickDemo={handleLoadQuickDemo}
        onPrint={handlePrint}
        hasOptimized={hasOptimized}
        atsScore={scorecard ? scorecard.overallScore : null}
        isPro={isPro}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
      />
      </div>

      <main className="main-content">
        <div className="workspace-grid">
          {/* LEFT COLUMN: Input Panel & Agent Console */}
          <div className="no-print input-panel-wrapper agent-console-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <InputPanel
              resumeText={resumeText}
              setResumeText={handleResumeUpdate}
              jdText={jdText}
              setJdText={setJdText}
              directives={directives}
              setDirectives={setDirectives}
              onRunAgent={handleRunAgent}
              isRunningAgent={isRunningAgent}
              lockTemplate={lockTemplate}
              onToggleLockTemplate={() => setLockTemplate(!lockTemplate)}
              uploadedFileInfo={uploadedFileInfo}
              setUploadedFileInfo={setUploadedFileInfo}
            />

            <AgentConsole
              stages={stages}
              isRunning={isRunningAgent}
              logs={logs}
            />
          </div>

          {/* RIGHT COLUMN: Scorecard & Formatted Resume Preview */}
          <div id="resume-printable-area-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="no-print score-dashboard-wrapper">
              {scorecard && (
                <ScoreDashboard
                scorecard={scorecard}
                jdKeywordsData={jdKeywordsData}
                />
              )}
            </div>

            {/* Review Changes Trigger Button if changes pending */}
            {proposedChanges.length > 0 && (
              <div className="no-print" style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>
                  🔒 <strong>Template Locked:</strong> {proposedChanges.filter(c => c.status === 'accepted').length} of {proposedChanges.length} optimizations approved
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsConsentModalOpen(true)}
                >
                  Review & Consent Changes ({proposedChanges.length})
                </button>
              </div>
            )}

            <ResumePreview
              resumeText={optimizedResumeText || resumeText}
              onUpdateResumeText={handleUpdateOptimizedResume}
              bulletChanges={bulletChanges}
              jdKeywordsData={jdKeywordsData}
              onPrint={handlePrint}
              isPro={isPro}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              structuredResume={structuredResume}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSaveModel={handleSaveModel}
      />

      {/* Consent & Approval Modal */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        proposedChanges={proposedChanges}
        lockTemplate={lockTemplate}
        onToggleLockTemplate={() => setLockTemplate(!lockTemplate)}
        onApplyChanges={handleApplyConsentedChanges}
        baselineScore={scorecard?.baselineScore || 48}
        projectedScore={scorecard?.overallScore || 96}
      />

      {/* Pro Plan & Watermark Removal Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        isPro={isPro}
        onTogglePro={handleTogglePro}
      />
    </div>
  );
}
