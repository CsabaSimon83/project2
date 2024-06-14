"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const data_ts_1 = require("./data.ts");
const uidGenerator_ts_1 = __importDefault(require("./utils/uidGenerator.ts"));
const ProductType = new graphql_1.GraphQLObjectType({
    name: "Product",
    description: "Product description",
    fields: () => ({
        _id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        vintage: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        producerId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        producer: {
            type: ProducerType,
            resolve: (product) => {
                return data_ts_1.producers.find(producer => producer._id === product.producerId);
            }
        }
    })
});
const ProducerType = new graphql_1.GraphQLObjectType({
    name: "Producer",
    description: "Producer description",
    fields: () => ({
        _id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        country: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        region: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        product: {
            type: new graphql_1.GraphQLList(ProductType),
            resolve: (producer) => {
                return data_ts_1.products.find(product => producer._id === product.producerId);
            }
        }
    })
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'Query',
    description: "Query description",
    fields: () => ({
        products: {
            type: new graphql_1.GraphQLList(ProductType),
            description: 'List of products',
            resolve: () => data_ts_1.products
        },
        product: {
            type: ProductType,
            description: 'show product by id',
            args: {
                _id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            resolve: (parent, args) => data_ts_1.products.find(product => product._id === args._id)
        },
        producer: {
            type: ProducerType,
            description: 'show producer by id',
            args: {
                _id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => data_ts_1.producers.find(producer => producer._id === args._id)
        }
    })
});
const productAddInput = new graphql_1.GraphQLInputObjectType({
    name: "ProductAddInput",
    fields: {
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        producerId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        vintage: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
    }
});
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    description: "Mutation description",
    fields: () => ({
        addProducts: {
            type: new graphql_1.GraphQLList(ProductType),
            description: 'Add products',
            args: {
                newProducts: { type: new graphql_1.GraphQLList(productAddInput) }
            },
            resolve: (parent, { newProducts }) => {
                let productsToAdd = [];
                for (const product of newProducts) {
                    const newProduct = { _id: (0, uidGenerator_ts_1.default)(), vintage: product.vintage, name: product.name, producerId: product.producerId };
                    productsToAdd.push(newProduct);
                    data_ts_1.products.push(newProduct);
                }
                return productsToAdd;
            }
        },
        updateProduct: {
            type: ProductType,
            description: 'Update product',
            args: {
                _id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                newValue: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args) => {
                for (const productIndex in data_ts_1.products) {
                    if (data_ts_1.products[productIndex]._id === args._id) {
                        data_ts_1.products[productIndex].name = args.newValue;
                        return data_ts_1.products[productIndex];
                    }
                }
            }
        },
        deleteProducts: {
            type: graphql_1.GraphQLBoolean,
            description: 'Delete products',
            args: {
                deleteProductIDs: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
            },
            resolve: (parent, { deleteProductIDs }) => {
                const productIds = data_ts_1.products.map((product) => {
                    return product._id;
                });
                for (const id of deleteProductIDs) {
                    if (productIds.indexOf(id) !== -1) {
                        data_ts_1.products.splice(productIds.indexOf(id), 1);
                    }
                }
                return true;
            }
        },
        loadProducts: {
            type: graphql_1.GraphQLBoolean,
            description: 'Load products from file',
            resolve: (parent) => {
                fetch("https://api.frw.co.uk/feeds/all_listings.csv")
                    .then((response) => response.body)
                    .then((response) => {
                    const reader = response.getReader();
                    return new ReadableStream({
                        start(controller) {
                            reader.read().then(function pump({ done, value }) {
                                if (done) {
                                    controller.close();
                                    return new Promise((resolve, reject) => {
                                        resolve('done');
                                    });
                                }
                                const encodedValue = new TextDecoder("utf-8").decode(value);
                                const rows = encodedValue.split('\n');
                                const rowsArray = rows.map((row) => {
                                    const wholeRow = row.split(',');
                                    wholeRow.splice(-1, 1);
                                    return wholeRow;
                                });
                                console.log(rowsArray);
                                return reader.read().then(pump);
                            });
                        }
                    });
                }).catch(err => console.log(err));
                return true;
            }
        }
    })
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
