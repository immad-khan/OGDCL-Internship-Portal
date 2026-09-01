const createdAt = new Date("2026-08-28T09:00:00Z");

export const mockSupervisor = {
  id: 1,
  name: "Engr. Ahmed Raza",
  email: "ahmed.raza@ogdcl.com",
  designation: "Deputy Manager — HR & Administration",
  department: "Human Resources",
  phone: "+92 51 920 9000",
  region: "Islamabad Head Office",
};

export const mockInterns = [
  [1, "Fatima Noor", "fatima.noor@ogdcl.com", "Petroleum Engineering", "NUST", "BSc Petroleum Engineering", "3.81", "active"],
  [2, "Hamza Sheikh", "hamza.sheikh@ogdcl.com", "Geology", "University of Peshawar", "MSc Geology", "3.64", "active"],
  [3, "Ayesha Khan", "ayesha.khan@ogdcl.com", "Chemical Engineering", "UET Lahore", "BSc Chemical Engineering", "3.72", "active"],
  [4, "Bilal Ahmed", "bilal.ahmed@ogdcl.com", "Mechanical Engineering", "GIKI", "BSc Mechanical Engineering", "3.55", "active"],
  [5, "Mariam Tariq", "mariam.tariq@ogdcl.com", "Electrical Engineering", "NED University", "BE Electrical Engineering", "3.49", "on_hold"],
].map(([id, name, email, department, university, degree, cgpa, status], index) => ({
  id: Number(id), name: String(name), email: String(email), phone: null, department: String(department), university: String(university), degree: String(degree), cgpa: String(cgpa),
  startDate: "2026-03-02", endDate: "2026-09-03", status: status as "active" | "on_hold", supervisorId: 1,
  createdAt: new Date(createdAt.getTime() - index * 86_400_000), taskCount: index === 0 ? 2 : 1, completedCount: index === 3 ? 1 : 0,
}));

export const mockTasks = [
  [1, 1, "Analyze wellbore pressure data for Tal Block", "Compile the flowing and shut-in pressure dataset.", "Wellsite Analysis", "high", "in_progress", "2026-09-04"],
  [2, 2, "Digitise structural contour maps", "Convert scanned maps into editable GIS layers.", "Geology", "medium", "todo", "2026-09-18"],
  [3, 3, "Optimise gas separation unit parameters", "Model the separator train and propose tuning recommendations.", "Process", "high", "in_progress", "2026-09-22"],
  [4, 4, "CAD drawings for skid redesign", "Update the skid mounting layout in AutoCAD.", "Design", "low", "completed", "2026-08-10"],
  [5, 5, "Substation load-flow study", "Run load-flow analysis on the distribution network.", "Electrical", "high", "review", "2026-09-30"],
].map(([id, internId, title, description, category, priority, status, dueDate], index) => {
  const intern = mockInterns.find((item) => item.id === internId)!;
  return { id: Number(id), internId: Number(internId), title: String(title), description: String(description), category: String(category), priority: priority as "low" | "medium" | "high", status: status as "todo" | "in_progress" | "review" | "completed", dueDate: String(dueDate), createdAt: new Date(createdAt.getTime() - index * 3_600_000), internName: intern.name, internDepartment: intern.department };
});

export const mockMessages = [
  [1, 1, "Fatima Noor", "intern", "I have almost finished the pressure dataset and will share it by Wednesday evening."],
  [2, 2, "Hamza Sheikh", "intern", "The structural contour mapping is now 60% complete."],
  [3, 3, "Engr. Ahmed Raza", "supervisor", "Please attach the sensitivity analysis for review."],
].map(([id, internId, senderName, role, content], index) => ({ id: Number(id), internId: Number(internId), senderName: String(senderName), role: String(role), content: String(content), read: index !== 0, createdAt: new Date(createdAt.getTime() - index * 7_200_000) }));

export const mockReports = [
  [1, 1, "Weekly Progress — Week 4", "Completed the pressure dataset and began anomaly mapping.", "submitted", 4],
  [2, 3, "Gas Separation Optimisation", "Proposed tuning improved recovery by about 2.1%.", "submitted", 4],
  [3, 4, "Skid Redesign Summary", "Finalised CAD drawings and updated the revision register.", "approved", 5],
].map(([id, internId, title, content, status, rating], index) => {
  const intern = mockInterns.find((item) => item.id === internId)!;
  return { id: Number(id), internId: Number(internId), title: String(title), content: String(content), status: status as "submitted" | "approved", rating: Number(rating), createdAt: new Date(createdAt.getTime() - index * 10_800_000), internName: intern.name, internDepartment: intern.department };
});
