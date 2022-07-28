### How to develop

Run `yarn install` in the root folder.

Copy `sample.env` to `.env`.

Edit `.env` with local environment variables.

Run `yarn dev` in the root folder. -> This will start compilation in watch mode.

The starting script for developing is `src/dev.ts`.

### Install a certificate for SSL
https://deviloper.in/ssl-certificate-in-nodejs#heading-lets-generate-ssl-certificates

### Generate HTTPS certificare for localhost

https://letsencrypt.org/docs/certificates-for-localhost/

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
