"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.default = () => {
    return (0, crypto_1.randomUUID)().toString();
};
