"use client";

import { useState, useRef, useEffect } from "react";
import { DayKey, TaskTag } from "@/lib/types";

interface AddTaskProps {
  dayKey: DayKey;
  onAdd: (title: string, notes?: string, tag?: TaskTag) => void;
}

export function AddTask({ dayKey, onAdd }: AddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState<TaskTag | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim(), notes.trim() || undefined, tag);
      setTitle("");
      setNotes("");
      setTag(undefined);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setTitle("");
      setNotes("");
      setTag(undefined);
    }
  };

  if (!isOpen) {
    return (
      <button className="add-task-btn" onClick={() => setIsOpen(true)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add task
      </button>
    );
  }

  return (
    <div className="add-task-form" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        type="text"
        className="add-task-input"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="add-task-notes"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="add-task-tags">
        <button
          className={`tag-btn work ${tag === "work" ? "active" : ""}`}
          onClick={() => setTag(tag === "work" ? undefined : "work")}
        >
          Work
        </button>
        <button
          className={`tag-btn personal ${tag === "personal" ? "active" : ""}`}
          onClick={() => setTag(tag === "personal" ? undefined : "personal")}
        >
          Personal
        </button>
      </div>
      <div className="add-task-actions">
        <button className="cancel-btn" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!title.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
