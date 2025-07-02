import mockJobs from '@/services/mockData/jobs.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
  getAll: async () => {
    await delay(300);
    return [...mockJobs];
  },

  getById: async (id) => {
    await delay(200);
    const job = mockJobs.find(j => j.Id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return { ...job };
  },

  create: async (jobData) => {
    await delay(400);
    const newJob = {
      ...jobData,
      Id: Math.max(...mockJobs.map(j => j.Id)) + 1,
      postedDate: new Date().toISOString()
    };
    mockJobs.push(newJob);
    return { ...newJob };
  },

  update: async (id, jobData) => {
    await delay(300);
    const index = mockJobs.findIndex(j => j.Id === id);
    if (index === -1) {
      throw new Error('Job not found');
    }
    mockJobs[index] = { ...mockJobs[index], ...jobData };
    return { ...mockJobs[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = mockJobs.findIndex(j => j.Id === id);
    if (index === -1) {
      throw new Error('Job not found');
    }
    const deleted = mockJobs.splice(index, 1)[0];
    return { ...deleted };
  }
};