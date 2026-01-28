// IndexedDB with Dexie for task persistence

import Dexie, { type EntityTable } from "dexie";
import { Task, DayKey, WeekKey } from "./types";
import { getWeekDays, getTodayKey } from "./week";

// Database schema
const db = new Dexie("FlowWeekDB") as Dexie & {
  tasks: EntityTable<Task, "id">;
};

db.version(1).stores({
  tasks: "id, day, status, createdAt, updatedAt",
});

// Task operations
export async function getAllTasks(): Promise<Task[]> {
  return db.tasks.toArray();
}

export async function getTasksByWeek(weekKey: WeekKey): Promise<Task[]> {
  const days = getWeekDays(weekKey);
  const dayKeys = days.map((d) => d.dayKey);
  return db.tasks.where("day").anyOf(dayKeys).toArray();
}

export async function getTasksByDay(dayKey: DayKey): Promise<Task[]> {
  return db.tasks.where("day").equals(dayKey).toArray();
}

export async function addTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">,
): Promise<Task> {
  const now = Date.now();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.tasks.add(newTask);
  return newTask;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>,
): Promise<void> {
  await db.tasks.update(id, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id);
}

export async function clearAllTasks(): Promise<void> {
  await db.tasks.clear();
}

// Bulk operations
export async function addBulkTasks(
  titles: string[],
  dayKey: DayKey = getTodayKey(),
): Promise<Task[]> {
  const now = Date.now();
  const tasks: Task[] = titles
    .filter((title) => title.trim())
    .map((title, i) => ({
      id: crypto.randomUUID(),
      title: title.trim(),
      status: "todo" as const,
      day: dayKey,
      createdAt: now + i,
      updatedAt: now + i,
    }));

  await db.tasks.bulkAdd(tasks);
  return tasks;
}

// Demo data
export async function seedDemoTasks(weekKey: WeekKey): Promise<Task[]> {
  const days = getWeekDays(weekKey);
  const demoTasks = [
    {
      title: "Review project roadmap",
      tag: "work" as const,
      day: days[0].dayKey,
    },
    {
      title: "Team standup meeting",
      tag: "work" as const,
      day: days[0].dayKey,
    },
    { title: "Gym session", tag: "personal" as const, day: days[0].dayKey },
    {
      title: "Code review for PR #42",
      tag: "work" as const,
      day: days[1].dayKey,
    },
    {
      title: "Lunch with Sarah",
      tag: "personal" as const,
      day: days[1].dayKey,
    },
    { title: "Sprint planning", tag: "work" as const, day: days[2].dayKey },
    { title: "Buy groceries", tag: "personal" as const, day: days[2].dayKey },
    {
      title: "Deploy v2.0 to staging",
      tag: "work" as const,
      day: days[3].dayKey,
    },
    {
      title: "Doctor appointment",
      tag: "personal" as const,
      day: days[3].dayKey,
    },
    { title: "Write documentation", tag: "work" as const, day: days[4].dayKey },
    {
      title: "Friday team retrospective",
      tag: "work" as const,
      day: days[4].dayKey,
    },
    { title: "Date night", tag: "personal" as const, day: days[5].dayKey },
    { title: "Clean apartment", tag: "personal" as const, day: days[5].dayKey },
    {
      title: "Weekly review & planning",
      tag: "personal" as const,
      day: days[6].dayKey,
    },
  ];

  const now = Date.now();
  const tasks: Task[] = demoTasks.map((t, i) => ({
    id: crypto.randomUUID(),
    title: t.title,
    tag: t.tag,
    status: "todo" as const,
    day: t.day,
    notes: undefined,
    createdAt: now + i,
    updatedAt: now + i,
  }));

  await db.tasks.bulkAdd(tasks);
  return tasks;
}

export { db };
