import interaction from '../../../fixtures/v3/search/interaction.json' assert { type: 'json' }

export const searchInteraction = function (req, res) {
  return res.json(interaction)
}
