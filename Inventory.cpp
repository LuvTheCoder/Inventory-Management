#include "Inventory.h"
#include <iostream>
#include <fstream>
#include <sstream>  
#include <string>   
#include <limits>   // <-- ADD THIS
#include <iomanip>  

using namespace std;

// ... (loadProducts, saveProducts, displayProducts functions are fine) ...
// ... (Make sure they are the same as the previous versions I sent) ...
void Inventory::loadProducts() {
    products.clear();
    ifstream fin("products.txt");
    if (!fin) {
        cout << "No existing products file found. A new one will be created.\n";
        return;
    }

    string line;
    while (getline(fin, line)) {
        stringstream ss(line);
        string segment;
        Product p;

        try {
            getline(ss, segment, ',');
            p.id = stoi(segment);
            
            getline(ss, segment, ',');
            p.name = segment;
            
            getline(ss, segment, ',');
            p.quantity = stoi(segment);
            
            getline(ss, segment, ',');
            p.price = stod(segment);
            
            products.push_back(p);
        } catch (...) {
            cout << "Warning: Skipping malformed line in products.txt\n";
        }
    }
    fin.close();
}

void Inventory::saveProducts() {
    ofstream fout("products.txt");
    for (auto &p : products) {
        fout << p.id << "," << p.name << "," << p.quantity << "," << p.price << endl;
    }
    fout.close();
}

void Inventory::addProduct() {
    Product p;
    
    cout << "Enter Product ID: ";
    // --- Validation for ID ---
    if (!(cin >> p.id)) {
        cout << "\nError: Invalid ID. Please enter a number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return; // Exit the function
    }

    // --- Fix for reading names with spaces ---
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Clear newline
    
    cout << "Enter Name: ";
    getline(cin, p.name); // Read the entire line
    // --- End Fix ---

    cout << "Enter Quantity: ";
    // --- Validation for Quantity ---
    if (!(cin >> p.quantity)) {
        cout << "\nError: Invalid Quantity. Please enter a number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return; // Exit the function
    }

    cout << "Enter Price: ";
    // --- Validation for Price ---
    if (!(cin >> p.price)) {
        cout << "\nError: Invalid Price. Please enter a number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return; // Exit the function
    }

    products.push_back(p);
    saveProducts(); // Save to file immediately
    cout << "Product added successfully!\n";
}

void Inventory::displayProducts() {
    cout << "\n--- CURRENT INVENTORY ---\n";
    cout << left << setw(5) << "ID" 
         << left << setw(25) << "Name" 
         << left << setw(10) << "Qty" 
         << left << setw(10) << "Price" << endl;
    cout << "---------------------------------------------------\n";
    for (auto &p : products) {
        p.display();
    }
    cout << "---------------------------------------------------\n";
}

void Inventory::updateStock(int id, int qtyChange) {
    for (auto &p : products) {
        if (p.id == id) {
            p.quantity += qtyChange;
            saveProducts();
            cout << "Stock for '" << p.name << "' updated. New Qty: " << p.quantity << endl;
            return;
        }
    }
    cout << "Error: Product ID " << id << " not found.\n";
}

double Inventory::getProductPrice(int id) {
    for (auto &p : products) {
        if (p.id == id) {
            return p.price;
        }
    }
    return 0.0;
}

vector<Product>& Inventory::getProducts() {
    return products;
}