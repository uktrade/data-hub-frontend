export const ISO_CODE = {
  UK: 'GB',
}

// Based on https://gist.github.com/dperini/729294
// Our version doesn't require protocol and don't accept ftp addresses.
export const WEBSITE_REGEX = /^(?:(?:(?:https?):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i

// Generic telephone regex without enforcing a format.
// Valid: spaces, (), +, -, numbers and empty string
export const GENERIC_PHONE_NUMBER_REGEX = /^$|([0-9]|#|\+|\s|\(|\))+$/

// Non ASCII
export const NON_ASCII_REGEX = /[^$|\x00-\x7F]/

// Prevents CSV formula injection attacks
// https://owasp.org/www-community/attacks/CSV_Injection
export const CSV_FORMULA_INJECTION_REGEX = /^[=+-@]/
