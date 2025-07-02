import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CompanyCard from '@/components/molecules/CompanyCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Input from '@/components/atoms/Input';
import { companyService } from '@/services/api/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies. Please try again.');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(companies.map(company => company.industry))].sort();

  if (loading) return <Loading type="companies" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Explore Companies
        </h1>
        <p className="text-gray-600">
          Discover amazing companies and their open positions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="Search"
            />
          </div>
          <div className="md:w-64">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredCompanies.length} companies
          {(searchQuery || industryFilter) && ' (filtered)'}
        </p>
      </div>

      {/* Company Grid */}
      {filteredCompanies.length === 0 ? (
        <Empty 
          type="companies"
          onAction={() => {
            setSearchQuery('');
            setIndustryFilter('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;