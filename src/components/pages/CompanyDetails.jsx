import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import JobCard from '@/components/molecules/JobCard';
import ReviewCard from '@/components/molecules/ReviewCard';
import ReviewForm from '@/components/molecules/ReviewForm';
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  useEffect(() => {
    loadCompanyData();
  }, [id]);

const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [companyData, allJobs, reviewsData] = await Promise.all([
        companyService.getById(parseInt(id)),
        jobService.getAll(),
        companyService.getReviews(parseInt(id))
      ]);
      
      setCompany(companyData);
      // Filter jobs for this company
      const companyJobs = allJobs.filter(job => job.company.Id === companyData.Id);
      setJobs(companyJobs);
      setReviews(reviewsData);
    } catch (err) {
      setError('Company not found or failed to load.');
      console.error('Error loading company:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await companyService.getReviews(parseInt(id));
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    await loadReviews();
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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getFilteredReviews = () => {
    if (reviewFilter === 'all') return reviews;
    const rating = parseInt(reviewFilter);
    return reviews.filter(review => review.rating === rating);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = 20) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name="Star"
            size={size}
            className={`${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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

        {/* Reviews Section */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Employee Reviews ({reviews.length})
            </h2>
            <Button
              variant="primary"
              onClick={() => setShowReviewForm(true)}
              icon="Plus"
            >
              Write Review
            </Button>
          </div>

          {/* Review Statistics */}
          {reviews.length > 0 && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {getAverageRating()}
                  </div>
                  <div className="mb-2">
                    {renderStars(Math.round(getAverageRating()), 24)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Rating Distribution</h4>
                  {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
                    <div key={rating} className="flex items-center mb-2">
                      <span className="w-2 text-sm text-gray-600">{rating}</span>
                      <ApperIcon name="Star" size={14} className="text-yellow-400 fill-current mx-2" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Review Filter */}
          {reviews.length > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                companyId={id}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <Loading type="reviews" />
          ) : reviews.length === 0 ? (
            <Empty
              title="No reviews yet"
              message="Be the first to share your experience working at this company!"
              actionLabel="Write First Review"
              onAction={() => setShowReviewForm(true)}
              icon="MessageSquare"
            />
          ) : (
            <div className="space-y-6">
              {getFilteredReviews().map((review, index) => (
                <motion.div
                  key={review.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ReviewCard review={review} onUpdate={loadReviews} />
                </motion.div>
              ))}
              
              {getFilteredReviews().length === 0 && reviewFilter !== 'all' && (
                <Empty
                  title="No reviews found"
                  message={`No reviews with ${reviewFilter} star${reviewFilter !== '1' ? 's' : ''} rating.`}
                  actionLabel="View All Reviews"
                  onAction={() => setReviewFilter('all')}
                  icon="Star"
                />
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDetails;