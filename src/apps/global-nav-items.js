const fs = require('fs')
const path = require('path')
const { compact, sortBy, concat, includes } = require('lodash')

const config = require('../config')
const urls = require('../lib/urls')

const subApps = fs.readdirSync(__dirname)

const APP_GLOBAL_NAV_ITEMS = compact(
  subApps.map((subAppDir) => {
    const constantsPath = path.join(__dirname, subAppDir, 'constants.js')

    if (
      !fs.existsSync(constantsPath) ||
      includes(constantsPath, 'propositions')
    ) {
      return null
    }

    return require(constantsPath).GLOBAL_NAV_ITEM
  })
)

const SORTED_APP_GLOBAL_NAV_ITEMS = sortBy(
  APP_GLOBAL_NAV_ITEMS,
  (globalNavItem) => globalNavItem.order
)
const GLOBAL_NAV_ITEMS = concat(
  SORTED_APP_GLOBAL_NAV_ITEMS,
  {
    path: config.performanceDashboardsUrl,
    label: 'MI dashboards',
    key: 'datahub-mi',
  },
  {
    path: urls.external.findExporters(),
    label: 'Find exporters',
    key: 'find-exporters',
  }
)

/**
 * Required for querying access to apps
 */

module.exports = GLOBAL_NAV_ITEMS
