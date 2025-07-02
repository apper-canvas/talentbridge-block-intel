import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import JobCard from '@/components/molecules/JobCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { companyService } from '@/services/api/companyService';
import { jobService } from '@/services/api/jobService';
import { applicationService } from '@/services/api/applicationService';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [companyData, allJobs] = await Promise.all([
        companyService.getById(parseInt(id)),
        jobService.getAll()
      ]);
      
      setCompany(companyData);
      // Filter jobs for this company
      const companyJobs = allJobs.filter(job => job.company.Id === companyData.Id);
      setJobs(companyJobs);
    } catch (err) {
      setError('Company not found or failed to load.');
      console.error('Error loading company:', err);
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

  if (loading) return <Loading type="companies" />;
  if (error) return <Error message={error} onRetry={loadCompanyData} />;
  if (!company) return <Error message="Company not found" showRetry={false} />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="small"
          icon="ArrowLeft"
          onClick={() => navigate(-1)}
        >
          Back to Companies
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Company Header */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar
              src={company.logo}
              alt={company.name}
              fallback={company.name.charAt(0)}
              size="xl"
              className="w-32 h-32 text-4xl"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {company.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Building2" size={20} className="mr-2" />
                  <span className="font-medium">{company.industry}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Users" size={20} className="mr-2" />
                  <span>{company.size} employees</span>
                </div>
                <Badge variant="success" size="large">
                  {jobs.length} Open Positions
                </Badge>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {company.description}
              </p>
            </div>
          </div>
        </div>

        {/* Company Culture */}
        {company.culture && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Company Culture
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {company.culture}
            </p>
          </div>
        )}

        {/* Benefits */}
        {company.benefits && company.benefits.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="CheckCircle" size={20} className="text-accent-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Open Positions */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Open Positions ({jobs.length})
            </h2>
            {jobs.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => navigate('/jobs')}
                icon="ExternalLink"
              >
                View All Jobs
              </Button>
            )}
          </div>
          
          {jobs.length === 0 ? (
            <Empty
              title="No open positions"
              message="This company doesn't have any open positions at the moment. Check back later!"
              actionLabel="Browse Other Jobs"
              onAction={() => navigate('/jobs')}
              icon="Briefcase"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6">
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDetails;