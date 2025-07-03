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
},

  // Review-related operations
  getReviews: async (companyId) => {
    await delay(300);
    const company = mockCompanies.find(c => c.Id === companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return [...(company.reviews || [])];
  },

  addReview: async (companyId, reviewData) => {
    await delay(400);
    const company = mockCompanies.find(c => c.Id === companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    
    if (!company.reviews) {
      company.reviews = [];
    }
    
    const newReview = {
      ...reviewData,
      Id: company.reviews.length > 0 ? Math.max(...company.reviews.map(r => r.Id)) + 1 : 1
    };
    
    company.reviews.push(newReview);
    return { ...newReview };
  },

  updateReview: async (reviewId, reviewData) => {
    await delay(300);
    for (const company of mockCompanies) {
      if (company.reviews) {
        const reviewIndex = company.reviews.findIndex(r => r.Id === reviewId);
        if (reviewIndex !== -1) {
          company.reviews[reviewIndex] = { ...company.reviews[reviewIndex], ...reviewData };
          return { ...company.reviews[reviewIndex] };
        }
      }
    }
    throw new Error('Review not found');
  },

  deleteReview: async (reviewId) => {
    await delay(300);
    for (const company of mockCompanies) {
      if (company.reviews) {
        const reviewIndex = company.reviews.findIndex(r => r.Id === reviewId);
        if (reviewIndex !== -1) {
          const deleted = company.reviews.splice(reviewIndex, 1)[0];
          return { ...deleted };
        }
      }
    }
    throw new Error('Review not found');
  },

  voteReview: async (reviewId, voteType) => {
    await delay(200);
    for (const company of mockCompanies) {
      if (company.reviews) {
        const review = company.reviews.find(r => r.Id === reviewId);
        if (review) {
          if (voteType === 'helpful') {
            review.helpfulVotes = (review.helpfulVotes || 0) + 1;
          }
          return { ...review };
        }
      }
    }
    throw new Error('Review not found');
  }
};