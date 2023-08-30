import { faker } from "@faker-js/faker";
export default class TestService {
  getMockedProducts() {
    const mockedProducts = [];

    for (let i = 0; i < 100; i++) {
      mockedProducts.push({
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [],
        code: faker.string.alphanumeric(5),
        stock: faker.number.int(500),
      });
    }
    return mockedProducts;
  }
}
