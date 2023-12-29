# repro-wrangler-circular-services

Reproduction of Cloudflare Workers circular service dependency.

### Local

#### Working scenario

- Run `npm i` to restore dependencies
- Run `npm ls wrangler` and confirm wrangler is at 3.18.0
- In separate terminals:
  - `npm start -w worker-a`
  - `npm start -w worker-b`
  - `npm start -w worker-c`
- Observe that wrangler restarts the dev server once for each `npm start`
- Send an HTTP POST request to a Worker
- Observe that the request is forwarded to the correct Worker through the service binding

#### Failing scenario

- Update wrangler with `npm i -D wrangler@latest` or any version >=3.19.0
- Run `npm ls wrangler` and confirm that wrangler is at 3.19.0 or higher
- In separate terminals:
  - `npm start -w worker-a`
  - `npm start -w worker-b`
  - `npm start -w worker-c`
- Observe that wrangler restarts the dev servers repeatedly

### Deploying

A Worker will not deploy if the service binding cannot be found, so one Worker must be deployed without the service binding initially. The remaining Workers can be deployed in the correct dependency sequence, then the original Worker can be redeployed with the service binding.

- Remove/comment `[[services]]` block in `worker-a/wrangler.toml`
- Run `npm run deploy -w worker-a`
- Run `npm run deploy -w worker-c`
- Run `npm run deploy -w worker-b`
- Reintroduce `[[services]]` block in `worker-a/wrangler.toml`
- Run `npm run deploy -w worker-a`
- Send an HTTP POST request to a deployed Worker
- Observe that the request is forwarded to the correct Worker through the service binding

This demonstrates that the Cloudflare Workers runtime supports circular service dependencies with no noticeable issues.
