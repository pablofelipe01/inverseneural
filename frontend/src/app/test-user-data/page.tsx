'use client';

import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';

export default function TestUserData() {
  const { user, profile, loading, refreshUser } = useUser();
  const [rawData, setRawData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Fetch raw user data from API
    const fetchRawData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        setRawData(data);
      } catch (error) {
        console.error('Error fetching raw data:', error);
      }
    };

    fetchRawData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">User Data Test</h1>
        
        <div className="grid gap-6">
          {/* User Context Data */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">User Context Data</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">User ID:</strong> {user?.id || 'No user'}</p>
              <p><strong className="text-white">Email:</strong> {user?.email || 'No email'}</p>
              <p><strong className="text-white">Profile exists:</strong> {profile ? 'Yes' : 'No'}</p>
              {profile && (
                <>
                  <p><strong className="text-white">Plan Type:</strong> {profile.plan_type || 'None'}</p>
                  <p><strong className="text-white">Subscription Status:</strong> {profile.subscription_status || 'None'}</p>
                  <p><strong className="text-white">Trial Ends:</strong> {profile.trial_ends_at || 'None'}</p>
                  <p><strong className="text-white">Stripe Customer ID:</strong> {profile.stripe_customer_id || 'None'}</p>
                  <p><strong className="text-white">Stripe Subscription ID:</strong> {profile.stripe_subscription_id || 'None'}</p>
                </>
              )}
            </div>
          </div>

          {/* Raw API Data */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Raw API Data</h2>
            <pre className="text-sm overflow-x-auto text-gray-300 bg-gray-900 p-4 rounded border">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Actions</h2>
                      <div className="space-x-4">
              <button
                onClick={refreshUser}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Refresh User Data
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
