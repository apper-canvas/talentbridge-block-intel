import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title,
  message,
  actionLabel,
  onAction,
  icon = "Search",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'jobs':
        return {
          title: title || "No jobs found",
          message: message || "Try adjusting your search criteria or browse all available positions.",
          actionLabel: actionLabel || "Browse All Jobs",
          icon: "Briefcase"
        };
      case 'companies':
        return {
          title: title || "No companies found",
          message: message || "We couldn't find any companies matching your criteria.",
          actionLabel: actionLabel || "View All Companies",
          icon: "Building2"
        };
      case 'applications':
        return {
          title: title || "No applications yet",
          message: message || "You haven't applied to any jobs yet. Start exploring opportunities!",
          actionLabel: actionLabel || "Browse Jobs",
          icon: "FileText"
        };
      default:
        return {
          title: title || "No results found",
          message: message || "Try adjusting your search or filters.",
          actionLabel: actionLabel || "Reset Filters",
          icon: icon
        };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} size={48} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {content.message}
      </p>
      
      {onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          icon="ArrowRight"
        >
          {content.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;