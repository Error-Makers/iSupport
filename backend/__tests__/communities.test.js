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
  it("Get communities", async () => {
    const response = await request.get("/communities");
    expect(response.status).toEqual(200);
  });
  // it("Get trending communities", async () => {
  //   const response = await request.get("/trending");
  //   expect(response.status).toEqual(200);
  // });
  it("Get a specific community", async () => {
    const response = await request.get("//community/1");
    expect(response.status).toEqual(200);
  });
  it("Create community", async () => {
    const response = await request.get("/create-community");
    expect(response.status).toEqual(200);
  });
});
