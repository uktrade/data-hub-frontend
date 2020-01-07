const { pluralise } = require('../config/nunjucks/filters')

function hasExportPermission(userPermissions, targetPermission) {
  return userPermissions.includes(targetPermission)
}

function invalidNumberOfItems(resultCount, maxItems) {
  return resultCount === 0 || resultCount >= maxItems
}

function buildExportMessage(resultCount, exportOptions) {
  if (resultCount >= exportOptions.maxItems) {
    return `Filter to fewer than ${exportOptions.maxItems} ${pluralise(
      exportOptions.entityName
    )} to download`
  }
  if (resultCount === 1) {
    return `You can now download this ${exportOptions.entityName}`
  }
  if (resultCount === 0) {
    return `There are no ${pluralise(exportOptions.entityName)} to download`
  }
  return `You can now download these ${resultCount} ${pluralise(
    exportOptions.entityName
  )}`
}

function buildExportAction(queryString, userPermissions, exportOptions) {
  if (!hasExportPermission(userPermissions, exportOptions.targetPermission)) {
    return {
      enabled: false,
    }
  }
  return {
    enabled: true,
    buildMessage: (count) => buildExportMessage(count, exportOptions),
    url: `${exportOptions.urlFragment}/export?${queryString}`,
    maxItems: exportOptions.maxItems,
    invalidNumberOfItems,
  }
}

module.exports = {
  buildExportAction,
}
