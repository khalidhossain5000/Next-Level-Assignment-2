import dotenv from "dotenv"
import path from "path"
dotenv.config({
path:path.join(process.cwd(),'.env')
})



const configuration={
    port:process.env.PORT,
    connectionString:process.env.DB_CONNECTION_STRING
}
export default configuration