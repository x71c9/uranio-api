## URANIO-API

Uranio API extends [Uranio CORE](https://github.com/nbl7/uranio-core).

Uranio API provides a method that creates a full web serivce for an Aplication
Programming Interface with CRUD operations.

```typescript
import uranio from 'uranio';
uranio.init();

const service = uranio.serive.create();
service.listen(() => {
	console.log(`Listening on port ${uranio.conf.get('service_port')}...`);
})
```

The web service runs on [Express.js](https://expressjs.com/).

> More services tpe will be available in the future

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


### Adding routes

As all Uranio repos, the only file that need to be develop is `src/book.ts`.

Here is the documenation on how to develop it:

(book.ts documentation)[]
