import React, { useState, useRef } from 'react';
import { User, Mail, Calendar, CheckCircle, Clock, Users, Send, Eye, Plus, Edit2, Trash2, Check, X, Settings, ChevronUp, ChevronDown, FileText, Copy } from 'lucide-react';
import CustomerTable from './components/CustomerTable';
import ParentForm from './components/ParentForm';

const SalesFlowApp = () => {
  const [programAdvisors, setProgramAdvisors] = useState([
    { id: 1, name: 'John Smith', email: 'john@company.com' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com' }
  ]);

  const [parentSupportStaff, setParentSupportStaff] = useState([
    { id: 1, name: 'Emma Thompson', email: 'emma.support@company.com' },
    { id: 2, name: 'David Rodriguez', email: 'david.support@company.com' }
  ]);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSupportSpecialist, setSelectedSupportSpecialist] = useState(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [newAdvisor, setNewAdvisor] = useState({ name: '', email: '' });
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateModes, setTemplateModes] = useState({
    confirmation: 'text',
    enrollment: 'text',
    parentSupport: 'text',
    esaTips: 'text'
  });

  const emailContentRef = useRef(null);

  const addAdvisor = () => {
    if (!newAdvisor.name || !validateEmail(newAdvisor.email)) {
      alert('Please enter a valid name and email address');
      return;
    }
    
    const advisor = {
      id: Math.max(...programAdvisors.map(a => a.id)) + 1,
      ...newAdvisor
    };
    
    setProgramAdvisors([...programAdvisors, advisor]);
    setNewAdvisor({ name: '', email: '' });
  };

  const updateAdvisor = (id, name, email) => {
    if (!name || !validateEmail(email)) {
      alert('Please enter a valid name and email address');
      return;
    }
    
    setProgramAdvisors(programAdvisors.map(advisor => 
      advisor.id === id ? { ...advisor, name, email } : advisor
    ));
    setEditingAdvisor(null);
  };

  const deleteAdvisor = (id) => {
    if (programAdvisors.length <= 1) {
      alert('Cannot delete the last advisor');
      return;
    }
    
    setProgramAdvisors(programAdvisors.filter(advisor => advisor.id !== id));
  };

  const deleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
      }
    }
  };

  const addNote = (customerId) => {
    const noteText = window.prompt('Enter note');
    if (!noteText) return;
    const note = { text: noteText, timestamp: new Date() };
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const updatedCustomer = { ...c, notes: [...(c.notes || []), note] };
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(updatedCustomer);
        }
        return updatedCustomer;
      }
      return c;
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const populateTemplate = (content, customer) => {
    return content
      .replace(/\{\{parentFirstName\}\}/g, customer.parentFirstName)
      .replace(/\{\{studentFirstName\}\}/g, customer.studentFirstName)
      .replace(/\{\{startDate\}\}/g, customer.startDate)
      .replace(
        /\{\{advisorName\}\}/g,
        programAdvisors.find(pa => pa.id === customer.advisorId).name || ''
      )
      .replace(
        /\{\{supportName\}\}/g,
        parentSupportStaff.find(ps => ps.id === selectedSupportSpecialist).name || ''
      );
  };

  const getTemplateHtml = (type, customer) => {
    const body = populateTemplate(emailTemplates[type].body, customer);
    return templateModes[type] === 'html'
      ? body
      : body.replace(/\n/g, '<br />');
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const [emailTemplates, setEmailTemplates] = useState({
    confirmation: {
      subject: 'Next Steps - Welcome to Alpha Anywhere!',
      body: `Hi {{parentFirstName}},

Thank you so much for choosing Alpha Anywhere for {{studentFirstName}}! We're excited to have you join our community.

To complete your enrollment, please complete these two important steps:

1. Complete the consent forms in our enrollment portal
2. Set up your payment method

Once these are complete, we'll send you a welcome package with everything you need to get {{studentFirstName}} started on {{startDate}}.

If you have any questions, please don't hesitate to reach out!

Best regards,
{{advisorName}}`
    },
    enrollment: {
      subject: 'Welcome to Alpha Anywhere - Let\'s Get Started!',
      body: `Dear {{parentFirstName}},

Welcome to Alpha Anywhere! We're thrilled that {{studentFirstName}} is joining us.

Your enrollment is now complete and we're all set for your start date of {{startDate}}.

Here's what happens next:
- You'll receive your welcome materials within 24 hours
- Our team will be in touch to schedule your first session
- Access to our parent portal will be activated shortly

We can't wait to begin this journey with {{studentFirstName}}!

Warm regards,
{{advisorName}}`
    },
    parentSupport: {
      subject: 'Meet Your Parent Support Specialist',
      body: `Hi {{parentFirstName}},

I'm reaching out to introduce myself as your dedicated Parent Support Specialist. My name is {{supportName}}, and I'll be your go-to resource throughout {{studentFirstName}}'s journey with us.

Here are a few pro tips to help you get started:
• Set up a consistent study schedule
• Create a dedicated learning space
• Stay in regular communication with our team

I'll be checking in regularly to ensure everything is going smoothly. Feel free to reach out anytime!

Best,
{{supportName}}`
    },
    esaTips: {
      subject: 'Tips for Using ESA Funds',
      body: `Hi {{parentFirstName}},

Here are a few tips to help you make the most of your ESA funds for {{studentFirstName}}.

Best regards,
{{advisorName}}`
    }
  });

  const updateEmailTemplate = (templateType, field, value) => {
    setEmailTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [field]: value
      }
    }));
  };

  const toggleTemplateMode = (templateType) => {
    setTemplateModes(prev => ({
      ...prev,
      [templateType]: prev[templateType] === 'text' ? 'html' : 'text'
    }));
  };


  const updateCustomerStatus = (customerId, field, value) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        const updatedTimeline = { ...customer.timeline, [field]: value };
        
        let step = customer.step;
        let status = customer.status;

        if (!updatedTimeline.confirmationEmailSent) {
          step = 1;
          status = 'step-1';
        } else if (
          !updatedTimeline.consentsCompleted ||
          !updatedTimeline.paymentCompleted ||
          !updatedTimeline.enrollmentEmailSent
        ) {
          step = 2;
          status = 'step-2';
        } else if (!updatedTimeline.parentSupportEmailSent) {
          step = 3;
          status = 'step-3';
        } else if (updatedTimeline.parentSupportEmailSent) {
          step = 3;
          status = 'completed';
          if (!updatedTimeline.completed) {
            updatedTimeline.completed = new Date();
          }
        }
        
        const updatedCustomer = {
          ...customer,
          timeline: updatedTimeline,
          step,
          status
        };
        
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(updatedCustomer);
        }
        
        return updatedCustomer;
      }
      return customer;
    }));
  };

  const copyEmail = async () => {
    if (emailContentRef.current) {
      const html = emailContentRef.current.innerHTML;
      try {
        if (navigator.clipboard && navigator.clipboard.write) {
          const blobInput = new Blob([html], { type: 'text/html' });
          const clipboardItem = new ClipboardItem({ 'text/html': blobInput });
          await navigator.clipboard.write([clipboardItem]);
        } else {
          await navigator.clipboard.writeText(html);
        }
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    }
  };

  const markEmailSent = (customerId, type) => {
    const timelineField =
      type === 'confirmation'
        ? 'confirmationEmailSent'
        : type === 'enrollment'
        ? 'enrollmentEmailSent'
        : type === 'parentSupport'
        ? 'parentSupportEmailSent'
        : 'esaTipsEmailSent';

    updateCustomerStatus(customerId, timelineField, new Date());
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
    setShowEmailModal(false);
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedCustomers = () => {
    if (!sortField) return customers;
    
    return [...customers].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'customer':
          aValue = `${a.parentFirstName} ${a.parentLastName}`.toLowerCase();
          bValue = `${b.parentFirstName} ${b.parentLastName}`.toLowerCase();
          break;
        case 'student':
          aValue = `${a.studentFirstName} ${a.studentLastName}`.toLowerCase();
          bValue = `${b.studentFirstName} ${b.studentLastName}`.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'step-1': return 'bg-blue-100 text-blue-800';
      case 'step-2': return 'bg-yellow-100 text-yellow-800';
      case 'step-3': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (customer) => {
    switch (customer.status) {
      case 'step-1': return 'Step 1: Convert';
      case 'step-2': return 'Step 2: Process';
      case 'step-3': return 'Step 3: Support';
      case 'completed': return 'Completed';
      default: return 'Step 1: Convert';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {emailSent && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Email marked as sent!
        </div>
      )}
      {copySuccess && (
        <div className="fixed top-16 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          Email copied to clipboard!
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Alpha Anywhere - Customer Onboarding</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTemplateEditor(true)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm flex items-center"
              >
                <Settings className="h-4 w-4 mr-1" />
                Email Templates
              </button>
              
              <button
                onClick={() => setShowAdminPanel(true)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
              >
                Manage Staff
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Customer to Onboarding
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 1: Convert</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.status === 'step-1').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <User className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 2: Process</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.status === 'step-2').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 3: Support</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.status === 'step-3').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Customer Onboarding Pipeline</h2>
          </div>
          
          <CustomerTable refreshSignal={refreshSignal} />
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button onClick={() => setShowAddForm(false)} className="text-gray-500">✕</button>
            </div>
            <ParentForm onCreated={() => { setShowAddForm(false); setRefreshSignal(prev => prev + 1); }} />
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-5xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">Manage Staff</h3>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Program Advisors */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Program Advisors</h4>
                
                {/* Add New Advisor */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-md font-medium text-blue-900 mb-3">Add New Program Advisor</h5>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newAdvisor.name}
                      onChange={(e) => setNewAdvisor({...newAdvisor, name: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newAdvisor.email}
                      onChange={(e) => setNewAdvisor({...newAdvisor, email: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addAdvisor}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Program Advisor
                    </button>
                  </div>
                </div>
                
                {/* Existing Advisors */}
                <div className="space-y-3">
                  {programAdvisors.map((advisor) => (
                    <div key={advisor.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      {editingAdvisor === advisor.id ? (
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="text"
                            defaultValue={advisor.name}
                            id={`name-${advisor.id}`}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="email"
                            defaultValue={advisor.email}
                            id={`email-${advisor.id}`}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              const nameEl = document.getElementById(`name-${advisor.id}`);
                              const emailEl = document.getElementById(`email-${advisor.id}`);
                              updateAdvisor(advisor.id, nameEl.value, emailEl.value);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingAdvisor(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{advisor.name}</div>
                            <div className="text-sm text-gray-500">{advisor.email}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingAdvisor(advisor.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAdvisor(advisor.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parent Support Specialists */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Parent Support Specialists</h4>
                
                {/* Add New Parent Support */}
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="text-md font-medium text-purple-900 mb-3">Add New Parent Support Specialist</h5>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name"
                      id="newSupportName"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      id="newSupportEmail"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => {
                        const nameEl = document.getElementById('newSupportName');
                        const emailEl = document.getElementById('newSupportEmail');
                        if (nameEl.value && validateEmail(emailEl.value)) {
                          const newSupport = {
                            id: Math.max(...parentSupportStaff.map(s => s.id)) + 1,
                            name: nameEl.value,
                            email: emailEl.value
                          };
                          setParentSupportStaff([...parentSupportStaff, newSupport]);
                          nameEl.value = '';
                          emailEl.value = '';
                        } else {
                          alert('Please enter valid name and email');
                        }
                      }}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Support Specialist
                    </button>
                  </div>
                </div>
                
                {/* Existing Parent Support Staff */}
                <div className="space-y-3">
                  {parentSupportStaff.map((support) => (
                    <div key={support.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{support.name}</div>
                        <div className="text-sm text-gray-500">{support.email}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (parentSupportStaff.length > 1) {
                              setParentSupportStaff(parentSupportStaff.filter(s => s.id !== support.id));
                              if (selectedSupportSpecialist === support.id) {
                                setSelectedSupportSpecialist(parentSupportStaff.find(s => s.id !== support.id).id);
                              }
                            } else {
                              alert('Cannot delete the last parent support specialist');
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">
                {selectedCustomer.parentFirstName} {selectedCustomer.parentLastName} - {selectedCustomer.studentFirstName}
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Parent:</span> {selectedCustomer.parentFirstName} {selectedCustomer.parentLastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedCustomer.parentEmail}</p>
                    <p><span className="font-medium">Student:</span> {selectedCustomer.studentFirstName} {selectedCustomer.studentLastName}</p>
                    <p><span className="font-medium">Start Date:</span> {selectedCustomer.startDate}</p>
                    <p><span className="font-medium">Transfer:</span> {selectedCustomer.isTransfer ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Internal Notes</h4>
                  {selectedCustomer.notes && selectedCustomer.notes.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {selectedCustomer.notes.map((note, idx) => (
                        <li key={idx} className="border-b pb-1">
                          <span className="font-medium">{formatDateTime(note.timestamp)}:</span> {note.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  )}
                  <button
                    onClick={() => addNote(selectedCustomer.id)}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Step 1: Convert Customer</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomer.timeline.converted}
                        onChange={(e) => updateCustomerStatus(selectedCustomer.id, 'converted', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">Marked as "Converted"</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomer.timeline.esaFunds}
                        onChange={(e) => updateCustomerStatus(selectedCustomer.id, 'esaFunds', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">Using ESA funds?</label>
                    </div>

                    {selectedCustomer.timeline.converted && (
                      selectedCustomer.timeline.confirmationEmailSent ? (
                        <p className="text-sm text-gray-600">Confirmation email sent on {formatDateTime(selectedCustomer.timeline.confirmationEmailSent)}</p>
                      ) : (
                        <button
                          onClick={() => {
                            setEmailType('confirmation');
                            setEmailContent(getTemplateHtml('confirmation', selectedCustomer));
                            setShowEmailModal(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Confirmation Email
                        </button>
                      )
                    )}

                    {selectedCustomer.timeline.esaFunds && (
                      selectedCustomer.timeline.esaTipsEmailSent ? (
                        <p className="text-sm text-gray-600">ESA Tips email sent on {formatDateTime(selectedCustomer.timeline.esaTipsEmailSent)}</p>
                      ) : (
                        <button
                          onClick={() => {
                            setEmailType('esaTips');
                            setEmailContent(getTemplateHtml('esaTips', selectedCustomer));
                            setShowEmailModal(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send ESA Tips Email
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Step 2: Process Enrollment</h4>
                  {selectedCustomer.timeline.confirmationEmailSent && (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomer.timeline.consentsCompleted}
                          onChange={(e) => updateCustomerStatus(selectedCustomer.id, 'consentsCompleted', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">Consent completed</label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomer.timeline.paymentCompleted}
                          onChange={(e) => updateCustomerStatus(selectedCustomer.id, 'paymentCompleted', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">Payment completed</label>
                      </div>

                      {selectedCustomer.timeline.consentsCompleted && selectedCustomer.timeline.paymentCompleted && (
                        selectedCustomer.timeline.enrollmentEmailSent ? (
                          <p className="text-sm text-gray-600">Enrollment email sent on {formatDateTime(selectedCustomer.timeline.enrollmentEmailSent)}</p>
                        ) : (
                          <button
                              onClick={() => {
                                setEmailType('enrollment');
                                setEmailContent(getTemplateHtml('enrollment', selectedCustomer));
                                setShowEmailModal(true);
                              }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Enrollment Email
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Step 3: Parent Support Handoff</h4>
                  {selectedCustomer.timeline.enrollmentEmailSent && !selectedCustomer.timeline.parentSupportEmailSent && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Parent Support Specialist:</label>
                        <select
                          value={selectedSupportSpecialist}
                          onChange={(e) => setSelectedSupportSpecialist(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {parentSupportStaff.map(specialist => (
                            <option key={specialist.id} value={specialist.id}>
                              {specialist.name} - {specialist.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                          onClick={() => {
                          setEmailType('parentSupport');
                          setEmailContent(getTemplateHtml('parentSupport', selectedCustomer));
                          setShowEmailModal(true);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Parent Support Welcome
                      </button>
                    </div>
                  )}

                  {selectedCustomer.timeline.parentSupportEmailSent && (
                    <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Parent Support email sent on {formatDateTime(selectedCustomer.timeline.parentSupportEmailSent)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal - FIXED */}
      {showTemplateEditor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">Edit Email Templates</h3>
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(emailTemplates).map(([type, template]) => (
                <div key={type} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg font-semibold capitalize mb-2 text-gray-800">
                    {type === 'parentSupport' ? 'Parent Support' : type === 'esaTips' ? 'ESA Tips' : type}
                  </h4>
                  
                  <label className="block text-sm text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={template.subject}
                    onChange={(e) => updateEmailTemplate(type, 'subject', e.target.value)}
                    className="w-full mt-1 mb-3 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <label className="block text-sm text-gray-700 mb-1">Body</label>
                  {templateModes[type] === 'text' ? (
                    <textarea
                      rows={8}
                      value={template.body}
                      onChange={(e) => updateEmailTemplate(type, 'body', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  ) : (
                    <div>
                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={() => applyFormat('bold')}
                          onMouseDown={(e) => e.preventDefault()}
                          className="px-2 py-1 border rounded text-xs font-semibold"
                        >
                          B
                        </button>
                        <button
                          onClick={() => applyFormat('italic')}
                          onMouseDown={(e) => e.preventDefault()}
                          className="px-2 py-1 border rounded text-xs italic"
                        >
                          I
                        </button>
                        <button
                          onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) applyFormat('createLink', url);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          Link
                        </button>
                        <button
                          onClick={() => applyFormat('formatBlock', 'h1')}
                          onMouseDown={(e) => e.preventDefault()}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          H1
                        </button>
                        <button
                          onClick={() => applyFormat('formatBlock', 'h2')}
                          onMouseDown={(e) => e.preventDefault()}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          H2
                        </button>
                      </div>
                      <div
                        contentEditable
                        className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                        dangerouslySetInnerHTML={{ __html: template.body }}
                        onInput={(e) => updateEmailTemplate(type, 'body', e.currentTarget.innerHTML)}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => toggleTemplateMode(type)}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Switch to {templateModes[type] === 'text' ? 'HTML' : 'Plain Text'}
                  </button>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Available merge fields:</strong><br />
                    {type === 'parentSupport' 
                      ? 'parentFirstName, studentFirstName, startDate, supportName'
                      : 'parentFirstName, studentFirstName, startDate, advisorName'
                    }
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save Templates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Send {emailType === 'parentSupport' ? 'Parent Support' : emailType === 'esaTips' ? 'ESA Tips' : emailType.charAt(0).toUpperCase() + emailType.slice(1)} Email
                </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
                <p className="text-sm text-gray-900">{selectedCustomer.parentEmail}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From:</label>
                <p className="text-sm text-gray-900">
                  {emailType === 'parentSupport' ? 
                    parentSupportStaff.find(ps => ps.id === selectedSupportSpecialist).email :
                    programAdvisors.find(pa => pa.id === selectedCustomer.advisorId).email
                  }
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                <input
                  type="text"
                  value={emailTemplates[emailType] ? populateTemplate(emailTemplates[emailType].subject || '', selectedCustomer) : ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={() => applyFormat('bold')}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-2 py-1 border rounded text-xs font-semibold"
                  >
                    B
                  </button>
                  <button
                    onClick={() => applyFormat('italic')}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-2 py-1 border rounded text-xs italic"
                  >
                    I
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt('Enter URL');
                      if (url) applyFormat('createLink', url);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    Link
                  </button>
                  <button
                    onClick={() => applyFormat('formatBlock', 'h1')}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => applyFormat('formatBlock', 'h2')}
                    onMouseDown={(e) => e.preventDefault()}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    H2
                  </button>
                </div>
                <div
                  ref={emailContentRef}
                  contentEditable
                  onInput={(e) => setEmailContent(e.currentTarget.innerHTML)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: emailContent }}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={copyEmail}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Email
                </button>
                <button
                  onClick={() => markEmailSent(selectedCustomer.id, emailType)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Sent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesFlowApp;