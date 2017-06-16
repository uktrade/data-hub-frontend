const config = require('../../config')
const authorisedRequest = require('../lib/authorised-request')

module.exports = (req, res, next) => {
  const token = req.session.token
  const user = req.session.user

  if (token && !user) {
    authorisedRequest(token, `${config.apiRoot}/whoami/`)
      .then((userInfo) => {
        req.session.user = {
          id: userInfo.id, // DIT Adviser id
          name: userInfo.name,
          team: userInfo.dit_team,
        }

        res.locals.user = req.session.user
        next()
      })
      .catch(next)
  } else {
    if (user) {
      res.locals.user = user
    }
    next()
  }
}
