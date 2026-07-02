/* ============================================================
   data.js — Mock backend using localStorage.
   This simulates a database + auth layer entirely client-side.
   IMPORTANT: This is a PROTOTYPE data layer only. Passwords here
   are stored in plain text in the browser and are NOT secure.
   Replace with a real backend (Node/Express + MongoDB + JWT +
   hashed passwords) before handling real student data.
   ============================================================ */

const DB_KEY = "aimsh_db_v1";
const SESSION_KEY = "aimsh_session_v1";

const PCET = (() => {

  function seedDatabase() {
    const seed = {
      users: [
        {
          id: "stu-001",
          role: "student",
          regNo: "21MBBS104",
          name: "Aarthi Subramaniam",
          email: "aarthi.subramaniam@agathiyaims.edu.in",
          password: "student123",
          department: "School of Medicine",
          year: "2nd Year",
          semester: 4
        },
        {
          id: "fac-001",
          role: "faculty",
          facultyId: "FAC-0231",
          name: "Dr. R. Meenakshi",
          email: "r.meenakshi@agathiyaims.edu.in",
          password: "faculty123",
          department: "School of Medicine",
          designation: "Associate Professor of Medicine"
        }
      ],
      attendance: [
        { course: "General Medicine", code: "MD204", percent: 92 },
        { course: "Pathology", code: "PA206", percent: 86 },
        { course: "Pharmacology", code: "PH208", percent: 78 },
        { course: "Community Medicine", code: "CM201", percent: 95 },
        { course: "Clinical Skills Lab", code: "CS210", percent: 88 }
      ],
      results: [
        { course: "General Medicine", code: "MD204", internal: 46, max: 50, grade: "A" },
        { course: "Pathology", code: "PA206", internal: 41, max: 50, grade: "B+" },
        { course: "Pharmacology", code: "PH208", internal: 38, max: 50, grade: "B" },
        { course: "Community Medicine", code: "CM201", internal: 48, max: 50, grade: "A+" }
      ],
      feeStatus: { total: 485000, paid: 485000, due: 0, lastPaymentDate: "2026-01-14" },
      notices: [
        { id: 1, title: "End Semester Examination Timetable — May 2026 published", category: "Exams", date: "2026-06-18" },
        { id: 2, title: "Founder's Day celebrations on 2nd July — campus event schedule", category: "Events", date: "2026-06-15" },
        { id: 3, title: "Library extended hours during examination period", category: "Circular", date: "2026-06-10" },
        { id: 4, title: "Free community health camp — Tiruvallur district, 28th June", category: "Outreach", date: "2026-06-19" },
        { id: 5, title: "Hostel mess feedback survey closes 30th June", category: "Circular", date: "2026-06-12" }
      ],
      assignedCourses: [
        { course: "General Medicine", code: "MD204", section: "MBBS-A", students: 58 },
        { course: "Pathology", code: "PA206", section: "MBBS-B", students: 61 }
      ],
      contactMessages: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }

  function getDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return seedDatabase();
    try {
      return JSON.parse(raw);
    } catch (e) {
      return seedDatabase();
    }
  }

  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function login(identifier, password, role) {
    const db = getDB();
    const user = db.users.find(u =>
      u.role === role &&
      password === u.password &&
      (u.email.toLowerCase() === identifier.toLowerCase() ||
       (u.regNo && u.regNo.toLowerCase() === identifier.toLowerCase()) ||
       (u.facultyId && u.facultyId.toLowerCase() === identifier.toLowerCase()))
    );
    if (!user) return { ok: false, error: "Invalid credentials. Check your ID and password, or use the demo credentials shown below the form." };
    const { password: _pw, ...safeUser } = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { ok: true, user: safeUser };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function requireAuth(role) {
    const user = getSession();
    if (!user || (role && user.role !== role)) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }

  function submitContactMessage(payload) {
    const db = getDB();
    db.contactMessages.push({ ...payload, id: Date.now(), date: new Date().toISOString() });
    saveDB(db);
  }

  return {
    getDB, saveDB, login, logout, getSession, requireAuth, submitContactMessage
  };
})();
