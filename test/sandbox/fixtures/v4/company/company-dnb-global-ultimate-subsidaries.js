import dnbGlobalUltimate from './company-dnb-global-ultimate.json' assert { type: 'json' }
import dnbGlobalSubsidiary from './company-dnb-subsidiary.json' assert { type: 'json' }
import dnbLtd from './company-dnb-ltd.json' assert { type: 'json' }

export default {
  count: 3,
  next: null,
  previous: null,
  results: [dnbGlobalUltimate, dnbGlobalSubsidiary, dnbLtd],
}
