import app from "./app";

import configuration from "./config/config";
import main from "./database";

const port=configuration.port


app.listen(port,()=>{
    main()
    console.log(`Next level assignement server is running on port ${port}`)
})