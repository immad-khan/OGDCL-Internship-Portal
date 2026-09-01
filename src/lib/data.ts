import { db, hasDatabase } from "@/db";
import {
  interns,
  supervisors,
  tasks,
  messages,
  reports,
} from "@/db/schema";
import { eq, desc, asc, count, and, gte, lte, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { mockInterns, mockMessages, mockReports, mockSupervisor, mockTasks } from "@/lib/mock-data";

export async function getSupervisor() {
  if (!hasDatabase) return mockSupervisor;
  await ensureSeeded();
  const rows = await db.select().from(supervisors).limit(1);
  return rows[0] ?? null;
}

export async function getInterns() {
  if (!hasDatabase) return mockInterns;
  await ensureSeeded();
  const rows = await db
    .select({
      id: interns.id,
      name: interns.name,
      email: interns.email,
      phone: interns.phone,
      department: interns.department,
      university: interns.university,
      degree: interns.degree,
      cgpa: interns.cgpa,
      startDate: interns.startDate,
      endDate: interns.endDate,
      status: interns.status,
      createdAt: interns.createdAt,
      taskCount: count(tasks.id),
      completedCount: count(sql`case when ${tasks.status} = 'completed' then 1 end`),
    })
    .from(interns)
    .leftJoin(tasks, eq(tasks.internId, interns.id))
    .groupBy(interns.id)
    .orderBy(desc(interns.createdAt));
  return rows;
}

export async function getInternById(id: number) {
  if (!hasDatabase) {
    const intern = mockInterns.find((item) => item.id === id);
    return intern ? {
      intern,
      tasks: mockTasks.filter((item) => item.internId === id),
      messages: mockMessages.filter((item) => item.internId === id),
      reports: mockReports.filter((item) => item.internId === id),
    } : null;
  }
  await ensureSeeded();
  const [intern] = await db.select().from(interns).where(eq(interns.id, id)).limit(1);
  if (!intern) return null;
  const internTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.internId, id))
    .orderBy(desc(tasks.createdAt));
  const internMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.internId, id))
    .orderBy(asc(messages.createdAt));
  const internReports = await db
    .select()
    .from(reports)
    .where(eq(reports.internId, id))
    .orderBy(desc(reports.createdAt));
  return { intern, tasks: internTasks, messages: internMessages, reports: internReports };
}

export async function getTasks() {
  if (!hasDatabase) return mockTasks;
  await ensureSeeded();
  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      category: tasks.category,
      priority: tasks.priority,
      status: tasks.status,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
      internId: tasks.internId,
      internName: interns.name,
      internDepartment: interns.department,
    })
    .from(tasks)
    .leftJoin(interns, eq(tasks.internId, interns.id))
    .orderBy(desc(tasks.createdAt));
  return rows;
}

export async function getConversations() {
  if (!hasDatabase) {
    return mockInterns.map(({ taskCount: _taskCount, completedCount: _completedCount, ...intern }) => {
      const thread = mockMessages.filter((item) => item.internId === intern.id);
      return { intern, lastMessage: thread.at(-1) ?? null, unread: thread.filter((item) => item.role === "intern" && !item.read).length };
    });
  }
  await ensureSeeded();
  const internList = await db.select().from(interns).orderBy(asc(interns.name));
  const conversationList = [];
  for (const intern of internList) {
    const [last] = await db
      .select()
      .from(messages)
      .where(eq(messages.internId, intern.id))
      .orderBy(desc(messages.createdAt))
      .limit(1);
    const unread = await db
      .select({ n: count() })
      .from(messages)
      .where(and(eq(messages.internId, intern.id), eq(messages.role, "intern"), eq(messages.read, false)));
    conversationList.push({
      intern,
      lastMessage: last ?? null,
      unread: unread[0]?.n ?? 0,
    });
  }
  return conversationList;
}

export async function getMessagesForIntern(internId: number) {
  if (!hasDatabase) return mockMessages.filter((item) => item.internId === internId);
  await ensureSeeded();
  return db
    .select()
    .from(messages)
    .where(eq(messages.internId, internId))
    .orderBy(asc(messages.createdAt));
}

export async function getReports() {
  if (!hasDatabase) return mockReports;
  await ensureSeeded();
  const rows = await db
    .select({
      id: reports.id,
      title: reports.title,
      content: reports.content,
      status: reports.status,
      rating: reports.rating,
      createdAt: reports.createdAt,
      internId: reports.internId,
      internName: interns.name,
      internDepartment: interns.department,
    })
    .from(reports)
    .leftJoin(interns, eq(reports.internId, interns.id))
    .orderBy(desc(reports.createdAt));
  return rows;
}

