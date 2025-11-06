#include "Report.h"
#include "Product.h" // Need this to access Product::display
#include <iostream>
#include <iomanip> // For formatting

using namespace std;

void Report::lowStockReport(Inventory &inv) {
    cout << "\n==== LOW STOCK REPORT (Qty < 5) ====\n";
    cout << left << setw(5) << "ID" 
         << left << setw(25) << "Name" 
         << left << setw(10) << "Qty" 
         << left << setw(10) << "Price" << endl;
    cout << "---------------------------------------------------\n";

    bool found = false;
    for (auto &p : inv.getProducts()) {
        if (p.quantity < 5) {
            p.display();
            found = true;
        }
    }

    if (!found) {
        cout << "No low stock products found.\n";
    }
    cout << "---------------------------------------------------\n";
}