import TestService from "../service/services/test_service.js";
import { OK } from "../utils/http_responses.js";
const testService = new TestService();
export default class TestController {
  getMockedProducts(req, res) {
    const mockedProducts = testService.getMockedProducts();
    res.status(OK).send(mockedProducts);
  }
}