export async function getDashboardData() {
  if (!hasDatabase) {
    const taskByStatus: Record<string, number> = { todo: 0, in_progress: 0, review: 0, completed: 0 };
    const taskByPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    for (const task of mockTasks) {
      taskByStatus[task.status] += 1;
      taskByPriority[task.priority] += 1;
    }
    const totalTasks = mockTasks.length;
    const completedTasks = taskByStatus.completed;
    return {
      totalInterns: mockInterns.length,
      activeInterns: mockInterns.filter((item) => item.status === "active").length,
      totalTasks,
      completedTasks,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      taskByStatus,
      taskByPriority,
      unreadMessages: mockMessages.filter((item) => item.role === "intern" && !item.read).length,
      pendingReports: mockReports.filter((item) => item.status === "submitted").length,
      recentMessages: mockMessages.map((message) => {
        const intern = mockInterns.find((item) => item.id === message.internId)!;
        return { ...message, internName: intern.name, internDepartment: intern.department };
      }),
      upcomingTasks: mockTasks.filter((item) => item.status !== "completed").map(({ description: _description, createdAt: _createdAt, internDepartment: _internDepartment, ...task }) => task),
      recentInterns: mockInterns.map(({ taskCount: _taskCount, completedCount: _completedCount, ...intern }) => intern),
      weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, index) => ({ label, count: [2, 4, 3, 5, 2, 1, 0][index] })),
    };
  }
  await ensureSeeded();

  const [internCount] = await db.select({ n: count() }).from(interns);
  const [activeCount] = await db
    .select({ n: count() })
    .from(interns)
    .where(eq(interns.status, "active"));

  const taskRows = await db
    .select({ status: tasks.status, priority: tasks.priority })
    .from(tasks);

  const taskByStatus: Record<string, number> = { todo: 0, in_progress: 0, review: 0, completed: 0 };
  const taskByPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  for (const t of taskRows) {
    taskByStatus[t.status] = (taskByStatus[t.status] ?? 0) + 1;
    taskByPriority[t.priority] = (taskByPriority[t.priority] ?? 0) + 1;
  }

  const [unreadCount] = await db
    .select({ n: count() })
    .from(messages)
    .where(and(eq(messages.role, "intern"), eq(messages.read, false)));

  const [pendingReports] = await db
    .select({ n: count() })
    .from(reports)
    .where(eq(reports.status, "submitted"));

  const totalTasks = taskRows.length;
  const completedTasks = taskByStatus.completed;

  const recentMessages = await db
    .select({
      id: messages.id,
      content: messages.content,
      role: messages.role,
      senderName: messages.senderName,
      createdAt: messages.createdAt,
      internId: messages.internId,
      internName: interns.name,
      internDepartment: interns.department,
    })
    .from(messages)
    .leftJoin(interns, eq(messages.internId, interns.id))
    .orderBy(desc(messages.createdAt))
    .limit(6);

  const upcomingTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      dueDate: tasks.dueDate,
      priority: tasks.priority,
      status: tasks.status,
      category: tasks.category,
      internId: tasks.internId,
      internName: interns.name,
    })
    .from(tasks)
    .leftJoin(interns, eq(tasks.internId, interns.id))
    .where(sql`${tasks.status} != 'completed'`)
    .orderBy(asc(tasks.dueDate))
    .limit(6);

  const recentInterns = await db
    .select()
    .from(interns)
    .orderBy(desc(interns.createdAt))
    .limit(5);

  // weekly activity bar data (last 7 days task+message activity)
  const weekly: Array<{ label: string; count: number }> = [];
  const now = new Date();
  const taskCreated = await db.select({ createdAt: tasks.createdAt, dp: sql`1` }).from(tasks);
  const msgCreated = await db.select({ createdAt: messages.createdAt, dp: sql`1` }).from(messages);
  const events = [
    ...taskCreated.map((e) => ({ at: new Date(e.createdAt).getTime(), n: 1 })),
    ...msgCreated.map((e) => ({ at: new Date(e.createdAt).getTime(), n: 1 })),
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    let c = 0;
    for (const e of events) {
      if (e.at >= dayStart.getTime() && e.at < dayEnd.getTime()) c += e.n;
    }
    weekly.push({ label: dayNames[dayStart.getDay()], count: c });
  }

  return {
    totalInterns: internCount?.n ?? 0,
    activeInterns: activeCount?.n ?? 0,
    totalTasks,
    completedTasks,
    completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    taskByStatus,
    taskByPriority,
    unreadMessages: unreadCount?.n ?? 0,
    pendingReports: pendingReports?.n ?? 0,
    recentMessages,
    upcomingTasks,
    recentInterns,
    weekly,
  };
}
