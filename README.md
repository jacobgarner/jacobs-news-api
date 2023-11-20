# Jacobs backend API

## Setting up your environments
In order to begin using this repo and connect to the databases, you will need to set up some .env files locally. Firstly, create the below two .env files:
.env.test
.env.enviroment

Once these files have been created, you want to use the structure specified in the .env-example file and add PGDATABASE="your db name". For the seed to run correctly, you will need to add the below names to each file:

test env file:
PGDATABASE=nc_news_test
development env file:
PGDATABASE=nc_news

This should allow you to create the DBs and begin working on the project.