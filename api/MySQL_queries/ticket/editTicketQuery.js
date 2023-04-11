function editTicketQuery(ticketID, title, description, reason,priority, status) {
  return `UPDATE tickets 
    SET title = '${title}', description = '${description}', status = '${status}' , reason='${reason}', priority='${priority}'
    WHERE ticketID = ${ticketID}`;
}

module.exports = editTicketQuery;
