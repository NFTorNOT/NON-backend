# NFT or Not Backend
Node.js repository for NFT or Not REST APIs and cron processes.

## Documentation
### OpenAPI Specs
We use OpenAPI specifications to standardize our API documentation. To generate the documentation, use the following command:
```sh
 > npm run generate-openapi-docs
```

You can view the user-friendly UI of the specs by visiting `<domain>/api-docs` in your browser.

### DB Schema Doc
We use DBML to document the MySQL tables in our project. You can find the DB schema documentation in the `docs/dbSchema.dbml` file.

To view the schema diagram in a user-friendly graphical format, use the [online editor](https://dbdiagram.io/d).

### Sequence Diagrams
To provide an easy-to-understand overview of the different steps involved in various flows, we've created a number of sequence diagrams.
You can find these diagrams in the `docs/sequenceDiagrams` folder.

## Environment Setup

### Prerequisites
Before you can start the server, please make sure that you have the following prerequisites installed:
- [Node.js](https://nodejs.org/en/download/) - the latest LTS version is recommended.
- [MySQL](https://www.mysql.com/downloads/)

You will also need to set the correct values for the environment variables mentioned in the `./env_vars.sample` file.

### Starting the Server
To start the server, please follow the steps below:

- Install the required NPM dependencies by running the following commands:
```shell script
rm -rf node_modules
rm -rf package-lock.json
npm install
```

- Create the main db and create schema_migrations table using the following command:
```shell script
source set_env_vars.sh
node db/seed.js
  ```

- Run all pending migrations by running the following commands:
```shell script
source set_env_vars.sh
node db/migrate.js

```

- Start the server by running the following commands:
```shell script
source set_env_vars.sh
npm start
```

### Start Cron Processes
TODO
