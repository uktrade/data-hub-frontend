var zendeskTickets = require('../fixtures/zendesk/tickets.json')

exports.tickets = function(req, res) {
  res.json(201, JSON.stringify(zendeskTickets))
}
