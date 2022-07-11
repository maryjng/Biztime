const db = require("../db");

describe("GET /", function() {
  test("It should return all invoices in a list", async function() {
    const resp = await request(app).get("/invoices")
    expect(resp.body).toEqual(
      {invoices:
        [
          {id: 1, comp_code: "nintendo"},
          {id: 2, comp_code: "capcom"},
          {id: 3, comp_code: "capcom"}
        ]
    });
  })
};


describe("GET /1", function() {
  test("It should return invoice with id of 1", async function() {
    const resp = await request(app).get("/invoices/1")
    expect(resp.body).toEqual(
      {"invoice":
        {
          id: 1,
          amt: 50,
          paid: false,
          add_date: "2020-02-02",
          paid_date: null,
          "company": {
            code: "nintendo",
            name: "Nintendo",
            description: "Gamecube and DS"
          }
      }
    });
  })
});

describe("POST /" function() {
  test("It should create an invoice", async function() {
    const resp = await request(app).post("/invoices", {comp_code: "nintendo", amt: 500})
    expect(resp.body).toEqual(
      {"invoice": {
          id: 4,
          comp_code: "nintendo",
          amt: 500,
          paid: false,
          add_date: expect.any(String),
          paid_date: null
        }
      }
    );
  });
});


describe("PUT /1", function() {
  test("It should edit invoice 1", async function() {
    const resp = await request(app).put("/invoices/1", {amt: 150})
    expect(resp.body).toEqual(
      {"invoice": {
        id: 1,
        comp_code: "nintendo",
        amt: 150,
        paid: false,
        add_date: '2020-02-02',
        paid_date: null
        }
      });
  });

  test("It should 404 if invoice does not exist", async function() {
    const resp = await request(app).put("/invoices/10", {amt: 10})
    expect(resp.status).toEqual(404)
  });
});


describe("DELETE /2", function() {
  test("It should delete invoice 2", async function() {
  const resp = await request(app).delete("/invoices/2")
  expect(resp.body).toEqual({"status": "deleted"});
});

  test("It should 404 if invoice does not exist", async function() {
    const resp = await request(app).delete("/invoices/10")
    expect(resp.status).toEqual(404)
  });
});
