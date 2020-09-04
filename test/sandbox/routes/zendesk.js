var zendeskTickets = require('../fixtures/zendesk/tickets.json')

exports.tickets = function (req, res) {
  var response = _.set(
    zendeskTickets,
    'ticket.description',
    req.body.ticket.comment.body
  )
  res.status(201).json(response)
}
