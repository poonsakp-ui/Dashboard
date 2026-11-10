/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { StandaloneCodeView } from './components/StandaloneCodeView';
import { FirebaseConfigView } from './components/FirebaseConfigView';
import { QRCodeModal } from './components/QRCodeModal';
import { getStoredResponses, subscribeToLiveUpdates } from './utils/storage';
import { calculateSummaryStats } from './utils/evaluation';
import { SurveyResponse } from './types/survey';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [firebaseDbUrl, setFirebaseDbUrl] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('training_firebase_db_url')) || '';
  });
  const [isFirebaseActive, setIsFirebaseActive] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('training_firebase_active') === 'true') || false;
  });

  // Sync dark theme on html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_dark', 'false');
    }
  }, [isDark]);

  // Read URL query parameter on initial load (e.g., ?tab=survey or ?tab=dashboard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as ActiveTab | null;
      if (tabParam && ['survey', 'dashboard', 'code-guide', 'firebase-config'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Initialize responses & subscribe to instant live updates
  useEffect(() => {
    setResponses(getStoredResponses());

    const unsubscribe = subscribeToLiveUpdates((latest) => {
      setResponses(latest);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Calculate live statistics
  const stats = useMemo(() => {
    return calculateSummaryStats(responses);
  }, [responses]);

  // Construct target survey URL for QR Code and sharing
  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?tab=survey`;
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const handleSaveFirebaseConfig = (cfg: { databaseURL: string }) => {
    setFirebaseDbUrl(cfg.databaseURL);
    localStorage.setItem('training_firebase_db_url', cfg.databaseURL);
    localStorage.setItem('training_firebase_active', 'true');
    setIsFirebaseActive(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        isFirebaseConnected={isFirebaseActive && !!firebaseDbUrl}
        totalResponses={responses.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <SurveyView
            onSubmittedSuccess={() => {
              // Refresh responses
              setResponses(getStoredResponses());
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            stats={stats}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {activeTab === 'code-guide' && <StandaloneCodeView />}

        {activeTab === 'firebase-config' && (
          <FirebaseConfigView
            onSaveConfig={handleSaveFirebaseConfig}
            currentDatabaseURL={firebaseDbUrl}
            isFirebaseActive={isFirebaseActive}
            setIsFirebaseActive={(active) => {
              setIsFirebaseActive(active);
              localStorage.setItem('training_firebase_active', String(active));
            }}
          />
        )}
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />
    </div>
  );
}
