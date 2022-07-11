const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");


beforeEach(createData)

afterAll()


describe("GET /", function() {
  test("It should respond with list of all companies", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({
      "companies": [
        {code: "nintendo", name:"Nintendo"},
        {code: "capcom", name:"Capcom"}]
    });
  })
});


describe("GET /nintendo", function() {
  test("It returns a company's info", async function() {
    const resp = await request(app).get("/companies/nintendo")
    expect(resp.body).toEqual(
      {
        "company": {
          code: "nintendo",
          name: "Nintendo",
          description: "Gamecube and DS",
          invoices: [1]
        }
      });
    })

  test("It should return 404 for nonexistant company", async function() {
    const resp = await request(app).get("/companies/notexist")
    expect(resp.status).toEqual(404);
  })
});


describe("POST /", function() {
  test("It should add a company", async function() {
    const resp = await request(app).post("/companies")
    .send({code: "ubisoft", name: "Ubisoft", description: "French video game company"});

    expect(resp.body).toEqual(
      {
        "company": {
          code: "ubisoft",
          name: "Ubisoft",
          description: "French video game company",
        }
    });



  })
});


describe("PUT /nintendo", function() {
  test("It should edit a company", async function() {
    const resp = await request(app).put("/companies/nintendo")
    .send({name: "testNintendo", description: "test description"});

    expect(resp.body).toEqual(
      {
        "company": {
          code: "nintendo",
          name: "testNintendo",
          description: "test description"
        }
      });
  });

  test("It should 404 if company doesn't exist" async function() {
    const resp = await request(app).put("/companies/notacompany")
    .send({name: "nonexistant"});

    expect(resp.status).toEqual(404)
  });
});


describe("DELETE /nintendo", function() {
  test("It should delete a company", async function() {
    const resp = await request(app).delete("/companies/nintendo");

    expect(resp.body).toEqual({"status": "deleted"});
  });

  test("It should return 404 if company does not exist", async function() {
    const resp = await request(app).delete("companies/nonexistant");
    expect(resp.status).toEqual(404)
  });
});
