# FireJS
 Highly customizable no config react static site generator built on the principles of Gatsby, NextJs and create-react-app.    
    
## Features    
    
 - Highly customizable
 - Very fast dev builds 
 - Vey fast on the fly pro builds
 - Dev Server (live reload)
 - Easy node interface
 - Plugins
 - Easy dynamic routes
    
## Why another React Static Site Gen... ?
 This need of the project ignited with the [requirement](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3) of very fast on the fly, highly customizable builds. We solved this issue with **FireJS**. You can change each and every dir with the help of **firejs.config.js** file. You can easily customize webpack with **webpack.config.js**.  
  
## Install  
~~~  
yarn add @eadded/firejs  
~~~    
## Args  
~~~    
[-p,--pro] Production Build (Static)  
[-c,--conf] Path to Config file    
[-v,--verbose] Print WebPack Stats  
[-nc,--no_color] No Color and Symbols in logs  
[--nc,--no_output] No output  
~~~  
## Hello World  
Run the command below to start dev server. Pass args as needed.  
~~~  
yarn run firejs  
~~~  
## Project Structure
Below is a typical project structure which can be highly modified using firejs.config.js    
```    
Project    
└─── out                    //output dir
|   └─── .cache             //cache required during build
│   └─── dist               //production output
│       └─── lib            //chunks
│           └─── map        //page dataa and chunks map
└─── src    
│   └─── pages              //all project pages go here
│       │   index.js    
│       │   about.js
│       │   404.js          //404.js is required for Link to work properly
│       │   ...    
│    
│   └─── plugins            //all plugins go here
│       │   plugin-name.js    
│       │   ...
│
│   └─── static             //all static files go here. eg : images
│       │   example.png
| firejs.config.js          //default config file
| webpack.config.js         //default webpack config file
```
## Components
**FireJS** exports two components : Link and Head

 - Link : Used for navigating pages (in project only). Preloads page content onMouseEnter. Preserves history.
 - Head : Injects children to head element. A wrapper around react-helmet. Allows SSR.

*Example*
```
import Link from "@eadded/firejs/Components/Link"  
import Head from "@eadded/firejs/Components/Head";  
export default () => {  
   return (  
    <div>  
      <Head>  
        <title>Index Page</title>  
      </Head>  
      <Link to="/about">Link to About Page</Link>  
    </div>  
   )
}
```
## Plugins
Plugins can be used to provide content and route structures.

Suppose you have a dynamic page *[author]/[article].js*. A plugin can be used to provide routes and page content. Eg: path */john/corona* ,a markdown can be passed as content
    
*Sample Plugin* 
~~~    
const axios = require('axios').default;      
module.exports = {      
 "[author]/[article].js": [     
    async () => {     
       let content = await axios.get("https://api.thevirustracker.com/free-api?global=stats");    
       content = content.data;    
       return [    
           { path: "/john/corona", content }    
       ]    
}]}    
~~~    
This plugin fetches some data from an api asynchronously and passes it to a route.    
    
File `[author]/[article].js` which is found in pages dir, is used to create the route `/john/corona`.

## Modifying Config
Create a *firejs.config.js* or specify a file using ```[-c,--config]``` flags.

*Example*

```
module.exports = {
    pro: Boolean,          //production mode when true, dev mode when false
    noPlugin: Boolean,     //disable or enable plugins
    paths: {               //paths absolute or relative to root
        root: String,      //project root, default : process.cwd()
        src: String,       //src dir, default : root/src
        pages: String,     //pages dir, default : root/src/pages
        out: String,       //output dir, default : root/out
        dist: String,      //production dist, default : root/out/dist
        cache: String,     //fire js cache dir, default : root/out/.cache
        babel: String,     //fire js production babel cache, default : root/out/.cache/babel
        template: String,  //template file, default : inbuilt template file
        lib: String,       //dir where chunks are exported, default : root/out/dist/lib
        map: String,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        webpack: String,   //webpack config file, default : root/webpack.config.js
        static: String,    //dir where page static elements are stored eg. images, default : root/src/static
        plugins: String,   //plugins dir, default : root/src/plugins
    },
    plugins: Array,        //plugins, default : []
    templateTags: {        //these tags need to exist if you pass custom template file
        script: String,    //this is replaced by all page scripts, default : "<%=SCRIPT=%>"
        static: String,    //this is replaced by static content enclosed in <div id="root"></div>, default : "<%=STATIC=%>"
        head: String,      //this is replaced by static head tags i.e tags in Head Component, default : "<%=HEAD=%>"
        style: String,     //this is replaced by all page styles, default : "<%=STYLE=%>"
        unknown: String    //files imported in pages other than [js,css] go here. Make sure you use a webpack loader for these files, default : "<%=UNKNOWN=%>"
    },
    pages: {
        _404: String       //404 page, default : 404.js 
    }
}
```

## License & Copyright
Copyright (C) 2020 Aniket Prajapati

Licensed under the [GNU GENERAL PUBLIC LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)

> **Note** This project is in a very early stage, with rapidly changing codebase. Do not use for production.