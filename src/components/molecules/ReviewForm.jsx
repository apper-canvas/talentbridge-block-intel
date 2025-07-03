import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { companyService } from '@/services/api/companyService';

const ReviewForm = ({ companyId, onReviewSubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    pros: [''],
    cons: [''],
    overallFeedback: '',
    employeeTitle: '',
    workDuration: '',
    isAnonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.employeeTitle.trim()) {
      newErrors.employeeTitle = 'Job title is required';
    }
    
    if (!formData.workDuration.trim()) {
      newErrors.workDuration = 'Work duration is required';
    }
    
    if (!formData.overallFeedback.trim()) {
      newErrors.overallFeedback = 'Overall feedback is required';
    }
    
    const validPros = formData.pros.filter(pro => pro.trim());
    if (validPros.length === 0) {
      newErrors.pros = 'At least one pro is required';
    }
    
    const validCons = formData.cons.filter(con => con.trim());
    if (validCons.length === 0) {
      newErrors.cons = 'At least one con is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const reviewData = {
        ...formData,
        pros: formData.pros.filter(pro => pro.trim()),
        cons: formData.cons.filter(con => con.trim()),
        date: new Date().toISOString(),
        helpfulVotes: 0
      };
      
      await companyService.addReview(parseInt(companyId), reviewData);
      toast.success('Review submitted successfully!');
      onReviewSubmitted();
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Rating:</span>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="focus:outline-none transition-colors"
            >
              <ApperIcon
                name="Star"
                size={24}
                className={`${
                  star <= formData.rating 
                    ? 'text-yellow-400 fill-current hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
        {formData.rating > 0 && (
          <span className="text-sm text-gray-600">({formData.rating}/5)</span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
        <Button
          variant="ghost"
          size="small"
          icon="X"
          onClick={onCancel}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          {renderStars()}
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            placeholder="e.g., Software Engineer"
            value={formData.employeeTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeTitle: e.target.value }))}
            error={errors.employeeTitle}
            required
          />
          <Input
            label="Work Duration"
            placeholder="e.g., 2 years"
            value={formData.workDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, workDuration: e.target.value }))}
            error={errors.workDuration}
            required
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Submit review anonymously
          </label>
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pros <span className="text-red-500">*</span>
          </label>
          {formData.pros.map((pro, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="What do you like about this company?"
                value={pro}
                onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                className="flex-1"
              />
              {formData.pros.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon="Minus"
                  onClick={() => removeArrayItem('pros', index)}
                />
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="small"
            icon="Plus"
            onClick={() => addArrayItem('pros')}
          >
            Add Pro
          </Button>
          {errors.pros && (
            <p className="mt-1 text-sm text-red-600">{errors.pros}</p>
          )}
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cons <span className="text-red-500">*</span>
          </label>
          {formData.cons.map((con, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="What could be improved?"
                value={con}
                onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                className="flex-1"
              />
              {formData.cons.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon="Minus"
                  onClick={() => removeArrayItem('cons', index)}
                />
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="small"
            icon="Plus"
            onClick={() => addArrayItem('cons')}
          >
            Add Con
          </Button>
          {errors.cons && (
            <p className="mt-1 text-sm text-red-600">{errors.cons}</p>
          )}
        </div>

        {/* Overall Feedback */}
        <Input
          type="textarea"
          label="Overall Feedback"
          placeholder="Share your overall experience working at this company..."
          value={formData.overallFeedback}
          onChange={(e) => setFormData(prev => ({ ...prev, overallFeedback: e.target.value }))}
          error={errors.overallFeedback}
          rows={4}
          required
        />

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon="Send"
          >
            Submit Review
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;