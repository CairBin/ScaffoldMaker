const express = require('express')
const path = require('path')
const localConfig = require('./config.json')
const errorHandle = require('./error')
const mustacheExpress = require('mustache-express')

//routes
const indexRoute = require('./routes/indexRoute')

const staticPath = path.join(__dirname,localConfig.path.static)
const app = express()

//static file
app.use(express.static(staticPath))

//template
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname,localConfig.path.views));

app.use('/',indexRoute)

//404 page
app.get('*',(req,res)=>{
    res.redirect('404.html')
})

//handle error
app.use(errorHandle.logErrors);
app.use(errorHandle.clientError);
app.use(errorHandle.errorHandler);



app.listen(localConfig.address.port,localConfig.address.host,()=>{
    console.log('Service is running on port',localConfig.address.port)
})

