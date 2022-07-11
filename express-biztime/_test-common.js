const db = require("./db")

async function createData() {
  await db.query("DELETE FROM invoices")
  await db.query("DELETE FROM companies")
  await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('nintendo', 'Nintendo', 'Gamecube and DS'),
          ('capcom', 'Capcom', 'Monster Hunter and Resident Evil')`);

  await db.query(
    `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
    VALUES ('nintendo', 50, false, '2020-02-02', null),
          ('capcom', 100, true, '2001-11-12', '2001-11-13'),
          ('capcom', 200, true, '2002-01-03', null)
          `)
}

module.exports = { createData };
