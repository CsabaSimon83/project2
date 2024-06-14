import {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLType,
    GraphQLBoolean
} from "graphql";
import { products, producers, productType } from "./data.ts"
import uid from './utils/uidGenerator.ts'

const ProductType:GraphQLObjectType = new GraphQLObjectType({
    name: "Product",
    description: "Product description",
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLID)},
        vintage: {type: GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLNonNull(GraphQLString)},
        producerId: {type: GraphQLNonNull(GraphQLInt)},
        producer: {
            type: ProducerType,
            resolve: (product) => {
                return producers.find(producer => producer._id === product.producerId)
            }
        }
    })
})

const ProducerType:GraphQLObjectType = new GraphQLObjectType({
    name: "Producer",
    description: "Producer description",
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLNonNull(GraphQLString)},
        country: {type: GraphQLNonNull(GraphQLString)},
        region: {type: GraphQLNonNull(GraphQLString)},
        product: {
            type: new GraphQLList(ProductType),
            resolve: (producer) => {
                return products.find(product => producer._id === product.producerId)
            }
        }
    })
})

const RootQuery:GraphQLType = new GraphQLObjectType({
    name: 'Query',
    description: "Query description",
    fields: () => ({
        products: {
            type: new GraphQLList(ProductType),
            description: 'List of products',
            resolve: () => products
        },
        product: {
            type: ProductType,
            description: 'show product by id',
            args: {
                _id: {type: GraphQLNonNull(GraphQLID)},
            },
            resolve: (parent, args) => products.find(product => product._id === args._id)
        },
        producer: {
            type: ProducerType,
            description: 'show producer by id',
            args: {
                _id: {type: GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => producers.find(producer => producer._id === args._id)
        }
    })
})

const productAddInput = new GraphQLInputObjectType({
    name: "ProductAddInput",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        producerId: { type: GraphQLNonNull(GraphQLInt) },
        vintage: { type: GraphQLNonNull(GraphQLString) },
    }
})

const RootMutation:GraphQLObjectType = new GraphQLObjectType({
    name: 'Mutation',
    description: "Mutation description",
    fields: () => ({
        addProducts: {
            type: new GraphQLList(ProductType),
            description: 'Add products',
            args: {
                newProducts: {type: new GraphQLList(productAddInput)}
            },
            resolve: (parent, {newProducts}) => {
                let productsToAdd:productType[] | undefined = []
                for (const product of newProducts) {
                    const newProduct:productType = { _id: uid(), vintage: product.vintage, name: product.name, producerId: product.producerId}
                    productsToAdd.push(newProduct)
                    products.push(newProduct)
                }
                return productsToAdd
            }
        },
        updateProduct: {
            type: ProductType,
            description: 'Update product',
            args: {
                _id: {type: GraphQLNonNull(GraphQLID)},
                newValue: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                for (const productIndex in products) {
                    if (products[productIndex]._id === args._id) {
                        products[productIndex].name = args.newValue
                        return products[productIndex]
                    }
                }
            }
        },
        deleteProducts: {
            type: GraphQLBoolean,
            description: 'Delete products',
            args: {
                deleteProductIDs: {type: new GraphQLList(GraphQLString)}
            },
            resolve: (parent, {deleteProductIDs}):boolean => {
                const productIds:string[] = products.map((product) => {
                    return product._id
                })
                for (const id of deleteProductIDs) {
                    if (productIds.indexOf(id) !== -1) {
                        products.splice(productIds.indexOf(id),1)
                    }
                }
                return true
            }
        },
        loadProducts: {
            type: GraphQLBoolean,
            description: 'Load products from file',
            resolve: (parent):boolean => {
                fetch("https://api.frw.co.uk/feeds/all_listings.csv")
                    .then((response) => response.body)
                    .then((response:ReadableStream<Uint8Array> | null) => {
                        const reader = response!.getReader()
                        return new ReadableStream({
                            start(controller) {
                                reader.read().then(
                                    function pump({ done, value }):Promise<string> {
                                        if (done) {
                                            controller.close()
                                            return new Promise((resolve,reject) => {
                                                resolve('done')
                                            })
                                        }
                                        const encodedValue:string = new TextDecoder("utf-8").decode(value)
                                        const rows = encodedValue.split('\n')
                                        const rowsArray = rows.map((row) => {
                                            const wholeRow = row.split(',')
                                            wholeRow.splice(-1, 1)
                                            return wholeRow
                                        })
                                        console.log(rowsArray)
                                    return reader.read().then(pump)
                                })
                            }
                        })
                    }).catch(err => console.log(err))

                return true
            }
        }

    })
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})