# Web Push Experiments

Web Push Experiments built with Parcel, Express, Bulma.

Live: [https://web-push-experiments.herokuapp.com](https://web-push-experiments.herokuapp.com) (it's a free dyno so be patient for the boot time 🙂)

## Installation

Clone the repository and then run the following command:

```
yarn
```

## Generate your VAPID Keys

Before using the application you'll need to generate a set of "application server keys".

We will use the [`web-push`](https://github.com/web-push-libs/web-push) package to generate those keys.

```
web-push generate-vapid-keys
```

## Run the development application

For run the development application and launch a server in watch mode on `localhost:3000`:

```
PUSH_PUBLIC_KEY=yourPublicApiKey PUSH_PRIVATE_KEY=yourPrivateApiKey yarn start:server
```

Then in a other tab you have to run:

```
PUSH_PUBLIC_KEY=yourPublicApiKey yarn start:client
```

## Run the production application

First you will need to build the client application:

```
PUSH_PUBLIC_KEY=yourPublicApiKey yarn build
```

Then you can run the application and open your browser on `localhost:3000`:

```
PUSH_PUBLIC_KEY=yourPublicApiKey PUSH_PRIVATE_KEY=yourPrivateApiKey yarn start
```
