import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '@/components/molecules/ApplicationCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from '@/components/atoms/Badge';
import { applicationService } from '@/services/api/applicationService';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status.toLowerCase() === statusFilter;
  });

  const getStatusCounts = () => {
    const counts = applications.reduce((acc, app) => {
      const status = app.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      all: applications.length,
      submitted: counts.submitted || 0,
      reviewed: counts.reviewed || 0,
      interview: counts.interview || 0,
      rejected: counts.rejected || 0,
      offered: counts.offered || 0
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) return <Loading type="applications" />;
  if (error) return <Error message={error} onRetry={loadApplications} />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          My Applications
        </h1>
        <p className="text-gray-600">
          Track your job applications and their progress
        </p>
      </div>

      {applications.length === 0 ? (
        <Empty 
          type="applications"
          onAction={() => navigate('/jobs')}
        />
      ) : (
        <>
          {/* Status Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({statusCounts.all})
              </button>
              {Object.entries(statusCounts).map(([status, count]) => {
                if (status === 'all' || count === 0) return null;
                
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No applications found for "{statusFilter}" status.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                  {statusFilter !== 'all' && ` with "${statusFilter}" status`}
                </p>
              </div>
              
              <div className="space-y-6">
                {filteredApplications.map((application, index) => (
                  <motion.div
                    key={application.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ApplicationCard application={application} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyApplications;