"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.producers = exports.products = void 0;
const uidGenerator_ts_1 = __importDefault(require("./utils/uidGenerator.ts"));
const products = [
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2021', name: 'Aszu', producerId: 1 },
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2022', name: 'Cuvee', producerId: 1 },
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2023', name: 'Furmint', producerId: 1 },
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2024', name: 'Szomorodni', producerId: 1 },
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2020', name: 'Bikaver', producerId: 2 },
    { _id: (0, uidGenerator_ts_1.default)(), vintage: '2020', name: 'Merlot', producerId: 2 }
];
exports.products = products;
const producers = [
    { _id: 1, name: 'Tokaji', country: 'Hungary', region: 'Tokaj' },
    { _id: 2, name: 'Egri', country: 'Hungary', region: 'Eger' }
];
exports.producers = producers;
