import app from "./app";
import configuration from "./config/config";
const port=configuration.port
app.listen(port,()=>{
    console.log(`Next level assignement server is running on port ${port}`)
})