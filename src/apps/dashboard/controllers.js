const { get } = require('lodash')
const rp = require('request-promise')
const moment = require('moment')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const { fetchHomepageData } = require('./repos')
const config = require('../../../config')

async function renderDashboard (req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')
    const { contacts, interactions } = await fetchHomepageData(
      req.session.token
    )

    const articleFeed = await rp({
      uri: config.zen.announcementsURL,
      json: true,
      timeout: 1000,
    })
      .then(feed =>
        feed.articles.map(item => ({
          heading: item.title,
          link: item.html_url,
          date: moment(item.created_at)
            .fromNow(),
        }))
      )
      .catch(err => {
        console.log(err)
      })

    res.title('Dashboard').render('dashboard/views/dashboard', {
      contacts,
      interactions,
      articleFeed,
      interactionsPermitted: isPermittedRoute(
        '/interactions',
        GLOBAL_NAV_ITEMS,
        userPermissions
      ),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
