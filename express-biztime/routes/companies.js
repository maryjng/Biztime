const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

// Returns list of companies, like {companies: [{code, name}, ...]}
router.get("/", function (req, res, next) {
  try {

    let results = await db.query(
      `SELECT code, name, description
      FROM companies ORDER BY name
      RETURNING code, name`)

    return res.json({"companies": results.rows})

  } catch(err){
    return next(err)
  }
});



// Return obj of company: {company: {code, name, description, invoices: [id, ...]}}
// If the company given cannot be found, this should return a 404 status response.
router.get("/:code", function (req, res, next) {
  try {
    let code = req.params.code

    let results = await db.query(
      `SELECT code, name, description
      FROM companies
      WHERE code=$1`, [code]
    );

    let invoices = await db.query(
      `SELECT id
      FROM invoices WHERE comp_code=$1`, [code]
    );

    if (results.rows.length == 0) {
      throw new ExpressError(`Company ${code} does not exist.`, 404)
    } else {
      let company = results.rows[0]
      company.invoices = invoices.map(inv => inv.id);

      return res.json({"company": company})
    }
  } catch(err) {
    return next(err)
  }
})


// Adds a company.
// Needs to be given JSON like: {code, name, description}
// Returns obj of new company: {company: {code, name, description}}
router.post("/", function (req, res, next) {
  try {
    let { code, name, description } = req.body

    let results = await db.query(
      `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description`,   [code, name, description]);

    return res.status(201).json({"company": results.rows[0]})

  } catch(err) {
    return next(err)
  }
})


// Edit existing company.
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description}
// Returns update company object: {company: {code, name, description}}
router.put("/:code", function(req, res, next) {
  try {
    let code = req.params
    let { name, description } = req.body

    let results = await db.query(
      `UPDATE companies
       SET name=$1, description=$2
       WHERE code = $3
       RETURNING code, name, description`, [name, description, code]);

    if (results.rows.length == 0) {
      throw new ExpressError(`Company ${code} does not exist.`, 404)
    } else {
      return res.json({"company": results.rows[0]})
    }
  } catch(err) {
    return next(err)
  }
})



// Deletes company.
// Should return 404 if company cannot be found.
// Returns {status: "deleted"}
router.delete("/:code", function(req, res, next) {
  try {
    let code = req.params
    let results = await db.query(
      `DELETE FROM companies
      WHERE code=$1
      RETURNING code`, [code]);

    if (results.rows.length == 0) {
      throw new ExpressError(`Company ${code} does not exist.`, 404)
    } else {
      return res.json({"status": "deleted"})
    }

  } catch(err) {
    return next(err)
  }
})

module.exports = router;
