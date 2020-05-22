# Firejs
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
 The need of this project ignited with the [requirement](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3) of very fast on the fly, highly customizable builds. We solved this issue with **Firejs**. You can change each and every dir with the help of **firejs.config.js** file. You can easily customize webpack with **webpack.config.js**.  
  
## Install  
~~~  
yarn add @eadded/firejs  
~~~    
## Args  
~~~    
"--pro"?: boolean,              //Production Mode
"--conf"?: string,              //Path to Config file
"--verbose"?: boolean,          //Log Webpack Stat
"--plain"?: boolean,            //Log without styling i.e colors and symbols
"--silent"?: boolean,           //Log errors only
"--disable-plugins"?: boolean   //Disable plugins 
~~~  
## Hello World  
Run the following command to start dev server. Pass args as needed.  
~~~  
yarn run firejs  
~~~  
## Project Structure
This is a typical project structure which can be highly modified using firejs.config.js    
```
Project    
└─── out                    //output dir
|   └─── .cache             //cache required during build
│   └─── dist               //production output
│       └─── lib            //chunks
│           └─── map        //page dataa and chunks map
└─── src    
│   └─── pages              //all project pages go here
│       │   index.ts    
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

*Note* During production static dir will not be copied.

## Components
**Firejs** exports two components : Link and Head

 - Link : Used for navigating pages (in project only). Preloads page content onMouseEnter. Preserves history.
 - Head : Injects children to head element. A wrapper around react-helmet. Allows SSR.

*Example*
```
import Link from "@eadded/firejs/components/Link"  
import Head from "@eadded/firejs/components/Head";  
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

*Plugin interface*
~~~
interface Plugin { [key: string]: PageObject[] }

type PageObject = string | PathObject | AsyncFunc

interface AsyncFunc { (): Promise<PathObject[]> }

interface PathObject { path: string, content: any}
~~~
Suppose that you have a dynamic page *[author]/[article].js*. A plugin can be used to provide routes and page content. Eg: path */john/corona*, a markdown can be passed as content.
    
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

## Configuration
Create a *firejs.config.js* or specify a file using ```[-c,--config]``` flags.

*Type Interface*

```
{
    pro?: boolean,          //production mode when true, dev mode when false
    paths?: {               //paths absolute or relative to root
        root?: string,      //project root, default : process.cwd()
        src?: string,       //src dir, default : root/src
        pages?: string,     //pages dir, default : root/src/pages
        out?: string,       //output dir, default : root/out
        dist?: string,      //production dist, default : root/out/dist
        cache?: string,     //fire js cache dir, default : root/out/.cache
        babel?: string,     //fire js production babel cache, default : root/out/.cache/babel
        template?: string,  //template file, default : inbuilt template file
        lib?: string,       //dir where chunks are exported, default : root/out/dist/lib
        map?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        webpack?: string,   //webpack config file, default : root/webpack.config.js
        static?: string,    //dir where page static elements are stored eg. images, default : root/src/static
        plugins?: string,   //plugins dir, default : root/src/plugins
    },
    plugins?: string[],     //plugins, default : []
    templateTags?: {        //these tags need to exist if you pass custom template file
        script?: string,    //this is replaced by all page scripts, default : "<%=SCRIPT=%>"
        static?: string,    //this is replaced by static content enclosed in <div id="root"></div>, default : "<%=STATIC=%>"
        head?: string,      //this is replaced by static head tags i.e tags in Head Component, default : "<%=HEAD=%>"
        style?: string,     //this is replaced by all page styles, default : "<%=STYLE=%>"
        unknown?: string    //files imported in pages other than [js,css] go here. Make sure you use a webpack loader for these files, default : "<%=UNKNOWN=%>"
    },
    pages?: {
        _404?: string       //404 page, default : 404.js
    }
}
```

## Node Interface
*Production build*
~~~
import FireJS from "@eadded/firejs"
const app = new FireJS({args: {"--pro": true}});
app.buildPro(()=>{
    console.log("Production build done")
})
~~~

*Building a specific page*
~~~
import FireJS from "@eadded/firejs"
//let's build 404 page
const app = new FireJS({args: {"--pro": true}, pages: ["404.js"]});
app.buildPro(() => {
    console.log("Built page 404")
});
~~~

*Passing Content*
~~~
import FireJS from "@eadded/firejs"

const app = new FireJS({args: {"--pro": true}});
//Get page from map and pass plugin to it
app.Context.map.get("[author]/[article].js").plugin = [
    {
        path : "aniketfuryrocks/rust is the best",
        content : {
            "title" : "Rust is really the best"
        }
    }
]
//build
app.buildPro(() => {
    console.log("Build finished. Build is placed in the default [out] dir")
})
~~~
#### Rendering On the fly
If you need to SSR (Server Side Render) your page, or if you want to do something like [this](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3). We've got your back.

*Rendering a page with data from plugins*
~~~
import {CustomRenderer} from "@eadded/firejs/dist";

const app = new CustomRenderer("./out/babel", "./src/plugins");
app.renderWithPluginData(app.map.get("[author]/[article].js"), "/aniket/rust",(html)=>{
    console.log(html)
});
~~~

*Rendering a page with data custom data*
~~~
import {CustomRenderer} from "@eadded/firejs/dist";

const app = new CustomRenderer("./out/babel", "./src/plugins");

const html = app.render("[author]/[article].js","/aniket/rust",{
    name : "this is content for the page"
})
console.log(html);
~~~

In the given examples we are rendering page **[author]/[article].js** for path **/aniket/rust**.

**Points to keep in mind**
1. If you are rendering in a remote location, like in a s3 function. You need to have [babel dir and plugins dir] in the vicinity. Babel Dir is nothing but a folder in the **out** dir.

2. Make sure the path that you pass exists. i.e the path shall either provided by a plugin, or the path must be a [default path](#default-path).

## Default Path

When you don't provide a path for a page using a plugin then the path of the page will be used as its' path.

Eg. A page "index.js" will have a default path "/index".

If you provide a blank plugin then default paths will not be applied.

## License & Copyright
Copyright (C) 2020 Aniket Prajapati

Licensed under the [GNU GENERAL PUBLIC LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)

> **Note** This project is in a very early stage, with rapidly changing codebase. Do not use for production.