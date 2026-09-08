import React, { useState } from 'react';
import { FileText, Briefcase, Wand2, Upload, CheckCircle, Lock, Unlock, FileCheck, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import DirectiveControls from './DirectiveControls';
import { sampleResumes } from '@/lib/resumezy/sampleResumes';
import { sampleJDs } from '@/lib/resumezy/sampleJDs';
import { parseUploadedResumeFile } from '@/lib/resumezy/documentParser';

export default function InputPanel({
  resumeText,
  setResumeText,
  jdText,
  setJdText,
  directives,
  setDirectives,
  onRunAgent,
  isRunningAgent,
  lockTemplate,
  onToggleLockTemplate,
  uploadedFileInfo,
  setUploadedFileInfo
}) {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume', 'jd', 'directives'
  const [selectedResumePreset, setSelectedResumePreset] = useState('software_engineer');
  const [selectedJDPreset, setSelectedJDPreset] = useState('stripe_backend');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleSelectResumePreset = (presetKey) => {
    setSelectedResumePreset(presetKey);
    setUploadedFileInfo(null);
    if (sampleResumes[presetKey]) {
      setResumeText(sampleResumes[presetKey].text);
    }
  };

  const handleSelectJDPreset = (presetKey) => {
    setSelectedJDPreset(presetKey);
    if (sampleJDs[presetKey]) {
      setJdText(sampleJDs[presetKey].text);
    }
  };

  const handleFileProcess = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError('');

    try {
      const parsed = await parseUploadedResumeFile(file);
      const fileInfo = {
        fileName: parsed.fileName,
        fileType: parsed.fileType,
        wordCount: parsed.wordCount
      };
      setResumeText(parsed.text, fileInfo);
      setUploadedFileInfo(fileInfo);
      setSelectedResumePreset('');
    } catch (err) {
      console.error("File upload error:", err);
      setUploadError(err.message || "Failed to parse file. Please try text or markdown.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="glass-card input-panel-wrapper" style={{ overflow: 'hidden' }}>
      {/* Panel Tab Bar */}
      <div className="panel-header" style={{ background: 'rgba(10, 16, 30, 0.6)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'resume' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('resume')}
          >
            <FileText size={14} />
            1. Current Resume
            {resumeText.trim().length > 50 && (
              <CheckCircle size={12} style={{ color: '#34d399' }} />
            )}
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'jd' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('jd')}
          >
            <Briefcase size={14} />
            2. Target Job Description
            {jdText.trim().length > 50 && (
              <CheckCircle size={12} style={{ color: '#34d399' }} />
            )}
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'directives' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('directives')}
          >
            <Wand2 size={14} />
            3. Custom Tweaks
          </button>
        </div>

        {/* Template Lock Status Badge */}
        <button
          type="button"
          className={`badge ${lockTemplate ? 'badge-emerald' : 'badge-amber'}`}
          onClick={onToggleLockTemplate}
          style={{ cursor: 'pointer', border: 'none', padding: '0.3rem 0.6rem' }}
          title="Click to toggle template protection mode"
        >
          {lockTemplate ? <Lock size={12} /> : <Unlock size={12} />}
          {lockTemplate ? 'Template Locked (Safe)' : 'Template Unlocked'}
        </button>
      </div>

      <div className="panel-body">
        {/* TAB 1: RESUME INPUT & UPLOAD */}
        {activeTab === 'resume' && (
          <div>
            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: '2px dashed rgba(99, 102, 241, 0.35)',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="file"
                id="resumeFileInput"
                accept=".pdf,.docx,.txt,.md,.tex"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileProcess(file);
                }}
                style={{ display: 'none' }}
              />

              <label htmlFor="resumeFileInput" style={{ cursor: 'pointer', display: 'block' }}>
                <Upload size={24} style={{ color: '#818cf8', margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                  {isUploading ? 'Extracting Resume Text...' : 'Click to Upload Resume or Drag & Drop'}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Supports <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, <strong>TXT</strong>, and <strong>Markdown (.md)</strong>
                </div>
              </label>

              {/* Uploaded File Pill */}
              {uploadedFileInfo && (
                <div style={{
                  marginTop: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.85rem',
                  fontSize: '0.75rem',
                  color: '#34d399'
                }}>
                  <FileCheck size={14} />
                  <span><strong>{uploadedFileInfo.fileName}</strong> ({uploadedFileInfo.wordCount} words preserved)</span>
                </div>
              )}
            </div>

            {uploadError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: '#fb7185',
                fontSize: '0.75rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <AlertCircle size={14} />
                {uploadError}
              </div>
            )}

            {/* Template Protection Notice */}
            <div style={{
              background: lockTemplate ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
              border: `1px solid ${lockTemplate ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: lockTemplate ? '#34d399' : '#fbbf24' }}>
                <Lock size={13} />
                <span>
                  <strong>Strict Template Protection:</strong> {lockTemplate ? 'No formatting or section reorders without your consent.' : 'Template reformatting allowed.'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                onClick={onToggleLockTemplate}
              >
                {lockTemplate ? 'Disable Lock' : 'Enable Lock'}
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                Or load a sample template:
              </div>
            </div>

            <div className="preset-chips">
              <button
                type="button"
                className={`chip ${selectedResumePreset === 'utkarsh_lead_frontend' ? 'active' : ''}`}
                onClick={() => handleSelectResumePreset('utkarsh_lead_frontend')}
                style={{ borderColor: selectedResumePreset === 'utkarsh_lead_frontend' ? 'rgba(168, 85, 247, 0.6)' : undefined, background: selectedResumePreset === 'utkarsh_lead_frontend' ? 'rgba(168, 85, 247, 0.15)' : undefined, color: selectedResumePreset === 'utkarsh_lead_frontend' ? '#c084fc' : undefined }}
              >
                🎓 Utkarsh (Overleaf LaTeX)
              </button>
              <button
                type="button"
                className={`chip ${selectedResumePreset === 'software_engineer' ? 'active' : ''}`}
                onClick={() => handleSelectResumePreset('software_engineer')}
              >
                💻 Senior Full Stack Engineer
              </button>
              <button
                type="button"
                className={`chip ${selectedResumePreset === 'data_scientist' ? 'active' : ''}`}
                onClick={() => handleSelectResumePreset('data_scientist')}
              >
                📊 AI & Data Scientist
              </button>
              <button
                type="button"
                className={`chip ${selectedResumePreset === 'product_manager' ? 'active' : ''}`}
                onClick={() => handleSelectResumePreset('product_manager')}
              >
                🚀 Technical Product Manager
              </button>
            </div>

            <textarea
              className="custom-textarea"
              rows={12}
              placeholder="Your resume content..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: '1.45' }}
            />
          </div>
        )}

        {/* TAB 2: JOB DESCRIPTION INPUT */}
        {activeTab === 'jd' && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              Load Real-World High-Bar Job Postings:
            </div>

            <div className="preset-chips">
              <button
                type="button"
                className={`chip ${selectedJDPreset === 'stripe_backend' ? 'active' : ''}`}
                onClick={() => handleSelectJDPreset('stripe_backend')}
              >
                💳 Stripe - Senior Backend Engineer
              </button>
              <button
                type="button"
                className={`chip ${selectedJDPreset === 'openai_applied_ai' ? 'active' : ''}`}
                onClick={() => handleSelectJDPreset('openai_applied_ai')}
              >
                🤖 Scale AI - Staff AI & RAG Engineer
              </button>
              <button
                type="button"
                className={`chip ${selectedJDPreset === 'datadog_product_lead' ? 'active' : ''}`}
                onClick={() => handleSelectJDPreset('datadog_product_lead')}
              >
                📈 CloudScale - Lead Product Manager
              </button>
            </div>

            <textarea
              className="custom-textarea"
              rows={15}
              placeholder="Paste the target Job Description (JD) here, including responsibilities, minimum qualifications, and tech stack..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: '1.45' }}
            />
          </div>
        )}

        {/* TAB 3: CUSTOM DIRECTIVES */}
        {activeTab === 'directives' && (
          <DirectiveControls
            directives={directives}
            onChangeDirectives={setDirectives}
          />
        )}

        {/* Agent Run Action Bar */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🛡️ <strong>Consent Mode Active</strong>: Proposed bullet rewrites will be previewed for your approval.
          </div>

          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={onRunAgent}
            disabled={isRunningAgent || !resumeText.trim() || !jdText.trim()}
            style={{ minWidth: '240px' }}
          >
            {isRunningAgent ? (
              <>
                <RefreshCw size={18} className="spin" />
                Agents Executing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Shield & Optimize Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
