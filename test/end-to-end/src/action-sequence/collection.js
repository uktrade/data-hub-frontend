import selectors from '../../../selectors'
import userAction from '../user-action'

const headerCount = () => {
  return userAction.getElement(selectors.collection.headerCount).getText()
}

const itemCount = () => {
  return userAction.getElements(selectors.collection.items).length
}

export default { headerCount, itemCount }
