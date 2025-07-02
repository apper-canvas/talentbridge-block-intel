import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const ApplicationCard = ({ application }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${application.job?.Id}`);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'submitted';
      case 'reviewed':
        return 'reviewed';
      case 'interview':
        return 'interview';
      case 'rejected':
        return 'rejected';
      case 'offered':
        return 'offered';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            src={application.job?.company?.logo}
            alt={application.job?.company?.name}
            fallback={application.job?.company?.name?.charAt(0)}
            size="medium"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {application.job?.title}
            </h3>
            <p className="text-gray-600 font-medium">{application.job?.company?.name}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(application.status)} size="medium">
          {application.status}
        </Badge>
      </div>

      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          {application.job?.location}
        </div>
        <div className="flex items-center">
          <ApperIcon name="Calendar" size={16} className="mr-1" />
          Applied {formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}
        </div>
      </div>

      {application.coverLetter && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 line-clamp-2">
            <span className="font-medium">Cover Letter:</span> {application.coverLetter}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="FileText" size={16} />
          <span>Resume: {application.resumeVersion}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="ExternalLink" size={16} className="text-primary-500" />
          <span className="text-primary-600 font-medium">View Details</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;