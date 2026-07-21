"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;

app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Task Management System API is running.');
});
// Start the server and test DB connection
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        const res = await (0, db_1.query)('SELECT NOW()');
        console.log('PostgreSQL connected at:', res.rows[0].now);
    }
    catch (err) {
        console.error('Failed to connect to PostgreSQL:', err);
    }
});
//# sourceMappingURL=index.js.map