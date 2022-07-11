const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

// Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get("/", function(req, res, next) {
  try {
    let results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
      FROM invoices
      RETURNING id, comp_code`)

    return res.json("invoices": results.rows)

  } catch(err) {
    return next(err)
  }
});

// Returns obj on given invoice.
// If invoice cannot be found, returns 404.
// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
router.get("/:id", function(req, res, next){
  try {
    let id = req.params
    let results = await db.query(
      `SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description
      FROM invoices i INNER JOIN companies c ON i.comp_code = c.code
      WHERE id=$1`, [id])


    if (results.rows.length == 0){
      throw new ExpressError(`Invoice ${id} does not exist.`, 404)
    }
    else {
      let data = results.rows[0]
      return res.json(
        "invoice": {
          id: data.id,
          amt: data.amt,
          paid: data.paid,
          add_date: data.add_date,
          paid_date: data.paid_date,
          "company": {
            code: data.code,
            name: data.name,
            description: data.description
          }
    });
  } catch(err) {
    return next(err)
  }
})


// Adds an invoice.
// Needs to be passed in JSON body of: {comp_code, amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.post("/", function(req, res, next) {
  try {
    let { comp_code, amt } = req.body

    let results = await db.query(
      `INSERT INTO invoices (comp_code, amt)
      VALUES ($1, $2)
      RETURNING (id, comp_code, amt, paid, add_date, paid_date)`, [comp_code, amt]);

    return res.status(201).json("invoice": results.rows[0])

  } catch(err) {
    return next(err)
  }
});


// Updates an invoice.
// If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of {amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.put("/:id", function(req, res, next) {
  try {
    let id = req.params
    let { amt } = req.body

    let results = await db.query(
      `UPDATE invoices
      SET amt=$1
      WHERE id=$2
      RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, id]);

    if (results.rows.length == 0){
      return new ExpressError(`Invoice ${id} does not exist.`, 404)
    } else {
      return res.json("invoice": results.rows[0])
    }

  } catch(err){
    return next(err)
  }
})


// Deletes an invoice.
// If invoice cannot be found, returns a 404.
// Returns: {status: "deleted"}
router.delete("/:id", function(req, res, next) {
  try {
    let id = req.params

    let results = await db.query(
      `DELETE FROM invoices
      WHERE id=$1
      RETURNING id`, [id]);

    if (results.rows.length == 0){
      return new ExpressError(`Invoice ${id} does not exist.`, 404)
    } else {
      return res.json("status": "deleted")
    }

  } catch(err) {
    return next(err)
  }
})
