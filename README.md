# Deprecated

**This repository is deprecated and no longer maintained.**

Please use the new repository for the latest code and updates:  
[https://github.com/x71c9/uranio](https://github.com/x71c9/uranio)

## URANIO API

Uranio API extends [Uranio CORE](https://github.com/nbl7/uranio-core).

Uranio API can run a web service for an Application Programming Interface with
CRUD operations.

The web service use [Express.js](https://expressjs.com/) internally.

> More service types will be available in the future

Urano API provides also a method that runs on Lambda Functions. Useful for
deplying on [AWS Lambda](https://aws.amazon.com/it/lambda/) or
[Netlify](https://www.netlify.com/).

```typescript
// Method for Lambda
import uranio from 'uranio';
uranio.init();

const uranio_lambda = uranio.lambda.connect_and_create();
const handler = async (event:uranio.lambda.LambdaEvent, context:uranio.lambda.LambdaContext)
		:Promise<uranio.lambda.HandlerResponse> => {
	return await uranio_lambda.handle(event, context);
};
export { handler };
```

### Routes

Uranio API generates for each Atom the following routes:

> See what is an [Atom](https://github.com/nbl7/uranio-core/README.md#Atom)

- `count`
- `find_one`
- `find`
- `find_id`
- `insert`
- `update`
- `delete`
- `insert_multiple`
- `update_multiple`
- `delete_multiple`

For the atom `media` it generates also the routes:

- `upload`
- `presigned`

#### Count

`count` returns how many records are in the relation.

| key | value |
| --- | --- |
| URL | `/count`|
| METHOD | `GET` |
| QUERY | `[filter]`|
| ACTION | `READ` |

#### Find one

`find_one` returns the first record that match the filter values.

| key | value |
| --- | --- |
| URL | `/first`|
| METHOD | `GET` |
| QUERY | `[filter, options]`|
| ACTION | `READ` |

#### Find

`find` returns all the record that match the filter values.

| key | value |
| --- | --- |
| URL | `/`|
| METHOD | `GET` |
| QUERY | `[filter, options]`|
| ACTION | `READ` |

#### Find id

Find id returns 

| key | value |
| --- | --- |
| URL | `/:id`|
| METHOD | `GET` |
| QUERY | `[options]`|
| ACTION | `READ` |

#### Insert

`insert` add a new record to the relation and returns the record created.

| key | value |
| --- | --- |
| URL | `/`|
| METHOD | `POST` |
| BODY | A record in JSON format. |
| ACTION | `WRITE` |

#### Update

`update` update a record and returns the record updated.

| key | value |
| --- | --- |
| URL | `/:id`|
| METHOD | `POST` |
| BODY | A partial record in JSON format. |
| ACTION | `WRITE` |

#### Delete

`delete` deletes a record and returns the deleted record.

| key | value |
| --- | --- |
| URL | `/:id`|
| METHOD | `DELETE` |
| ACTION | `WRITE` |

#### Insert multiple

`insert_multiple` add new records to the relation and returns the records created.

| key | value |
| --- | --- |
| URL | `/multiple`|
| METHOD | `POST` |
| BODY | A array of records in JSON format. |
| ACTION | `WRITE` |

#### Update multiple

`update_multiple` update records and returns the records updated.

| key | value |
| --- | --- |
| URL | `/multiple/:ids`|
| METHOD | `POST` |
| BODY | A partial record with the fields to update in JSON format. |
| ACTION | `WRITE` |

#### Delete multiple

`delete` deletes records and returns the deleted records.

| key | value |
| --- | --- |
| URL | `/multiple/:ids`|
| METHOD | `DELETE` |
| ACTION | `WRITE` |

#### Upload (only on `media`)

`upload` upload a file and return the `media` record created.

| key | value |
| --- | --- |
| URL | `/upload`|
| METHOD | `POST` |
| BODY | `{file: Buffer \| BufferArray \| Blob}` |
| ACTION | `WRITE` |


#### Presigned (only on `media`)

`presigned` generate a presigned URL for uploading on AWS or Google Cloud Storage.

| key | value |
| --- | --- |
| URL | `/presigned`|
| METHOD | `GET` |
| ACTION | `READ` |


### Authentication

Uranio API provides an authentication route for each **AuthAtom**.

> See what is an [AuthAtom](https://github.com/nbl7/uranio-core#authatoms)

The route path must be defined in Book with the attribute `auth_url` inside
the `dock` property:

```typescript
// src/customer/index.ts
import uranio from 'uranio';
export default uranio.register.atom({
	authenticate: true,
	properties: {
		...
	},
	dock:{
		url: '/customers',
		auth_url: '/auth-customer',
		...
	}
});
```
Then the route `https://myservice.com/[prefix-api]/auth-customer` will
accept a POST request with a JSON body:
```json
{
	email: 'email@email.com',
	password: 'fjs8a9fysa98fhafaj'
}
```
If the authentication succeed, the server respond with a `payload` containing a
JWT `token`.

The JWT `token` can be then sent back to the server through the header
`urn-auth-token`.

```
GET /uranio/api/products HTTP/1.1
Host: myhost.com
Accept: application/json
urn-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3...
```
If the client and the server are on the same domain there is no need to send back
the `token`, since the server will also set an `HttpOnly` cookie with the token.

#### Authenticate with `HttpOnly` cookie

If the authentication succeed the server will also send back a `Set-Cookie` Header
with the JWT `token`.

The cookie is `HttpOnly; SameSite=Strict; Secure;`. Therefore the browser
will send back the `token` for each request without JS needed.

But it will do only if the server is the same.

> See [HttpOnly](https://owasp.org/www-community/HttpOnly) flag
>
> See [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) flag

### Regenerating the token

The token expire after `a week`. The expiration time can be changed in the config `toml` file.

For each authenticated call the server will respond with a header containing a new token.
The server will also set a new `HttpOnly` cookie on each request.

### Adding routes

With the following folder structure:

```
src
`-- atoms
    `-- product
        |-- routes
        |   `-- add-review.ts
        `-- index.ts
```
Uranio will create a new route for the `Atom` product. The route name would be `add-review`.

The module `add-review.ts` must export a route definition:

```typescript
// src/atoms/product/routes/add_review.ts

import uranio from 'uranio';
export default uranio.register.route({
	url: '/add-review-custom-url',
	method: uranio.types.RouteMethod.POST,
	action: uranio.types.AuthAction.WRITE,
	query: ['stars', 'customer'],
	return 'number',
	call: async (request:uranio.types.Api.Request<'product','add_review'>):Promise<'number'>{
		// Some logic
		const bll_customers = uranio.core.bll.create('customer', request.passport);
		const customer = await bll_customers.find_id(request.customer);
		// Some logic
		return request.query.stars || 0;
	}
});

```
The web serivce then will have the following route:

```
https://myservice.com/[prefix-api]/products/add-review-custom-url
```

that will call the method defined under the property `call` in the definition
module.

