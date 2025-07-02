import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { jobService } from '@/services/api/jobService';
import { applicationService } from '@/services/api/applicationService';
import { formatDistanceToNow } from 'date-fns';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await jobService.getById(parseInt(id));
      setJob(data);
    } catch (err) {
      setError('Job not found or failed to load.');
      console.error('Error loading job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const applicationData = {
        jobId: job.Id,
        candidateId: 1, // Mock candidate ID
        status: 'submitted',
        appliedDate: new Date().toISOString(),
        coverLetter: coverLetter,
        resumeVersion: 'current_resume.pdf'
      };
      
      await applicationService.create(applicationData);
      toast.success(`Applied to ${job.title} successfully!`);
      setShowApplyForm(false);
      setCoverLetter('');
    } catch (err) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Error applying to job:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading type="jobs" />;
  if (error) return <Error message={error} onRetry={loadJob} />;
  if (!job) return <Error message="Job not found" showRetry={false} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="small"
          icon="ArrowLeft"
          onClick={() => navigate(-1)}
        >
          Back to Jobs
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Job Header */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div className="flex items-start space-x-6">
              <Avatar
                src={job.company?.logo}
                alt={job.company?.name}
                fallback={job.company?.name?.charAt(0)}
                size="xl"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="text-xl font-semibold text-primary-600">
                    {job.company?.name}
                  </span>
                  <div className="flex items-center">
                    <ApperIcon name="MapPin" size={18} className="mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Clock" size={18} className="mr-1" />
                    {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="primary" size="medium">
                    {job.type}
                  </Badge>
                  <div className="flex items-center text-lg font-semibold text-accent-600">
                    <ApperIcon name="DollarSign" size={20} className="mr-1" />
                    ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              <Button
                variant="primary"
                size="large"
                icon="Send"
                onClick={() => setShowApplyForm(true)}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              {job.description}
            </p>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <div className="space-y-3">
              {job.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start">
                  <ApperIcon name="CheckCircle" size={20} className="text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        {job.company && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              About {job.company.name}
            </h2>
            <div className="flex items-start space-x-6 mb-6">
              <Avatar
                src={job.company.logo}
                alt={job.company.name}
                fallback={job.company.name.charAt(0)}
                size="large"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.company.name}
                </h3>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <ApperIcon name="Building2" size={18} className="mr-2" />
                    {job.company.industry}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Users" size={18} className="mr-2" />
                    {job.company.size}
                  </div>
                </div>
              </div>
            </div>
            
            {job.company.description && (
              <p className="text-gray-700 mb-6">
                {job.company.description}
              </p>
            )}
            
            {job.company.benefits && job.company.benefits.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {job.company.benefits.map((benefit, index) => (
                    <Badge key={index} variant="default" size="medium">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() => navigate(`/companies/${job.company.Id}`)}
                icon="ExternalLink"
              >
                View Company Profile
              </Button>
            </div>
          </div>
        )}

        {/* Apply Form Modal */}
        {showApplyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowApplyForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Apply for {job.title}
                </h3>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're perfect for this role..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="FileText" size={16} className="mr-2" />
                    Resume: current_resume.pdf
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowApplyForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleApply}
                    loading={applying}
                    icon="Send"
                  >
                    {applying ? 'Applying...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default JobDetails;