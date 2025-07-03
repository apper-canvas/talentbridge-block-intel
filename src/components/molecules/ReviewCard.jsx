import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';
import { companyService } from '@/services/api/companyService';

const ReviewCard = ({ review, onUpdate }) => {
  const [voting, setVoting] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes || 0);
  const [userVoted, setUserVoted] = useState(false);

  const handleVote = async (voteType) => {
    if (userVoted || voting) return;
    
    try {
      setVoting(true);
      await companyService.voteReview(review.Id, voteType);
      
      if (voteType === 'helpful') {
        setHelpfulVotes(prev => prev + 1);
        toast.success('Thank you for your feedback!');
      }
      
      setUserVoted(true);
    } catch (err) {
      toast.error('Failed to submit vote. Please try again.');
      console.error('Error voting on review:', err);
    } finally {
      setVoting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name="Star"
            size={16}
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

  const getRatingBadgeVariant = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {renderStars(review.rating)}
            <Badge variant={getRatingBadgeVariant(review.rating)} size="small">
              {review.rating}/5
            </Badge>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
        </div>
      </div>

      {/* Employee Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {review.isAnonymous ? 'Anonymous Employee' : 'Employee'}
          </div>
          <div className="text-sm text-gray-600">
            {review.employeeTitle} • {review.workDuration}
          </div>
        </div>
      </div>

      {/* Pros */}
      {review.pros && review.pros.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ApperIcon name="ThumbsUp" size={16} className="text-green-500 mr-2" />
            <span className="font-medium text-gray-900">Pros</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-6">
            {review.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons */}
      {review.cons && review.cons.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ApperIcon name="ThumbsDown" size={16} className="text-red-500 mr-2" />
            <span className="font-medium text-gray-900">Cons</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-6">
            {review.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Feedback */}
      {review.overallFeedback && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ApperIcon name="MessageSquare" size={16} className="text-blue-500 mr-2" />
            <span className="font-medium text-gray-900">Overall Experience</span>
          </div>
          <p className="text-gray-700 leading-relaxed ml-6">
            {review.overallFeedback}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            icon="ThumbsUp"
            onClick={() => handleVote('helpful')}
            disabled={userVoted || voting}
            className={`${userVoted ? 'text-green-600' : ''}`}
          >
            Helpful ({helpfulVotes})
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Was this review helpful?
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;