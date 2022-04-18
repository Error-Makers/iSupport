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

describe("users routes", () => {
  it("Get users list", async () => {
    const response = await request.get("/users");
    expect(response.status).toEqual(200);
  });
  it("Get single user", async () => {
    const response = await request.get("/users/1");
    expect(response.status).toEqual(200);
  });
});
