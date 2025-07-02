import mockApplications from '@/services/mockData/applications.json';
import mockJobs from '@/services/mockData/jobs.json';
import mockCandidates from '@/services/mockData/candidates.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const applicationService = {
  getAll: async () => {
    await delay(300);
    // Enrich applications with job and candidate data
    const enrichedApplications = mockApplications.map(app => {
      const job = mockJobs.find(j => j.Id === app.jobId);
      const candidate = mockCandidates.find(c => c.Id === app.candidateId);
      return {
        ...app,
        job: job ? { ...job } : null,
        candidate: candidate ? { ...candidate } : null
      };
    });
    return enrichedApplications;
  },

  getById: async (id) => {
    await delay(200);
    const application = mockApplications.find(a => a.Id === id);
    if (!application) {
      throw new Error('Application not found');
    }
    const job = mockJobs.find(j => j.Id === application.jobId);
    const candidate = mockCandidates.find(c => c.Id === application.candidateId);
    return {
      ...application,
      job: job ? { ...job } : null,
      candidate: candidate ? { ...candidate } : null
    };
  },

  create: async (applicationData) => {
    await delay(400);
    const newApplication = {
      ...applicationData,
      Id: Math.max(...mockApplications.map(a => a.Id)) + 1
    };
    mockApplications.push(newApplication);
    return { ...newApplication };
  },

  update: async (id, applicationData) => {
    await delay(300);
    const index = mockApplications.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }
    mockApplications[index] = { ...mockApplications[index], ...applicationData };
    return { ...mockApplications[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = mockApplications.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }
    const deleted = mockApplications.splice(index, 1)[0];
    return { ...deleted };
  }
};