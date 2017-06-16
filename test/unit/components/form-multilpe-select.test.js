const expectComponent = require('../component-helper').expectComponent

describe('Form multiple choice component', () => {
  describe('all variants', () => {
    const variant = 'radio'

    it('should render inline', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          inline: true,
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
          ],
        },
        `
        <fieldset class="form-group inline">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

            <label for="input--looking-for--1" class="block-label selection-button-radio">
              My marbells
              <input type="radio" name="looking-for" id="input--looking-for--1" value="marbells">
            </label>
        </fieldset>
        `
      )
    })

    it('should render an error', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          error: true,
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
          ],
        },
        `
        <fieldset class="form-group error">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

            <label for="input--looking-for--1" class="block-label selection-button-radio">
              My marbells
              <input type="radio" name="looking-for" id="input--looking-for--1" value="marbells">
            </label>
        </fieldset>
        `
      )
    })

    it('should use label value as fallback', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          error: true,
          children: [
            {
              label: 'My marbells',
            },
          ],
        },
        `
        <fieldset class="form-group error">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

            <label for="input--looking-for--1" class="block-label selection-button-radio">
              My marbells
              <input type="radio" name="looking-for" id="input--looking-for--1" value="My marbells">
            </label>
        </fieldset>
        `
      )
    })

    it('should render as optional', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          optional: true,
          children: [
            {
              label: 'My marbells',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for? (optional)
          </legend>

            <label for="input--looking-for--1" class="block-label selection-button-radio">
              My marbells
              <input type="radio" name="looking-for" id="input--looking-for--1" value="My marbells">
            </label>
        </fieldset>
        `
      )
    })

    it('should render hint text', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          hint: 'Choose an option',
          children: [
            {
              label: 'My marbells',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
            <span class="form-hint" id="hint-looking-for">Choose an option</span>
          </legend>

            <label for="input--looking-for--1" class="block-label selection-button-radio">
              My marbells
              <input type="radio" name="looking-for" id="input--looking-for--1" value="My marbells" aria-describedby="hint-looking-for">
            </label>
        </fieldset>
        `
      )
    })
  })

  describe('radio variant', () => {
    const variant = 'radio'

    it('should render', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

          <label for="input--looking-for--1" class="block-label selection-button-radio">
            My marbells
            <input type="radio" name="looking-for" id="input--looking-for--1" value="marbells">
          </label>
        </fieldset>
        `
      )
    })

    it('should render first item checked', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          value: 'marbells',
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
            {
              label: 'For love',
              value: 'love',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

          <label for="input--looking-for--1" class="block-label selection-button-radio selected">
            My marbells
            <input type="radio" name="looking-for" id="input--looking-for--1" value="marbells" checked="checked">
          </label>

          <label for="input--looking-for--2" class="block-label selection-button-radio">
            For love
            <input type="radio" name="looking-for" id="input--looking-for--2" value="love">
          </label>
        </fieldset>
        `
      )
    })
  })

  describe('checkbox variant', () => {
    const variant = 'checkbox'

    it('should render', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

          <label for="input--looking-for--1" class="block-label selection-button-checkbox">
            My marbells
            <input type="checkbox" name="looking-for" id="input--looking-for--1" value="marbells">
          </label>
        </fieldset>
        `
      )
    })

    it('should render second item checked', () => {
      expectComponent(
        'form-multiple-choice',
        {
          variant,
          label: 'What were you looking for?',
          name: 'looking-for',
          value: ['love'],
          children: [
            {
              label: 'My marbells',
              value: 'marbells',
            },
            {
              label: 'For love',
              value: 'love',
            },
          ],
        },
        `
        <fieldset class="form-group">
          <legend class="form-label-bold" id="group-looking-for">
            What were you looking for?
          </legend>

          <label for="input--looking-for--1" class="block-label selection-button-checkbox">
            My marbells
            <input type="checkbox" name="looking-for" id="input--looking-for--1" value="marbells">
          </label>

          <label for="input--looking-for--2" class="block-label selection-button-checkbox selected">
            For love
            <input type="checkbox" name="looking-for" id="input--looking-for--2" value="love" checked="checked">
          </label>
        </fieldset>
        `
      )
    })
  })
})
