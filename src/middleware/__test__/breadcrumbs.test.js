const breadcrumbs = require('../breadcrumbs')

describe('breadcrumbs middleware', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.resMock = {}
  })

  describe('init()', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
    })

    it('should attach a method to the response object', () => {
      this.init({}, this.resMock, this.nextSpy)

      expect(this.resMock).to.have.property('breadcrumb')
      expect(this.resMock.breadcrumb).to.be.a('function')
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('res.breadcrumb()', () => {
    beforeEach(() => {
      this.init({}, this.resMock, this.nextSpy)
    })

    describe('when called with no arguments', () => {
      it('should return the breadcrumb', () => {
        expect(this.resMock.breadcrumb()).to.deep.equal([])
      })
    })

    describe('when called with 1 argument', () => {
      it('should set name', () => {
        this.resMock.breadcrumb('Name')

        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
          },
        ])
      })
    })

    describe('when called with 2 arguments', () => {
      it('should set url and name', () => {
        this.resMock.breadcrumb('Name', '/sample-url')

        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
            href: '/sample-url',
          },
        ])
      })
    })

    describe('when called with an object', () => {
      it('should add the object to breadcrumb', () => {
        this.resMock.breadcrumb({
          text: 'Name',
          href: '/sample-url',
        })

        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Name',
            href: '/sample-url',
          },
        ])
      })
    })

    describe('when called with an array of objects', () => {
      it('should add each object to breadcrumb', () => {
        this.resMock.breadcrumb([
          {
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          },
        ])

        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            name: 'First item',
            url: '/first-item',
          },
          {
            name: 'Second item',
            url: '/second-item',
          },
        ])
      })
    })
  })

  describe('res.removeBreadcrumb()', () => {
    describe('when removing last breadcrumb item', () => {
      beforeEach(() => {
        this.init({}, this.resMock, this.nextSpy)

        this.resMock.breadcrumb('Item one')
        this.resMock.breadcrumb('Item two')
        this.resMock.breadcrumb('Item three')

        this.resMock.removeBreadcrumb()
      })

      it('should only contain two items', () => {
        expect(this.resMock.breadcrumb()).to.have.length(2)
      })

      it('should only contain the correct items', () => {
        expect(this.resMock.breadcrumb()).to.deep.equal([
          { text: 'Item one' },
          { text: 'Item two' },
        ])
      })
    })

    describe('when breadcrumb middle breadcrumb items', () => {
      beforeEach(() => {
        this.init({}, this.resMock, this.nextSpy)

        this.resMock.breadcrumb('Item one')
        this.resMock.breadcrumb('Item two')
        this.resMock.breadcrumb('Item three')

        this.resMock.removeBreadcrumb()

        this.resMock.breadcrumb('Item four')
      })

      it('should only contain three items', () => {
        expect(this.resMock.breadcrumb()).to.have.length(3)
      })

      it('should only contain the correct items', () => {
        expect(this.resMock.breadcrumb()).to.deep.equal([
          { text: 'Item one' },
          { text: 'Item two' },
          { text: 'Item four' },
        ])
      })
    })
  })

  describe('setHome()', () => {
    beforeEach(() => {
      this.init = breadcrumbs.init()
      this.init({}, this.resMock, sinon.spy())

      this.setHome = breadcrumbs.setHome
    })

    describe('when called with no arguments', () => {
      beforeEach(() => {
        this.setHome()({}, this.resMock, this.nextSpy)
      })

      it('should set a default value for the home item', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Home',
            href: '/',
            _home: true,
          },
        ])
      })
    })

    describe('when called with an object', () => {
      beforeEach(() => {
        this.setHome({
          text: 'Root',
          href: '/root',
        })({}, this.resMock, this.nextSpy)
      })

      it('should set the object as the home item', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Root',
            href: '/root',
            _home: true,
          },
        ])
      })
    })

    describe('when home is already set', () => {
      beforeEach(() => {
        this.setHome()({}, this.resMock, this.nextSpy)
      })

      it('should update the home item', () => {
        this.setHome({
          text: 'Root',
          href: '/root',
        })({}, this.resMock, this.nextSpy)

        expect(this.nextSpy.calledTwice).to.be.true
        expect(this.resMock.breadcrumb()).to.deep.equal([
          {
            text: 'Root',
            href: '/root',
            _home: true,
          },
        ])
      })
    })
  })
})
