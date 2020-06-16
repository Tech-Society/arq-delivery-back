import '@babel/polyfill'
import dotenv from 'dotenv'
dotenv.config()
import app from './app'
const { NODE_ENV } = process.env;

let port = process.env.PORT_DEVELOPMENT
let urlBase = process.env.URL_BASE

if (NODE_ENV === "production") { port = process.env.PORT } else if (NODE_ENV === "test") { port = process.env.PORT_TEST }

async function main() {
    await app.listen(port, () => {
        console.log(`Environment ${NODE_ENV}, url ${urlBase}`)
    });
}

main();