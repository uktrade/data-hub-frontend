const { find, get } = require('lodash')

const { Order } = require('../../../models')

async function editLeadAssignee (req, res, next) {
  const adviserId = req.body.adviserId
  const orderId = req.body.orderId
  const returnUrl = req.body.returnUrl || req.header('Referer')

  if (!adviserId || !orderId) {
    return res.redirect(returnUrl)
  }

  try {
    const allAssignees = await Order.getAssignees(req.session.token, orderId)
    const assignees = allAssignees.map(assignee => {
      return Object.assign(assignee, {
        is_lead: assignee.adviser.id === adviserId,
      })
    })
    const leadAdviser = find(assignees, { adviser: { id: adviserId } })

    await Order.saveAssignees(req.session.token, orderId, assignees)

    req.flash('success', `Lead post adviser set to ${get(leadAdviser, 'adviser.name')}`)
    res.redirect(returnUrl)
  } catch (error) {
    next(error)
  }
}

module.exports = editLeadAssignee
