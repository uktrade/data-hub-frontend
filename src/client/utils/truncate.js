export const truncateData = (enquiry, maxLength = 200) =>
  enquiry.length < maxLength
    ? enquiry
    : enquiry.slice(0, maxLength).split(' ').slice(0, -1).join(' ') + ' ...'
