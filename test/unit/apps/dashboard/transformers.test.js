const {
  formatZenArticles,
} = require('../../../../src/apps/dashboard/transformers')
const { omit } = require('lodash')

const mockResponse = {
  count: 3,
  articles: [
    {
      id: 360001431697,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub',
      author_id: 7837434105,
      comments_disabled: true,
      draft: false,
      promoted: false,
      position: 0,
      vote_sum: 0,
      vote_count: 0,
      section_id: 360000018069,
      created_at: '2019-04-18T15:24:32Z',
      updated_at: '2019-04-18T15:24:35Z',
      name: 'Recording policy feedback on Data Hub',
      title: 'Recording policy feedback on Data Hub',
    },
    {
      id: 360001412918,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019',
      author_id: 17979367345,
      created_at: '2019-04-15T09:42:05Z',
      updated_at: '2019-04-18T14:30:29Z',
      name: 'Improvements to company data in Data Hub - April 2019',
      title: 'Improvements to company data in Data Hub - April 2019',
      source_locale: 'en-gb',
      locale: 'en-gb',
      outdated: false,
      outdated_locales: [],
      edited_at: '2019-04-18T14:30:29Z',
    },
    {
      id: 360001345138,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions',
      author_id: 9903012689,
      comments_disabled: true,
      vote_count: 0,
      section_id: 360000018069,
      created_at: '2019-04-03T12:16:23Z',
      updated_at: '2019-04-18T14:27:50Z',
      name: 'Recording multiple DIT advisers against interactions',
      title: 'Recording multiple DIT advisers against interactions',
      edited_at: '2019-04-18T14:27:50Z',
      label_names: [],
    },
  ],
  sort_by: 'position',
  sort_order: 'asc',
}

const expected = [
  {
    heading: 'Recording policy feedback on Data Hub',
    link:
      'https://uktrade.zendesk.com/hc/en-gb/articles/360001431697-Recording-policy-feedback-on-Data-Hub',
    date: '8 days ago',
  },
  {
    heading: 'Improvements to company data in Data Hub - April 2019',
    link:
      'https://uktrade.zendesk.com/hc/en-gb/articles/360001412918-Improvements-to-company-data-in-Data-Hub-April-2019',
    date: '11 days ago',
  },
  {
    heading: 'Recording multiple DIT advisers against interactions',
    link:
      'https://uktrade.zendesk.com/hc/en-gb/articles/360001345138-Recording-multiple-DIT-advisers-against-interactions',
    date: '23 days ago',
  },
]

describe('#formatZenArticles', () => {
  context('Successful API response', () => {
    beforeEach(() => {
      this.transformed = formatZenArticles(mockResponse)
    })
    it('should format Zen desk articles', () => {
      expect(this.transformed).to.deep.equal(expected)
    })
  })

  context('malformed api responses', () => {
    it('should return empty array', () => {
      expect(formatZenArticles({})).to.deep.equal([])
      expect(formatZenArticles(undefined)).to.deep.equal([])
      expect(formatZenArticles([])).to.deep.equal([])
      expect(formatZenArticles(omit(expected, ['articles']))).to.deep.equal([])
    })
  })
})
