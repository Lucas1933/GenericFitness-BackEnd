export default class UserTokenDto {
  constructor(user) {
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.email = user.email;
    this.role = user.role;
    this.cart = user.cart;
  }

  plain() {
    return {
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      cart: this.cart,
    };
  }
}
