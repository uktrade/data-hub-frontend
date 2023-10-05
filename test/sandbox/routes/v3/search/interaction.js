import interactionJson from '../../../fixtures/v3/search/interaction.json' assert { type: 'json' };

export const interaction = function (req, res) {
  return res.json(interactionJson)
};
