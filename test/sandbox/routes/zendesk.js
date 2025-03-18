import zendeskTickets from '../fixtures/zendesk/tickets.json' with { type: 'json' }

export const tickets = function (req, res) {
  var response = _.set(
    zendeskTickets,
    'ticket.description',
    req.body.ticket.comment.body
  )
  res.status(201).json(response)
}
