import mockCompanies from '@/services/mockData/companies.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  getAll: async () => {
    await delay(250);
    return [...mockCompanies];
  },

  getById: async (id) => {
    await delay(200);
    const company = mockCompanies.find(c => c.Id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  create: async (companyData) => {
    await delay(400);
    const newCompany = {
      ...companyData,
      Id: Math.max(...mockCompanies.map(c => c.Id)) + 1
    };
    mockCompanies.push(newCompany);
    return { ...newCompany };
  },

  update: async (id, companyData) => {
    await delay(300);
    const index = mockCompanies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    mockCompanies[index] = { ...mockCompanies[index], ...companyData };
    return { ...mockCompanies[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = mockCompanies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    const deleted = mockCompanies.splice(index, 1)[0];
    return { ...deleted };
  }
};