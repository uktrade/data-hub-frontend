import { SERVICE_CONTEXTS, THEMES, KINDS } from '../../../constants'

export default function getInteractionKind(values) {
  return (values.theme === THEMES.EXPORT &&
    values.kind_export === SERVICE_CONTEXTS.EXPORT_SERVICE_DELIVERY) ||
    (values.theme === THEMES.OTHER &&
      values.kind_other === SERVICE_CONTEXTS.OTHER_SERVICE_DELIVERY)
    ? KINDS.SERVICE_DELIVERY
    : KINDS.INTERACTION
}
