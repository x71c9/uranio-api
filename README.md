## URANIO API

Uranio API extends [Uranio CORE](https://github.com/nbl7/uranio-core).

Uranio API provides a method that creates a full web serivce for an Aplication
Programming Interface with CRUD operations.

```typescript
import uranio from 'uranio';
uranio.init();

const service = uranio.service.create();
service.listen(() => {
	console.log(`Listening on port ${uranio.conf.get('service_port')}...`);
})
```

The web service runs on [Express.js](https://expressjs.com/).

> More services type will be available in the future

Urano API provides also a method that runs on Lambda Functions. Useful for
deplying on [AWS Lambda](https://aws.amazon.com/it/lambda/) or
[Netlify](https://www.netlify.com/).

```typescript
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

Uranio API generates for each Releation the following routes:

- `count`
- `find_one`
- `find`
- `find_id`
- `insert`
- `update`
- `delete`

For the relation `media` it generates also the route:

- `upload`

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

#### Upload (only on `media`)

`upload` upload a file and return the `medida` record created.

| key | value |
| --- | --- |
| URL | `/upload`|
| METHOD | `POST` |
| BODY | `{file: Buffer \| BufferArray \| Blob}` |
| ACTION | `WRITE` |


### Authentication

Uranio API provides an authentication route for each **AuthAtom**.

> See what is an [AuthAtom](https://github.com/nbl7/uranio-core#authatoms)

The route path must be defined in Book with the attribute `auth_url` inside `dock`:

```typescript
// src/book.ts
export default atom_book:uranio.types.Book = {
	customer: {
		authenticate: true,
		properties: {
			...
		},
		dock:{
			url: '/customers',
			auth_url: '/auth-customer',
			...
		}
	}
}
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
the `token`.

#### Authenticate with `HttpOnly` cookie

If the authentication succeed the server will also send back a `Set-Cookie` Header
with the JWT `token`.

The cookie is `HttpOnly; SameSite=Strict; Secure;`. Therefore the browser
will send back the `token` for each request without JS needed.

But it will do only if the server is the same.

> See [HttpOnly](https://owasp.org/www-community/HttpOnly) flag
>
> See [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) flag


### Adding routes

As all Uranio repos, the only file that need to be develop is `src/book.ts`.

Here is the documenation on how to develop it:

(book.ts documentation)[]
