import dnbGlobalUltimate from './company-dnb-global-ultimate.json' with { type: 'json' }
import dnbGlobalSubsidiary from './company-dnb-subsidiary.json' with { type: 'json' }
import dnbLtd from './company-dnb-ltd.json' with { type: 'json' }

export default {
  count: 3,
  next: null,
  previous: null,
  results: [dnbGlobalUltimate, dnbGlobalSubsidiary, dnbLtd],
}
