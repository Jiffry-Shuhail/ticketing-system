// Require express router
const createTicket = require("express").Router();

// Require MySQL connection
const MySQLConnection = require("../../config/MySQL");

// Require authentication middleware
const checkAuth = require("../../middleware/checkAuth");

// Import MySQL queries
const checkIfTicketsTableExistsQuery = require("../MySQL_queries/ticket/checkIfTicketsTableExistsQuery");
const insertTicketQuery = require("../MySQL_queries/ticket/insertTicketQuery");

// Create route to '/createTicket'
createTicket.post("/createTicket", checkAuth, (req, res, next) => {
  // Assign request values to the variables
  const { userID, title, description,reason, priority} = req.body;

  // Check if all required fields are filled in
  if (!title)
    return res.status(400).json({ message: "Ticket title field is empty." });
  else if (!description)
    return res
      .status(400)
      .json({ message: "Ticket description field is empty." });

  // Check if tickets table exists in the database
  MySQLConnection.query(checkIfTicketsTableExistsQuery, (err, result) => {
    // Error handling
    if (err) res.status(500).json({ message: err });
    // If tickets table doesn't exist, throw error message
    else if (result.length === 0) {
      res
        .status(400)
        .json({ message: "Tickets table doesn't exist in the database." });
    } else {
      // Create new ticket object
      const newTicket = {
        userID,
        title,
        description,
        reason,
        priority,
        dateOfCreation:new Date(),
        status:"none"
      };

      // Insert new ticket to the db
      MySQLConnection.query(insertTicketQuery, newTicket, (err, result) => {
        // Error handling
        if (err){console.log(err.message); res.status(500).json({ message: err });}
        else res.status(201).json({ message: "Ticket has been created." });
      });
    }
  });
});

module.exports = createTicket;
