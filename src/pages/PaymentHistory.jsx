import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PaymentHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load payment history from localStorage
  const getPaymentHistory = () => {
    try {
      const saved = window.localStorage.getItem('appointment_payment_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out dummy/old data that doesn't have the new format
        const filtered = parsed.filter(payment => {
          // Keep only new format data with proper fields
          return payment.id && payment.date && payment.amount && 
                 typeof payment.amount === 'number' && 
                 payment.transactionId && payment.service;
        });
        // If we filtered out old data, update localStorage
        if (filtered.length < parsed.length) {
          window.localStorage.setItem('appointment_payment_history', JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch (e) {
      // Clear corrupted data
      window.localStorage.removeItem('appointment_payment_history');
    }
    return [];
  };

  const [payments] = useState(getPaymentHistory());

  // Filter logic
  const filteredPayments = payments.filter((payment) => {
    // Search filter
    if (
      searchTerm &&
      !payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }

    // Method filter
    if (methodFilter !== 'all' && payment.method !== methodFilter) {
      return false;
    }

    return true;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    const amount = typeof payment.amount === 'string' ? parseInt(payment.amount.replace(/[^0-9]/g, '')) || 0 : payment.amount || 0;
    return sum + amount;
  }, 0);
  const completedPayments = filteredPayments.filter((p) => p.status?.toLowerCase() === 'completed').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      Khalti: 'bg-purple-100 text-purple-800',
      eSewa: 'bg-green-100 text-green-800',
      Card: 'bg-blue-100 text-blue-800',
      'Online Banking': 'bg-indigo-100 text-indigo-800',
      'Cash on Visitation': 'bg-amber-100 text-amber-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    // Create CSV data
    const headers = ['Payment ID', 'Date', 'Amount', 'Doctor', 'Service', 'Method', 'Status', 'Transaction ID'];
    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.date,
      payment.amount,
      payment.doctor,
      payment.service,
      payment.method,
      payment.status,
      payment.transactionId,
    ]);

    let csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    link.download = 'payment_history.csv';
    link.click();
  };

  const handleClearHistory = () => {
    setShowClearConfirm(true);
  };

  const confirmClearHistory = () => {
    window.localStorage.removeItem('appointment_payment_history');
    setShowClearConfirm(false);
    window.location.reload();
  };

  const cancelClearHistory = () => {
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white px-4 sm:px-6 lg:px-10 py-6 md:py-8 font-sans">
      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none">
          <style>{`
            @keyframes slideInFromTop {
              from {
                opacity: 0;
                transform: translateY(-50px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .clear-confirm-modal {
              animation: slideInFromTop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              pointer-events: auto;
            }
          `}</style>
          <div className="fixed inset-0 bg-black/50 pointer-events-auto" onClick={cancelClearHistory}></div>
          <div className="clear-confirm-modal bg-white rounded-[1.5rem] shadow-2xl p-8 w-full max-w-md relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900">Clear Payment History?</h2>
              <button
                onClick={cancelClearHistory}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                You are about to permanently delete all your payment history. <span className="font-bold text-red-600">This action cannot be undone.</span>
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Note:</span> If you need your payment history again, please contact <span className="font-bold">Swastha Sewa</span> support team.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelClearHistory}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearHistory}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Clear All History
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              title="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Payment History</h1>
              <p className="text-gray-500 mt-1">View and manage all your payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Clear History
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Payments Card */}
          <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold text-sm mb-1">Total Payments</p>
                <p className="text-3xl font-extrabold text-gray-900">{filteredPayments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold text-gray-900">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h-2M10 10h-2m8 0h2M6 10h2m6-4v8m0-8v-2m0 2v8m0 8v-8m0 8h8m-8-8H6m10 0h2m0 0V6m0 0v8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Payments Card */}
          <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold text-sm mb-1">Completed</p>
                <p className="text-3xl font-extrabold text-gray-900">{completedPayments}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Doctor name or Transaction ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Method Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Methods</option>
                <option value="Khalti">Khalti</option>
                <option value="eSewa">eSewa</option>
                <option value="Card">Card</option>
                <option value="Online Banking">Online Banking</option>
                <option value="Cash on Visitation">Cash on Visitation</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setMethodFilter('all');
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{payment.doctor}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{payment.service}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{(typeof payment.amount === 'string' ? parseInt(payment.amount.replace(/[^0-9]/g, '')) || 0 : payment.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(payment.method)}`}>
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
