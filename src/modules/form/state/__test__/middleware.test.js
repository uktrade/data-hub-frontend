const {
  validateState,
  updateStateData,
  updateStateBrowseHistory,
  setFormDetails,
  invalidateStateForChangedNextPath,
  invalidateStateForDependentSteps,
} = require('../middleware')
const steps = require('../../__fixtures__/steps.js')()

describe('Form state middleware', () => {
  describe('#validateState', () => {
    context('when starting the journey', () => {
      beforeEach(() => {
        this.req = {
          session: {},
          baseUrl: '/base',
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStepId: 0,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        validateState(this.req, this.res, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should not redirect', () => {
        expect(this.res.redirect).to.not.be.called
      })
    })

    context(
      'when steps 1 and 3 have been completed and then rendering step 5',
      () => {
        beforeEach(() => {
          this.req = {
            session: {
              'multi-step': {
                '/base/step-1': {
                  steps: {
                    '/step-1': {
                      data: {
                        selectedAtStep1: 'step-3-value',
                      },
                      completed: true,
                    },
                    '/step-3': {
                      data: {
                        selectedAtStep3: 'step-5-value',
                      },
                      completed: true,
                    },
                  },
                },
              },
            },
            baseUrl: '/base',
          }
          this.res = {
            locals: {
              journey: {
                steps,
                currentStepId: 4,
                key: '/base/step-1',
              },
            },
            redirect: sinon.spy(),
          }
          this.nextSpy = sinon.spy()

          validateState(this.req, this.res, this.nextSpy)
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledOnce
        })

        it('should not redirect', () => {
          expect(this.res.redirect).to.not.be.called
        })
      }
    )

    context(
      'when step 3 has not been completed and then rendering step 5',
      () => {
        beforeEach(() => {
          this.req = {
            session: {
              'multi-step': {
                '/base/step-1': {
                  steps: {
                    '/step-1': {
                      data: {
                        selectedAtStep1: 'step-3-value',
                      },
                      completed: true,
                    },
                    '/step-3': {
                      data: {
                        selectedAtStep3: 'step-5-value',
                      },
                    },
                  },
                },
              },
            },
            baseUrl: '/base',
          }
          this.res = {
            locals: {
              journey: {
                steps,
                currentStepId: 4,
                key: '/base/step-1',
              },
            },
            redirect: sinon.spy(),
          }
          this.nextSpy = sinon.spy()

          validateState(this.req, this.res, this.nextSpy)
        })

        it('should not call next', () => {
          expect(this.nextSpy).to.not.be.called
        })

        it('should redirect', () => {
          expect(this.res.redirect).to.be.calledOnce
          expect(this.res.redirect).to.be.calledWith('/base/step-1')
        })
      }
    )

    context(
      'when starting with step 2 which does not require previously completed steps',
      () => {
        beforeEach(() => {
          this.req = {
            session: {
              'multi-step': {
                '/base/step-1': {},
              },
            },
            baseUrl: '/base',
          }
          this.res = {
            locals: {
              journey: {
                steps,
                currentStepId: 1,
                key: '/base/step-1',
              },
            },
            redirect: sinon.spy(),
          }
          this.nextSpy = sinon.spy()

          validateState(this.req, this.res, this.nextSpy)
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledOnce
        })

        it('should not redirect', () => {
          expect(this.res.redirect).to.not.be.called
        })
      }
    )
  })

  describe('#updateStateData', () => {
    beforeEach(() => {
      this.req = {
        session: {},
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-3-value',
        },
      }
      this.res = {
        locals: {
          journey: {
            steps,
            currentStep: steps[0],
            currentStepId: 0,
            key: '/base/step-1',
          },
        },
        redirect: sinon.spy(),
      }
      this.nextSpy = sinon.spy()

      updateStateData(this.req, this.res, this.nextSpy)
    })

    it('should update state data', () => {
      expect(this.req.session).to.deep.equal({
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  selectedAtStep1: 'step-3-value',
                },
              },
            },
          },
        },
      })
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledOnce
    })
  })

  describe('#updateStateBrowseHistory', () => {
    beforeEach(() => {
      this.req = {
        session: {},
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-3-value',
        },
      }
      this.res = {
        locals: {
          journey: {
            steps,
            currentStep: steps[0],
            currentStepId: 0,
            key: '/base/step-1',
          },
        },
        redirect: sinon.spy(),
      }
      this.nextSpy = sinon.spy()

      updateStateBrowseHistory(this.req, this.res, this.nextSpy)
    })

    it('should update state browse history', () => {
      expect(this.req.session).to.deep.equal({
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {},
              },
            },
            browseHistory: ['/step-1'],
          },
        },
      })
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledOnce
    })
  })

  describe('#setFormDetails', () => {
    context('when setting form details for the first step', () => {
      context('when rendering the template for this first time', () => {
        beforeEach(() => {
          this.req = {
            session: {},
            baseUrl: '/base',
            body: {
              selectedAtStep1: 'step-3-value',
            },
          }
          this.res = {
            locals: {
              journey: {
                steps,
                currentStep: steps[0],
                currentStepId: 0,
                key: '/base/step-1',
              },
            },
            redirect: sinon.spy(),
          }
          this.nextSpy = sinon.spy()

          setFormDetails(this.req, this.res, this.nextSpy)
        })

        it('should set state on locals', () => {
          expect(this.res.locals.form.state).to.deep.equal({})
        })

        it('should set the return link', () => {
          expect(this.res.locals.form.returnLink).to.equal('/base')
        })

        it('should set the return text', () => {
          expect(this.res.locals.form.returnText).to.equal('Cancel')
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledOnce
        })
      })

      context(
        'when rendering the template having browsed to subsequent steps',
        () => {
          beforeEach(() => {
            this.req = {
              session: {
                'multi-step': {
                  '/base/step-1': {
                    steps: {
                      '/step-1': {
                        data: {
                          selectedAtStep1: 'step-3-value',
                        },
                        completed: true,
                      },
                      '/step-3': {
                        data: {
                          selectedAtStep3: 'step-5-value',
                        },
                        completed: true,
                      },
                    },
                    browseHistory: ['/step-1', '/step-3'],
                  },
                },
              },
              baseUrl: '/base',
              body: {
                selectedAtStep1: 'step-3-value',
              },
            }
            this.res = {
              locals: {
                journey: {
                  steps,
                  currentStep: steps[0],
                  currentStepId: 0,
                  key: '/base/step-1',
                },
              },
              redirect: sinon.spy(),
            }
            this.nextSpy = sinon.spy()

            setFormDetails(this.req, this.res, this.nextSpy)
          })

          it('should set state on locals', () => {
            expect(this.res.locals.form.state).to.deep.equal({
              selectedAtStep1: 'step-3-value',
              selectedAtStep3: 'step-5-value',
            })
          })

          it('should set the return link', () => {
            expect(this.res.locals.form.returnLink).to.equal('/base')
          })

          it('should set the return text', () => {
            expect(this.res.locals.form.returnText).to.equal('Cancel')
          })

          it('should call next once', () => {
            expect(this.nextSpy).to.be.calledOnce
          })
        }
      )
    })

    context('when setting form details for subsequent steps', () => {
      beforeEach(() => {
        this.req = {
          session: {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      selectedAtStep1: 'step-3-value',
                    },
                    completed: true,
                  },
                  '/step-3': {
                    data: {
                      selectedAtStep3: 'step-5-value',
                    },
                    completed: true,
                  },
                },
                browseHistory: ['/step-1', '/step-3'],
              },
            },
          },
          baseUrl: '/base',
          body: {
            selectedAtStep1: 'step-3-value',
          },
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStep: steps[4],
              currentStepId: 4,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        setFormDetails(this.req, this.res, this.nextSpy)
      })

      it('should set state on locals', () => {
        expect(this.res.locals.form.state).to.deep.equal({
          selectedAtStep1: 'step-3-value',
          selectedAtStep3: 'step-5-value',
        })
      })

      it('should set the return link', () => {
        expect(this.res.locals.form.returnLink).to.equal('/base/step-3')
      })

      it('should set the return text', () => {
        expect(this.res.locals.form.returnText).to.equal('Back')
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })
  })

  describe('invalidating state', () => {
    const buildReq = (body) => {
      return {
        body,
        session: {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    selectedAtStep1: 'step-3-value',
                    moreDataAtStep1: 'more',
                  },
                  completed: true,
                  nextPath: '/step-3',
                },
                '/step-3': {
                  data: {
                    selectedAtStep3: 'step-5-value',
                  },
                  completed: true,
                  nextPath: '/step-5',
                },
                '/step-5': {
                  data: {
                    moreDataAtStep5: 'more',
                  },
                  completed: true,
                  nextPath: '/finish',
                },
              },
            },
          },
        },
      }
    }

    describe('#invalidateStateForChangedNextPath', () => {
      context('when the next path has changed', () => {
        beforeEach(() => {
          this.req = buildReq({ selectedAtStep1: 'step-2-value' })
          this.res = {
            locals: {
              journey: {
                key: '/base/step-1',
                currentStep: steps[0],
              },
            },
          }
          this.nextSpy = sinon.spy()

          invalidateStateForChangedNextPath(this.req, this.res, this.nextSpy)
        })

        it('should not remove state for step 1', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-1']
          expect(actual).to.exist
        })

        it('should remove state for step 3', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-3']
          expect(actual).to.be.undefined
        })

        it('should remove state for step 5', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-5']
          expect(actual).to.be.undefined
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledWithExactly()
          expect(this.nextSpy).to.have.been.calledOnce
        })
      })

      context('when the next path is the same', () => {
        beforeEach(() => {
          this.req = buildReq({ selectedAtStep1: 'step-3-value' })
          this.res = {
            locals: {
              journey: {
                key: '/base/step-1',
                currentStep: steps[0],
              },
            },
          }
          this.nextSpy = sinon.spy()

          invalidateStateForChangedNextPath(this.req, this.res, this.nextSpy)
        })

        it('should not remove state for step 1', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-1']
          expect(actual).to.exist
        })

        it('should not remove state for step 3', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-3']
          expect(actual).to.exist
        })

        it('should not remove state for step 5', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-5']
          expect(actual).to.exist
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledWithExactly()
          expect(this.nextSpy).to.have.been.calledOnce
        })
      })

      context(
        'when the current next path does not exist because this step has not been completed before',
        () => {
          beforeEach(() => {
            this.req = {
              body: {
                selectedAtStep3: 'step-5-value',
              },
              session: {
                'multi-step': {
                  '/base/step-1': {
                    steps: {
                      '/step-1': {
                        data: {
                          selectedAtStep1: 'step-3-value',
                          moreDataAtStep1: 'more',
                        },
                        completed: true,
                        nextPath: '/step-3',
                      },
                    },
                  },
                },
              },
            }
            this.res = {
              locals: {
                journey: {
                  key: '/base/step-1',
                  currentStep: steps[2],
                },
              },
            }
            this.nextSpy = sinon.spy()

            invalidateStateForChangedNextPath(this.req, this.res, this.nextSpy)
          })

          it('should not remove state for step 1', () => {
            const actual =
              this.req.session['multi-step']['/base/step-1'].steps['/step-1']
            expect(actual).to.exist
          })

          it('should call next once', () => {
            expect(this.nextSpy).to.be.calledWithExactly()
            expect(this.nextSpy).to.have.been.calledOnce
          })
        }
      )

      context(
        'when the next path returns undefined because invalid data was entered',
        () => {
          beforeEach(() => {
            this.req = buildReq({ selectedAtStep1: 'invalid-value' })
            this.res = {
              locals: {
                journey: {
                  key: '/base/step-1',
                  currentStep: steps[0],
                },
              },
            }
            this.nextSpy = sinon.spy()

            invalidateStateForChangedNextPath(this.req, this.res, this.nextSpy)
          })

          it('should not remove state for step 1', () => {
            const actual =
              this.req.session['multi-step']['/base/step-1'].steps['/step-1']
            expect(actual).to.exist
          })

          it('should not remove state for step 3', () => {
            const actual =
              this.req.session['multi-step']['/base/step-1'].steps['/step-3']
            expect(actual).to.exist
          })

          it('should not remove state for step 5', () => {
            const actual =
              this.req.session['multi-step']['/base/step-1'].steps['/step-5']
            expect(actual).to.exist
          })

          it('should call next once', () => {
            expect(this.nextSpy).to.be.calledWithExactly()
            expect(this.nextSpy).to.have.been.calledOnce
          })
        }
      )
    })

    describe('#invalidateStateForDependentSteps', () => {
      beforeEach(() => {
        steps[2].macro = () => {
          return {
            dependsOn: 'moreDataAtStep1',
          }
        }

        this.res = {
          locals: {
            journey: {
              steps,
              key: '/base/step-1',
              currentStep: steps[0],
            },
          },
        }
        this.nextSpy = sinon.spy()
      })

      context('when there are differences', () => {
        beforeEach(() => {
          this.req = buildReq({
            selectedAtStep1: 'step-3-value',
            moreDataAtStep1: 'changed-more',
          })

          invalidateStateForDependentSteps(this.req, this.res, this.nextSpy)
        })

        it('should not remove state for step 1', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-1']
          expect(actual).to.exist
        })

        it('should remove state for step 3', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-3']
          expect(actual).to.be.undefined
        })

        it('should not remove state for step 5', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-5']
          expect(actual).to.exist
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledWithExactly()
          expect(this.nextSpy).to.have.been.calledOnce
        })
      })

      context('when there are no differences', () => {
        beforeEach(() => {
          this.req = buildReq({
            selectedAtStep1: 'step-3-value',
            moreDataAtStep1: 'more',
          })

          invalidateStateForDependentSteps(this.req, this.res, this.nextSpy)
        })

        it('should not remove state for step 1', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-1']
          expect(actual).to.exist
        })

        it('should not remove state for step 3', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-3']
          expect(actual).to.exist
        })

        it('should not remove state for step 5', () => {
          const actual =
            this.req.session['multi-step']['/base/step-1'].steps['/step-5']
          expect(actual).to.exist
        })

        it('should call next once', () => {
          expect(this.nextSpy).to.be.calledWithExactly()
          expect(this.nextSpy).to.have.been.calledOnce
        })
      })
    })
  })
})
