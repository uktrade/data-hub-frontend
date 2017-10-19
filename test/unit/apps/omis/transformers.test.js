describe('OMIS list transformers', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformers = proxyquire('~/src/apps/omis/transformers', {
      'date-fns/format': this.sandbox.stub().returnsArg(0),
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#transformOrderToListItem', () => {
    const simpleOrder = require('~/test/unit/data/omis/simple-order.json')

    context('when given an unqualified result', () => {
      it('should return undefined', () => {
        expect(this.transformers.transformOrderToListItem()).to.be.undefined
        expect(this.transformers.transformOrderToListItem({ a: 'b' })).to.be.undefined
        expect(this.transformers.transformOrderToListItem({ id: 'abcd' })).to.be.undefined
        expect(this.transformers.transformOrderToListItem({ reference: 'Z123/SD' })).to.be.undefined
      })
    })

    context('when given a qualified result', () => {
      context('without delivery date', () => {
        it('should return a transformed object', () => {
          const actual = this.transformers.transformOrderToListItem(simpleOrder)

          expect(actual).to.have.property('id').a('string')
          expect(actual).to.have.property('name').a('string')
          expect(actual).to.have.property('type', 'order')
          expect(actual).to.have.property('urlPrefix', 'omis/')
          expect(actual).to.have.property('meta').an('array').to.deep.equal([
            { label: 'Status', type: 'badge', value: 'Draft' },
            { label: 'Market', type: 'badge', value: 'France' },
            { label: 'Company', value: 'Venus Ltd' },
            { label: 'Updated', type: 'datetime', value: '2017-08-16T14:18:28.328729' },
            { label: 'Contact', value: 'Jenny Cakeman' },
          ])
        })
      })

      context('with delivery date', () => {
        it('should return a transformed object', () => {
          simpleOrder.delivery_date = '2018-10-16T14:18:28.328729'
          const actual = this.transformers.transformOrderToListItem(simpleOrder)

          expect(actual).to.have.property('id').a('string')
          expect(actual).to.have.property('name').a('string')
          expect(actual).to.have.property('type', 'order')
          expect(actual).to.have.property('urlPrefix', 'omis/')
          expect(actual).to.have.property('meta').an('array').to.deep.equal([
            { label: 'Status', type: 'badge', value: 'Draft' },
            { label: 'Market', type: 'badge', value: 'France' },
            { label: 'Company', value: 'Venus Ltd' },
            { label: 'Updated', type: 'datetime', value: '2017-08-16T14:18:28.328729' },
            { label: 'Contact', value: 'Jenny Cakeman' },
            { label: 'Delivery date', type: 'date', value: '2018-10-16T14:18:28.328729' },
          ])
        })
      })
    })
  })

  describe('#transformOrderToTableItem', () => {
    const simpleOrder = require('~/test/unit/data/omis/simple-order.json')

    context('when given an unqualified result', () => {
      it('should return undefined', () => {
        expect(this.transformers.transformOrderToTableItem()).to.be.undefined
        expect(this.transformers.transformOrderToTableItem({ a: 'b' })).to.be.undefined
        expect(this.transformers.transformOrderToTableItem({ id: 'abcd' })).to.be.undefined
        expect(this.transformers.transformOrderToTableItem({ reference: 'Z123/SD' })).to.be.undefined
      })
    })

    context('when given a qualified result', () => {
      it('should return a transformed object', () => {
        const actual = this.transformers.transformOrderToTableItem(simpleOrder)

        expect(actual).to.have.property('id').a('string')
        expect(actual).to.have.property('reference').a('string')
        expect(actual).to.have.property('status').a('string')
        expect(actual).to.have.property('net_cost').a('number')
        expect(actual).to.have.property('total_cost').a('number')
        expect(actual).to.have.property('company').a('string')
      })
    })
  })
})
