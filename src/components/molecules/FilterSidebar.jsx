import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }) => {
  const [expanded, setExpanded] = useState({
    location: true,
    salary: true,
    jobType: true,
    experience: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleCheckboxChange = (field, value, checked) => {
    const currentValues = filters[field] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }
    
    onFiltersChange({
      ...filters,
      [field]: newValues
    });
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button 
          variant="ghost" 
          size="small" 
          onClick={onClearFilters}
          icon="X"
        >
          Clear All
        </Button>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <span className="font-medium text-gray-900">Location</span>
          <ApperIcon 
            name={expanded.location ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500"
          />
        </button>
        
        {expanded.location && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder="Enter city or remote"
              value={filters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              icon="MapPin"
            />
          </motion.div>
        )}
      </div>

      {/* Salary Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('salary')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <span className="font-medium text-gray-900">Salary Range</span>
          <ApperIcon 
            name={expanded.salary ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500"
          />
        </button>
        
        {expanded.salary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Input
              type="number"
              placeholder="Min salary"
              value={filters.minSalary || ''}
              onChange={(e) => handleInputChange('minSalary', e.target.value)}
              icon="DollarSign"
            />
            <Input
              type="number"
              placeholder="Max salary"
              value={filters.maxSalary || ''}
              onChange={(e) => handleInputChange('maxSalary', e.target.value)}
              icon="DollarSign"
            />
          </motion.div>
        )}
      </div>

      {/* Job Type Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('jobType')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <span className="font-medium text-gray-900">Job Type</span>
          <ApperIcon 
            name={expanded.jobType ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500"
          />
        </button>
        
        {expanded.jobType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(filters.jobTypes || []).includes(type)}
                  onChange={(e) => handleCheckboxChange('jobTypes', type, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Experience Level Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('experience')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <span className="font-medium text-gray-900">Experience Level</span>
          <ApperIcon 
            name={expanded.experience ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500"
          />
        </button>
        
        {expanded.experience && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(filters.experienceLevels || []).includes(level)}
                  onChange={(e) => handleCheckboxChange('experienceLevels', level, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;