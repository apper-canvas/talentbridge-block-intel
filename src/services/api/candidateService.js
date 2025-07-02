import mockCandidates from '@/services/mockData/candidates.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const candidateService = {
  getAll: async () => {
    await delay(300);
    return [...mockCandidates];
  },

  getById: async (id) => {
    await delay(200);
    const candidate = mockCandidates.find(c => c.Id === id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return { ...candidate };
  },

  create: async (candidateData) => {
    await delay(400);
    const newCandidate = {
      ...candidateData,
      Id: Math.max(...mockCandidates.map(c => c.Id)) + 1
    };
    mockCandidates.push(newCandidate);
    return { ...newCandidate };
  },

  update: async (id, candidateData) => {
    await delay(300);
    const index = mockCandidates.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Candidate not found');
    }
    mockCandidates[index] = { ...mockCandidates[index], ...candidateData };
    return { ...mockCandidates[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = mockCandidates.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Candidate not found');
    }
    const deleted = mockCandidates.splice(index, 1)[0];
    return { ...deleted };
  }
};