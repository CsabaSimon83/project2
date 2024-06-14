"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_ts_1 = __importDefault(require("./schema.ts"));
const app = (0, express_1.default)();
const port = 8080;
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_ts_1.default,
    graphiql: true
}));
app.listen(port, () => {
    console.log(`http://localhost:${port}/graphql`);
});
