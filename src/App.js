import { useEffect, useState } from 'react';
import { Users, Clock, User, Mail, CheckCircle } from 'lucide-react';
import CustomerTable from './components/CustomerTable';
import { supabase } from './supabaseClient.js';

export default function App() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true });
      if (error) console.error('Database connection error:', error.message);
      else console.log('Database connection established');
    }

    async function load() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at');
      if (error) console.error(error);
      setCustomers(data || []);
    }

    checkConnection();
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Alpha Anywhere - Customer Onboarding
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <CustomerTable customers={customers} onSelect={() => {}} />
        </div>
      </div>
    </div>
  );
}