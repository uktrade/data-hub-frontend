const proxyquire = require('proxyquire')

const FormController = require('../form')

const updateMockData = {
  id: 'order-1234567890',
}

describe('OMIS EditController', () => {
  beforeEach(() => {
    this.nextSpy = sinon.stub()
    this.orderUpdateStub = sinon.stub()

    this.ControllerClass = proxyquire('../edit', {
      '../models': {
        Order: {
          update: this.orderUpdateStub,
        },
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('saveValues()', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {
          token: 'sessionToken',
        },
        form: {
          values: {
            foo: 'bar',
            fizz: 'buzz',
          },
        },
      }
      this.resMock = {
        locals: {
          order: { id: updateMockData.id },
        },
      }
    })

    context('when order save is successful', () => {
      beforeEach(async () => {
        this.orderUpdateStub.resolves(updateMockData)

        await this.controller.saveValues(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should call save method on order model', () => {
        expect(this.orderUpdateStub).to.have.been.calledWith(
          this.reqMock,
          updateMockData.id,
          {
            foo: 'bar',
            fizz: 'buzz',
          }
        )
      })

      it('should call next with no arguments', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when order save fails', () => {
      beforeEach(async () => {
        this.errorMock = new Error('Save Error')
        this.orderUpdateStub.rejects(this.errorMock)

        await this.controller.saveValues(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should call next with the error', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      })
    })
  })

  describe('successHandler()', () => {
    beforeEach(() => {
      this.resetSpy = sinon.spy()
      this.destroySpy = sinon.spy()
      this.flashSpy = sinon.spy()
      this.redirectSpy = sinon.spy()
      this.nextMock = '/next-step/'

      this.reqMock = {
        form: {
          options: {},
        },
        sessionModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        journeyModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        flash: this.flashSpy,
      }
      this.resMock = {
        redirect: this.redirectSpy,
      }

      sinon.stub(FormController.prototype, 'getNextStep').returns(this.nextMock)
    })

    context("when a success message doesn't exist", () => {
      beforeEach(() => {
        this.controller.successHandler(this.reqMock, this.resMock)
      })

      it('should reset the models', () => {
        expect(this.resetSpy).to.have.been.calledTwice
        expect(this.destroySpy).to.have.been.calledTwice
      })

      it('should not set a flash message', () => {
        expect(this.flashSpy).not.to.have.been.called
      })

      it('should get the next value', () => {
        expect(FormController.prototype.getNextStep).to.have.been.calledOnce
        expect(FormController.prototype.getNextStep).to.have.been.calledWith(
          this.reqMock,
          this.resMock
        )
      })

      it('should redirect with getNextStep value', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.have.been.calledWith(this.nextMock)
      })
    })

    context('when a success message exists', () => {
      beforeEach(() => {
        this.reqMock.form.options.successMessage = 'Successfully handled'
        this.controller.successHandler(this.reqMock, this.resMock)
      })

      it('should set a flash message', () => {
        expect(this.flashSpy).to.have.been.calledOnce
        expect(this.flashSpy).to.have.been.calledWith(
          'success',
          'Successfully handled'
        )
      })
    })
  })

  describe('getValues()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              foo: {},
              fizz: {},
              delivery_date: {},
            },
          },
        },
        sessionModel: {
          toJSON: () => {
            return {}
          },
        },
      })
    })

    it('should not return the errorValues key', (done) => {
      this.reqMock.sessionModel.toJSON = () => {
        return { errorsValues: {} }
      }
      const nextMock = (e, values) => {
        expect(values).not.to.have.property('errorValues')
        done()
      }

      this.controller.getValues(this.reqMock, globalRes, nextMock)
    })

    it('should not return the errors key', (done) => {
      this.reqMock.sessionModel.toJSON = () => {
        return { errors: {} }
      }
      const nextMock = (e, values) => {
        expect(values).not.to.have.property('errors')
        done()
      }

      this.controller.getValues(this.reqMock, globalRes, nextMock)
    })

    context('when no sessionValues are set', () => {
      it('should return values from res.locals.order', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: 'bar',
              fizz: 'buzz',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: 'bar',
            fizz: 'buzz',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when session values are set', () => {
      it('should combine and override orderValues', (done) => {
        this.reqMock.sessionModel.toJSON = () => {
          return {
            foo: 'buzz',
          }
        }
        const resMock = {
          locals: {
            order: {
              foo: 'bar',
              fizz: 'buzz',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: 'buzz',
            fizz: 'buzz',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when error values are set', () => {
      it('should combine and override orderValues and sessionValues', (done) => {
        this.reqMock.sessionModel.toJSON = () => {
          return {
            foo: 'buzz',
            errorValues: {
              foo: 'world',
            },
          }
        }
        const resMock = {
          locals: {
            order: {
              foo: 'bar',
              fizz: 'buzz',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: 'world',
            fizz: 'buzz',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when a field marked as a date field contains a date', () => {
      it('should format it using the config format', (done) => {
        const resMock = {
          locals: {
            order: {
              delivery_date: '2017-01-10',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            delivery_date: '10 January 2017',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context(
      "when a field marked as a date field doesn't contain a valid date",
      () => {
        it('should return the value', (done) => {
          const resMock = {
            locals: {
              order: {
                delivery_date: 'not-a-date',
              },
            },
          }
          const nextMock = (e, values) => {
            expect(values).to.deep.equal({
              delivery_date: 'not-a-date',
            })
            done()
          }

          this.controller.getValues(this.reqMock, resMock, nextMock)
        })
      }
    )

    context('when a field marked as a date field is null', () => {
      it('should not format field as a date', (done) => {
        const resMock = {
          locals: {
            order: {
              delivery_date: null,
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({})
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when a field not marked as a date field contains a date', () => {
      it('should return the value', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: '2017-01-10',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: '2017-01-10',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when a value contains a boolean', () => {
      it('should return true', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: true,
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: true,
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })

      it('should return false', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: false,
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: false,
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when returning order keys', () => {
      context('when the value is a plain object', () => {
        it('should return the id property', (done) => {
          const resMock = {
            locals: {
              order: {
                foo: { id: 'dcdabbc9-1781-e411-8955-e4115bead28a' },
              },
            },
          }
          const nextMock = (e, values) => {
            expect(values).to.deep.equal({
              foo: 'dcdabbc9-1781-e411-8955-e4115bead28a',
            })
            done()
          }

          this.controller.getValues(this.reqMock, resMock, nextMock)
        })
      })

      context('when the value is an array of plain object', () => {
        it('should return an array of id properties', (done) => {
          const resMock = {
            locals: {
              order: {
                foo: [
                  { id: 'dcdabbc9-1781-e411-8955-e4115bead28a' },
                  { id: '22651151-2149-465e-871b-ac45bc568a62' },
                ],
              },
            },
          }
          const nextMock = (e, values) => {
            expect(values).to.deep.equal({
              foo: [
                'dcdabbc9-1781-e411-8955-e4115bead28a',
                '22651151-2149-465e-871b-ac45bc568a62',
              ],
            })
            done()
          }

          this.controller.getValues(this.reqMock, resMock, nextMock)
        })
      })

      context(
        'when the value is an array that contains adviser objects',
        () => {
          it('should return the id property', (done) => {
            const resMock = {
              locals: {
                order: {
                  foo: [
                    {
                      adviser: { id: 'dcdabbc9-1781-e411-8955-e4115bead28a' },
                    },
                    {
                      adviser: { id: '22651151-2149-465e-871b-ac45bc568a62' },
                    },
                  ],
                },
              },
            }
            const nextMock = (e, values) => {
              expect(values).to.deep.equal({
                foo: [
                  'dcdabbc9-1781-e411-8955-e4115bead28a',
                  '22651151-2149-465e-871b-ac45bc568a62',
                ],
              })
              done()
            }

            this.controller.getValues(this.reqMock, resMock, nextMock)
          })
        }
      )

      context('when field is a repeatable field', () => {
        it('should convert a string into an array', (done) => {
          this.reqMock.form.options.fields.foo.repeatable = true
          const resMock = {
            locals: {
              order: {
                foo: 'string',
              },
            },
          }
          const nextMock = (e, values) => {
            expect(values).to.deep.equal({
              foo: ['string'],
            })
            done()
          }

          this.controller.getValues(this.reqMock, resMock, nextMock)
        })
      })
    })

    describe('filtering', () => {
      it('should only filter null and undefined', (done) => {
        const resMock = {
          locals: {
            order: {
              false: false,
              undefined: undefined,
              null: null,
              empty: '',
            },
          },
        }
        const reqMock = Object.assign({}, this.reqMock, {
          form: {
            options: {
              fields: {
                false: {},
                undefined: {},
                null: {},
                empty: {},
              },
            },
          },
        })
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            false: false,
            empty: '',
          })
          done()
        }

        this.controller.getValues(reqMock, resMock, nextMock)
      })
    })
  })
})
