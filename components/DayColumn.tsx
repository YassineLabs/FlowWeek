"use client";

import { useState } from "react";
import { Task, DayData, TaskStatus, TaskTag, WeekKey } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { InlineTaskEditor } from "./InlineTaskEditor";

interface DayColumnProps {
  day: DayData;
  tasks: Task[];
  weekKey: WeekKey;
  onAddTask: (
    dayKey: string,
    title: string,
    notes?: string,
    tag?: TaskTag,
  ) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPostpone: (id: string, newDay: string, movedToNextWeek: boolean) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (
    id: string,
    updates: { title?: string; notes?: string; tag?: TaskTag },
  ) => void;
}

export function DayColumn({
  day,
  tasks,
  weekKey,
  onAddTask,
  onStatusChange,
  onPostpone,
  onDeleteTask,
  onUpdateTask,
}: DayColumnProps) {
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  const [isExpanded, setIsExpanded] = useState(day.isToday);

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort: todo first, then blocked, then done
    const order: Record<TaskStatus, number> = { todo: 0, blocked: 1, done: 2 };
    return order[a.status] - order[b.status] || a.createdAt - b.createdAt;
  });

  const isCollapsedView = !day.isToday && !isExpanded;
  const visibleTasks = isCollapsedView ? sortedTasks.slice(0, 3) : sortedTasks;

  return (
    <article
      className={`day-column  day-${day.dayName.toLowerCase()} ${
        day.isToday ? "today" : ""
      }`}
    >
      <header className="day-header">
        <div className="day-title">
          <span className="day-name">{day.dayName}</span>
          {/* {day.isToday && <span className="today-badge">Today</span>} */}
          <span className="day-date">
            {day.dayNumber}/{day.monthName}
          </span>
        </div>
        <div className="day-counter">
          <span className="counter-done">{doneTasks}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">{totalTasks}</span>
        </div>
      </header>

      <div className={`day-tasks ${isCollapsedView ? "collapsed" : ""}`}>
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            weekKey={weekKey}
            onStatusChange={onStatusChange}
            onPostpone={onPostpone}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}

        {/* Inline editor at the bottom of tasks - xTiles style */}
        <InlineTaskEditor
          onAdd={(title, notes, tag) =>
            onAddTask(day.dayKey, title, notes, tag)
          }
          placeholder="Type a task..."
        />
      </div>

      {!day.isToday && sortedTasks.length > 3 && (
        <div className="day-footer">
          <button
            className="add-task-btn"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isCollapsedView ? "More" : "Less"}
          </button>
        </div>
      )}
    </article>
  );
}
