import { db } from "@/db";
import {
  interns,
  supervisors,
  tasks,
  messages,
  reports,
} from "@/db/schema";
import { count } from "drizzle-orm";

let seeded = false;

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const rows = await db.select({ n: count() }).from(interns);
  if ((rows[0]?.n ?? 0) > 0) {
    seeded = true;
    return;
  }
  await seedDatabase();
  seeded = true;
}

export async function seedDatabase(): Promise<void> {
  const [sup] = await db
    .insert(supervisors)
    .values({
      name: "Engr. Ahmed Raza",
      email: "ahmed.raza@ogdcl.com",
      designation: "Deputy Manager — HR & Administration",
      department: "Human Resources",
      phone: "+92 51 920 9000",
      region: "Islamabad Head Office",
    })
    .returning({ id: supervisors.id });

  const supId = sup.id;

  const internRows = await db
    .insert(interns)
    .values([
      { name: "Fatima Noor", email: "fatima.noor@ogdcl.com", phone: "+92 300 1112233", department: "Petroleum Engineering", university: "NUST", degree: "BSc Petroleum Engineering", cgpa: "3.81", startDate: "2026-03-02", endDate: "2026-09-03", status: "active", supervisorId: supId },
      { name: "Hamza Sheikh", email: "hamza.sheikh@ogdcl.com", phone: "+92 321 4455667", department: "Geology", university: "University of Peshawar", degree: "MSc Geology", cgpa: "3.64", startDate: "2026-04-06", endDate: "2026-10-06", status: "active", supervisorId: supId },
      { name: "Ayesha Khan", email: "ayesha.khan@ogdcl.com", phone: "+92 333 7788990", department: "Chemical Engineering", university: "UET Lahore", degree: "BSc Chemical Engineering", cgpa: "3.72", startDate: "2026-04-20", endDate: "2026-10-20", status: "active", supervisorId: supId },
      { name: "Bilal Ahmed", email: "bilal.ahmed@ogdcl.com", phone: "+92 301 5566778", department: "Mechanical Engineering", university: "GIKI", degree: "BSc Mechanical Engineering", cgpa: "3.55", startDate: "2026-05-04", endDate: "2026-11-04", status: "active", supervisorId: supId },
      { name: "Mariam Tariq", email: "mariam.tariq@ogdcl.com", phone: "+92 345 2223344", department: "Electrical Engineering", university: "NED University", degree: "BE Electrical Engineering", cgpa: "3.49", startDate: "2026-05-18", endDate: "2026-11-18", status: "on_hold", supervisorId: supId },
      { name: "Usman Malik", email: "usman.malik@ogdcl.com", phone: "+92 311 9900112", department: "IT & Digital", university: "COMSATS", degree: "BS Computer Science", cgpa: "3.68", startDate: "2026-06-01", endDate: "2026-12-01", status: "active", supervisorId: supId },
      { name: "Zainab Qureshi", email: "zainab.qureshi@ogdcl.com", phone: "+92 332 4455667", department: "Finance", university: "LUMS", degree: "BSc Accounting & Finance", cgpa: "3.77", startDate: "2026-09-07", endDate: "2027-03-07", status: "pending", supervisorId: supId },
      { name: "Hassan Ali", email: "hassan.ali@ogdcl.com", phone: "+92 322 1122334", department: "Human Resources", university: "Bahria University", degree: "BS Business Administration", cgpa: "3.41", startDate: "2026-01-05", endDate: "2026-07-31", status: "completed", supervisorId: supId },
    ])
    .returning({ id: interns.id, name: interns.name });

  const idByName: Record<string, number> = {};
  for (const row of internRows) idByName[row.name] = row.id;

  const tasksSeed: Array<{ n: string; t: string; d?: string; c: string; p: "low" | "medium" | "high" | "urgent"; s: "todo" | "in_progress" | "review" | "completed"; due?: string }> = [
    { n: "Fatima Noor", t: "Analyze wellbore pressure data for Tal Block", d: "Compile the flowing & shut-in pressure dataset and flag anomalies.", c: "Wellsite Analysis", p: "high", s: "in_progress", due: "2026-09-04" },
    { n: "Fatima Noor", t: "Draft monthly production report", d: "Summarise oil & gas production across the northern fields.", c: "Reporting", p: "medium", s: "review", due: "2026-09-15" },
    { n: "Hamza Sheikh", t: "Digitise structural contour maps", d: "Convert scanned geological maps into editable GIS layers.", c: "Geology", p: "medium", s: "todo", due: "2026-09-18" },
    { n: "Hamza Sheikh", t: "Prepare core sample log", d: "Document lithology and porosity readings from Well X-12.", c: "Geology", p: "urgent", s: "in_progress", due: "2026-08-20" },
    { n: "Ayesha Khan", t: "Optimise gas separation unit parameters", d: "Model the separator train and propose tuning recommendations.", c: "Process", p: "high", s: "in_progress", due: "2026-09-22" },
    { n: "Ayesha Khan", t: "HSE compliance checklist audit", d: "Review the safety checklists for the processing plant.", c: "HSE", p: "medium", s: "todo", due: "2026-09-28" },
    { n: "Bilal Ahmed", t: "Pump maintenance schedule review", d: "Update preventive maintenance plan for field transfer pumps.", c: "Maintenance", p: "medium", s: "review", due: "2026-09-11" },
    { n: "Bilal Ahmed", t: "CAD drawings for skid redesign", d: "Redraw the skid mounting layout in AutoCAD.", c: "Design", p: "low", s: "completed", due: "2026-08-10" },
    { n: "Mariam Tariq", t: "Substation load-flow study", d: "Run load-flow analysis on the 132kV distribution network.", c: "Electrical", p: "high", s: "todo", due: "2026-09-30" },
    { n: "Mariam Tariq", t: "Electrical safety training slides", d: "Prepare material on arc-flash & LOTO procedures.", c: "HSE", p: "low", s: "in_progress", due: "2026-10-05" },
    { n: "Usman Malik", t: "Build intern dashboards in Power BI", d: "Wire production KPIs to the Power BI reporting model.", c: "IT", p: "high", s: "in_progress", due: "2026-09-24" },
    { n: "Usman Malik", t: "Automate weekly data extraction", d: "Schedule ETL job for SCADA export to the data lake.", c: "IT", p: "medium", s: "todo", due: "2026-10-01" },
    { n: "Zainab Qureshi", t: "Budget variance analysis", d: "Compare Q1 actuals against the capital budget.", c: "Finance", p: "medium", s: "todo", due: "2026-09-20" },
    { n: "Zainab Qureshi", t: "Cost centre reconciliation", d: "Reconcile cost centre spend for the CSR programme.", c: "Finance", p: "low", s: "todo", due: "2026-09-29" },
  ];

  for (const row of tasksSeed) {
    const internId = idByName[row.n];
    if (!internId) continue;
    await db.insert(tasks).values({
      internId,
      title: row.t,
      description: row.d,
      category: row.c,
      priority: row.p,
      status: row.s,
      dueDate: row.due,
    });
  }

  const supName = "Engr. Ahmed Raza";
  const msgThreads: Record<string, Array<{ role: "supervisor" | "intern"; content: string }>> = {
    "Fatima Noor": [
      { role: "supervisor", content: "Salam Fatima! Great start on the wellbore analysis. Can you send me the shut-in pressure readings for Well X-12 by Thursday?" },
      { role: "intern", content: "Salam sir! Yes, I have almost finished the dataset. I will share it by Wednesday evening, In Sha Allah." },
      { role: "supervisor", content: "Perfect. Also add a short note on any anomalies you notice near the sandstone section." },
      { role: "intern", content: "Noted, sir. I noticed a pressure drop around 2,050m — I will flag it in the report with a sketch." },
    ],
    "Hamza Sheikh": [
      { role: "supervisor", content: "Hamza, how is the structural contour mapping coming along?" },
      { role: "intern", content: "Almost 60% done, sir. The scanned maps from the library are a bit faded but still readable." },
      { role: "supervisor", content: "Good. Prioritise the Kirthar formation layers; they will be used in the next drilling review." },
    ],
    "Ayesha Khan": [
      { role: "intern", content: "Sir, I finished the first simulation run of the separator train. The recovery improved by about 2.1%." },
      { role: "supervisor", content: "Nice work Ayesha. Please attach the sensitivity analysis and book a slot with the process team to review it." },
    ],
    "Bilal Ahmed": [
      { role: "supervisor", content: "Bilal, the CAD drawings were approved. Great job keeping to the deadline." },
      { role: "intern", content: "Thank you sir! I also updated the revisions block per the drawing register." },
      { role: "supervisor", content: "Excellent. Next week we will move on to the pump maintenance schedule review." },
    ],
    "Mariam Tariq": [
      { role: "supervisor", content: "Mariam, welcome to the electrical division. Because of a site visit, your induction is on hold for now." },
      { role: "intern", content: "Understood, sir. I have started reading the safety handbooks in the meantime." },
    ],
    "Usman Malik": [
      { role: "supervisor", content: "Usman, the Power BI prototype looks promising. Let us finalise the KPI cards for the dashboard." },
      { role: "intern", content: "Thanks sir! I will polish the drill-down on the production page and push the fix today." },
      { role: "supervisor", content: "Great. I will give you access to the SCADA extract so you can automate the nightly load." },
    ],
  };

  for (const [name, msgs] of Object.entries(msgThreads)) {
    const internId = idByName[name];
    if (!internId) continue;
    let readState = msgs.length > 1 ? false : true;
    for (const m of msgs) {
      await db.insert(messages).values({
        internId,
        senderName: m.role === "supervisor" ? supName : name,
        role: m.role,
        content: m.content,
        read: readState,
      });
      readState = true;
    }
  }

  const reportsSeed: Array<{ n: string; title: string; content: string; status: "draft" | "submitted" | "approved" | "rejected"; rating: number | null }> = [
    { n: "Fatima Noor", title: "Weekly Progress — Week 4", content: "Completed the pressure dataset and began the anomaly mapping for the Tal block. Awaiting field data for the second well.", status: "submitted", rating: 4 },
    { n: "Fatima Noor", title: "Wellsite Data Summary", content: "Summarised flowing and shut-in pressures; identified a sharp decline near the sandstone transition at ~2,050m.", status: "approved", rating: 5 },
    { n: "Hamza Sheikh", title: "Geological Mapping Progress", content: "Digitised 60% of Kirthar formation contour maps. Two layers pending QA review.", status: "submitted", rating: 4 },
    { n: "Ayesha Khan", title: "Gas Separation Optimisation", content: "Completed the separator train model; proposed tuning improved recovery by ~2.1%. Requesting review with process team.", status: "submitted", rating: 4 },
    { n: "Bilal Ahmed", title: "Skid Redesign Summary", content: "Finalised CAD drawings for the skid redesign; updated revision register. Delivered ahead of schedule.", status: "approved", rating: 5 },
    { n: "Usman Malik", title: "Power BI Dashboard — Phase 1", content: "Delivered production KPI dashboard prototype with drill-downs. Next phase is automated data refresh.", status: "submitted", rating: 4 },
    { n: "Mariam Tariq", title: "Induction Notes", content: "Read safety handbooks and arc-flash guidelines pending site induction.", status: "draft", rating: null },
  ];

  for (const r of reportsSeed) {
    const internId = idByName[r.n];
    if (!internId) continue;
    await db.insert(reports).values({
      internId,
      title: r.title,
      content: r.content,
      status: r.status,
      rating: r.rating,
    });
  }
}
