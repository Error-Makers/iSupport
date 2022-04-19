"use strict";

const server = require("../src/server");

const supertest = require("supertest");

const request = supertest(server.app);
const database = require("../src/db/models/index");

beforeAll(async () => {
  await database.sequelize.sync();
});
afterAll(async () => {
  await database.sequelize.drop();
});

describe("auth routes", () => {
  it("POST /signup creates a new user", async () => {
    let user = {
      username: "kqinneh",
      password: "1234",
      role: "user",
    };
    const response = await request.post("/signup").send(user);
    expect(response.status).toEqual(201);
  });

  it("POST to /signin to login as a user (use basic auth)", async () => {
    let user = {
      username: "kqinneh",
      password: "1234",
      role: "admin",
    };
    const response = await request
      .post("/signin")
      .auth(user.username, user.password);
    expect(response.status).toBe(200);
  });
  it("logout feature", async () => {
    const response = await request.get("/logout/1");
    expect(response.status).toEqual(200);
  });
  it("Delete user", async () => {
    const response = await request.get("/delete-user/1");
    expect(typeof response.body).toEqual("object");
  });
  it("Update user", async () => {
    let user = {
      username: "kqinneh",
      password: "1234",
      role: "admin",
    };
    const response = await request.post("/update-user/1");
    expect(typeof response.body).toEqual("object");
    expect(response.status).toBe(200);
  });
});
