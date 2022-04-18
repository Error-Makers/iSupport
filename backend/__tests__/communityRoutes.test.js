"use strict";
// process.env.SECRET = "test";
const server = require("../src/server");
const supertest = require("supertest");
const db = require("../src/db/models/index");
const request = supertest(server.app);
let id;
let Users = {
  admin: { username: "admin", password: "password", role: "admin" },
  moderator: { username: "editor", password: "password", role: "moderator" },
  user: { username: "user", password: "password", role: "user" },
};
beforeAll(async () => {
  await db.sequelize.sync();
});
afterAll(async () => {
  await db.sequelize.drop();
});
Object.keys(Users).forEach((element) => {
  describe("testing  comunity route", () => {
    it("post signup and create new community", async () => {
      let Auth = await request.post("/signup").send(Users[element]);
      let userToken = Auth.body.token;
      const response = await request
        .post("/community")
        .send({
          community_name: "test comm3",
          community_desc: "testdes",
          user_id: 3,
        })
        .set("Authorization", `Bearer ${userToken}`);
      id = response.body.id;
      if (element.role === "moderator" || element.role === "admin") {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(403);
      }
    });

    it("testing get one community by id", async () => {
      let Auth = await request
        .post("/signin")
        .auth(Users[element].username, Users[element].password);
      let userToken = Auth.body.token;
      const response = await request
        .get(`/community/1`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toEqual(500);
    });
  });
});
