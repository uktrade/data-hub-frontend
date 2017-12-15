const updateMockData = {
  id: 'order-1234567890',
}

describe('OMIS EditController', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.stub()
    this.orderUpdateStub = sandbox.stub()

    this.ControllerClass = proxyquire('~/src/apps/omis/controllers/edit', {
      '../models': {
        Order: {
          update: this.orderUpdateStub,
        },
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('successHandler()', () => {
    beforeEach(() => {
      this.resetSpy = sandbox.spy()
      this.destroySpy = sandbox.spy()
      this.flashSpy = sandbox.spy()

      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              foo: {},
              fizz: {},
            },
          },
        },
        session: {
          token: 'token-12345',
        },
        sessionModel: {
          toJSON: () => {
            return {
              'csrf-secret': 'secret-key',
              errors: {},
              foo: 'bar',
              fizz: 'buzz',
            }
          },
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        journeyModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        flash: this.flashSpy,
      })
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          order: {
            id: updateMockData.id,
          },
        },
      })
    })

    context('when order save is succesfully', () => {
      beforeEach(() => {
        this.orderUpdateStub.resolves(updateMockData)
      })

      it('should call update method with correct values', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (url) => {
            try {
              expect(this.orderUpdateStub).to.have.been.calledWith('token-12345', 'order-1234567890', {
                foo: 'bar',
                fizz: 'buzz',
              })
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })

      it('should reset the models', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: () => {
            try {
              expect(this.resetSpy).to.have.been.calledTwice
              expect(this.destroySpy).to.have.been.calledTwice
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })

      it('should set a flash message', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: () => {
            try {
              expect(this.flashSpy).to.have.been.calledOnce
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })

      it('should redirect back to the order', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (url) => {
            try {
              expect(url).to.equal(`/omis/${updateMockData.id}`)
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })

      context('when next is set', () => {
        it('should redirect back to returnUrl', (done) => {
          const reqMock = Object.assign({}, this.reqMock)
          const resMock = Object.assign({}, this.resMock, {
            redirect: (url) => {
              try {
                expect(url).to.equal('/custom-return-url')
                done()
              } catch (error) {
                done(error)
              }
            },
          })

          reqMock.form.options.next = '/custom-return-url'

          this.controller.successHandler(reqMock, resMock, this.nextSpy)
        })
      })

      it('should not call the next method', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: () => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when order save fails', () => {
      beforeEach(() => {
        this.orderUpdateStub.rejects(new Error())
      })

      it('should save an order', (done) => {
        const resMock = {
          redirect: sandbox.spy(),
        }
        const nextMock = (error) => {
          try {
            expect(error).to.be.an('error')
            expect(resMock.redirect).to.not.have.been.called
            expect(this.resetSpy).to.not.have.been.called
            done()
          } catch (error) {
            done(error)
          }
        }

        this.controller.successHandler(this.reqMock, resMock, nextMock)
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

    context('when a value contains a date', () => {
      it('should format it using the config format', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: '2017-01-10',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: '10 January 2017',
          })
          done()
        }

        this.controller.getValues(this.reqMock, resMock, nextMock)
      })
    })

    context('when a value doesn\'t contain a date', () => {
      it('should return the value', (done) => {
        const resMock = {
          locals: {
            order: {
              foo: 'not-a-date',
            },
          },
        }
        const nextMock = (e, values) => {
          expect(values).to.deep.equal({
            foo: 'not-a-date',
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

      context('when the value is an array that contains adviser objects', () => {
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
      })

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
