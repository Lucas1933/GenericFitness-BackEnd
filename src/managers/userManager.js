import fs from "fs";
class UsersManager {
  path;
  users;
  constructor(path) {
    this.path = path;
    this.users = [];
  }

  createUser(user) {
    this.users.push(user);
    fs.writeFileSync(this.path, JSON.stringify(this.users));
  }
}
let dummyUser = {
  name: "Victor",
  lastName: "Tortazo",
  age: 23,
  course: "advanced mathematics",
};
let dummyUser2 = {
  name: "Jose",
  lastName: "Gonzales",
  age: 53,
  course: "bakery",
};
let dummyUser3 = {
  name: "Miguel",
  lastName: "Salvador",
  age: 53,
  course: "carpentry",
};
let userManager = new UsersManager("../users.json");
userManager.createUser(dummyUser);
userManager.createUser(dummyUser2);
userManager.createUser(dummyUser3);
userManager.createUser(dummyUser);
