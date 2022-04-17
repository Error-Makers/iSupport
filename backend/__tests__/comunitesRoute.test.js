"use strict";

process.env.SECRET = "test";

const server = require("../src/server");
const supertest = require("supertest");
const db = require("../src/db/models/index");
const request = supertest(server.app);

let Users = {
  admin: { username: "admin", password: "password", role: "admin" },
  moderator: { username: "editor", password: "password", role: "moderator" },
  user: { username: "user", password: "password", role: "user" },
};
beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});
Object.keys(Users).forEach((element) => {
  describe("testing  comunites route", () => {
    it("testing get all comunites fron database", async () => {
      let Auth = await request
        .post("/signin")
        .auth(Users[element].username, Users[element].password);
      let userToken = Auth.body.token;
      const response = await request
        .get(`/community`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toEqual(200);
    });
  });
});
