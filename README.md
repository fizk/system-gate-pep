# system-gate-pep

## Development
```sh
npm i
npm run dev
npm run
```

This will install dependencys, start a Typescript watcher that compiles to `./build` and then start **nodemon** that is running code from from `./build` directory.

Additionally, you can start an echo server for the **Gate** to froward to by running:
```sh
npm run echo
```

You can also run the app from within a Docker Container
```sh
docker-compose up gate
```
But you still need to run
```sh
npm run dev
```

The docker-compose file is configured to forward onto the _echo server_ on the host's localhost address (on port 1234), which is the same config as defined in the `package.json` file.

Full dev setup would then be:
```sh
npm i                   # Installs dependencies
npm run dev             # Starts TypeScript compiler in watch mode
npm run echo            # Starts a server to forward onto (echo server)
docker-compose up gate  # Starts this service from a Docker container that's listening for changes and reloads via nodemon
```

## Production
The Dockerfile is to create a container for production. It installs dependencies, copies code from the `./dist` directory (so the code needs to be compiled first via `npm run build`) and places it in `/app/src`. It then starts a `forever` process that runs the **Gate Server** that print logs to `stdout`.

This service requires the following ENV variables

* **PROXY_PORT** &lt;int&gt; the port this this service should run on.
* **FORWARD_URL** &lt;string&gt; the full URL of the service to forward onto. ex: http://system.com:8080.
* **JWT_SECRET** &lt;string&gt; the JWT secret to validate tokens with.

## How it works.
Currently, this service will forward all **GET** requests, but will block any **non-GET** requests that do not have a valid JWT token.

The JWT token is expected to be in the HTTP Authorization's Header.
```
Authorization: Bearer <jwt-token>
```
If a `id` property is found in the JWT token, it will be converted into a `x-user-id` HTTP header and sent to the forwarded system (along with all the other headers).
