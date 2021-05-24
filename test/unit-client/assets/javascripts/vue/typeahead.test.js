const Vue = require('vue')
const { mount } = require('@vue/test-utils')
const axios = require('axios')

const Typeahead =
  require('../../../../../assets/javascripts/vue/typeahead.vue').default
const { highlight } = require('../../../../../assets/javascripts/vue/filters')

const XHR = require('../../../../../assets/javascripts/lib/xhr')

describe('Typeahead', () => {
  let defaultProps

  beforeEach(() => {
    XHR.request = sinon.stub().resolves()

    defaultProps = {
      name: 'adviser',
      entity: 'adviser',
      label: 'Adviser',
      placeholder: 'Search team member',
      hideLabel: true,
      useSubLabel: true,
      target: 'metadata',
    }

    Vue.filter('highlight', highlight)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('template', () => {
    let component

    beforeEach(() => {
      component = mount(Typeahead, {
        propsData: defaultProps,
      })
    })

    context('when rendering default state', () => {
      it('should render a control wrapper with the request classes for styling', () => {
        expect(
          component.find(
            '.c-form-group.c-form-group--light.c-form-group--smaller.c-form-group--filter'
          )
        ).to.not.be.null
      })

      it('should render the label', () => {
        expect(
          component
            .find('label.c-form-group__label span.c-form-group__label-text')
            .text()
        ).to.equal('Adviser')
      })

      it('should render a multi select control', () => {
        expect(component.find('input.multiselect__input')).to.not.be.null
      })

      it('should render a placeholder value in search text field', () => {
        expect(
          component.find('.multiselect__input').attributes().placeholder
        ).to.equal('Search team member')
      })
    })

    context('when there are suggestions to display', () => {
      beforeEach((done) => {
        const dataWithOptions = Object.assign({}, defaultProps, {
          options: [
            {
              value: '1234',
              label: 'Fred Smith',
              subLabel: 'London',
            },
            {
              value: '4321',
              label: 'Jane Jones',
              subLabel: 'Scotland',
            },
          ],
        })

        component.setData(dataWithOptions)
        Vue.nextTick(done)
      })

      it('should render an item for each option', () => {
        const options = component.findAll(
          '.multiselect__element .multiselect__option'
        )
        expect(options).to.have.length(2)
      })

      it('should render the correct markup for an option', () => {
        const markup = component.find(
          '.multiselect__element .multiselect__option'
        ).element.innerHTML
        expect(markup).to.equal(
          '<div class="multiselect__option-label">Fred Smith</div> <div class="multiselect__option-sublabel">London</div>'
        )
      })
    })

    context('when advisers are selected that have names and team names', () => {
      beforeEach((done) => {
        const dataWithSelectedAdvisers = Object.assign({}, defaultProps, {
          selectedOptions: [
            {
              value: '1234',
              label: 'Fred Jones',
              subLabel: 'Team ABC',
            },
          ],
        })

        component.setData(dataWithSelectedAdvisers)
        Vue.nextTick(done)
      })

      it('should populate the default selected options', () => {
        expect(component.findAll('.multiselect__tag')).to.have.length(1)
      })

      it('should show the adviser name and team in the tag', () => {
        expect(component.find('.multiselect__tag').text()).to.equal(
          'Fred Jones, Team ABC'
        )
      })

      it('should render the selected options as hidden fields', () => {
        const element = component.find(
          'input[type="hidden"][name="adviser"]'
        ).element
        expect(element.value).to.equal('1234')
      })
    })

    context('when choosing not to display form labels', () => {
      beforeEach((done) => {
        component = mount(Typeahead, {
          propsData: Object.assign({}, defaultProps, { isLabelHidden: true }),
        })
        Vue.nextTick(done)
      })
      it('should hide the label with visually hidden class', () => {
        expect(
          component.find('.u-visually-hidden').classes('u-visually-hidden')
        ).to.be.true
      })
    })

    context('when choosing not to display sub labels when selected', () => {
      beforeEach((done) => {
        const dataWithHiddenSubLabel = Object.assign({}, defaultProps, {
          hasSubLabel: false,
          selectedOptions: [
            {
              value: '1234',
              label: 'Fred Jones',
              subLabel: 'Team ABC',
            },
          ],
        })
        component.setData(dataWithHiddenSubLabel)
        Vue.nextTick(done)
      })
      it('should show the adviser name without the team', () => {
        expect(component.find('.multiselect__tag').text()).to.equal(
          'Fred Jones'
        )
      })
    })
  })

  describe('data', () => {
    let component
    const model = `[{
            "value": "cff02898-9698-e211-a939-e4115bead28a",
            "label": "Aberdeen City Council"
          }, {
            "value": "08c14624-2f50-e311-a56a-e4115bead28a",
            "label": "Advanced Manufacturing Sector"
          }, {
            "value": "d33ade1c-9798-e211-a939-e4115bead28a",
            "label": "Advantage West Midlands (AWM)"
          }]`

    context('when created with isAsync false', () => {
      beforeEach(() => {
        component = mount(Typeahead, {
          propsData: Object.assign({}, defaultProps, {
            isAsync: false,
            model,
          }),
        })
      })
      it('should set options data to parsed model data', () => {
        expect(component.vm.options).to.deep.equal(JSON.parse(model))
      })
    })

    context('when created with no value', () => {
      beforeEach(() => {
        component = mount(Typeahead, {
          propsData: defaultProps,
        })
      })

      it('should set a default of no selected advisers', () => {
        expect(component.vm.selectedOptions).to.deep.equal([])
      })
    })

    context('when created with previously selected advisers', () => {
      const adviser = {
        value: '1234',
        label: 'Fred Jones',
        subLabel: 'London',
      }

      beforeEach(() => {
        const dataWithSelectedAdvisers = Object.assign({}, defaultProps, {
          value: JSON.stringify([adviser]),
        })

        component = mount(Typeahead, {
          propsData: dataWithSelectedAdvisers,
        })
      })

      it('should populate the selection options value', () => {
        expect(component.vm.selectedOptions).to.deep.equal([adviser])
      })
    })
  })

  describe('methods', () => {
    describe('#asyncSearch', () => {
      let instance
      let asyncSearch

      beforeEach(() => {
        instance = {
          name: 'adviser',
          entity: 'adviser',
          options: [],
          filterInactive: '',
          target: 'metadata',
        }
        asyncSearch = Typeahead.methods.asyncSearch.bind(instance)
      })

      context('when the user enters more than 3 characters', () => {
        beforeEach((done) => {
          axios.get = sinon.stub().resolves({
            data: [
              {
                value: '1',
                label: 'Fred Smith',
                subLabel: 'Dept of commerce',
              },
            ],
          })

          asyncSearch('fred')
          setTimeout(done, 600)
        })

        it('should have fetched suggestions', () => {
          expect(axios.get).to.have.been.calledOnce
          expect(axios.get).to.be.calledWith(
            '/api/options/adviser?autocomplete=fred&target=metadata'
          )
        })

        it('should store the return options', () => {
          expect(instance.options).to.deep.equal([
            {
              value: '1',
              label: 'Fred Smith',
              subLabel: 'Dept of commerce',
            },
          ])
        })
      })

      context(
        'when typehead depends (is chained with) on another typehead',
        () => {
          beforeEach((done) => {
            instance = {
              name: 'adviser',
              entity: 'adviser',
              multipleSelectOptions: false,
              options: [],
              filterInactive: '',
              chainedParams: { urlParam: 'testparam', valueFrom: 'testInput' },
              target: 'metadata',
            }

            asyncSearch = Typeahead.methods.asyncSearch.bind(instance)

            sinon.stub(document, 'getElementsByName').returns([
              {
                value: 'testvalue',
              },
            ])

            axios.get = sinon.stub().resolves({
              data: [
                {
                  value: '1',
                  label: 'Fred Smith',
                  subLabel: 'Dept of commerce',
                },
              ],
            })

            asyncSearch('fred')
            setTimeout(done, 600)
          })

          it('should have fetched suggestions', () => {
            expect(axios.get).to.have.been.calledOnce
            expect(axios.get).to.be.calledWith(
              '/api/options/adviser?autocomplete=fred&target=metadata&chained_param=testparam&chained_value=testvalue'
            )
          })
        }
      )

      context('when the user enters less than 3 characters', () => {
        beforeEach((done) => {
          axios.get = sinon.stub().resolves()
          asyncSearch('fr')
          setTimeout(done, 600)
        })

        it('should not fetch the results', () => {
          expect(axios.get).to.not.be.called
        })

        it('should clear the available options', () => {
          expect(instance.options).to.deep.equal([])
        })
      })

      context('when choosing to not display inactive advisers', () => {
        beforeEach((done) => {
          instance = {
            name: 'adviser',
            entity: 'adviser',
            options: [],
            filterInactive: '&is_active=true',
            target: 'metadata',
          }
          asyncSearch = Typeahead.methods.asyncSearch.bind(instance)

          axios.get = sinon.stub().resolves({
            data: [
              {
                value: '1',
                label: 'Fred Smith',
                subLabel: 'Dept of commerce',
              },
            ],
          })

          asyncSearch('fred')
          setTimeout(done, 600)
        })
        it('should not fetch active users', () => {
          expect(axios.get).to.have.been.calledOnce
          expect(axios.get).to.be.calledWith(
            '/api/options/adviser?autocomplete=fred&is_active=true&target=metadata'
          )
        })
      })
    })

    describe('#search', () => {
      const wrapper = mount(Typeahead, {
        propsData: {
          name: 'dit_team',
          label: 'Team',
          placeholder: 'Search teams',
          isAsync: false,
          model: `[{
            "value": "cff02898-9698-e211-a939-e4115bead28a",
            "label": "Aberdeen City Council"
          }, {
            "value": "08c14624-2f50-e311-a56a-e4115bead28a",
            "label": "Advanced Manufacturing Sector"
          }, {
            "value": "d33ade1c-9798-e211-a939-e4115bead28a",
            "label": "Advantage West Midlands (AWM)"
          }]`,
          target: 'metadata',
        },
      })

      const textInput = wrapper.find('.multiselect__input')

      it('should have a placeholder with a value', () => {
        expect(textInput.attributes().placeholder).to.equal('Search teams')
      })

      context('when the user enters less than 3 characters', () => {
        beforeEach((done) => {
          textInput.setValue('z')
          setTimeout(done, 600)
        })
        it('should not have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal(
            'No elements found. Consider changing the search query.'
          )
        })
      })

      context('when the user enters a character that matches', () => {
        beforeEach((done) => {
          textInput.setValue('a')
          setTimeout(done, 600)
        })
        it('should have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal('Aberdeen City Council')
        })
      })

      context('when the user enters characters that match', () => {
        beforeEach((done) => {
          textInput.setValue('aber')
          setTimeout(done, 600)
        })
        it('should have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal('Aberdeen City Council')
        })
      })

      context('when the user enters words that match in reverse order', () => {
        beforeEach((done) => {
          textInput.setValue('City Aberdeen')
          setTimeout(done, 600)
        })
        it('should have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal('Aberdeen City Council')
        })
      })

      context('when the user enters words that match in all lowercase', () => {
        beforeEach((done) => {
          textInput.setValue('aberdeen city')
          setTimeout(done, 600)
        })
        it('should have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal('Aberdeen City Council')
        })
      })

      context('when the user enters words that match in all uppercase', () => {
        beforeEach((done) => {
          textInput.setValue('ABERDEEN CITY')
          setTimeout(done, 600)
        })
        it('should have fetched results', () => {
          const listItem = wrapper.find('.multiselect__content li')
          expect(listItem.text()).to.equal('Aberdeen City Council')
        })
      })
    })
  })

  describe('watch', () => {
    let instance

    beforeEach(() => {
      instance = {
        name: 'adviser',
        entity: 'adviser',
        autoSubmit: true,
        multiple: true,
        id: 'xyz',
      }
    })

    describe('#selectedOptions', () => {
      let selectedOptions

      beforeEach(() => {
        selectedOptions = Typeahead.watch.selectedOptions.bind(instance)
      })

      context('when called from within a form', () => {
        beforeEach(() => {
          document.body.innerHTML = `<div>
            <form id="form" action="/search">
              <h1>Form</h1>
              <input name="country" value="9999">
              <input name="xyz" value="zzz">
            </form>
            <div id="xhr-target">Some stuff</div>
          </div>`

          instance.formSelector = '#form'
        })

        context('and when not already waiting for search results', () => {
          beforeEach((done) => {
            selectedOptions([
              { value: '1234', label: 'Fred Smith', subLabel: 'Charters' },
            ])
            setTimeout(done, 100)
          })

          it('should call XHR with the form values plus the selected options', () => {
            expect(XHR.request).to.be.calledWith('/search', {
              country: '9999',
              adviser: ['1234'],
            })
          })
        })
      })
    })
  })
})
