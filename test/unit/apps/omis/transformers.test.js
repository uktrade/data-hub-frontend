const { assign, merge } = require('lodash')

describe('OMIS list transformers', () => {
  beforeEach(() => {
    this.transformers = proxyquire('~/src/apps/omis/transformers', {
      './constants': {
        ORDER_STATES: [
          {
            value: 'draft',
            label: 'Draft',
          },
        ],
        '@noCallThru': false,
      },
    })
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
        beforeEach(() => {
          this.actual = this.transformers.transformOrderToListItem(simpleOrder)
        })

        it('should return a transformed object', () => {
          expect(this.actual).to.have.property('id').a('string')
          expect(this.actual).to.have.property('name').a('string')
          expect(this.actual).to.have.property('type', 'order')
          expect(this.actual).to.have.property('urlPrefix', 'omis/')
          expect(this.actual).to.have.property('meta').an('array').to.deep.equal([
            { label: 'Status', type: 'badge', value: 'Draft' },
            { label: 'Market', type: 'badge', value: 'France' },
            { label: 'Company', value: 'Venus Ltd' },
            { label: 'Created', type: 'datetime', value: '2017-07-26T14:08:36.380979' },
            { label: 'Contact', value: 'Jenny Cakeman' },
            { label: 'UK region', value: 'London' },
          ])
        })

        it('should set the updated date time as a sub heading', () => {
          expect(this.actual.subTitle).to.deep.equal({
            label: 'Updated on',
            type: 'datetime',
            value: '2017-08-16T14:18:28.328729',
          })
        })
      })

      context('without a valid status', () => {
        beforeEach(() => {
          const order = assign({}, simpleOrder, {
            status: 'dummy',
          })
          this.actual = this.transformers.transformOrderToListItem(order)
        })

        it('should set Status to undefined', () => {
          expect(this.actual).to.have.property('meta').an('array').to.deep.equal([
            { label: 'Status', type: 'badge', value: undefined },
            { label: 'Market', type: 'badge', value: 'France' },
            { label: 'Company', value: 'Venus Ltd' },
            { label: 'Created', type: 'datetime', value: '2017-07-26T14:08:36.380979' },
            { label: 'Contact', value: 'Jenny Cakeman' },
            { label: 'UK region', value: 'London' },
          ])
        })

        it('should set the updated date time as a sub heading', () => {
          expect(this.actual.subTitle).to.deep.equal({
            label: 'Updated on',
            type: 'datetime',
            value: '2017-08-16T14:18:28.328729',
          })
        })
      })

      context('with delivery date', () => {
        beforeEach(() => {
          const order = assign({}, simpleOrder, {
            delivery_date: '2018-10-16T14:18:28.328729',
          })
          this.actual = this.transformers.transformOrderToListItem(order)
        })

        it('should return a transformed object', () => {
          expect(this.actual).to.have.property('id').a('string')
          expect(this.actual).to.have.property('name').a('string')
          expect(this.actual).to.have.property('type', 'order')
          expect(this.actual).to.have.property('urlPrefix', 'omis/')
          expect(this.actual).to.have.property('meta').an('array').to.deep.equal([
            { label: 'Status', type: 'badge', value: 'Draft' },
            { label: 'Market', type: 'badge', value: 'France' },
            { label: 'Company', value: 'Venus Ltd' },
            { label: 'Created', type: 'datetime', value: '2017-07-26T14:08:36.380979' },
            { label: 'Contact', value: 'Jenny Cakeman' },
            { label: 'UK region', value: 'London' },
            { label: 'Delivery date', type: 'date', value: '2018-10-16T14:18:28.328729' },
          ])
        })

        it('should set the updated date time as a sub heading', () => {
          expect(this.actual.subTitle).to.deep.equal({
            label: 'Updated on',
            type: 'datetime',
            value: '2017-08-16T14:18:28.328729',
          })
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
        expect(actual).to.have.property('subtotal_cost').a('number')
        expect(actual).to.have.property('total_cost').a('number')
        expect(actual).to.have.property('company').a('string')
      })
    })
  })

  describe('#transformPaymentToView', () => {
    const payment = require('~/test/unit/data/omis/payments.json')[0]

    context('when given an unqualified result', () => {
      it('should return undefined', () => {
        expect(this.transformers.transformPaymentToView()).to.be.undefined
        expect(this.transformers.transformPaymentToView({ a: 'b' })).to.be.undefined
        expect(this.transformers.transformPaymentToView({ id: 'abcd' })).to.be.undefined
      })
    })

    context('when given a qualified result', () => {
      it('should return the correct properties', () => {
        const actual = this.transformers.transformPaymentToView(payment)

        expect(actual).to.have.property('reference').a('string')
        expect(actual).to.have.property('transaction_reference').a('string')
        expect(actual).to.have.property('additional_reference').a('string')
        expect(actual).to.have.property('method').a('string')
        expect(actual).to.have.property('received_on').a('string')
        expect(actual).to.have.property('created_on').a('string')
        expect(actual).to.have.property('amount').a('number')
      })

      it('should convert amount to pounds', () => {
        const actual = this.transformers.transformPaymentToView(payment)
        const amount = actual.amount

        expect(amount).to.equal(53.43)
      })
    })
  })

  describe('#transformSubscriberToView', () => {
    const subscriber = require('~/test/unit/data/omis/subscribers.json')[0]
    const subscriberWithTeam = merge({}, subscriber, {
      dit_team: {
        uk_region: {
          name: 'London',
        },
      },
    })

    context('when given an unqualified result', () => {
      it('should return undefined', () => {
        expect(this.transformers.transformSubscriberToView()()).to.be.undefined
        expect(this.transformers.transformSubscriberToView()({ a: 'b' })).to.be.undefined
        expect(this.transformers.transformSubscriberToView()({ name: 'abcd' })).to.be.undefined
      })
    })

    context('when given a qualified result', () => {
      context('when the subscriber is not the current user', () => {
        it('should return just the name', () => {
          const actual = this.transformers.transformSubscriberToView()(subscriber)

          expect(actual).to.equal('Puck Head')
        })

        context('when the subscriber has a UK region', () => {
          it('should return the name and Uk region', () => {
            const actual = this.transformers.transformSubscriberToView()(subscriberWithTeam)

            expect(actual).to.equal('Puck Head, London')
          })
        })
      })

      context('when the subscriber is the current user', () => {
        it('should return the name with suffix', () => {
          const actual = this.transformers.transformSubscriberToView(subscriber.id)(subscriber)

          expect(actual).to.equal('Puck Head (you)')
        })

        context('when the subscriber has a UK region', () => {
          it('should return the name and Uk region', () => {
            const actual = this.transformers.transformSubscriberToView(subscriber.id)(subscriberWithTeam)

            expect(actual).to.equal('Puck Head, London (you)')
          })
        })
      })
    })
  })
})
