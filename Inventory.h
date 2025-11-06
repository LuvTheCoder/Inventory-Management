#ifndef INVENTORY_H
#define INVENTORY_H

#include "Product.h"
#include <vector>
#include <fstream>

using namespace std;

class Inventory {
private:
    vector<Product> products;

public:
    void loadProducts();
    void saveProducts();
    void addProduct();
    void displayProducts();
    void updateStock(int id, int qtyChange);
    double getProductPrice(int id);
    vector<Product>& getProducts(); // This is key for the billing fix
};

#endif