"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = void 0;
const data_ts_1 = require("./data.ts");
// const product = (args: {_id: string}): Product => {
//     return products.find((product) => product._id === args._id)
// }
const getProducts = () => {
    return data_ts_1.products;
};
exports.root = {
    getProducts
};
