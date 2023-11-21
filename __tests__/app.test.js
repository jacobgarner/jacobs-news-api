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

describe("/api/articles/:article_id", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api/articles/2").expect(200);
  });
  it("GET responds with status code 200", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body.article[0].article_id).toEqual(2)
        expect(response.body.article[0]).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("Reponds 400 if invalid article id is provided", () => {
    return request(app).get("/api/articles/cat").expect(400);
  });
  it("Reponds with 'bad request' as error message if provided something other than number as article id", () => {
    return request(app)
      .get("/api/articles/cat")
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  it("Reponds with 'bad request' as error message if article id does not exist", () => {
    return request(app)
      .get("/api/articles/306")
      .expect(404)
      .then((response) => {
        expect(response.body.err).toBe("Article does not exist");
      });
  });
});
