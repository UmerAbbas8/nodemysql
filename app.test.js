const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Test to find treasure within 1/10Km", () => {
  test("It should response the POST method", done => {
    request(app)
      .post("/find_treasure", {"latitude":'1.3273451', "longitude":"103.8756757", "distance":"1"})
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBeDefined();
        done();
      });
  });
});




