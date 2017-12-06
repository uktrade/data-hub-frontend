const { zipWith, get, isArray, isString, assign } = require('lodash')
const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateInvestmentTeamMembers } = require('../../repos')
const { teamMembersLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

// Transform the form posted to an array of objects to save
// and filter out any blanks
function transformDataToTeamMemberArray (body) {
  let teamMembers = []
  if (isArray(body.adviser)) {
    teamMembers = zipWith(body.adviser, body.role, (adviser, role) => ({ adviser, role }))
  } else if (isString(body.adviser)) {
    teamMembers = [{ adviser: body.adviser, role: body.role }]
  }
  return teamMembers.filter(member => member.adviser.length)
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

async function handleFormPost (req, res, next) {
  try {
    res.locals.projectId = req.params.investmentId
    const teamMembers = transformDataToTeamMemberArray(req.body)
    await updateInvestmentTeamMembers(req.session.token, req.params.investmentId, teamMembers)
    next()
  } catch (err) {
    if (err.statusCode === 400) {
      const teamMembers = transformDataToTeamMemberArray(req.body)
      const roleError = get(err, 'error.role')
      let messages = {}
      if (roleError) {
        teamMembers.forEach((item, i) => {
          if (item.role === '') {
            messages['role-' + i] = roleError
          }
        })
      }
      res.locals.form = Object.assign({}, res.locals.form, {
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
}
