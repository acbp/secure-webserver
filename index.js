const express = require('express');
const helmet = require('helmet')
const session = require('cookie-session') ;
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
const app = express();
const options = {
    extentions:['html'],
    setHeaders:(q,w,e)=>{
        q.set('link','<style.css>;rel=stylesheet;');
        q.set('X-XSS-Protection','1');
        
    }
};

app.use(helmet({
    frameguard:{
        action:'deny'
    },
    contentSecurityPolicy:{
        useDefaults: true,
        directives: {
            defaultSrc:['*'],
            imgSrc:['*']
        }
    }
}));

const cookies={
    keys:['key'],
    httpOnly:true,
    secure:true,
    expires:(new Date(Date.now()+24*60*60000)),
    sameSite:true,
    cookie:{
        httpOnly:true,
        sameSite:true,
        secure: true,
        expires:(new Date(Date.now()+24*60*60000))
    }
};

app.use(session(cookies));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf(cookies))

app.use(express.static('public',options));

app.all('/',(req,res)=>{
    res.cookie('XSRF-TOKEN', req.csrfToken()) 
    res.send(200);
});

app.listen(3000,()=>console.log('rocks on 3000'));
