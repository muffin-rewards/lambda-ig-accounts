const crypto = require('crypto')

/**
 * Generates proof key.
 *
 * @param {string} token User token
 * @return {string} App secret proof
 */
exports.generateProof = (token) => {
  const hmac = crypto.createHmac('sha1', token)
  hmac.update(Buffer.from(process.env.APP_SECRET), 'utf-8')

  return hmac.digest('hex')
}
