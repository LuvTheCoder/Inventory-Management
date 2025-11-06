import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Inventory } from './components/Inventory';
import { Billing } from './components/Billing';
import { Reports } from './components/Reports';

type Tab = 'inventory' | 'billing' | 'reports';

function App() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('inventory');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7fafc'
      }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#667eea',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'white'
            }}>
              IMS
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0
            }}>
              Inventory Management System
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {user.email}
            </span>
            <button
              onClick={signOut}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: activeTab === 'inventory' ? '#667eea' : '#6b7280',
                cursor: 'pointer',
                borderBottom: activeTab === 'inventory' ? '3px solid #667eea' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: activeTab === 'billing' ? '#667eea' : '#6b7280',
                cursor: 'pointer',
                borderBottom: activeTab === 'billing' ? '3px solid #667eea' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              Billing
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: activeTab === 'reports' ? '#667eea' : '#6b7280',
                cursor: 'pointer',
                borderBottom: activeTab === 'reports' ? '3px solid #667eea' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              Reports
            </button>
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'inventory' && <Inventory />}
            {activeTab === 'billing' && <Billing />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
