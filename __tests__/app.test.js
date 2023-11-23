const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
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
        expect(response.body.article[0].article_id).toEqual(2);
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

describe("GET /api/articles", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  it("GET responds with slug and description fields", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("GET responds with status code 200", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.comments.length).toBe(11);

        response.body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  it("Reponds 400 if invalid article id is provided", () => {
    return request(app)
      .get("/api/articles/cat/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("bad request");
      });
  });
  it("Responds with 'does not exist' if valid article ID provided that does not exist", () => {
    return request(app)
      .get("/api/articles/345/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.err).toBe("Article does not exist");
      });
  });
  it("Responds with 200 and empty array if no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("returns 201 and correct comment body when all details correct ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "my comment is here",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((comment) => {
        const addedComment = comment.body.addedComment
        expect(newComment.body).toEqual(addedComment.body);
        expect(newComment.username).toEqual(addedComment.author)
        expect(comment.body.addedComment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String)
        })
      });
  });
  it("Responds with a 404 if the article id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "my comment is here",
    };
    return request(app)
      .post("/api/articles/345/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.err).toEqual("Article does not exist");
      });
  });
  it("Responds with a 404 if the username does not exist", () => {
    const commentToAdd = { username: "doh", body: "my comment is here" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(404)
      .then((response) => {
        expect(response.body.err).toEqual("User does not exist");
      });
  });
  it("Responds with 400 if username or body is missing", () => {
    const commentToAdd = { body: "my comment is here" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(400)
      .then((response) => {
        expect(response.body.err).toEqual(
          "request body must include username and body properties"
        );
      });
  })
  it("Responds with 400 if article id provided is invalid",()=>{
    const newComment = {
      username: "butter_bridge",
      body: "my comment is here",
    };
    return request(app)
      .post("/api/articles/cat/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual(
          "bad request"
        );
      });
  })
  it("Responds 201 if additional fields are provided in the req body",()=>{
    const newComment = {
      username: "butter_bridge",
      body: "my comment is here",
      favFood: "pancakes"
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((comment) => {
        const addedComment = comment.body.addedComment.body;
        expect(newComment.body).toEqual(addedComment);
      });
  })
});

describe("PATCH /api/articles/:article_id", ()=>{
  it("Return 201 and updated article", ()=>{
  const patchObj = {inc_votes:5}
  return request(app)
  .patch("/api/articles/1")
  .send(patchObj)
  .expect(200)
  .then((response)=>{
    expect(response.body.votes).toBe(105)
    expect(response.body.article_id).toBe(1)
    expect(response.body).toMatchObject({
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      article_img_url: expect.any(String),
    })
  })
  })
  it("Returns 404 if valid article id does not exist",()=>{
    const patchObj = {inc_votes:5}
  return request(app)
  .patch("/api/articles/1000")
  .send(patchObj)
  .expect(404)
  .then((response)=>{
    expect(response.body.err).toBe("Article does not exist")
  })
  })
  it("Responds with 400 if vote count is missing",()=>{
    const patchObj = {}
  return request(app)
  .patch("/api/articles/1")
  .send(patchObj)
  .expect(400)
  .then((response)=>{
    expect(response.body.err).toBe('Missing vote count')
  })
  })
  it("Returns 400 if invalid article id provided",()=>{
    const patchObj = {inc_votes:5}
    return request(app)
  .patch("/api/articles/cat")
  .send(patchObj)
  .expect(400)
  .then((response)=>{
    expect(response.body.msg).toBe("bad request")
  })
  })
  it("Responds with 400 if vote count is not a number",()=>{
    const patchObj = {inc_votes:"dog"}
  return request(app)
  .patch("/api/articles/1")
  .send(patchObj)
  .expect(400)
  .then((response)=>{
    expect(response.body.msg).toBe('bad request')
  })
  })
})

describe("DELETE /api/comments/:comment_id", ()=>{
  it("responds 204 after successful deletion", ()=>{
    return request(app)
  .delete("/api/comments/2")
  .expect(204)
  })
  it("Returns 404 if valid comment id does not exist",()=>{
    return request(app)
  .delete("/api/comments/10000")
  .expect(404)
  .then((response)=>{
    expect(response.body.err).toBe("Comment does not exist")
  })
  })
  it("Returns 400 if invalid comment id provided",()=>{
    return request(app)
  .delete("/api/comments/cat")
  .expect(400)
  .then((response)=>{
    expect(response.body.msg).toBe("bad request")
  })
})})

describe("/api/users", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  it("GET responds with correct fields", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});

describe("GET /api/articles can accept 'topic' as a query", () => {
  it("GET responds with status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  it("GET responds with articles with 'mitch' as the topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .then((response) => {
        expect(response.body.length).toBe(12);
        response.body.forEach((article) => {
          expect(article.topic).toEqual("mitch")
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  })
  it("Returns 400 if topic does not exist",()=>{
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(400)
      .then((response)=>{
        expect(response.body.err).toBe("topic does not exist")
      })
  })
  it("Returns 200 if topic exists but has no articles",()=>{
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response)=>{
        expect(response.body).toEqual([])
      })
  })
});