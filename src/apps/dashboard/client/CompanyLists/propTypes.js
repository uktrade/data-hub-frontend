import PropTypes from 'prop-types'

export const idName = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export const companies = PropTypes.arrayOf(PropTypes.shape({
  company: idName,
  latestInteraction: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
  }),
}))

export const list = PropTypes.shape({
  ...idName,
  companies,
})

export const lists = PropTypes.arrayOf(list)
