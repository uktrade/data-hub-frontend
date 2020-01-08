import PropTypes from 'prop-types'

export const idName = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export const companies = PropTypes.arrayOf(
  PropTypes.shape({
    company: PropTypes.shape(idName),
    latestInteraction: PropTypes.shape({
      date: PropTypes.string,
      id: PropTypes.string,
      subject: PropTypes.string,
    }),
  })
)

export const list = PropTypes.shape({
  ...idName,
  companies,
})

export const lists = PropTypes.arrayOf(list)
