"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const db_1 = require("../config/db");
const getAllTasks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)('SELECT * FROM Tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
});
exports.getAllTasks = getAllTasks;
const getTaskById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)('SELECT * FROM Tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0];
});
exports.getTaskById = getTaskById;
const createTask = (userId, title, description, priority, status, due_date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)(`INSERT INTO Tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [userId, title, description, priority, status, due_date]);
    return result.rows[0];
});
exports.createTask = createTask;
const updateTask = (id, userId, title, description, priority, status, due_date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)(`UPDATE Tasks SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 AND user_id = $7 RETURNING *`, [title, description, priority, status, due_date, id, userId]);
    return result.rows[0];
});
exports.updateTask = updateTask;
const deleteTask = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)('DELETE FROM Tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    return result.rows[0];
});
exports.deleteTask = deleteTask;
