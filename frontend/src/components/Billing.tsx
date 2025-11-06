import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BillItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export const Billing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<BillItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('quantity', 0)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const addToCart = () => {
    setError('');

    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product) {
      setError('Product not found');
      return;
    }

    const existingCartItem = cart.find(item => item.product.id === product.id);
    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;

    if (currentCartQty + qty > product.quantity) {
      setError(`Not enough stock. Only ${product.quantity - currentCartQty} more available.`);
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + qty, subtotal: (item.quantity + qty) * product.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity: qty,
        subtotal: qty * product.price
      }]);
    }

    setSelectedProductId('');
    setQuantity('1');
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQty > product.quantity) {
      setError(`Cannot exceed stock quantity of ${product.quantity}`);
      return;
    }

    setError('');
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQty, subtotal: newQty * item.product.price }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setError('');
    const total = getTotalAmount();

    const { data: billData, error: billError } = await supabase
      .from('bills')
      .insert([{
        total,
        created_by: user?.id
      }])
      .select()
      .single();

    if (billError) {
      setError('Error creating bill: ' + billError.message);
      return;
    }

    const billItems = cart.map(item => ({
      bill_id: billData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('bill_items')
      .insert(billItems);

    if (itemsError) {
      setError('Error saving bill items: ' + itemsError.message);
      return;
    }

    for (const item of cart) {
      const { error: stockError } = await supabase
        .from('products')
        .update({
          quantity: item.product.quantity - item.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.product.id);

      if (stockError) {
        console.error('Error updating stock:', stockError);
      }
    }

    setSuccess(`Bill created successfully! Total: $${total.toFixed(2)}`);
    setCart([]);
    fetchProducts();

    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>
        Generate Bill
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#2d3748' }}>
              Add Items
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Select Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: '#d1fae5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}

            <button
              onClick={addToCart}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                padding: '0.625rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#2d3748' }}>
              Cart ({cart.length} items)
            </h3>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '0.875rem' }}>
                Cart is empty. Add products to create a bill.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>{item.product.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          style={{
                            backgroundColor: '#e2e8f0',
                            border: 'none',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            lineHeight: '1'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            backgroundColor: '#e2e8f0',
                            border: 'none',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            lineHeight: '1'
                          }}
                        >
                          +
                        </button>
                        <span style={{ fontWeight: '700', color: '#2d3748', minWidth: '60px', textAlign: 'right' }}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '2px solid #e2e8f0',
                  paddingTop: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2d3748' }}>
                      Total:
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Complete Purchase
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
