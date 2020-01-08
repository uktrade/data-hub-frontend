const state = require('../current')

describe('Current form state', () => {
  describe('#update', () => {
    context('when adding state for a step', () => {
      beforeEach(() => {
        const session = {
          'multi-step': {
            '/base/step-1': {},
          },
        }
        const data = {
          field_1: 'field_1',
        }
        const journeyKey = '/base/step-1'

        state.update(session, journeyKey, '/step-1', { data })

        this.actual = state.getCurrent(session, journeyKey)
      })

      it('should update state', () => {
        const expected = {
          steps: {
            '/step-1': {
              data: {
                field_1: 'field_1',
              },
            },
          },
        }

        expect(this.actual).to.deep.equal(expected)
      })
    })

    context(
      'when adding state for a step and state exists for another journey',
      () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/another-step-1': {
                steps: {
                  '/another-step-1': {
                    data: {
                      another_field_1: 'another_field_1',
                    },
                  },
                },
              },
            },
          }
          const data = {
            field_1: 'field_1',
          }

          state.update(session, '/base/step-1', '/step-1', { data })

          this.actual = state.getCurrent(session, '/base/another-step-1')
        })

        it('should not alter state for the other journey', () => {
          const expected = {
            steps: {
              '/another-step-1': {
                data: {
                  another_field_1: 'another_field_1',
                },
              },
            },
          }

          expect(this.actual).to.deep.equal(expected)
        })
      }
    )

    context('when appending state for a step', () => {
      beforeEach(() => {
        const session = {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    field_1: 'field_1',
                  },
                },
              },
            },
          },
        }
        const data = {
          field_1: 'field_1',
          field_2: 'field_2',
        }
        const journeyKey = '/base/step-1'

        state.update(session, journeyKey, '/step-1', { data })

        this.actual = state.getCurrent(session, journeyKey)
      })

      it('should update state', () => {
        const expected = {
          steps: {
            '/step-1': {
              data: {
                field_1: 'field_1',
                field_2: 'field_2',
              },
            },
          },
        }

        expect(this.actual).to.deep.equal(expected)
      })
    })

    context('when updating state for a step', () => {
      beforeEach(() => {
        const session = {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    field_1: 'field_1',
                  },
                },
              },
            },
          },
        }
        const data = {
          field_1: 'new_field_1',
        }
        const journeyKey = '/base/step-1'

        state.update(session, journeyKey, '/step-1', { data })

        this.actual = state.getCurrent(session, journeyKey)
      })

      it('should update state', () => {
        const expected = {
          steps: {
            '/step-1': {
              data: {
                field_1: 'new_field_1',
              },
            },
          },
        }

        expect(this.actual).to.deep.equal(expected)
      })
    })

    context('when updating state with a new completed step', () => {
      context('when completed is true', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', { completed: true })

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should set the step completed to true', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
                completed: true,
              },
            },
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })

      context('when completed is false', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', { completed: false })

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should set the step completed to false', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
                completed: false,
              },
            },
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })
    })

    context('when updating browse history', () => {
      context('when rendering a step for the first time', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', {
            addBrowseHistory: true,
          })

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should add the step to the browse history', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
            },
            browseHistory: ['/step-1'],
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })

      context('when refreshing a step', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
                browseHistory: ['/step-1'],
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', {
            addBrowseHistory: true,
          })

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should add the step to the browse history', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
            },
            browseHistory: ['/step-1'],
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })
    })

    context('when updating next path', () => {
      context('when the next path is set', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', { nextPath: '/step-2' })

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should set the step next path', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
                nextPath: '/step-2',
              },
            },
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })

      context('when the next path is not set', () => {
        beforeEach(() => {
          const session = {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      field_1: 'field_1',
                    },
                  },
                },
              },
            },
          }
          const journeyKey = '/base/step-1'

          state.update(session, journeyKey, '/step-1', {})

          this.actual = state.getCurrent(session, journeyKey)
        })

        it('should not set the step next path', () => {
          const expected = {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
            },
          }

          expect(this.actual).to.deep.equal(expected)
        })
      })
    })
  })

  describe('#getCurrent', () => {
    context('when state exists', () => {
      beforeEach(() => {
        const session = {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    field_1: 'field_1',
                  },
                  completed: true,
                  nextPath: '/step-2',
                },
              },
            },
          },
        }

        this.actual = state.getCurrent(session, '/base/step-1')
      })

      it('should return current state', () => {
        const expected = {
          steps: {
            '/step-1': {
              data: {
                field_1: 'field_1',
              },
              completed: true,
              nextPath: '/step-2',
            },
          },
        }

        expect(this.actual).to.deep.equal(expected)
      })
    })

    context('when state does not exist', () => {
      beforeEach(() => {
        const session = {}

        this.actual = state.getCurrent(session, '/base/step-1')
      })

      it('should return the default state for this form', () => {
        const expected = {}

        expect(this.actual).to.deep.equal(expected)
      })
    })

    context('when state exists for another multi step form', () => {
      beforeEach(() => {
        const session = {
          'multi-step': {
            '/base/another-step-1': {
              steps: {
                '/step-1': {
                  data: {
                    field_1: 'field_1',
                  },
                  completed: true,
                  nextPath: '/another-step-2',
                },
              },
            },
          },
        }
        this.actual = state.getCurrent(session, '/base/step-1')
      })

      it('should return the default state for this form', () => {
        const expected = {}

        expect(this.actual).to.deep.equal(expected)
      })
    })
  })

  describe('#reduceSteps', () => {
    beforeEach(() => {
      const session = {
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
              '/step-2': {
                data: {
                  field_2: 'field_2',
                },
              },
            },
          },
        },
      }

      this.actual = state.reduceSteps(session, '/base/step-1')
    })

    it('should reduce data for all steps', () => {
      const expected = {
        field_1: 'field_1',
        field_2: 'field_2',
      }

      expect(this.actual).to.deep.equal(expected)
    })
  })

  describe('#remove', () => {
    beforeEach(() => {
      this.session = {
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
              '/step-2': {
                data: {
                  field_2: 'field_2',
                },
              },
            },
          },
          '/base/another-step-1': {
            steps: {
              '/another-step-1': {
                data: {
                  another_field_1: 'another_field_1',
                },
              },
            },
          },
        },
      }

      state.remove(this.session, '/base/step-1')
    })

    it('should remove the specified journey only', () => {
      expect(this.session).to.deep.equal({
        'multi-step': {
          '/base/another-step-1': {
            steps: {
              '/another-step-1': {
                data: {
                  another_field_1: 'another_field_1',
                },
              },
            },
          },
        },
      })
    })
  })

  describe('#getField', () => {
    beforeEach(() => {
      this.session = {
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
              '/step-2': {
                data: {
                  field_2: 'field_2',
                },
              },
            },
          },
        },
      }

      this.actual = state.getField(this.session, '/base/step-1', 'field_2')
    })

    it('should return the specified field', () => {
      expect(this.actual).to.equal('field_2')
    })
  })

  describe('#removeStep', () => {
    beforeEach(() => {
      this.session = {
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
              '/step-2': {
                data: {
                  field_2: 'field_2',
                },
              },
            },
          },
        },
      }

      state.removeStep(this.session, '/base/step-1', '/step-2')
    })

    it('should remove the specified step only', () => {
      expect(this.session).to.deep.equal({
        'multi-step': {
          '/base/step-1': {
            steps: {
              '/step-1': {
                data: {
                  field_1: 'field_1',
                },
              },
            },
          },
        },
      })
    })
  })
})
