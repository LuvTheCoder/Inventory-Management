#ifndef BILLING_H
#define BILLING_H

#include "Inventory.h" // Already includes Product.h, vector, etc.

using namespace std;

class Billing {
public:
    void generateBill(Inventory &inv);
};

#endif