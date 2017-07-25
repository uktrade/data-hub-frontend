const breadcrumbs = require('~/src/middleware/breadcrumbs')

describe('breadcrumbs middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.nextSpy = this.sandbox.spy()
    this.resMock = {}
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('init()', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
    })

    it('should attach a method to the response object with expected properties', () => {
      this.init({}, this.resMock, this.nextSpy)

      expect(this.resMock).to.have.property('breadcrumb')
      expect(this.resMock.breadcrumb).to.be.a('object')
      expect(this.resMock.breadcrumb).to.have.property('get')
      expect(this.resMock.breadcrumb).to.have.property('add')
      expect(this.resMock.breadcrumb).to.have.property('update')
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('res.breadcrumb()', () => {
    beforeEach(() => {
      this.init({}, this.resMock, this.nextSpy)
    })

    describe('#get', () => {
      describe('when called should return expected breadcrumbs', () => {
        it('should return the breadcrumb', () => {
          expect(this.resMock.breadcrumb.get()).to.deep.equal([])
        })
      })
      describe('when called should return expected breadcrumbs', () => {
        it('should return the breadcrumb', () => {
          this.resMock.breadcrumb.add([
            { name: 'mock', url: 'mockUrl' },
            { name: 'mockOther', url: 'mockUrlOther' },
          ])
          expect(this.resMock.breadcrumb.get()).to.deep.equal([
            { name: 'mock', url: 'mockUrl' },
            { name: 'mockOther', url: 'mockUrlOther' },
          ])
        })
      })
    })

    describe('#update', () => {
      describe('expected breadcrumb name and url should be updated', () => {
        it('should set url', () => {
          this.resMock.breadcrumb.add([
            { name: 'mock', url: 'mockUrl' },
            { name: 'mockOther', url: 'mockUrlOther' },
          ])
          this.resMock.breadcrumb.update('mock', {
            name: 'updatedMock',
            url: 'updatedMockUrl',
          })

          expect(this.resMock.breadcrumb.get()).to.deep.equal([
            { name: 'updatedMock', url: 'updatedMockUrl' },
            { name: 'mockOther', url: 'mockUrlOther' },
          ])
        })
      })
    })

    describe('#add', () => {
      describe('when called with 1 argument', () => {
        it('should set name', () => {
          this.resMock.breadcrumb.add('Name')

          expect(this.resMock.breadcrumb.get()).to.deep.equal([{
            name: 'Name',
          }])
        })
      })

      describe('when called with 2 arguments', () => {
        it('should set url and name', () => {
          this.resMock.breadcrumb.add('Name', '/sample-url')

          expect(this.resMock.breadcrumb.get()).to.deep.equal([{
            name: 'Name',
            url: '/sample-url',
          }])
        })
      })

      describe('when called with an object', () => {
        it('should add the object to breadcrumb', () => {
          this.resMock.breadcrumb.add({
            name: 'Name',
            url: '/sample-url',
          })

          expect(this.resMock.breadcrumb.get()).to.deep.equal([{
            name: 'Name',
            url: '/sample-url',
          }])
        })
      })

      describe('when called with an array of objects', () => {
        it('should add each object to breadcrumb', () => {
          this.resMock.breadcrumb.add([{
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          }])

          expect(this.resMock.breadcrumb.get()).to.deep.equal([{
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          }])
        })
      })
    })
  })

  describe('setHome()', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
      this.init({}, this.resMock, this.sandbox.spy())

      this.setHome = breadcrumbs.setHome
    })

    describe('when called with no arguments', () => {
      beforeEach(() => {
        this.setHome()({}, this.resMock, this.nextSpy)
      })

      it('should set a default value for the home item', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.resMock.breadcrumb.get()).to.deep.equal([{
          name: 'Home',
          url: '/',
          _home: true,
        }])
      })
    })

    describe('when called with an object', () => {
      beforeEach(() => {
        this.setHome({
          name: 'Root',
          url: '/root',
        })({}, this.resMock, this.nextSpy)
      })

      it('should set the object as the home item', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.resMock.breadcrumb.get()).to.deep.equal([{
          name: 'Root',
          url: '/root',
          _home: true,
        }])
      })
    })

    describe('when home is already set', () => {
      beforeEach(() => {
        this.setHome()({}, this.resMock, this.nextSpy)
      })

      it('should update the home item', () => {
        this.setHome({
          name: 'Root',
          url: '/root',
        })({}, this.resMock, this.nextSpy)

        expect(this.nextSpy.calledTwice).to.be.true
        expect(this.resMock.breadcrumb.get()).to.deep.equal([{
          name: 'Root',
          url: '/root',
          _home: true,
        }])
      })
    })
  })
})
