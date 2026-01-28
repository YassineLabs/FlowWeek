"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, TaskTag, DayKey, WeekKey } from "@/lib/types";
import { getCurrentWeekKey, getWeekData, getTodayKey } from "@/lib/week";
import {
  getTasksByWeek,
  addTask,
  updateTask,
  deleteTask,
  addBulkTasks,
  clearAllTasks,
  seedDemoTasks,
} from "@/lib/db";
import { WeekHeader } from "@/components/WeekHeader";
import { DayColumn } from "@/components/DayColumn";
import { QuickDump } from "@/components/QuickDump";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { Toast } from "@/components/Toast";

export default function HomePage() {
  const [weekKey, setWeekKey] = useState<WeekKey>(getCurrentWeekKey());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "warning";
  } | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("flowweek_theme");
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  const [showWeekends, setShowWeekends] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("flowweek_showWeekends");
    return stored === "true";
  });

  const [isTodayModalOpen, setIsTodayModalOpen] = useState(false);

  const weekData = getWeekData(weekKey);
  const todayKey = getTodayKey();
  const todayDay = weekData.days.find((day) => day.dayKey === todayKey);

  const visibleDays = weekData.days.filter((day) => {
    const isWeekend = day.dayName === "Sat" || day.dayName === "Sun";
    return showWeekends || !isWeekend;
  });

  // Load tasks from DB
  const loadTasks = useCallback(async () => {
    try {
      const weekTasks = await getTasksByWeek(weekKey);
      setTasks(weekTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setToast({ message: "Failed to load tasks", type: "warning" });
    } finally {
      setIsLoading(false);
    }
  }, [weekKey]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add task
  const handleAddTask = async (
    dayKey: DayKey,
    title: string,
    notes?: string,
    tag?: TaskTag,
  ) => {
    try {
      const newTask = await addTask({
        title,
        notes,
        tag,
        status: "todo",
        day: dayKey,
      });
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
      setToast({ message: "Failed to add task", type: "warning" });
    }
  };

  // Change task status
  const handleStatusChange = async (id: string, status: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: Date.now() } : t,
      ),
    );

    try {
      await updateTask(id, { status });
    } catch (error) {
      console.error("Failed to update task:", error);
      loadTasks(); // Reload on error
    }
  };

  // Postpone task
  const handlePostpone = async (
    id: string,
    newDay: DayKey,
    movedToNextWeek: boolean,
  ) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, day: newDay, updatedAt: Date.now() } : t,
      ),
    );

    try {
      await updateTask(id, { day: newDay });
      if (movedToNextWeek) {
        setToast({ message: "Task moved to next week", type: "info" });
      }
    } catch (error) {
      console.error("Failed to postpone task:", error);
      loadTasks();
    }
  };

  // Update task content (title, notes, tag)
  const handleUpdateTask = async (
    id: string,
    updates: { title?: string; notes?: string; tag?: TaskTag },
  ) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t,
      ),
    );

    try {
      await updateTask(id, updates);
    } catch (error) {
      console.error("Failed to update task content:", error);
      loadTasks();
      setToast({ message: "Failed to update task", type: "warning" });
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Reload tasks to restore state if delete failed
      loadTasks();
      setToast({ message: "Failed to delete task", type: "warning" });
    }
  };

  // Bulk add tasks
  const handleQuickDump = async (titles: string[], dayKey: DayKey) => {
    try {
      const newTasks = await addBulkTasks(titles, dayKey);
      setTasks((prev) => [...prev, ...newTasks]);
      setToast({ message: `Added ${newTasks.length} tasks`, type: "success" });
    } catch (error) {
      console.error("Failed to add tasks:", error);
      setToast({ message: "Failed to add tasks", type: "warning" });
    }
  };

  // Clear all data
  const handleClearAll = async () => {
    try {
      await clearAllTasks();
      setTasks([]);
      setToast({ message: "All data cleared", type: "info" });
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  };

  // Seed demo data
  const handleSeedDemo = async () => {
    try {
      const demoTasks = await seedDemoTasks(weekKey);
      setTasks((prev) => [...prev, ...demoTasks]);
      setToast({ message: "Demo tasks loaded", type: "success" });
    } catch (error) {
      console.error("Failed to seed demo:", error);
    }
  };

  // Get tasks for a specific day
  const getTasksForDay = (dayKey: DayKey) => {
    return tasks.filter((t) => t.day === dayKey);
  };

  // Persist weekend visibility preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "flowweek_showWeekends",
        showWeekends ? "true" : "false",
      );
    }
  }, [showWeekends]);

  // Apply and persist theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const body = window.document.body;
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    window.localStorage.setItem("flowweek_theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-left">
          <WeekHeader weekKey={weekKey} onWeekChange={setWeekKey} />
        </div>
        <div className="header-right">
          {weekKey === getCurrentWeekKey() && todayDay && (
            <button
              className="focus-today-btn"
              onClick={() => setIsTodayModalOpen(true)}
            >
              Focus today
            </button>
          )}
          <QuickDump days={weekData.days} onDump={handleQuickDump} />
          <SettingsDrawer
            onClearAllData={handleClearAll}
            onSeedDemo={handleSeedDemo}
            theme={theme}
            onThemeChange={setTheme}
            showWeekends={showWeekends}
            onToggleWeekends={setShowWeekends}
          />
        </div>
      </div>

      <main className="week-grid">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          visibleDays.map((day) => (
            <DayColumn
              key={day.dayKey}
              day={day}
              tasks={getTasksForDay(day.dayKey)}
              weekKey={weekKey}
              onAddTask={handleAddTask}
              onStatusChange={handleStatusChange}
              onPostpone={handlePostpone}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ))
        )}
      </main>

      {isTodayModalOpen && todayDay && (
        <div className="today-modal-root">
          <div
            className="modal-backdrop"
            onClick={() => setIsTodayModalOpen(false)}
          />
          <div className="today-modal" role="dialog" aria-modal="true">
            <button
              className="today-modal-close"
              onClick={() => setIsTodayModalOpen(false)}
              aria-label="Close today focus"
            >
              ×
            </button>
            <DayColumn
              day={todayDay}
              tasks={getTasksForDay(todayDay.dayKey)}
              weekKey={weekKey}
              onAddTask={handleAddTask}
              onStatusChange={handleStatusChange}
              onPostpone={handlePostpone}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
