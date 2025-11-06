#include "User.h"
#include <iostream>
#include <fstream>
#include <string>
#include <limits> // Required for clearing input buffer

using namespace std;

// Constructor
User::User(string uname, string pass) {
    this->username = uname;
    this->password = pass;
}

// Static signup method
void User::signup() {
    string uname, pass;
    
    cout << "Enter new admin username: ";
    // Use getline() to allow for spaces
    getline(cin, uname); 

    cout << "Enter new password: ";
    // Use getline() for the password too
    getline(cin, pass); 

    // Save credentials to file (simple, insecure plaintext)
    ofstream fout("credentials.txt");
    if (!fout) {
        cout << "Error: Could not create credentials file.\n";
        return;
    }
    fout << uname << endl;
    fout << pass << endl;
    fout.close();

    cout << "Signup successful!\n";
}

// Login method
bool User::login() {
    string stored_uname, stored_pass;
    ifstream fin("credentials.txt");

    if (!fin) {
        cout << "Error: credentials file missing. Please signup first.\n";
        return false;
    }

    // Read credentials using getline to match how they were saved
    getline(fin, stored_uname);
    getline(fin, stored_pass);
    fin.close();

    // Check if entered credentials match stored credentials
    if (this->username == stored_uname && this->password == stored_pass) {
        return true;
    } else {
        return false;
    }
}