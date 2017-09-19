const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

const items = [
  { label: 'Foo', value: 'Bar' },
  { label: 'Fizz', value: 'Buzz' },
]

describe('Answers Summary macro', () => {
  context('invalid props', () => {
    it('should not render if no items or caller is not provided', () => {
      const component = commonMacros.renderToDom('AnswersSummary')
      expect(component).to.be.null
    })
  })

  context('minimum props', () => {
    context('items prop', () => {
      beforeEach(() => {
        this.component = commonMacros.renderToDom('AnswersSummary', {
          items,
        })
      })

      it('should render list of items', () => {
        const rows = this.component.querySelectorAll('tr')

        expect(rows).to.have.lengthOf(2)
        expect(rows[0].querySelector('.c-answers-summary__title').textContent.trim()).to.equal('Foo')
        expect(rows[0].querySelector('.c-answers-summary__content').textContent.trim()).to.equal('Bar')
        expect(rows[1].querySelector('.c-answers-summary__title').textContent.trim()).to.equal('Fizz')
        expect(rows[1].querySelector('.c-answers-summary__content').textContent.trim()).to.equal('Buzz')
      })

      it('should not display a caption', () => {
        expect(this.component.querySelector('caption')).to.be.null
      })
    })

    context('caller', () => {
      beforeEach(() => {
        this.component = commonMacros.renderWithCallerToDom('AnswersSummary')(
          `
          <tbody>
            <tr>
              <th>Custom body</th>
            </tr>
          </tbody>
          `
        )
      })

      it('should render list of items', () => {
        expect(this.component.querySelector('tbody').textContent.trim()).to.equal('Custom body')
      })

      it('should not display a caption', () => {
        expect(this.component.querySelector('caption')).to.be.null
      })
    })
  })

  context('customise component', () => {
    context('with heading', () => {
      it('should display heading element', () => {
        const component = commonMacros.renderToDom('AnswersSummary', {
          heading: 'Table heading',
          items,
        })

        expect(component.querySelector('.c-answers-summary__heading').textContent.trim()).to.equal('Table heading')
      })
    })

    context('with actions', () => {
      beforeEach(() => {
        this.component = commonMacros.renderToDom('AnswersSummary', {
          actions: [{
            url: '/edit',
          }],
          items,
        })
      })

      it('should display summary heading', () => {
        expect(this.component.querySelectorAll('.c-answers-summary__heading')).to.have.lengthOf(1)
      })

      it('should display action with default text', () => {
        const action = this.component.querySelector('.c-answers-summary__heading-action')

        expect(action.textContent.trim()).to.equal('Edit')
        expect(action.getAttribute('href').trim()).to.equal('/edit')
      })

      context('with multiple actions', () => {
        beforeEach(() => {
          this.component = commonMacros.renderToDom('AnswersSummary', {
            actions: [{
              url: '/edit-1',
            }, {
              url: '/edit-2',
            }, {
              url: '/edit-3',
            }],
            items,
          })
        })

        it('should render the correct amount', () => {
          const actions = this.component.querySelectorAll('.c-answers-summary__heading-action')

          expect(actions).to.have.lengthOf(3)
        })
      })

      context('with custom label', () => {
        beforeEach(() => {
          this.component = commonMacros.renderToDom('AnswersSummary', {
            actions: [{
              url: '/edit',
              label: 'Edit this item',
            }],
            items,
          })
        })

        it('should render the correct amount', () => {
          const action = this.component.querySelector('.c-answers-summary__heading-action')

          expect(action.textContent.trim()).to.equal('Edit this item')
        })
      })

      context('with no url', () => {
        beforeEach(() => {
          this.component = commonMacros.renderToDom('AnswersSummary', {
            actions: [{
              url: '/edit-1',
            }, {
              label: 'No url value',
            }, {
              url: '/edit-2',
            }],
            items,
          })
        })

        it('should not render ', () => {
          const actions = this.component.querySelectorAll('.c-answers-summary__heading-action')

          expect(actions).to.have.lengthOf(2)
          expect(actions[0].getAttribute('href')).to.equal('/edit-1')
          expect(actions[1].getAttribute('href')).to.equal('/edit-2')
        })
      })
    })
  })

  context('items as list of strings', () => {
    beforeEach(() => {
      this.component = commonMacros.renderToDom('AnswersSummary', {
        items: ['Item one', 'Item two', 'Item three'],
      })
    })

    it('should only render 1 column', () => {
      const rows = this.component.querySelectorAll('tr')

      expect(rows[0].querySelector('.c-answers-summary__content')).to.be.null
      expect(rows[0].querySelector('.c-answers-summary__title').getAttribute('colspan')).to.equal('2')
    })

    it('should render all items', () => {
      const rows = this.component.querySelectorAll('tr')

      expect(rows).to.have.lengthOf(3)
      expect(rows[0].querySelector('.c-answers-summary__title').textContent.trim()).to.equal('Item one')
      expect(rows[1].querySelector('.c-answers-summary__title').textContent.trim()).to.equal('Item two')
      expect(rows[2].querySelector('.c-answers-summary__title').textContent.trim()).to.equal('Item three')
    })
  })
})
