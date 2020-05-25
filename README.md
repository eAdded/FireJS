# Firejs 🔥
 Highly customizable no config react static site generator built on the principles of Gatsby, NextJs and create-react-app.    
    
## Features    
    
 - 🗾 [Highly customizable](#configuration)
 - 🚀 Very fast builds (< 2s)
 - 🏁 [Very fast SSR](#rendering-on-the-fly)
 - 🔭 Dev Server (live reload)
 - 🤠 [Easy to use node interface](#node-interface)
 - 💯 [Plugins](#plugins)
🚀
## Why another React Static Site Gen... ?
 The need of this project ignited with the [requirement](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3) of very fast on the fly, highly customizable builds. We solved this issue with **Firejs**. You can change each and every dir with the help of **firejs.config.js** file. You can easily customize webpack with **webpack.config.js**.  
  
## Install  
~~~  
yarn add @eadded/firejs  
~~~    
## Args  
pass flag [-h, --help] to list all valid flags
~~~    
yarn run firejs -h
~~~  
## Hello World  
Run the following command to start dev server. 
~~~  
yarn run firejs  
~~~  
## Project Structure
This is a typical project structure which can be highly modified using firejs.config.js    
```
Project    
└─── out                    //output dir
|   └─── babel              //babel dir for on the fly builds
│   └─── dist               //production output
│       └─── lib            //chunks
│           └─── map        //page dataa and chunks map
└─── src    
│   └─── pages              //all project pages go here
│       │   FireJS.ts    
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
A plugin can be used to provide dynamic routes and content.

Suppose that you have a page *[author]/[article].js*. A plugin can be used to provide path */aniket/react*, and a markdown as content.
    
**Sample Plugin In TypeScript**
~~~    
import Plugin from "@eadded/firejs/dist/classes/Plugin";

export default class extends Plugin {
    constructor() {
        //pass page here
        super("[author]/[article].js");
    }

    async initPaths(): Promise<void> {
        //provide all possible paths here
        //this.paths can be changed dynamically
        this.paths = [
            "/aniket/rust"
        ]
    }

    async getContent(path): Promise<any> {
        //provide content for the provided path
        return {
            name: "Aniket"
        }
    }

    async onRequest(req, res): Promise<void> {
        //this method is called during dev mode
        console.log(req.url)
    }
}
~~~    
File `[author]/[article].js` which is found in pages dir, is used to create the route `/aniket/rust`.

## Configuration
Create a *firejs.config.js* file or specify a file using ```[-c,--config]``` flags.

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
        babel?: string,     //fire js production babel cache, default : root/out/.cache/babel
        template?: string,  //template file, default : inbuilt template file
        lib?: string,       //dir where chunks are exported, default : root/out/dist/lib
        map?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        webpack?: string,   //webpack config file, default : root/webpack.config.js
        static?: string,    //dir where page static elements are stored eg. images, default : root/src/static
        plugins?: string,   //plugins dir, default : root/src/plugins
    },
    templateTags?: {        //these tags need to exist if you pass custom template file
        script?: string,    //this is replaced by all page scripts, default : "<%=SCRIPT=%>"
        static?: string,    //this is replaced by static content enclosed in <div id="root"></div>, default : "<%=STATIC=%>"
        head?: string,      //this is replaced by static head tags i.e tags in Head Component, default : "<%=HEAD=%>"
        style?: string,     //this is replaced by all page styles, default : "<%=STYLE=%>"
        unknown?: string    //files imported in pages other than [js,css] go here. Make sure you use a webpack loader for these files, default : "<%=UNKNOWN=%>"
    },
    pages?: {
        404?: string       //404 page, default : 404.js
    }
}
```

## Node Interface
*Production build*
~~~
import FireJS from "@eadded/firejs/dist/FireJS";

(async () => {
    const app = new FireJS({args: {"--pro": true}});
    await app.init();
    await app.buildPro();
    console.log("Build Complete")
})()
~~~

*Building a specific pro page*
~~~
import FireJS from "@eadded/firejs/dist/FireJS";
//here we are building page [author]/[article].js
(async () => {
    const app = new FireJS({args: {"--pro": true}, pages: ["[author]/[article].js"]});
    await app.init();
    await app.buildPro();
    console.log("Build Complete")
})()
~~~

## Rendering On the fly
If you need to SSR (Server Side Render) your page, or if you want to do something like [this](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3). We've got your back.

*Rendering a page with custom data*
~~~
import CustomRenderer from "@eadded/firejs/dist/CustomRenderer";

//here we pass the path to babel and plugins dir
const renderer = new CustomRenderer("./out/babel", "./src/plugins");
const obj = renderer.render("[author]/[article].js", "/aniket/rust", {name: "Aniket"});
console.log(obj);
~~~
The **obj** variable is json of structure
~~~
{
    html : string,  //contains the statically rendered html
    map : string    //contains map for the page
}
~~~
The **map** property contains the page chunks and its content. It shall be served by the route */lib/map/[path].map.js*

Make sure you serve the **map** by the correct route to ensure the correct functioning of **Link** component

The map for path */aniket/rust* shall be served by the route */lib/map/aniket/rust.map.js*

**Rendering a page with data from plugins**

~~~
import CustomRenderer from "@eadded/firejs/dist/CustomRenderer";

(async () => {
    const renderer = new CustomRenderer("./out/babel", "./src/plugins");
    const obj = await renderer.renderWithPluginData("[author]/[article].js", "/aniket/rust")
    console.log(obj);
})()
~~~

**Points to keep in mind**

1. Make sure to build in production mode before custom rendering your page.

2. If you are rendering in a remote location, like in a s3 function. You need to have [babel dir and plugins dir] in the vicinity. Babel Dir is nothing, but a folder in the **out** dir. No other dir like the **src** dir shall be required.

3. Make sure the path that you pass exists. i.e the path shall either provided by a plugin, or the path must be a [default path](#default-path).

**Map variable**

The map variable i.e app.map , maps all the pages, with its paths and plugins.
## Default Path

When you don't provide a path for a page using a plugin then the path of the page will be used as its' path.

Eg. A page "index.js" will have a default path "/index".

If you provide a blank plugin then default paths will not be applied.

## License & Copyright
Copyright (C) 2020 Aniket Prajapati

Licensed under the [GNU GENERAL PUBLIC LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)