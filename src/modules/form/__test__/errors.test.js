const { getErrors } = require('~/src/modules/form/errors.js')

describe('errors', () => {
  describe('#getErrors', () => {
    context('when field 1 validation is not conditional', () => {
      beforeEach(() => {
        const children = [
          {
            name: 'field_1',
            validations: [
              {
                type: 'required',
                message: 'You must select field 1',
              },
            ],
          },
          {
            name: 'field_2',
            validations: [
              {
                type: 'required',
                message: 'You must select field 2',
              },
            ],
          },
        ]
        this.errors = getErrors(children, {})
      })

      it('should map the errors to an object', () => {
        expect(this.errors).to.deep.equal({
          field_1: [ 'You must select field 1' ],
          field_2: [ 'You must select field 2' ],
        })
      })
    })

    context('when field 1 validation is conditional', () => {
      context('when the conditional field value implies field 1 needs to be validated', () => {
        beforeEach(() => {
          const children = [
            {
              name: 'field_1',
              validations: [
                {
                  type: 'required',
                  message: 'You must select field 1',
                  when: ({ field_2: field2 }) => field2 === 'selected',
                },
              ],
            },
          ]
          this.errors = getErrors(children, { field_2: 'selected' })
        })

        it('should map the errors to an object', () => {
          expect(this.errors).to.deep.equal({
            field_1: [ 'You must select field 1' ],
          })
        })
      })

      context('when the conditional field value implies field 1 does not need to be validated', () => {
        beforeEach(() => {
          const children = [
            {
              name: 'field_1',
              validations: [
                {
                  type: 'required',
                  message: 'You must select field 1',
                  when: ({ field_2: field2 }) => field2 === 'selected',
                },
              ],
            },
          ]
          this.errors = getErrors(children, { field_2: 'not selected' })
        })

        it('should not map any errors', () => {
          expect(this.errors).to.deep.equal({})
        })
      })
    })

    context('when field 1 has children with validation', () => {
      beforeEach(() => {
        const children = [
          {
            name: 'field_1',
            validations: [
              {
                type: 'required',
                message: 'You must select field 1',
              },
            ],
            options: [
              {
                children: [
                  {
                    name: 'sub_field_1',
                    validations: [
                      {
                        type: 'required',
                        message: 'You must select sub field 1',
                      },
                    ],
                    options: [
                      {
                        children: [
                          {
                            name: 'sub_sub_field_1',
                            validations: [
                              {
                                type: 'required',
                                message: 'You must select sub sub field 1',
                              },
                            ],
                          },
                          {
                            name: 'sub_sub_field_2',
                            validations: [
                              {
                                type: 'required',
                                message: 'You must select sub sub field 2',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]
        this.errors = getErrors(children, {})
      })

      it('should map the errors to an object', () => {
        expect(this.errors).to.deep.equal({
          field_1: [ 'You must select field 1' ],
          sub_field_1: [ 'You must select sub field 1' ],
          sub_sub_field_1: [ 'You must select sub sub field 1' ],
          sub_sub_field_2: [ 'You must select sub sub field 2' ],
        })
      })
    })
  })
})
