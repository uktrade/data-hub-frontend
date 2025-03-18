import interaction from '../../../fixtures/v3/search/interaction.json' with { type: 'json' }

export const searchInteraction = function (req, res) {
  return res.json(interaction)
}
