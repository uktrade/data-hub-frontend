import constate from 'constate'

const [FormContextProvider, useFormContext] = constate((state) => state)

export { FormContextProvider, useFormContext }
