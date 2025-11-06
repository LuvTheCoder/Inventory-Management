import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';

export const Reports = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    fetchLowStockProducts();
  }, [threshold]);

  const fetchLowStockProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lt('quantity', threshold)
      .order('quantity', { ascending: true });

    if (error) {
      console.error('Error fetching low stock products:', error);
    } else {
      setLowStockProducts(data || []);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c' }}>
          Low Stock Report
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
            Threshold:
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 5)}
            min="1"
            style={{
              width: '80px',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Loading report...
        </div>
      ) : lowStockProducts.length === 0 ? (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✓</div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            All products are well stocked!
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            No products found with quantity below {threshold}
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} running low
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                Consider restocking soon to avoid stockouts
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                  <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Name</th>
                  <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Stock</th>
                  <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                  <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.875rem', color: '#2d3748', fontSize: '0.875rem' }}>
                      {product.id}
                    </td>
                    <td style={{ padding: '0.875rem', color: '#2d3748', fontSize: '0.875rem', fontWeight: '500' }}>
                      {product.name}
                    </td>
                    <td style={{ padding: '0.875rem', fontSize: '0.875rem' }}>
                      <span style={{
                        backgroundColor: product.quantity === 0 ? '#fee2e2' : '#fef3c7',
                        color: product.quantity === 0 ? '#991b1b' : '#92400e',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '12px',
                        fontSize: '0.8125rem',
                        fontWeight: '600'
                      }}>
                        {product.quantity} {product.quantity === 0 ? '(Out of Stock)' : ''}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem', color: '#2d3748', fontSize: '0.875rem', fontWeight: '600' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '0.875rem', fontSize: '0.875rem' }}>
                      <span style={{
                        backgroundColor: product.quantity === 0 ? '#dc2626' : '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '12px',
                        fontSize: '0.8125rem',
                        fontWeight: '600'
                      }}>
                        {product.quantity === 0 ? 'Critical' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
