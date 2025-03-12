import companywithInvestment1 from './company-with-investment-1.json' with { type: 'json' }
import companywithInvestment2 from './company-with-investment-2.json' with { type: 'json' }

export default {
  count: 2,
  next: null,
  previous: null,
  results: [companywithInvestment1, companywithInvestment2],
}
