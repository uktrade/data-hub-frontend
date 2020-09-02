const rewire = require('rewire')

const builders = require('../builders')
const config = require('../../config')

describe('Global builders', () => {
  const stubRequest = { session: { token: '1234' } }

  describe('#getDeepObjectValuesForKey', () => {
    it('should return an empty array when no valid args are given', () => {
      expect(builders.getDeepObjectValuesForKey({}))
        .to.be.an('array')
        .with.length(0)
      expect(builders.getDeepObjectValuesForKey({ a: 'A' }))
        .to.be.an('array')
        .with.length(0)
      expect(builders.getDeepObjectValuesForKey({ a: 'A' }, 'Q'))
        .to.be.an('array')
        .with.length(0)
    })

    it('should return an array of values matching the key found in deep object properties', () => {
      const actual = builders.getDeepObjectValuesForKey(
        {
          name: 'a',
          children: [
            {
              name: 'a.a',
              options: [{ name: 'a.a.a' }, { name: 'a.a.b' }],
            },
            { name: 'a.b' },
          ],
        },
        'name'
      )

      expect(actual)
        .to.be.an('array')
        .with.length(5)
        .and.deep.equal(['a', 'a.a', 'a.a.a', 'a.a.b', 'a.b'])
    })

    it('should return an array of values matching the key found in an array of objects', () => {
      const actual = builders.getDeepObjectValuesForKey(
        [
          { name: 'a' },
          { name: 'b' },
          {
            name: 'c',
            children: [
              {
                name: 'c.a',
                options: [{ name: 'c.a.a' }],
              },
            ],
          },
        ],
        'name'
      )

      expect(actual)
        .to.be.an('array')
        .with.length(5)
        .and.deep.equal(['a', 'b', 'c', 'c.a', 'c.a.a'])
    })
  })

  describe('#assignPropsIfFoundInObject', () => {
    it('should return undefined when no arguments are given', () => {
      expect(builders.assignPropsIfFoundInObject()).to.be.undefined
    })

    it('should return children argument when no valid arguments are given', () => {
      expect(builders.assignPropsIfFoundInObject({}, {})).to.deep.equal({})
      expect(
        builders.assignPropsIfFoundInObject([{ a: 'A' }], {})
      ).to.deep.equal([{ a: 'A' }])
    })

    it('should return a copy of children array with properties in sourceObj matched by name assigned as propName', () => {
      const actual = builders.assignPropsIfFoundInObject(
        [
          { name: 'firstName', label: 'Tyrion' },
          { name: 'firstName', label: 'Jon' },
        ],
        {
          firstName: 'Daenerys',
        },
        'link'
      )

      expect(actual).to.deep.equal([
        { name: 'firstName', label: 'Tyrion', link: 'Daenerys', error: null },
        { name: 'firstName', label: 'Jon', link: 'Daenerys', error: null },
      ])
    })

    it('should return a recurse down to children of children', () => {
      const actual = builders.assignPropsIfFoundInObject(
        [
          {
            name: 'folder-1',
            label: 'A',
            children: [
              {
                name: 'folder-1-1',
                label: 'A.A',
                children: [
                  {
                    name: 'file-1-1-1',
                    label: 'A.A.a',
                  },
                ],
              },
            ],
          },
        ],
        {
          'file-1-1-1': '*',
        },
        'mark'
      )

      expect(actual).to.deep.equal([
        {
          name: 'folder-1',
          label: 'A',
          mark: undefined,
          error: null,
          children: [
            {
              name: 'folder-1-1',
              label: 'A.A',
              mark: undefined,
              error: null,
              children: [
                {
                  name: 'file-1-1-1',
                  label: 'A.A.a',
                  mark: '*',
                  error: null,
                },
              ],
            },
          ],
        },
      ])
    })

    it('should return a recurse down to children of children options', () => {
      const actual = builders.assignPropsIfFoundInObject(
        [
          {
            name: 'folder-1',
            label: 'A',
            options: [
              {
                name: 'folder-1-1',
                label: 'A.A',
                children: [
                  {
                    name: 'file-1-1-1',
                    label: 'A.A.a',
                  },
                ],
              },
            ],
          },
        ],
        {
          'file-1-1-1': '*',
        },
        'mark'
      )

      expect(actual).to.deep.equal([
        {
          name: 'folder-1',
          label: 'A',
          mark: undefined,
          error: null,
          options: [
            {
              name: 'folder-1-1',
              label: 'A.A',
              children: [
                {
                  name: 'file-1-1-1',
                  label: 'A.A.a',
                  mark: '*',
                  error: null,
                },
              ],
            },
          ],
        },
      ])
    })
  })

  describe('#buildFormWithErrors', () => {
    beforeEach(() => {
      this.formObject = {
        children: [
          {
            name: 'a',
            label: 'Field A',
            children: [{ name: 'a.a', label: 'Field A.A' }],
          },
          { name: 'b', label: 'Field B' },
          { name: 'c', label: 'Field C' },
        ],
      }

      this.errorsObject = {
        a: ['Error for field A'],
        'a.a': ['Error for field A.A'],
        b: ['Error for field B'],
      }
    })

    it('should return a new form identical to initial form if no errors object is given', () => {
      const actual = builders.buildFormWithErrors(this.formObject)

      expect(actual).to.deep.equal(this.formObject)
    })

    it('should return a new form with custom error summary', () => {
      const actual = builders.buildFormWithErrors(this.formObject, {
        summary: 'An atypical error occurred',
      })

      expect(actual).to.deep.equal(
        Object.assign({}, this.formObject, {
          errors: {
            summary: 'An atypical error occurred',
            messages: {},
            fieldLabels: {},
          },
        })
      )
    })

    it('should return a new object populated with defaulterrors summary and individual field errors', () => {
      const actual = builders.buildFormWithErrors(
        this.formObject,
        this.errorsObject
      )

      expect(actual.errors).to.deep.equal({
        summary: 'Please correct the following errors:',
        messages: this.errorsObject,
        fieldLabels: {
          a: 'Field A',
          b: 'Field B',
        },
      })
      expect(actual.children[0]).to.have.property('error', this.errorsObject.a)
      expect(actual.children[0].children[0]).to.have.property(
        'error',
        this.errorsObject['a.a']
      )
      expect(actual.children[1]).to.have.property('error', this.errorsObject.b)
      expect(actual.children[2]).to.have.property('error', undefined)
    })
  })

  describe('#buildFormWithState', () => {
    beforeEach(() => {
      this.formObject = {
        children: [
          {
            name: 'a',
            label: 'Field A',
            children: [{ name: 'a.a', label: 'Field A.A' }],
          },
          { name: 'b', label: 'Field B' },
          { name: 'c', label: 'Field C' },
        ],
      }

      this.requestBody = {
        a: 'value-A',
        'a.a': 'value-A.A',
        b: 'value-B',
      }
    })

    it('should return a new form identical to initial form if no errors object is given', () => {
      const actual = builders.buildFormWithState(this.formObject)

      expect(actual).to.deep.equal(this.formObject)
    })

    it('should return a new object populated with errors summary and individual field errors', () => {
      const actual = builders.buildFormWithState(
        this.formObject,
        this.requestBody
      )

      const elements = actual.children
      expect(elements[0]).to.have.property('value', 'value-A')
      expect(elements[0]).to.have.property('error', null)
      expect(elements[0].children[0]).to.have.property('value', 'value-A.A')
      expect(elements[0].children[0]).to.have.property('error', null)
      expect(elements[1]).to.have.property('value', 'value-B')
      expect(elements[1]).to.have.property('error', null)
      expect(elements[2]).to.have.property('value', undefined)
      expect(elements[2]).to.have.property('error', null)
    })
  })

  describe('#buildFormWithStateAndErrors', () => {
    beforeEach(() => {
      this.builders = rewire('../builders')
      this.buildFormWithStateSpy = sinon.stub()
      this.buildFormWithErrorsSpy = sinon.stub()
      this.builders.__set__('buildFormWithState', this.buildFormWithStateSpy)
      this.builders.__set__('buildFormWithErrors', this.buildFormWithErrorsSpy)
    })

    it('should return form without calling any functions', () => {
      const formObject = {
        children: [
          { name: 'a', label: 'A' },
          { name: 'b', label: 'B' },
        ],
      }
      const requestBody = {
        a: 'a',
      }
      const errorsObject = {
        b: ['Field B is missing'],
      }

      this.builders.buildFormWithStateAndErrors(
        formObject,
        requestBody,
        errorsObject
      )

      expect(this.buildFormWithStateSpy).to.be.calledWith(
        formObject,
        requestBody
      )
      expect(this.buildFormWithErrorsSpy).to.be.calledWith(
        sinon.match.any,
        errorsObject
      )
    })
  })

  describe('#buildSelectedFiltersSummary', () => {
    beforeEach(() => {
      this.fields = [
        {
          macroName: 'MultipleChoiceField',
          name: 'stage',
          label: 'State',
          type: 'checkbox',
          options: sinon.stub().returns([
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]),
        },
        {
          macroName: 'MultipleChoiceField',
          name: 'sector',
          label: 'Sector',
          options: [
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y' },
            { value: 'z', label: 'Z' },
          ],
        },
        {
          macroName: 'TextField',
          label: 'Estimated land date after',
          name: 'estimated_land_date_after',
          hint: 'YYYY-MM-DD',
          placeholder: 'e.g. 2018-07-18',
        },
      ]
    })

    it('should return empty object when called without query', () => {
      const actual = builders.buildSelectedFiltersSummary()

      expect(actual).to.be.undefined
    })

    it('should return object with filters containing valueLabels for values defined in query', () => {
      const query = {
        stage: 'a',
        sector: 'x',
      }

      const actual = builders.buildSelectedFiltersSummary(this.fields, query)

      expect(actual.stage.label).to.equal('State')
      expect(actual.stage.valueLabel).to.equal('A')
      expect(actual.sector.label).to.equal('Sector')
      expect(actual.sector.valueLabel).to.equal('X')
    })

    it('should return filters object with value as valueLabel for text field', () => {
      const query = {
        estimated_land_date_after: '2017-08-03',
      }

      const actual = builders.buildSelectedFiltersSummary(this.fields, query)

      expect(actual.estimated_land_date_after)
        .to.have.property('label')
        .a('string')
      expect(actual.estimated_land_date_after.valueLabel).to.equal('2017-08-03')
    })

    it('should return filters object with valueLabel for multiple values (string)', () => {
      const query = {
        stage: 'a,c',
      }

      const actual = builders.buildSelectedFiltersSummary(this.fields, query)

      expect(actual.stage.valueLabel).to.equals('A, C')
    })

    it('should return filters object with valueLabel for multiple values (array)', () => {
      const query = {
        stage: ['b', 'c'],
      }

      const actual = builders.buildSelectedFiltersSummary(this.fields, query)

      expect(actual.stage.valueLabel).to.equals('B, C')
    })

    context('when a filter has selected options', () => {
      beforeEach(() => {
        const fields = [
          {
            macroName: 'typeahead',
            name: 'adviser',
            label: 'Adviser',
            entity: 'adviser',
            selectedOptions: [
              { value: '1', label: 'Adviser 1' },
              { value: '2', label: 'Adviser 2' },
            ],
            apiVersion: 'metadata',
          },
        ]

        const query = {
          adviser: ['1', '2'],
        }

        this.summary = builders.buildSelectedFiltersSummary(fields, query)
      })

      it('transforms the summary to display selected options', () => {
        expect(this.summary.adviser.valueLabel).to.equal('Adviser 1, Adviser 2')
      })

      it('transforms the summary to display the correct label for selected options', () => {
        expect(this.summary.adviser.label).to.equal('Adviser')
      })
    })
  })

  describe('#buildFieldsWithSelectedEntities', () => {
    beforeEach(() => {
      this.fred = { name: 'Fred Smith', id: '1234' }
      this.wilma = { name: 'Wilma Brown', id: '4321' }

      nock(config.apiRoot)
        .get('/adviser/1234/')
        .reply(200, this.fred)
        .get('/adviser/4321/')
        .reply(200, this.wilma)

      this.fields = [
        {
          macroName: 'Typeahead',
          name: 'dit_adviser',
          entity: 'adviser',
        },
        {
          macroName: 'TextField',
          name: 'date_after',
          hint: 'YYYY-MM-DD',
          placeholder: `e.g. 2018-07-18`,
        },
      ]
    })

    context('when the user has passed in some previous selections', () => {
      beforeEach(async () => {
        const query = {
          dit_adviser: ['1234', '4321'],
        }

        this.result = await builders.buildFieldsWithSelectedEntities(
          stubRequest,
          this.fields,
          query
        )
      })

      it('should put the selection option data into the field', () => {
        expect(this.result[0].selectedOptions).to.deep.equal([
          {
            value: '1234',
            label: 'Fred Smith',
          },
          {
            value: '4321',
            label: 'Wilma Brown',
          },
        ])
      })

      it('should return other fields, untouched', () => {
        expect(this.result[1]).to.deep.equal(this.fields[1])
      })
    })

    context('when the user has passed in one previous selection', () => {
      beforeEach(async () => {
        const query = {
          dit_adviser: '1234',
        }

        this.result = await builders.buildFieldsWithSelectedEntities(
          stubRequest,
          this.fields,
          query
        )
      })

      it('should put the option into the field', () => {
        expect(this.result[0].selectedOptions).to.deep.equal([
          {
            value: '1234',
            label: 'Fred Smith',
          },
        ])
      })

      it('should return other fields, untouched', () => {
        expect(this.result[1]).to.deep.equal(this.fields[1])
      })
    })

    context('when the user has not passed a previous selection', () => {
      beforeEach(async () => {
        const query = {}

        this.result = await builders.buildFieldsWithSelectedEntities(
          stubRequest,
          this.fields,
          query
        )
      })

      it('should leave the entity field untouched', () => {
        expect(this.result[0]).to.deep.equal(this.fields[0])
      })

      it('should return other fields, untouched', () => {
        expect(this.result[1]).to.deep.equal(this.fields[1])
      })
    })
  })
})
