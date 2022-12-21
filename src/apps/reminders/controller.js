const urls = require('../../lib/urls')

const redirectEstimatedLandDate = (req, res) =>
  res.redirect(urls.reminders.investments.estimatedLandDate())

const redirectNoRecentInteraction = (req, res) =>
  res.redirect(urls.reminders.investments.noRecentInteraction())

const redirectOutstandingPropositions = (req, res) =>
  res.redirect(urls.reminders.investments.outstandingPropositions())

const redirectEstimatedLandDateSettings = (req, res) =>
  res.redirect(urls.reminders.settings.investments.estimatedLandDate())

const redirectNoRecentInteractionSettings = (req, res) =>
  res.redirect(urls.reminders.settings.investments.noRecentInteraction())

module.exports = {
  redirectEstimatedLandDate,
  redirectNoRecentInteraction,
  redirectOutstandingPropositions,
  redirectEstimatedLandDateSettings,
  redirectNoRecentInteractionSettings,
}
