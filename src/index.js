const { Awi } = require('awi')
const { generateProof } = require('./generateProof')

/**
 * Awi base for fetching the content.
 *
 * @var {Awi} base
 */
const base = () => new Awi()
  .use(async req => req.base = 'https://graph.facebook.com/v3.2/me/')
  .use(async req => req.query.fields = 'picture,instagram_business_account.fields(username)')

/**
 * Access headers for CORs.
 *
 * @var {object} headers
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event, _, callback) => {
  /**
   * @param {number} status Http status to return
   * @param {string} body Response body
   */
  const respond = (statusCode, body) => callback(null, { body, headers, statusCode })

  /**
   * @var {string} challenge Confirmation integer
   */
  const { token } = event.queryStringParameters

  // Missing configuration.
  if (!token) {
    return respond(422, 'Missing token in query parameters.')
  }

  /**
   * @var {string} proof App secret proof
   */
  const proof = generateProof(token)

  // TODO: Is IG business account filter.
  (await base()
    .use(async req => req.query.access_token = token)
    .use(async req => req.query.appsecret_proof = proof)
    .optional('accounts'))
    .match(
      ({ data }) => respond(200, JSON.stringify(
        data
          .filter(({ instagram_business_account }) => instagram_business_account && instagram_business_account.username)
          .map(({ picture, instagram_business_account }) => ({
            username: instagram_business_account.username,
            image: picture.data.url,
          }))
      )),
      () => respond(404),
    )
}
