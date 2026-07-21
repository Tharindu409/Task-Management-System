"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = void 0;

const db_1 = require("../config/db");


const findUserByEmail = async (email) => {
    const result = await (0, db_1.query)('SELECT * FROM Users WHERE email = $1', [email]);
    return result.rows[0];
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const result = await (0, db_1.query)('SELECT id, name, email, created_at, updated_at FROM Users WHERE id = $1', [id]);
    return result.rows[0];
};
exports.findUserById = findUserById;
//# sourceMappingURL=userModel.js.map