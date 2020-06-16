module.exports = {
    PORT: process.env.PORT_TEST,
    DB: {
        connectionLimit: 10,
        host: process.env.DB_HOST_TEST,
        user: process.env.DB_USERNAME_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_DATABASE_TEST,
        dialect: process.env.DB_DIALECT_TEST,
    }
};