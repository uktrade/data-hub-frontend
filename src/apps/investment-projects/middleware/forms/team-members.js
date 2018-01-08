const { zipWith, get, isArray, assign, forOwn, isEmpty } = require('lodash')

const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateInvestmentTeamMembers } = require('../../repos')
const { teamMembersLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

// Transform the form posted to an array of objects to save
// and filter out any blanks
function transformDataToTeamMemberArray ({ adviser, role }) {
  const advisersArray = isArray(adviser) ? adviser : [adviser]
  const rolesArray = isArray(role) ? role : [role]

  const teamMembers = zipWith(advisersArray, rolesArray, (adviser, role) => ({ adviser, role }))
  return teamMembers.filter(member => !isEmpty(member.adviser))
}

function getTeamMemberItem ({ teamMember, advisers }) {
  const adviser = get(teamMember, 'adviser.id')

  const options = filterActiveAdvisers({
    advisers,
    includeAdviser: adviser,
  }).map(transformObjectToOption)

  return {
    options,
    adviser,
    role: get(teamMember, 'role'),
  }
}

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData
    const advisersResponse = await getAdvisers(req.session.token)

    const teamMembers = investmentData.team_members.map((teamMember) => getTeamMemberItem({ teamMember, advisers: advisersResponse.results }))
    teamMembers.push(getTeamMemberItem({ advisers: advisersResponse.results }))

    res.locals.form = assign({}, res.locals.form, {
      labels: teamMembersLabels.edit,
      fields: { teamMembers },
      buttonText: 'Save',
      returnLink: `/investment-projects/${investmentData.id}/team`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

function transformErrorResponseToFormError (error) {
  const messages = {}

  if (isArray(error)) {
    for (let pos = 0; pos < error.length; pos += 1) {
      const errorItem = error[pos]
      forOwn(errorItem, function (value, key) {
        messages[`${key}-${pos}`] = value[0]
      })
    }
  } else {
    forOwn(error, function (value, key) {
      messages[key] = value[0]
    })
  }

  return messages
}

async function handleFormPost (req, res, next) {
  try {
    res.locals.projectId = req.params.investmentId
    const teamMembers = transformDataToTeamMemberArray(req.body)
    await updateInvestmentTeamMembers(req.session.token, req.params.investmentId, teamMembers)
    next()
  } catch (err) {
    if (err.statusCode === 400) {
      const teamMembers = transformDataToTeamMemberArray(req.body)
      const messages = transformErrorResponseToFormError(err.error)

      res.locals.form = assign({}, res.locals.form, {
        errors: { messages },
        state: { teamMembers },
      })

      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
  transformDataToTeamMemberArray,
  transformErrorResponseToFormError,
}
