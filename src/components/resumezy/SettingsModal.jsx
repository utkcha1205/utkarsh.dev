import React, { useState, useEffect, useRef } from 'react';
import { X, Key, Check, AlertCircle, Sparkles, ExternalLink, Cpu, RefreshCw, Layers, Zap } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  selectedModel,
  onSaveModel
}) {
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [localModel, setLocalModel] = useState(selectedModel || 'auto');
  const [autoDetectedModelName, setAutoDetectedModelName] = useState('');
  const [testStatus, setTestStatus] = useState(null); // 'testing', 'success', 'error'
  const [testMessage, setTestMessage] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const debounceTimerRef = useRef(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalKey(apiKey || '');
      setLocalModel(selectedModel || 'auto');
      setTestStatus(null);
      setTestMessage('');
      if (apiKey && apiKey.length > 20) {
        detectBestModel(apiKey.trim(), false);
      }
    }
  }, [isOpen, apiKey, selectedModel]);

  // Automatically detect model when typing or pasting API key
  const handleKeyChange = (e) => {
    const val = e.target.value;
    setLocalKey(val);
    setTestStatus(null);
    setTestMessage('');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length >= 30) {
      debounceTimerRef.current = setTimeout(() => {
        detectBestModel(val.trim(), false);
      }, 700);
    }
  };

  /**
   * Queries Google AI Studio with the user's API key to find all models
   * and automatically selects the highest performance model (e.g. gemini-3.6-flash)
   */
  const detectBestModel = async (keyToTest, showFeedback = true) => {
    if (!keyToTest) return;

    setIsDetecting(true);
    if (showFeedback) {
      setTestStatus('testing');
      setTestMessage('Connecting to Google AI Studio & auto-detecting best model for your key...');
    }

    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keyToTest}`);
      
      if (!modelsRes.ok) {
        const errJson = await modelsRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'Invalid API Key or project permissions.');
      }

      const modelsData = await modelsRes.json();
      const rawList = modelsData.models || [];

      // Filter to models that support text generation
      const usableModels = rawList
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => {
          const modelId = m.name.replace(/^models\//, '');
          return {
            id: modelId,
            displayName: m.displayName || modelId,
            description: m.description || ''
          };
        });

      if (usableModels.length > 0) {
        setAvailableModels(usableModels);

        // Smart Ranking:
        // 1. gemini-3.6-flash (Latest recommended by Google)
        // 2. gemini-2.5-flash
        // 3. gemini-1.5-flash
        // 4. any other flash model
        // 5. gemini-2.5-pro / gemini-1.5-pro
        const priorityOrder = [
          'gemini-3.6-flash',
          'gemini-2.5-flash',
          'gemini-1.5-flash',
          'gemini-2.5-pro',
          'gemini-1.5-pro'
        ];

        let bestModelId = null;
        for (const p of priorityOrder) {
          if (usableModels.some(m => m.id === p)) {
            bestModelId = p;
            break;
          }
        }

        if (!bestModelId) {
          const flashModel = usableModels.find(m => m.id.includes('flash'));
          bestModelId = flashModel ? flashModel.id : usableModels[0].id;
        }

        const bestModelObj = usableModels.find(m => m.id === bestModelId);
        setAutoDetectedModelName(bestModelObj?.displayName || bestModelId);

        if (localModel === 'auto' || !localModel) {
          setLocalModel(bestModelId);
        }

        // Run quick ping test
        const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${bestModelId}:generateContent?key=${keyToTest}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Respond with OK' }] }]
          })
        });

        if (testRes.ok) {
          setTestStatus('success');
          setTestMessage(`✨ Auto-Selected Best Model: ${bestModelObj?.displayName || bestModelId} (${usableModels.length} models accessible on your key)`);
        } else {
          const testErr = await testRes.json().catch(() => ({}));
          throw new Error(testErr.error?.message || `Auto-test failed for ${bestModelId}.`);
        }
      } else {
        setTestStatus('success');
        setTestMessage('API Key is valid.');
      }

    } catch (err) {
      console.error("Model detection error:", err);
      if (showFeedback) {
        setTestStatus('error');
        setTestMessage(err.message || 'Verification failed. Please check your API key.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(localKey.trim());
    onSaveModel(localModel);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 6, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        background: 'rgba(14, 20, 36, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div className="panel-header" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="panel-title">
            <Key size={18} style={{ color: '#818cf8' }} />
            Google Gemini API Configuration
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="panel-body">
          {/* Smart Auto-Selection Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} style={{ color: '#06b6d4' }} />
                Auto-Select Best Model Enabled
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                ZERO CONFIG REQUIRED
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45' }}>
              Paste your API key below and Resumezy will <strong>automatically inspect your Google AI Studio project and pick the best, highest-speed model</strong> (such as <code>gemini-3.6-flash</code>) with zero manual setup.
            </div>
          </div>

          {/* Key Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontSize: '0.725rem' }}
              >
                Get API Key from Google AI Studio <ExternalLink size={10} />
              </a>
            </label>
            <input
              type="password"
              className="custom-input"
              placeholder="Paste your API key (AIzaSy...)"
              value={localKey}
              onChange={handleKeyChange}
            />
          </div>

          {/* Auto-Detected Model Indicator */}
          {autoDetectedModelName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              marginBottom: '1rem',
              fontSize: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
                <Check size={14} />
                <span>
                  <strong>Best Model Auto-Selected:</strong> {autoDetectedModelName} ({localModel})
                </span>
              </div>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                Fastest & Highest Quality
              </span>
            </div>
          )}

          {/* Model Selector (Advanced override) */}
          <div className="form-group">
            <label className="form-label">
              <span>Model Selection (Auto-Managed)</span>
              {availableModels.length > 0 && (
                <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                  {availableModels.length} models accessible
                </span>
              )}
            </label>
            <select
              className="custom-input"
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
            >
              <option value="auto">⚡ Auto-Select Best Model (Recommended)</option>
              {availableModels.length > 0 ? (
                availableModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.displayName} ({m.id})
                  </option>
                ))
              ) : (
                <>
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash (Latest)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </>
              )}
            </select>
          </div>

          {/* Test / Detection Status Message */}
          {testMessage && (
            <div style={{
              fontSize: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              background: testStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: testStatus === 'success' ? '#34d399' : '#fb7185',
              border: `1px solid ${testStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              lineHeight: '1.4'
            }}>
              {testMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => detectBestModel(localKey.trim(), true)}
              disabled={isDetecting || !localKey.trim()}
            >
              {isDetecting ? (
                <>
                  <RefreshCw size={13} className="spin" />
                  Auto-Detecting Best Model...
                </>
              ) : (
                <>
                  <Sparkles size={13} style={{ color: '#818cf8' }} />
                  Re-Test & Auto-Detect
                </>
              )}
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSave}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
