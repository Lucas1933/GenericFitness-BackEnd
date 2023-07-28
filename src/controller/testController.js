import TestService from "../service/testService.js";
import { OK } from "../utils/httpReponses.js";
const testService = new TestService();
export default class TestController {
  getMockedProducts(req, res) {
    const mockedProducts = testService.getMockedProducts();
    res.status(OK).send(mockedProducts);
  }
}
