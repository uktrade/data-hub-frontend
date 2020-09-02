const { find, get } = require('lodash')

const { Order } = require('../../../models')

async function editLeadAssignee(req, res, next) {
  const adviserId = req.body.adviserId
  const orderId = req.body.orderId

  if (!adviserId || !orderId) {
    return res.redirect(res.locals.ORIGINAL_URL)
  }

  try {
    const allAssignees = await Order.getAssignees(req, orderId)
    const assignees = allAssignees.map((assignee) => {
      return Object.assign(assignee, {
        is_lead: assignee.adviser.id === adviserId,
      })
    })
    const leadAdviser = find(assignees, { adviser: { id: adviserId } })

    await Order.saveAssignees(req, orderId, assignees)

    req.flash(
      'success',
      `Lead adviser in the market set to ${get(leadAdviser, 'adviser.name')}`
    )
    res.redirect(res.locals.ORIGINAL_URL)
  } catch (error) {
    next(error)
  }
}

module.exports = editLeadAssignee
