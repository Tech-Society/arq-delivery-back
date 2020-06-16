module.exports = {
    PORT: process.env.PORT_DEVELOPMENT,
    DB: {
        connectionLimit: 10,
        host: process.env.DB_HOST_DEVELOPMENT,
        user: process.env.DB_USERNAME_DEVELOPMENT,
        password: process.env.DB_PASSWORD_DEVELOPMENT,
        database: process.env.DB_DATABASE_DEVELOPMENT,
        dialect: process.env.DB_DIALECT_DEVELOPMENT,
    }
};