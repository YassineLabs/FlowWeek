"use client";

import { useState } from "react";

interface SettingsDrawerProps {
  onClearAllData: () => void;
  onSeedDemo: () => void;
  theme: "dark" | "light";
  onThemeChange: (value: "dark" | "light") => void;
  showWeekends: boolean;
  onToggleWeekends: (value: boolean) => void;
}

export function SettingsDrawer({
  onClearAllData,
  onSeedDemo,
  theme,
  onThemeChange,
  showWeekends,
  onToggleWeekends,
}: SettingsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      onClearAllData();
      setConfirmClear(false);
      setIsOpen(false);
    } else {
      setConfirmClear(true);
    }
  };

  return (
    <>
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsOpen(false)} />
          <aside className="settings-drawer">
            <header className="drawer-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            <div className="drawer-content">
              <section className="settings-section">
                <h3>View</h3>
                <button
                  className="settings-btn"
                  onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
                >
                  <span>Theme</span>
                  <span style={{ marginLeft: "auto", opacity: 0.8 }}>
                    {theme === "light" ? "Light" : "Dark"}
                  </span>
                </button>
                <button
                  className="settings-btn"
                  onClick={() => onToggleWeekends(!showWeekends)}
                >
                  <span>Show weekends</span>
                  <span style={{ marginLeft: "auto", opacity: 0.8 }}>
                    {showWeekends ? "On" : "Off"}
                  </span>
                </button>
              </section>

              <section className="settings-section">
                <h3>Data</h3>

                <button className="settings-btn seed" onClick={onSeedDemo}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M4.93 4.93l2.83 2.83" />
                    <path d="M16.24 16.24l2.83 2.83" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                    <path d="M4.93 19.07l2.83-2.83" />
                    <path d="M16.24 7.76l2.83-2.83" />
                  </svg>
                  Load Demo Tasks
                </button>

                <button
                  className={`settings-btn danger ${confirmClear ? "confirm" : ""}`}
                  onClick={handleClear}
                  onBlur={() => setConfirmClear(false)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  {confirmClear ? "Click again to confirm" : "Clear All Data"}
                </button>
              </section>

              <section className="settings-section">
                <h3>About</h3>
                <p className="settings-about">
                  FlowWeek is a minimal weekly planner that works offline. All
                  data is stored locally on your device.
                </p>
                <p className="settings-version">v1.0.0</p>
              </section>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
