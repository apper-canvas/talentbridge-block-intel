import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { candidateService } from '@/services/api/candidateService';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    skills: [],
    experience: [],
    education: [],
    preferredLocation: '',
    expectedSalary: ''
  });
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    duration: '',
    description: ''
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    school: '',
    year: '',
    field: ''
  });
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Mock loading existing profile
      const mockProfile = {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        resume: 'john_doe_resume.pdf',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        experience: [
          {
            title: 'Senior Frontend Developer',
            company: 'Tech Solutions Inc.',
            duration: '2021 - Present',
            description: 'Lead frontend development for multiple client projects using React and modern web technologies.'
          },
          {
            title: 'Frontend Developer',
            company: 'Digital Agency',
            duration: '2019 - 2021',
            description: 'Developed responsive web applications and collaborated with design teams.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            school: 'University of Technology',
            year: '2019',
            field: 'Computer Science'
          }
        ],
        preferredLocation: 'San Francisco, CA',
        expectedSalary: '120000'
      };
      setProfile(mockProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setProfile(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }]
      }));
      setNewExperience({ title: '', company: '', duration: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.school) {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ degree: '', school: '', year: '', field: '' });
    }
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'skills', label: 'Skills', icon: 'Star' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          My Profile
        </h1>
        <p className="text-gray-600">
          Manage your profile information and career details
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="card p-6 text-center mb-6">
            <Avatar
              src={profile.avatar}
              alt={profile.name}
              fallback={profile.name.charAt(0)}
              size="xl"
              className="w-24 h-24 mx-auto mb-4 text-2xl"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {profile.name}
            </h3>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <ApperIcon name="MapPin" size={16} className="mr-1" />
              {profile.preferredLocation}
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} className="mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="card p-8">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <Input
                    label="Preferred Location"
                    value={profile.preferredLocation}
                    onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                    icon="MapPin"
                  />
                  <Input
                    label="Expected Salary (Annual)"
                    type="number"
                    value={profile.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    icon="DollarSign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {profile.resume ? `Current: ${profile.resume}` : 'Upload your resume'}
                    </p>
                    <Button variant="outline" size="small">
                      {profile.resume ? 'Replace Resume' : 'Upload Resume'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Skills
                </h2>
                
                <div className="flex gap-3">
                  <Input
                    placeholder="Add a skill (e.g., JavaScript, Marketing)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1"
                  />
                  <Button onClick={addSkill} icon="Plus">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="primary" size="medium" className="pr-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <ApperIcon name="X" size={16} />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {profile.skills.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No skills added yet. Add your first skill above.
                  </p>
                )}
              </motion.div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Work Experience
                </h2>
                
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Add New Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Job Title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="Company Name"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    />
                    <Input
                      placeholder="Duration (e.g., 2020 - 2022)"
                      value={newExperience.duration}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <textarea
                    placeholder="Job description and achievements..."
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4 resize-none"
                  />
                  <Button onClick={addExperience} icon="Plus">
                    Add Experience
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {exp.title}
                          </h4>
                          <p className="text-primary-600 font-medium">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.duration}</p>
                        </div>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={20} />
                        </button>
                      </div>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
                
                {profile.experience.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No work experience added yet. Add your first job above.
                  </p>
                )}
              </motion.div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Education
                </h2>
                
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Add Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Degree (e.g., Bachelor of Science)"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    />
                    <Input
                      placeholder="School/University"
                      value={newEducation.school}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                    />
                    <Input
                      placeholder="Graduation Year"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={newEducation.field}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addEducation} icon="Plus">
                    Add Education
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {edu.degree}
                          </h4>
                          <p className="text-primary-600 font-medium">{edu.school}</p>
                          <p className="text-gray-600">
                            {edu.field} • {edu.year}
                          </p>
                        </div>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {profile.education.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No education added yet. Add your first qualification above.
                  </p>
                )}
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                icon="Save"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;