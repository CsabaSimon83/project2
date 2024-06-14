import express from 'express';

import { graphqlHTTP } from 'express-graphql';
import schema from "./schema.ts";

const app: express.Application = express();
const port: number = 8080;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`http://localhost:${port}/graphql`);
});
