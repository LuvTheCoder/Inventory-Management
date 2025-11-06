#include "Billing.h"
#include <iostream>
#include <iomanip>
#include <limits> // <-- ADD THIS

using namespace std;

void Billing::generateBill(Inventory &inv) {
    int id, qty;
    double total = 0.0;

    cout << "\n--- GENERATE BILL ---\n";
    
    while (true) {
        cout << "Enter Product ID (-1 to stop): ";
        
        // --- Validation for ID ---
        if (!(cin >> id)) {
            cout << "\nError: Invalid ID. Please enter a number.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue; // Ask for ID again
        }

        if (id == -1) break;

        cout << "Enter Quantity: ";
        // --- Validation for Quantity ---
        if (!(cin >> qty)) {
            cout << "\nError: Invalid Quantity. Please enter a number.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue; // Ask for Quantity again (for the same ID)
        }

        if (qty <= 0) {
            cout << "Quantity must be positive.\n";
            continue;
        }

        // --- Stock Check Logic (from before) ---
        Product* productToBuy = nullptr;
        for (auto &p : inv.getProducts()) {
            if (p.id == id) {
                productToBuy = &p;
                break;
            }
        }

        if (productToBuy == nullptr) {
            cout << "Error: Product ID " << id << " not found.\n";
            continue;
        }

        if (productToBuy->quantity < qty) {
            cout << "Error: Not enough stock for '" << productToBuy->name 
                 << "'. Only " << productToBuy->quantity << " available.\n";
            continue;
        }
        // --- End Stock Check ---

        double cost = qty * productToBuy->price;
        total += cost;
        inv.updateStock(id, -qty); 

        cout << "Added to bill: " << productToBuy->name << " (x" << qty << ") - $" 
             << fixed << setprecision(2) << cost << endl;
    }

    cout << "\n----------------------\n";
    cout << "Total Bill: $" << fixed << setprecision(2) << total << endl;
    cout << "----------------------\n";
}