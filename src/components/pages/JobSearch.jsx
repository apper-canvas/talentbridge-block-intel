import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import JobCard from '@/components/molecules/JobCard';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { jobService } from '@/services/api/jobService';
import { applicationService } from '@/services/api/applicationService';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadJobs();
  }, [filters, sortBy, currentPage]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await jobService.getAll();
      
      let filteredJobs = [...data];
      
      // Apply filters
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.minSalary) {
        filteredJobs = filteredJobs.filter(job => 
          job.salaryRange.min >= parseInt(filters.minSalary)
        );
      }
      
      if (filters.maxSalary) {
        filteredJobs = filteredJobs.filter(job => 
          job.salaryRange.max <= parseInt(filters.maxSalary)
        );
      }
      
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.jobTypes.includes(job.type)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'recent':
          filteredJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
          break;
        case 'salary-high':
          filteredJobs.sort((a, b) => b.salaryRange.max - a.salaryRange.max);
          break;
        case 'salary-low':
          filteredJobs.sort((a, b) => a.salaryRange.min - b.salaryRange.min);
          break;
        case 'title':
          filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
      
      // Pagination
      const jobsPerPage = 10;
      const startIndex = (currentPage - 1) * jobsPerPage;
      const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);
      const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
      
      setJobs(paginatedJobs);
      setTotalPages(totalPages);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      const applicationData = {
        jobId: job.Id,
        candidateId: 1, // Mock candidate ID
        status: 'submitted',
        appliedDate: new Date().toISOString(),
        coverLetter: '',
        resumeVersion: 'current_resume.pdf'
      };
      
      await applicationService.create(applicationData);
      toast.success(`Applied to ${job.title} successfully!`);
    } catch (err) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Error applying to job:', err);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loading type="jobs" />;
  if (error) return <Error message={error} onRetry={loadJobs} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover opportunities that match your skills and aspirations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white rounded-lg p-4 shadow-md">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600">
                Showing {jobs.length} jobs
                {Object.keys(filters).length > 0 && ' (filtered)'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="recent">Most Recent</option>
                <option value="salary-high">Salary (High to Low)</option>
                <option value="salary-low">Salary (Low to High)</option>
                <option value="title">Job Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Job Listings */}
          {jobs.length === 0 ? (
            <Empty 
              type="jobs" 
              onAction={handleClearFilters}
            />
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JobCard job={job} onApply={handleApply} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon="ChevronLeft"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === index + 1
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;