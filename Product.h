#ifndef PRODUCT_H
#define PRODUCT_H

#include <iostream>
#include <string>

// Added "using namespace std;" to match your other files
using namespace std; 

class Product {
public:
    int id;
    string name;
    int quantity;
    double price;

    Product(int id = 0, string name = "", int qty = 0, double price = 0.0);
    void display() const;
};

#endif