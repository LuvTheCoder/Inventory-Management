/*
  # Create Bills and Bill Items Tables

  1. New Tables
    - `bills`
      - `id` (uuid, primary key) - Bill ID
      - `total` (numeric) - Total bill amount
      - `created_by` (uuid) - User who created the bill
      - `created_at` (timestamptz) - Bill creation timestamp

    - `bill_items`
      - `id` (uuid, primary key) - Bill item ID
      - `bill_id` (uuid, foreign key) - Reference to bills table
      - `product_id` (integer, foreign key) - Reference to products table
      - `product_name` (text) - Product name at time of purchase
      - `quantity` (integer) - Quantity purchased
      - `price` (numeric) - Price at time of purchase
      - `subtotal` (numeric) - Item subtotal

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their bills
    - Add policies for authenticated users to view bill items
*/

CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bills"
  ON bills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own bills"
  ON bills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can read bill items for their bills"
  ON bill_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bills
      WHERE bills.id = bill_items.bill_id
      AND bills.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert bill items for their bills"
  ON bill_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bills
      WHERE bills.id = bill_items.bill_id
      AND bills.created_by = auth.uid()
    )
  );
