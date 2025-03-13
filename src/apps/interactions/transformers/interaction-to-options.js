const { uniqBy, sortBy } = require('lodash')

function transformServicesOptions(services) {
  const deliminator = ' : '

  const mapInteractionQuestions = (service) => {
    return service.interaction_questions && service.interaction_questions.length
      ? service.interaction_questions.map((q) => {
          return {
            value: q.id,
            label: q.name,
            options:
              q.answer_options &&
              q.answer_options.map((o) => ({
                label: o.name,
                value: o.id,
              })),
          }
        })
      : []
  }

  const serviceList = uniqBy(
    services.map((s) => {
      const splitName = s.name.split(deliminator)
      return {
        label: splitName[0],
        value: !splitName[1] ? s.id : splitName[0],
        interactionQuestions: mapInteractionQuestions(s),
      }
    }),
    'label'
  )

  const subServiceList = services
    .map((s) => {
      const splitName = s.name.split(deliminator)
      if (!splitName[1]) return
      return {
        label: splitName[1],
        value: s.id,
        parent: splitName[0],
        interactionQuestions: mapInteractionQuestions(s),
      }
    })
    .filter((s) => s !== undefined)

  const nestedServiceList = serviceList.map((service) => {
    const isControlledBySecondary = service.label === service.value

    const interactionQuestions = isControlledBySecondary
      ? []
      : service.interactionQuestions.map((question) => ({
          ...question,
          serviceId: service.value,
        }))

    const secondaryOptions = isControlledBySecondary
      ? subServiceList
          .map((option) => {
            // loops through sub service list to and matches it to its parent service
            if (option.parent === service.label) {
              return {
                ...option,
                interactionQuestions: option.interactionQuestions.map(
                  (question) => ({
                    ...question,
                    serviceId: option.value,
                    isControlledBySecondary,
                  })
                ),
              }
            }
          })
          .filter((s) => s !== undefined)
      : []

    return {
      ...service,
      interactionQuestions,
      secondaryOptions: sortBy(secondaryOptions, (option) => option.label),
    }
  })

  return nestedServiceList
}

module.exports = transformServicesOptions
