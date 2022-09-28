require("dotenv").config();

const express = require("express");
const supertest = require("supertest");
const v1 = require("../../src/routes/v1");

const { db } = require("../../src/models/index");

const app = express();
app.use(express.json());
app.use("/api/v1", v1);

const request = supertest(app);

describe("v1 Routes", () => {
  describe("Food routes", () => {
    beforeEach(async () => {
      await db.sync({ force: true });
    });
    /*
    afterEach(async () => {
      await db.sync({ force: true });
    });
    */
    test("get a list of foods", async () => {
      const resp = await request.get("/api/v1/food");
      expect(resp.body).toEqual([]);
    });
    test("post creates a food item", async () => {
      await request
        .post("/api/v1/food")
        .send({ name: "banana", calories: 105, type: "fruit" })
        .expect(201);
      const resp = await request.get("/api/v1/food");
      expect(resp.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "banana",
            calories: 105,
            type: "fruit",
          }),
        ])
      );
    });
    test("update a food", async () => {
      const resp = await request
        .post("/api/v1/food")
        .send({ name: "banana", calories: 105, type: "fruit" })
        .expect(201);

      const fruit = resp.body;
      const respUpdated = await request
        .put(`/api/v1/food/${fruit.id}`)
        .send({ name: "plantain" });
      const fruitUpdated = respUpdated.body;
      expect(fruitUpdated.name).toBe("plantain");
    });

    test("delete a food", async () => {
      const resp = await request
        .post("/api/v1/food")
        .send({ name: "banana", calories: 105, type: "fruit" });
      const fruit = resp.body;
      const respDeleted = await request
        .delete(`/api/v1/food/${fruit.id}`)
        .expect(200);
      expect(respDeleted.body).toBe(1);
      const fruit2 = await request.get(`/api/v1/food/${fruit.id}`);
      expect(fruit2.body).toBeNull();
    });
  });
});
