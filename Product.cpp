#include "Product.h"
#include <iostream>
#include <iomanip> // For formatting

using namespace std;

Product::Product(int id, string name, int qty, double price) {
    this->id = id;
    this->name = name;
    this->quantity = qty;
    this->price = price;
}

void Product::display() const {
    // Use iomanip for clean columns
    cout << left << setw(5) << id 
         << left << setw(25) << name 
         << left << setw(10) << quantity 
         << left << setw(10) << fixed << setprecision(2) << price 
         << endl;
}