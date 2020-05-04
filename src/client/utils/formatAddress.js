// strips undefined values and formats address
const formatAddress = (address) => address.filter(Boolean).join(', ')

export default formatAddress
