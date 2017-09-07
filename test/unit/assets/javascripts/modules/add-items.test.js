const AddAnotherFragment = require('~/assets/javascripts/modules/add-items')
const { getMacros } = require('~/test/unit/macro-helper')
const formMacros = getMacros('form')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

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

function makeSingleFieldset (allowDeleteAll = false) {
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
      ${allowDeleteAll ? 'data-can-remove-all' : ''}>${fieldset}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeMultipleFieldset (allowDeleteAll = false) {
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
      ${allowDeleteAll ? 'data-can-remove-all' : ''}>${fieldset}${fieldset}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function makeSingleSelect (allowDeleteAll = false) {
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

function makeMultipleSelect (allowDeleteAll = false) {
  const HTML = `
    <div class="js-AddItems"
      data-item-selector=".js-adviser"
      ${allowDeleteAll ? 'data-can-remove-all' : ''}>${selectMarkup}${selectMarkup}</div>`

  const { window } = new JSDOM(HTML)
  const document = window.document
  const wrapper = document.querySelector('.js-AddItems')
  AddAnotherFragment.init(document)

  return { document, wrapper }
}

function getVisibleRemoveButtons (wrapper, selector = '.js-AddItems__remove') {
  return Array
  .from(wrapper.querySelectorAll(selector))
  .filter((removeLink) => !Array.from(removeLink.classList).includes('u-hidden'))
}

describe('Add another', () => {
  describe('<fieldset>', () => {
    describe('add', () => {
      beforeEach(() => {
        const { document, wrapper } = makeSingleFieldset()
        this.document = document
        this.wrapper = wrapper
      })

      it('should add a button to add more fragments', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        expect(addButtonElement.innerText).to.equal('Add another item')
      })

      it('should create a 2nd fieldset after the first if the add button is pressed', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()
        const fieldsets = this.wrapper.querySelectorAll('fieldset')
        expect(fieldsets).to.have.length(2)
      })

      it('should create a new ID for elements with an existing ID', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()
        const fieldsets = Array.from(this.wrapper.querySelectorAll('fieldset'))

        const firstTextField = fieldsets[0].querySelector('input')
        const secondTextField = fieldsets[1].querySelector('input')

        expect(secondTextField.id).to.have.length.above(0)
        expect(secondTextField.id).to.not.equal(firstTextField.id)
      })

      it('should re-assign "for" attributes to their associated new field', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()

        const fieldset = Array.from(this.wrapper.querySelectorAll('fieldset'))[1]
        const secondTextField = fieldset.querySelector('input')
        const label = fieldset.querySelector(`[for="${secondTextField.id}"]`)
        expect(label.innerHTML).to.contain('Role')
      })
    })

    describe('remove', () => {
      describe('default behaviour', () => {
        it('should not show a remove button if there is only 1 initial fragment by default', () => {
          const { document, wrapper } = makeSingleFieldset()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button at the end of each fragment if there is more than one', () => {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove an element if the remove button is pressed', () => {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.c-form-fieldset .js-AddItems__remove:not(.u-hidden)').click()

          expect(this.wrapper.querySelectorAll('.c-form-fieldset')).to.have.length(1)
        })

        it('should delete the remove button if you remove a fragment and there is only 1 left', () => {
          const { document, wrapper } = makeMultipleFieldset()
          this.document = document
          this.wrapper = wrapper
          this.wrapper.querySelector('.c-form-fieldset .js-AddItems__remove:not(.u-hidden)').click()

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button to existing fragments if they go from 1 to 2 fragments', () => {
          const { document, wrapper } = makeSingleFieldset()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })
      })

      describe('(allow remove all)', () => {
        beforeEach(() => {
          const { document, wrapper } = makeMultipleFieldset(true)
          this.document = document
          this.wrapper = wrapper
        })

        it('should add a remove button when there is only one fragment', () => {
          const { document, wrapper } = makeSingleFieldset(true)
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(1)
        })

        it('should add a remove button when there is more than one fragment', () => {
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove an element if the remove button is pressed', () => {
          this.wrapper.querySelector('.js-AddItems__remove').click()
          expect(this.wrapper.querySelectorAll('.c-form-fieldset')).to.have.length(1)
        })

        it('should not delete the remove button if you remove a fragment and there is only 1 left', () => {
          this.wrapper.querySelector('.c-form-fieldset .js-AddItems__remove').click()
          expect(getVisibleRemoveButtons(this.wrapper)).have.length(1)
        })

        it('should add a remove button to any new fragments', () => {
          const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
          addButtonElement.click()

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(3)
        })
      })
    })
  })

  describe('<select>', () => {
    describe('add', () => {
      beforeEach(() => {
        const { document, wrapper } = makeSingleSelect()
        this.document = document
        this.wrapper = wrapper
      })

      it('should add a button to add more fragments', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        expect(addButtonElement.innerText).to.equal('Add another item')
      })

      it('should create a 2nd textfield after the first if the add button is pressed', () => {
        const addButtonElement = this.wrapper.querySelector('.js-AddItems__add')
        addButtonElement.click()

        const inputs = this.wrapper.querySelectorAll('.js-adviser')
        expect(inputs).to.have.length(2)
      })
    })

    describe('remove', () => {
      describe('default behaviour', () => {
        it('should not add a remove button if there is only 1 initial form group by default', () => {
          const { document, wrapper } = makeSingleSelect()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
        })

        it('should add a remove button at the end of each form group if there is more than one', () => {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove a form group if the remove button is pressed', () => {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()

          expect(this.wrapper.querySelectorAll('.js-adviser')).to.have.length(1)
        })

        it('should delete the remove button if you remove a form group and there is only 1 left', () => {
          const { document, wrapper } = makeMultipleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.be.length(0)
        })

        it('should add a remove button to existing fragments if they go from 1 to 2 fragments', () => {
          const { document, wrapper } = makeSingleSelect()
          this.document = document
          this.wrapper = wrapper

          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })
      })

      describe('(allow remove all)', () => {
        beforeEach(() => {
          const { document, wrapper } = makeMultipleSelect(true)
          this.document = document
          this.wrapper = wrapper
        })

        it('should add a remove button when there is only one fragment', () => {
          const { document, wrapper } = makeSingleSelect(true)
          this.document = document
          this.wrapper = wrapper

          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(1)
        })

        it('should add a remove button when there is more than one fragment', () => {
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(2)
        })

        it('should remove an element if the remove button is pressed', () => {
          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(this.wrapper.querySelectorAll('.js-adviser')).to.have.length(1)
        })

        it('should not delete the remove button if you remove a fragment and there is only 1 left', () => {
          this.wrapper.querySelector('.js-adviser .js-AddItems__remove').click()
          expect(getVisibleRemoveButtons(this.wrapper)).have.length(1)
        })

        it('should add a remove button to any new fragments', () => {
          this.wrapper.querySelector('.js-AddItems__add').click()
          expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(3)
        })
      })
    })
  })

  describe('decorate existing add button', () => {
    beforeEach(() => {
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

    it('should not add a new add button if one is specified', () => {
      expect(this.document.querySelector('.js-AddItems__add')).to.equal(null)
      expect(this.document.querySelectorAll('[data-method="add"]')).to.have.length(1)
    })

    it('should add a fragment when the add button is pressed', () => {
      this.document.getElementById('add').click()
      expect(this.document.querySelectorAll('.c-form-fieldset')).to.have.length(2)
    })
  })

  describe('decorate existing remove button', () => {
    beforeEach(() => {
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

    it('should not add a new remove button if one is specified to existing markup', () => {
      expect(getVisibleRemoveButtons(this.wrapper)).to.have.length(0)
    })

    it('should remove a fragment when the decorated remove button is pressed', () => {
      this.document.querySelector('.js-remove-thing').click()
      expect(this.document.querySelectorAll('.my-fragment')).to.have.length(1)
    })
  })

  it('should allow add another button text to be overriden', () => {
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

    expect(document.querySelector('.js-AddItems__add').innerText).to.contain('Add new adviser')
  })

  it('should allow remove button text to be overridden', () => {
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

    expect(document.querySelector('[data-method="remove"]').innerHTML).to.contain('Delete this item')
  })
})
