const Vue = require('vue')
const { mount } = require('@vue/test-utils')
const axios = require('axios')

const Typeahead = require('../../assets/javascripts/vue/typeahead.vue').default
const { highlight } = require('../../assets/javascripts/vue/filters')

const XHR = require('../../assets/javascripts/lib/xhr')

describe('Typeahead', () => {
  let sandbox
  let defaultProps

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    XHR.request = sandbox.stub().resolves()

    defaultProps = {
      name: 'adviser',
      entity: 'adviser',
      label: 'Adviser',
    }

    Vue.filter('highlight', highlight)
  })

  afterEach(() => {
    sandbox.restore()
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
        expect(component.find('.c-form-group.c-form-group--light.c-form-group--smaller.c-form-group--filter')).to.not.be.null
      })

      it('should render the label', () => {
        expect(component.find('label.c-form-group__label span.c-form-group__label-text').text()).to.equal('Adviser')
      })

      it('should render a multi select control', () => {
        expect(component.find('input.multiselect__input')).to.not.be.null
      })
    })

    context('when there are suggestions to display', () => {
      beforeEach((done) => {
        const dataWithOptions = Object.assign({}, defaultProps, {
          options: [{
            value: '1234',
            label: 'Fred Smith',
            subLabel: 'London',
          }, {
            value: '4321',
            label: 'Jane Jones',
            subLabel: 'Scotland',
          }],
        })

        component.setData(dataWithOptions)
        Vue.nextTick(done)
      })

      it('should render an item for each option', () => {
        const options = component.findAll('.multiselect__element .multiselect__option')
        expect(options).to.have.length(2)
      })

      it('should render the correct markup for an option', () => {
        const markup = component.find('.multiselect__element .multiselect__option').element.innerHTML
        expect(markup).to.equal('<div class="multiselect__option-label">Fred Smith</div> <div class="multiselect__option-sublabel">London</div>')
      })
    })

    context('when advisers are selected', () => {
      beforeEach((done) => {
        const dataWithSelectedAdvisers = Object.assign({}, defaultProps, {
          selectedOptions: [{
            value: '1234',
            label: 'Fred Jones',
            subLabel: 'London',
          }],
        })

        component.setData(dataWithSelectedAdvisers)
        Vue.nextTick(done)
      })

      it('should populate the default selected options', () => {
        expect(component.findAll('.multiselect__tag')).to.have.length(1)
      })

      it('should show the adviser name in the tag', () => {
        expect(component.find('.multiselect__tag').text()).to.equal('Fred Jones')
      })
    })
  })

  describe('data', () => {
    let component

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
    let instance

    beforeEach(() => {
      instance = {
        name: 'adviser',
        entity: 'adviser',
      }
    })

    describe('#asyncFind', () => {
      let asyncFind

      beforeEach(() => {
        asyncFind = Typeahead.methods.asyncFind.bind(instance)
      })

      context('when the user enters more than 3 characters', () => {
        beforeEach((done) => {
          axios.get = sinon.stub().resolves({
            data: [{
              value: '1',
              label: 'Fred Smith',
              subLabel: 'Dept of commerce',
            }],
          })

          asyncFind('fred')
          setTimeout(done, 600)
        })

        it('should have fetched suggestions', () => {
          expect(axios.get).to.have.been.calledOnce
          expect(axios.get).to.be.calledWith('/api/options/adviser?term=fred')
        })

        it('should store the return options', () => {
          expect(instance.options).to.deep.equal([{
            value: '1',
            label: 'Fred Smith',
            subLabel: 'Dept of commerce',
          }])
        })
      })

      context('when the user enters less than 3 characters', () => {
        beforeEach((done) => {
          axios.get = sinon.stub().resolves()
          asyncFind('fr')
          setTimeout(done, 600)
        })

        it('should not fetch the results', () => {
          expect(axios.get).to.not.be.called
        })

        it('should clear the available options', () => {
          expect(instance.options).to.deep.equal([])
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
            </form>
            <div id="xhr-target">Some stuff</div>
          </div>`

          instance.formSelector = '#form'
        })

        context('and when not already waiting for search results', () => {
          beforeEach((done) => {
            instance.isSubmitting = false
            selectedOptions([{ value: '1234', label: 'Fred Smith', subLabel: 'Charters' }])
            setTimeout(done, 100)
          })

          it('should call XHR with the form values plus the selected options', () => {
            expect(XHR.request).to.be.calledWith('/search', {
              country: '9999',
              adviser: ['1234'],
            })
          })
        })

        context('and when already waiting for search results', () => {
          beforeEach((done) => {
            instance.isSubmitting = true
            selectedOptions([{ value: '1234', label: 'Fred Smith', subLabel: 'Charters' }])
            setTimeout(done, 100)
          })

          it('should not call XHR', () => {
            expect(XHR.request).to.not.be.called
          })
        })
      })
    })
  })
})
