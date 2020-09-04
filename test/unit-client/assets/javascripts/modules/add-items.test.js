/* eslint-disable no-new */
const Vue = require('vue')
const Typeahead = require('../../../../../assets/javascripts/vue/typeahead.vue')
  .default
const AddAnotherFragment = require('../../../../../assets/javascripts/modules/add-items')

const selectMarkup = `<div id="group-field-adviser" class="c-form-group js-adviser">
  <label class="c-form-group__label " for="field-adviser">
    <span class="c-form-group__label-text">Test label</span>
  </label>
  <div class="c-form-group__inner">
    <select id="field-adviser" name="adviser" class="c-form-control">
      <option value="fred">Fred</option>
      <option value="wilma" selected>Wilma</option>
    </select>
  </div>
</div>`

function makeSingleFieldset(allowDeleteAll = false, allowDelete = true) {
  const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
    formMacros.render('MultipleChoiceField', {
      label: 'Test label',
      name: 'adviser',
      value: 'wilma',
      options: [
        { label: 'Fred', value: 'fred' },
        { label: 'Wilma', value: 'wilma' },
      ],
    }),
    formMacros.render('TextField', {
      label: 'Role',
      name: 'role',
      value: 'Fred Smith',
    })
  ).outerHTML

  const HTML = `
    <div class="js-AddItems"
      data-item-selector=".c-form-fieldset"
      ${allowDelete ? '' : 'data-can-remove="false"'}
      ${allowDeleteAll ? 'data-can-remove-all' : ''}>${fieldset}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeMultipleFieldset(allowDeleteAll = false, allowDelete = true) {
  const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
    formMacros.render('MultipleChoiceField', {
      label: 'Test label',
      name: 'adviser',
      value: 'wilma',
      options: [
        { label: 'Fred', value: 'fred' },
        { label: 'Wilma', value: 'wilma' },
      ],
    }),
    formMacros.render('TextField', {
      label: 'Role',
      name: 'role',
      value: 'Fred Smith',
    })
  ).outerHTML

  const HTML = `
    <div class="js-AddItems"
      data-item-selector=".c-form-fieldset"
      ${allowDelete ? '' : 'data-can-remove="false"'}
      ${
        allowDeleteAll ? 'data-can-remove-all' : ''
      }>${fieldset}${fieldset}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeSingleSelect(allowDeleteAll = false) {
  const HTML = `
    <div class="js-AddItems"
      data-item-selector=".js-adviser"
      ${allowDeleteAll ? 'data-can-remove-all' : ''}>${selectMarkup}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')

  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeMultipleSelect(allowDeleteAll = false) {
  const HTML = `
    <div class="js-AddItems"
      data-item-selector=".js-adviser"
      ${
        allowDeleteAll ? 'data-can-remove-all' : ''
      }>${selectMarkup}${selectMarkup}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeTypeahead() {
  const HTML = formMacros.render('AddAnother', {
    buttonName: 'add_item',
    name: 'dit_participants',
    children: [
      {
        macroName: 'Typeahead',
        name: 'dit_participants',
        label: 'Advisers',
        isLabelHidden: true,
        entity: 'adviser',
        placeholder: 'Search adviser',
        classes: 'c-form-group c-form-group--no-filter',
        multipleSelect: false,
        options: [
          {
            value: '1',
            label: 'Bob',
            subLabel: 'Lawson',
          },
        ],
        apiVersion: 'metadata',
      },
    ],
    label: 'Adviser(s)',
    error: null,
    value: ['1'],
  })

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  return { document, wrapper }
}

function getVisibleRemoveButtons(wrapper, selector = '.js-AddItems__remove') {
  return Array.from(wrapper.querySelectorAll(selector)).filter(
    (removeLink) => !Array.from(removeLink.classList).includes('u-hidden')
  )
}

describe('Add another', function () {
  describe('<fieldset>', function () {
    describe('add', function () {
      beforeEach(function () {
        const { document, wrapper } = makeSingleFieldset()
        this.document = document
        this.wrapper = wrapper
      })

      it('should add a button to add more fragments', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        expect(addButtonElement.innerText).to.equal('Add another item')
      })

      it('should create a 2nd fieldset after the first if the add button is pressed', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()
        const fieldsets = this.wrapper.querySelectorAll('fieldset')
        expect(fieldsets).to.have.length(2)
      })

      it('should create a new ID for elements with an existing ID', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()
        const fieldsets = Array.from(this.wrapper.querySelectorAll('fieldset'))

        const firstTextField = fieldsets[0].querySelector('input')
        const secondTextField = fieldsets[1].querySelector('input')

        expect(secondTextField.id).to.have.length.above(0)
        expect(secondTextField.id).to.not.equal(firstTextField.id)
      })

      it('should not create a new NAME for elements with an existing NAME', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()
        const fieldsets = Array.from(this.wrapper.querySelectorAll('fieldset'))

        const firstTextField = fieldsets[0].querySelector('input')
        const secondTextField = fieldsets[1].querySelector('input')

        expect(secondTextField.name).to.have.length.above(0)
        expect(secondTextField.name).to.equal(firstTextField.name)
      })

      it('should re-assign "for" attributes to their associated new field', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()

        const fieldset = Array.from(
          this.wrapper.querySelectorAll('fieldset')
        )[1]
        const secondTextField = fieldset.querySelector('input')
        const label = fieldset.querySelector(`[for="${secondTextField.id}"]`)
        expect(label.innerHTML).to.contain('Role')
      })
    })

    describe('remove', function () {
      describe('default behaviour', function () {
        it('should not show a remove button if there is only 1 initial fragment by default', function () {
          const { document, wrapper } = makeSingleFieldset()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button at the end of each fragment if there is more than one', function () {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove an element if the remove button is pressed', function () {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper

          this.wrapper
            .querySelector(
              '.c-form-fieldset .js-AddItems__remove:not(.u-hidden)'
            )
            .click()

          expect(
            this.wrapper.querySelectorAll('.c-form-fieldset')
          ).to.have.length(1)
        })

        it('should delete the remove button if you remove a fragment and there is only 1 left', function () {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper
          this.wrapper
            .querySelector(
              '.c-form-fieldset .js-AddItems__remove:not(.u-hidden)'
            )
            .click()

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button to existing fragments if they go from 1 to 2 fragments', function () {
          const { document, wrapper } = makeSingleFieldset()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })
      })

      describe('(allow remove all)', function () {
        beforeEach(function () {
          const { wrapper } = makeMultipleFieldset(true)
          this.wrapper = wrapper
        })

        it('should remove an element if the remove button is pressed', function () {
          this.wrapper.querySelector('.js-AddItems__remove').click()
          expect(
            this.wrapper.querySelectorAll('.c-form-fieldset')
          ).to.have.length(1)
        })

        it('should not delete the remove button if you remove a fragment and there is only 1 left', function () {
          this.wrapper
            .querySelector('.c-form-fieldset .js-AddItems__remove')
            .click()
          expect(getVisibleRemoveButtons(this.wrapper)).have.length(1)
        })

        it('should add a remove button to any new fragments', function () {
          const addButtonElement = this.wrapper.querySelector(
            '.js-AddItems__add'
          )
          addButtonElement.click()

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(3)
        })

        context('when multiple items', function () {
          it('should add multiple remove button', function () {
            expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
          })
        })

        context('when only one item', function () {
          beforeEach(function () {
            const { wrapper } = makeSingleFieldset(true)
            this.wrapper = wrapper
          })

          it('should add one remove button', function () {
            expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(1)
          })
        })
      })

      describe('(disallow remove any)', function () {
        context('when only one item', function () {
          beforeEach(function () {
            const { wrapper } = makeSingleFieldset(false, false)
            this.wrapper = wrapper
          })

          it('should not add a remove button', function () {
            expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
          })
        })

        context('when multiple items', function () {
          beforeEach(function () {
            const { wrapper } = makeMultipleFieldset(false, false)
            this.wrapper = wrapper
          })

          it('should not add a remove button', function () {
            expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
          })
        })
      })
    })
  })

  describe('<select>', function () {
    describe('add', function () {
      beforeEach(function () {
        const { document, wrapper } = makeSingleSelect()
        this.document = document
        this.wrapper = wrapper
      })

      it('should add a button to add more fragments', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        expect(addButtonElement.innerText).to.equal('Add another item')
      })

      it('should create a 2nd textfield after the first if the add button is pressed', function () {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()

        const inputs = this.wrapper.querySelectorAll('.js-adviser')
        expect(inputs).to.have.length(2)
      })
    })

    describe('remove', function () {
      describe('default behaviour', function () {
        it('should not add a remove button if there is only 1 initial form group by default', function () {
          const { document, wrapper } = makeSingleSelect()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button at the end of each form group if there is more than one', function () {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove a form group if the remove button is pressed', function () {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()

          expect(this.wrapper.querySelectorAll('.js-adviser')).to.have.length(1)
        })

        it('should delete the remove button if you remove a form group and there is only 1 left', function () {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.be.length(0)
        })

        it('should add a remove button to existing fragments if they go from 1 to 2 fragments', function () {
          const { document, wrapper } = makeSingleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })
      })

      describe('(allow remove all)', function () {
        beforeEach(function () {
          const { document, wrapper } = makeMultipleSelect(true)
          this.document = document
          this.wrapper = wrapper
        })

        it('should add a remove button when there is only one fragment', function () {
          const { document, wrapper } = makeSingleSelect(true)
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(1)
        })

        it('should add a remove button when there is more than one fragment', function () {
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove an element if the remove button is pressed', function () {
          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(this.wrapper.querySelectorAll('.js-adviser')).to.have.length(1)
        })

        it('should not delete the remove button if you remove a fragment and there is only 1 left', function () {
          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(getVisibleRemoveButtons(this.wrapper)).have.length(1)
        })

        it('should add a remove button to any new fragments', function () {
          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(3)
        })
      })
    })
  })

  describe('<typeahead>', function () {
    beforeEach(function () {
      const { document, wrapper } = makeTypeahead()
      this.document = document
      this.wrapper = wrapper
      const vueWrappers = Array.from(
        document.querySelectorAll('.js-vue-wrapper')
      )
      const noScriptTags = Array.from(document.getElementsByTagName('noscript'))

      noScriptTags.forEach((tag) => {
        tag.parentNode.removeChild(tag)
      })

      vueWrappers.forEach((wrapper) => {
        new Vue({
          el: wrapper,
          components: {
            typeahead: Typeahead,
          },
        })
      })
      AddAnotherFragment.init(document)
    })

    it('should contain a typeahead', function () {
      const typeahead = this.wrapper.querySelector(
        '#group-field-dit_participants'
      )
      expect(typeahead).to.exist
    })

    it('should contain a selected value in the placeholder', function () {
      const hiddenInput = this.wrapper.querySelector('.multiselect__input')
      const placeholder = hiddenInput.getAttribute('placeholder')
      expect(placeholder).to.equal('Bob, Lawson')
    })

    it('should create a new typeahead field when add another is clicked', function () {
      this.wrapper.querySelector('.js-AddItems__add--typeahead').click()
      const typeaheads = this.wrapper.querySelectorAll(
        '#group-field-dit_participants'
      )
      expect(typeaheads.length).to.equal(2)
    })

    it('should not contain a placeholder in the 2nd item', function () {
      this.wrapper.querySelector('.js-AddItems__add--typeahead').click()
      const typeaheadTwo = Array.from(
        this.wrapper.querySelectorAll('#group-field-dit_participants')
      )[1]
      const hiddenInput = typeaheadTwo.querySelector('.multiselect__input')
      const placeholder = hiddenInput.getAttribute('placeholder')
      expect(placeholder).to.equal('Search team member')
    })
  })

  describe('decorate with typeahead add button', function () {
    beforeEach(function () {
      const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
        formMacros.render('Typeahead', {
          name: 'dit_participants',
          label: 'Advisers',
          isLabelHidden: true,
          entity: 'adviser',
          placeholder: 'Search adviser',
          classes: 'c-form-group c-form-group--no-filter',
          multipleSelect: false,
          options: [
            {
              value: '1',
              label: 'Bob',
              subLabel: 'Lawson',
            },
          ],
        })
      ).outerHTML

      const HTML = `
        <div class="js-AddItems"
          data-item-selector=".c-form-fieldset"
          data-add-button-type="typeahead"
          >

          ${fieldset}
        </div>`

      const { window } = new JSDOM(HTML)
      this.document = window.document
      const vueWrappers = Array.from(
        this.document.querySelectorAll('.js-vue-wrapper')
      )
      const noScriptTags = Array.from(
        this.document.getElementsByTagName('noscript')
      )

      noScriptTags.forEach((tag) => {
        tag.parentNode.removeChild(tag)
      })

      vueWrappers.forEach((wrapper) => {
        new Vue({
          el: wrapper,
          components: {
            typeahead: Typeahead,
          },
        })
      })
      AddAnotherFragment.init(this.document)
    })

    it('should create a button that adds a new fieldset with typeahead ', function () {
      expect(
        this.document.querySelectorAll('[data-method="add-typeahead"]')
      ).to.have.length(1)
    })

    it('should add a fragment when the add button is pressed', function () {
      this.document.querySelector('[data-method="add-typeahead"]').click()
      expect(this.document.querySelectorAll('.c-form-fieldset')).to.have.length(
        2
      )
    })
  })

  describe('decorate existing add button', function () {
    beforeEach(function () {
      const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
        formMacros.render('MultipleChoiceField', {
          label: 'Test label',
          name: 'adviser',
          value: 'wilma',
          options: [
            { label: 'Fred', value: 'fred' },
            { label: 'Wilma', value: 'wilma' },
          ],
        }),
        formMacros.render('TextField', {
          label: 'Role',
          name: 'role',
          value: 'Fred Smith',
        })
      ).outerHTML

      const HTML = `
        <div class="js-AddItems"
          data-item-selector=".c-form-fieldset"
          data-add-button-selector="#add"
          >

          ${fieldset}

          <p>
            <a id="add" href="page">Add more stuff</a>
          </p>
        </div>`

      const { window } = new JSDOM(HTML)
      this.document = window.document
      AddAnotherFragment.init(this.document)
    })

    it('should not add a new add button if one is specified', function () {
      expect(this.document.querySelector('.js-AddItems__add')).to.equal(null)
      expect(
        this.document.querySelectorAll('[data-method="add"]')
      ).to.have.length(1)
    })

    it('should add a fragment when the add button is pressed', function () {
      this.document.getElementById('add').click()
      expect(this.document.querySelectorAll('.c-form-fieldset')).to.have.length(
        2
      )
    })
  })

  describe('decorate existing remove button', function () {
    beforeEach(function () {
      const selectMarkup = formMacros.render('MultipleChoiceField', {
        label: 'Test label',
        name: 'adviser',
        value: 'wilma',
        groupClass: 'js-adviser',
        options: [
          { label: 'Fred', value: 'fred' },
          { label: 'Wilma', value: 'wilma' },
        ],
      })

      const HTML = `
        <div class="js-AddItems"
          data-item-selector=".my-fragment"
          data-remove-button-selector=".js-remove-thing">
          <div class="my-fragment">
            ${selectMarkup}
            <p>
              <a href="/thing" class="js-remove-thing">delete</a>
            </p>
          </div>
          <div class="my-fragment">
            ${selectMarkup}
            <p>
              <a href="/thing" class="js-remove-thing">delete</a>
            </p>
          </div>
        </div>`

      const { window } = new JSDOM(HTML)
      this.document = window.document
      this.wrapper = this.document.querySelector('.js-AddItems')
      AddAnotherFragment.init(this.document)
    })

    it('should not add a new remove button if one is specified to existing markup', function () {
      expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
    })

    it('should remove a fragment when the decorated remove button is pressed', function () {
      this.document.querySelector('.js-remove-thing').click()
      expect(this.document.querySelectorAll('.my-fragment')).to.have.length(1)
    })
  })

  it('should allow add another button text to be overriden', function () {
    const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
      formMacros.render('MultipleChoiceField', {
        label: 'Test label',
        name: 'adviser',
        value: 'wilma',
        options: [
          { label: 'Fred', value: 'fred' },
          { label: 'Wilma', value: 'wilma' },
        ],
      }),
      formMacros.render('TextField', {
        label: 'Role',
        name: 'role',
        value: 'Fred Smith',
      })
    ).outerHTML

    const HTML = `
      <div class="js-AddItems"
        data-item-selector=".c-form-fieldset"
        data-add-button-text="Add new adviser"
        >
        ${fieldset}
      </div>`

    const { window } = new JSDOM(HTML)
    const document = window.document
    AddAnotherFragment.init(document)

    expect(document.querySelector('.js-AddItems__add').innerText).to.contain(
      'Add new adviser'
    )
  })

  it('should allow remove button text to be overridden', function () {
    const fieldset = formMacros.renderWithCallerToDom('Fieldset')(
      formMacros.render('MultipleChoiceField', {
        label: 'Test label',
        name: 'adviser',
        value: 'wilma',
        options: [
          { label: 'Fred', value: 'fred' },
          { label: 'Wilma', value: 'wilma' },
        ],
      }),
      formMacros.render('TextField', {
        label: 'Role',
        name: 'role',
        value: 'Fred Smith',
      })
    ).outerHTML

    const HTML = `
      <div class="js-AddItems"
        data-item-selector=".c-form-fieldset"
        data-remove-button-text="Delete this item"
        >
        ${fieldset}
        ${fieldset}
      </div>`

    const { window } = new JSDOM(HTML)
    const document = window.document
    AddAnotherFragment.init(document)

    expect(
      document.querySelector('[data-method="remove"]').innerHTML
    ).to.contain('Delete this item')
  })
})
