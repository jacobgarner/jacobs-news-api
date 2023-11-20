const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("GET responds with slug and description fields", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/doesNotExist", () => {
  it("Invalid URL returns 404", () => {
    return request(app).get("/api/doesNotExist").expect(404);
  });
});

describe("/api", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api").expect(200);
  });
  it("GET responds with all apis objects", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(typeof response.body.apis).toEqual("object");
        expect(response.body.apis["GET /api"].description).toBe(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});
