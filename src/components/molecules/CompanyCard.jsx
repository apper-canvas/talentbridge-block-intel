import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/companies/${company.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-4 mb-4">
        <Avatar
          src={company.logo}
          alt={company.name}
          fallback={company.name?.charAt(0)}
          size="large"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
            {company.name}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <ApperIcon name="Building2" size={16} className="mr-1" />
              {company.industry}
            </div>
            <div className="flex items-center">
              <ApperIcon name="Users" size={16} className="mr-1" />
              {company.size}
            </div>
          </div>
          <Badge variant="success" size="small">
            {company.openPositions || 0} Open Positions
          </Badge>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {company.description}
      </p>

      {company.benefits && (
        <div className="flex flex-wrap gap-2">
          {company.benefits.slice(0, 3).map((benefit, index) => (
            <Badge key={index} variant="default" size="small">
              {benefit}
            </Badge>
          ))}
          {company.benefits.length > 3 && (
            <Badge variant="default" size="small">
              +{company.benefits.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CompanyCard;