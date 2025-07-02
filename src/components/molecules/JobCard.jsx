import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, onApply }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.Id}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApply(job);
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
            src={job.company?.logo}
            alt={job.company?.name}
            fallback={job.company?.name?.charAt(0)}
            size="medium"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium">{job.company?.name}</p>
          </div>
        </div>
        <Badge variant="primary" size="small">
          {job.type}
        </Badge>
      </div>

      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <ApperIcon name="DollarSign" size={16} className="mr-1" />
          ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
        </div>
        <div className="flex items-center">
          <ApperIcon name="Clock" size={16} className="mr-1" />
          {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {job.requirements?.slice(0, 3).map((req, index) => (
            <Badge key={index} variant="default" size="small">
              {req}
            </Badge>
          ))}
          {job.requirements?.length > 3 && (
            <Badge variant="default" size="small">
              +{job.requirements.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button
          variant="primary"
          size="small"
          icon="Send"
          onClick={handleApplyClick}
        >
          Apply Now
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCard;