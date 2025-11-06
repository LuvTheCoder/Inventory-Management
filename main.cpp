#include "User.h"
#include "Inventory.h"
#include "Billing.h"
#include "Report.h"
#include <iostream>
#include <string>
#include <limits> // <-- ADD THIS

using namespace std;

int main() {
    cout << "==== INVENTORY MANAGEMENT SYSTEM ====\n";

    int choice;
    cout << "1. Signup\n2. Login\nChoice: ";
    
    // --- Input validation for first choice ---
    if (!(cin >> choice)) {
        cout << "Invalid choice. Goodbye!\n";
        return 0; // Exit if input is not a number
    }
    // --- End validation ---

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    if (choice == 1) {
        User::signup();
        cout << "\nSignup complete. Please run the program again to log in.\n";
        return 0; 
    } 
    
    if (choice == 2) {
        // ... (Login process is fine) ...
        string uname, pass;
        cout << "Enter username: ";
        getline(cin, uname); 

        cout << "Enter password: ";
        getline(cin, pass);

        User admin(uname, pass);
        if (!admin.login()) {
            cout << "Login failed. Invalid username or password.\n";
            return 0;
        }
        cout << "\nLogin successful! Welcome.\n";
    } else {
        cout << "Invalid choice. Goodbye!\n";
        return 0;
    }

    Inventory inv;
    Billing bill;
    Report rpt;
    inv.loadProducts(); 

    while (true) {
        cout << "\n--- Main Menu ---\n";
        cout << "1. Add Product\n";
        cout << "2. Display Products\n";
        cout << "3. Update Stock\n";
        cout << "4. Generate Bill\n";
        cout << "5. Low Stock Report\n";
        cout << "6. Exit\n";
        cout << "Choice: ";

        // --- Input validation block for Main Menu ---
        if (!(cin >> choice)) { // If reading into choice fails
            cout << "\nError: Invalid input. Please enter a number (1-6).\n";
            cin.clear(); // Clear the fail state
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Discard the bad input
            continue; // Go back to the start of the while loop
        }
        // --- End validation block ---

        switch (choice) {
            case 1: inv.addProduct(); break;
            case 2: inv.displayProducts(); break;
            case 3: {
                int id, qty;
                cout << "Enter Product ID: ";
                
                // --- Validation for ID ---
                if (!(cin >> id)) {
                    cout << "\nError: Invalid input. ID must be a number.\n";
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    break; // Break out of case 3, go back to menu
                }
                
                cout << "Enter quantity to add (e.g., 10 or -5): ";
                
                // --- Validation for Qty ---
                if (!(cin >> qty)) {
                    cout << "\nError: Invalid input. Quantity must be a number.\n";
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    break; // Break out of case 3, go back to menu
                }

                inv.updateStock(id, qty);
                break;
            }
            case 4: bill.generateBill(inv); break;
            case 5: rpt.lowStockReport(inv); break;
            case 6: cout << "Goodbye!\n"; return 0;
            default: cout << "Invalid choice. Please enter a number (1-6).\n";
        }
    }
}