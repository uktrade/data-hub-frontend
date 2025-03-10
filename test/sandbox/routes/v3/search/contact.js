import contact from '../../../fixtures/v3/search/contact.json' with { type: 'json' }

export const contacts = function (req, res) {
  if (req.body.original_query === 'no results') {
    return res.json({
      count: 0,
      results: [],
    })
  }

  res.json(contact)
}
