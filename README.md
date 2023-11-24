# Jacob's Backend API

## Setting Up Your Environments

To get started with this repository and establish connections to databases, you'll need to set up local `.env` files. Begin by creating the following two files:
- .env.test
- .env.development

Once these files are created, follow the structure specified in the `.env-example` file and add `PGDATABASE="your db name"`. To ensure proper seed execution, include the following names in each file:

**For the test environment:**
```plaintext
PGDATABASE=nc_news_test
```

**For the development environment:**
```plaintext
PGDATABASE=nc_news
```

These configurations will enable you to create the databases and start working on the project seamlessly.

## Summary

Explore the hosted version [here](https://jacobs-news-api.onrender.com/api).

This project serves as a straightforward backend API for a news/forum platform resembling Reddit. Navigate through various articles, users, comments, and topics from different databases using the provided [link](https://jacobs-news-api.onrender.com/api). The technology stack includes:

- **Language:** JavaScript using Node.js
- **Backend:** PostgreSQL (using node-postgres)
- **Testing:** Jest and Supertest

All endpoints have been developed following Test-Driven Development (TDD) principles. The project utilizes the following versions:

- Node v21.1.0
- PostgreSQL (psql) v14.9

## How to Clone and Install Dependencies

To clone the repository, copy the HTTPS link under the code tab on GitHub. Navigate to your desired location in the terminal and use the following command:

```bash
git clone "the url"
```

Next, install the dependencies. Below are the packages along with the commands to install them. All these packages will be managed with npm. Refer to the [npm documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for more details.

- **psql:** Manage data in databases. Installation instructions [here](https://www.postgresql.org/docs/).
- **node-postgres:** Work with the database and assist with queries. Installation instructions [here](https://node-postgres.com/).
- **express:** Web application framework for managing the server. Installation instructions [here](https://expressjs.com/en/starter/installing.html).
- **supertest:** Test the server. Installation instructions [here](https://www.npmjs.com/package/supertest).
- **jest:** Test functions and integrations. Installation instructions [here](https://jestjs.io/docs/getting-started).
- **jest-sorted:** Additional testing for ensuring query order. Installation instructions [here](https://www.npmjs.com/package/jest-sorted).
- **dotenv:** Help manage environment and configuration files. Installation instructions [here](https://www.npmjs.com/package/dotenv).

### Working with dotenv

To use this project, create two `.env` files for the test and development databases. Ensure your `.gitignore` file includes '.env.*' to avoid uploading environment files to GitHub. Name the files as follows:

**.env.development**
```plaintext
PGDATABASE=nc_news
```

**.env.test**
```plaintext
PGDATABASE=nc_news_test
```

## Seeding the Database and Running Tests

To create the databases, run:
```bash
npm run setup-dbs
```

Next, seed the databases with:
```bash
npm run seed
```

Verify successful seeding by running:
```bash
npm test
```

All tests should pass with green ticks. If issues arise, check for missing packages or problems with database seeding. For further validation, use psql to run commands and inspect data within the databases.