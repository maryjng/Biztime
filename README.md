# Biztime

Tech stack: Node.js, Express, PG, Postgresql

A backend application with REST API routes for handling company invoice data.



# Routes
 - invoices - GET (all) 
 - invoices - GET/<:id>
 - invoices - POST
	- Takes {comp_code, amt}
	- Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
- invoices - PUT/<:id>
	- Takes {amt}
	- Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
- invoices - DELETE
   
- companies - GET (all)
- companies - GET/<:code>
- companies - POST
 	- Takes {code, name, description}
    	- Returns {company: {code, name, description}}
- companies - PUT/<:code>
    	- Takes {name, description}
    	- Returns {company: {code, name, description}}
- companies - DELETE/<:code>
###
