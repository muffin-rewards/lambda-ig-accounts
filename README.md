# Lambda Instagram Accounts
Lists user instagram accounts.

## Deployment
To deploy the lambda for production, use `npm run deploy:prod`.

### Environment variables
- `APP_SECRET`

## Request
Include the user `token` in a query parameter.

## Response

If `token` is missing in query params, then `422`.

If user does not exist, then `404`.

On an unexpected error `500`.

On success `200` with body as follow:

```
[
  {
    username: String,
    image: String
  }
]
```
