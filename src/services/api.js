import axios from "axios";

// Connect directly to our decoupled Express instance on Port 5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🚨 Essential: passes JWT session cookies to Express!
});

// =======================
// 🔐 AUTHENTICATION APIs
// =======================
export async function registerUser({ username, email, password }) {
  const response = await api.post("/api/auth/register", { username, email, password });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}

export async function logoutUser() {
  const response = await api.get("/api/auth/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}

export async function updateProfile({ defaultSelfDescription, resumeFile }) {
  const formData = new FormData();
  if (defaultSelfDescription) formData.append("defaultSelfDescription", defaultSelfDescription);
  if (resumeFile) formData.append("resume", resumeFile);

  const response = await api.post("/api/auth/profile", formData);
  return response.data;
}

// =======================
// 🎯 AI INTERVIEW EVALUATION APIs
// =======================
export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  if (selfDescription) formData.append("selfDescription", selfDescription);
  if (resumeFile) formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData);
  return response.data;
}

export async function getInterviewReportById(interviewId) {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
}

export async function getAllInterviewReports() {
  const response = await api.get("/api/interview/");
  return response.data;
}

export async function generateResumePdf(interviewReportId) {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: "blob",
  });
  return response.data;
}

export default api;
