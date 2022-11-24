# Lightning to Email

Forward lightning payments from your email address + ".ln2.email" to your current lightning
wallet.

![](/public/og.png)

## Deployment Instructions

1. Sign up to an email service like Amazon SES. This will be your **`SMTP_SERVER`**.
2. Generate a random secret [here](https://generate-secret.vercel.app/32). This will be your **`NEXTAUTH_SECRET`**.
3. Configure your MongoDB URI in **`MONGODB_URI`**.
4. Configure **`PROJECT_ID_VERCEL`** and **`AUTH_BEARER_TOKEN`** to automatically add users'
email-addresses' domains as subdomains, using
[Vercel domains api](https://vercel.com/templates/next.js/domains-api).

## Vercel + MongoDB Integration

https://vercel.com/integrations/mongodbatlas

## Tech Stack

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Vercel](https://vercel.com/)

## FAQ

### How does ln2.email redirection work behind the scenes?

When a lightning wallet wants to pay to a lightning address like "someuser@somedomain.com", it
sends an HTTP request to https://**somedomain.com**/.well-known/lnurlp/**someuser**, to get
technical details for how to proceed with the payment.

When a user signs in with email like "johndoe@mailserver.com", and configures his lightning
address "someuser@somedomain.com", he gets a new lightning address
"johndoe@mailserver.com.ln2.email" that redirects the HTTP requests: any HTTP request to
https://**mailserver.com.ln2.email**/.well-known/lnurlp/**johndoe** responds with a
[307 Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) to
https://**somedomain.com**/.well-known/lnurlp/**someuser**, and the payment continues from there.

This way ln2.email never holds users' funds at any point.

### Why aren't onion addresses supported?

Most lightning wallets do support paying to onion lightning addresses (that look like
"username@verylonggibberish.onion"), which are common in personal nodes whose owner don't want to
buy a domain.

Unfortunately, when our server replies with a
[307 Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) to an onion address,
most wallets simply break. We have decided to block this capability until most wallets will
support the redirection.
