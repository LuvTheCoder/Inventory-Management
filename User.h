#ifndef USER_H
#define USER_H

#include <string>

using namespace std;

class User {
private:
    string username;
    string password;

public:
    User(string uname, string pass);
    bool login();
    static void signup(); // Static so it can be called before a User object exists
};

#endif