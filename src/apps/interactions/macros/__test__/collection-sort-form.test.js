const { buildInteractionSortForm, getDefaultInteractionSort } = require('~/src/apps/interactions/macros/collection-sort-form.js')

describe('interactions collection sort form', () => {
  describe('#buildInteractionSortForm', () => {
    it('should render form with all options', () => {
      const actual = buildInteractionSortForm()
      const expected = {
        'method': 'get',
        'class': 'c-collection__sort-form js-AutoSubmit',
        'hideFormActions': true,
        'hiddenFields': {
          'custom': true,
        },
        'children': [
          {
            'options': [
              {
                'value': '-date',
                'label': 'Newest',
              },
              {
                'value': 'company__name',
                'label': 'Company: A-Z',
              },
              {
                'value': 'subject',
                'label': 'Subject: A-Z',
              },
            ],
            'macroName': 'MultipleChoiceField',
            'label': 'Sort by',
            'name': 'sortby',
            'modifier': [
              'small',
              'inline',
              'light',
            ],
          },
        ],
      }

      expect(actual).to.deep.equal(expected)
    })

    it('should render form without company option', () => {
      const actual = buildInteractionSortForm(false)
      const expected = {
        'method': 'get',
        'class': 'c-collection__sort-form js-AutoSubmit',
        'hideFormActions': true,
        'hiddenFields': {
          'custom': true,
        },
        'children': [
          {
            'options': [
              {
                'value': '-date',
                'label': 'Newest',
              },
              {
                'value': 'subject',
                'label': 'Subject: A-Z',
              },
            ],
            'macroName': 'MultipleChoiceField',
            'label': 'Sort by',
            'name': 'sortby',
            'modifier': [
              'small',
              'inline',
              'light',
            ],
          },
        ],
      }

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#getDefaultInteractionSort', () => {
    it('should get default option', () => {
      const actual = getDefaultInteractionSort()
      const expected = '-date'

      expect(actual).to.deep.equal(expected)
    })

    it('should get default option when the company name is hidden', () => {
      const actual = getDefaultInteractionSort(false)
      const expected = '-date'

      expect(actual).to.deep.equal(expected)
    })
  })
})
