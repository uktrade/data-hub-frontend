/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

module.exports = {
  /**
   * @deprecated
   */
  randomString: () => {
    return Math.random().toString(36).substring(7)
  },
}
