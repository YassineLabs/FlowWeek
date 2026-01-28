"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { Task, TaskStatus, TaskTag, WeekKey } from "@/lib/types";
import { getWeekDays, getNextDayKey, isInDifferentWeek } from "@/lib/week";

interface TaskItemProps {
  task: Task;
  weekKey: WeekKey;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPostpone: (id: string, newDay: string, movedToNextWeek: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    updates: { title?: string; notes?: string; tag?: TaskTag },
  ) => void;
}

export function TaskItem({
  task,
  weekKey,
  onStatusChange,
  onPostpone,
  onDelete,
  onUpdate,
}: TaskItemProps): JSX.Element {
  const [showPostpone, setShowPostpone] = useState(false);
  const days = getWeekDays(weekKey);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes ?? "");
  const [editTag, setEditTag] = useState<TaskTag | undefined>(task.tag);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const handlePostpone = (targetDay: string) => {
    const movedToNextWeek = isInDifferentWeek(targetDay, weekKey);
    onPostpone(task.id, targetDay, movedToNextWeek);
    setShowPostpone(false);
  };

  const handleQuickPostpone = () => {
    const nextDay = getNextDayKey(task.day);
    const movedToNextWeek = isInDifferentWeek(nextDay, weekKey);
    onPostpone(task.id, nextDay, movedToNextWeek);
  };

  const handleSaveEdits = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      // If title is cleared, revert changes and exit edit mode
      setEditTitle(task.title);
      setEditNotes(task.notes ?? "");
      setEditTag(task.tag);
      setIsEditing(false);
      return;
    }

    onUpdate(task.id, {
      title: trimmedTitle,
      notes: editNotes.trim() || undefined,
      tag: editTag,
    });
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setEditTitle(task.title);
    setEditNotes(task.notes ?? "");
    setEditTag(task.tag);
    setIsEditing(false);
  };

  const handleEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdits();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdits();
    }
  };

  return (
    <div className={`task-item status-${task.status}`}>
      <div
        className="task-content"
        onClick={() => {
          if (!isEditing) {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? (
          <div className="task-edit">
            <input
              ref={titleInputRef}
              type="text"
              className="add-task-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleEditKeyDown}
            />
            <input
              type="text"
              className="add-task-notes"
              placeholder="Notes (optional)"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              onKeyDown={handleEditKeyDown}
            />
            <div className="add-task-tags">
              <button
                className={`tag-btn work ${editTag === "work" ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTag(editTag === "work" ? undefined : "work");
                }}
                onKeyDown={handleEditKeyDown}
                type="button"
              >
                Work
              </button>
              <button
                className={`tag-btn personal ${editTag === "personal" ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTag(editTag === "personal" ? undefined : "personal");
                }}
                onKeyDown={handleEditKeyDown}
                type="button"
              >
                Personal
              </button>
              <button
                className="submit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdits();
                }}
                onKeyDown={handleEditKeyDown}
                type="button"
              >
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdits();
                }}
                onKeyDown={handleEditKeyDown}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="task-title">{task.title}</span>
            {task.tag && (
              <span className={`task-tag ${task.tag}`}>{task.tag}</span>
            )}
            {task.notes && <span className="task-notes">{task.notes}</span>}
          </>
        )}
      </div>

      <div className="task-actions">
        <button
          className={`action-btn done ${task.status === "done" ? "active" : ""}`}
          onClick={() =>
            onStatusChange(task.id, task.status === "done" ? "todo" : "done")
          }
          aria-label="Mark done"
          title="Done"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </button>

        <button
          className={`action-btn blocked ${task.status === "blocked" ? "active" : ""}`}
          onClick={() =>
            onStatusChange(
              task.id,
              task.status === "blocked" ? "todo" : "blocked",
            )
          }
          aria-label="Mark blocked"
          title="Blocked"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </button>

        <div className="postpone-wrapper">
          <button
            className="action-btn postpone"
            onClick={() => setShowPostpone(!showPostpone)}
            aria-label="Postpone"
            title="Postpone"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>

          {showPostpone && (
            <div className="postpone-menu">
              <button
                className="postpone-option quick"
                onClick={handleQuickPostpone}
              >
                Tomorrow →
              </button>
              <div className="postpone-divider" />
              {days.map((day) => (
                <button
                  key={day.dayKey}
                  className={`postpone-option ${day.dayKey === task.day ? "current" : ""}`}
                  onClick={() => handlePostpone(day.dayKey)}
                  disabled={day.dayKey === task.day}
                >
                  {day.dayName} {day.dayNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="action-btn delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
