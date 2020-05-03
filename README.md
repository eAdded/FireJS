# FireJS
 Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.    
    
## Features    
    
 - Highly customizable
 - Very fast dev builds 
 - Vey fast on the fly pro builds
 - Dev Server (live reload)
 - Easy node interface
 - Plugins
 - Easy dynamic routes
    
## Why another React Static Site Gen... ?
 This project was ignited with the [requirement](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3) of very fast on the fly, highly customizable builds. We solved this issue with **FireJS**. You can change each and every dir with the help of **firejs.config.js** file. You can easily customize webpack with **webpack.config.js**.  
  
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
└─── out    
|  └─── .cache    
│  └─── dist    
└─── src    
│   └─── pages    
│       │   index.js    
│       │   about.js    
│       │   ...    
│    
│   └─── plugins    
│       │   plugin-name.js    
│       │   ...    
|    
| firejs.config.js    
| webpack.config.js    
```
## Components
**FireJS** exports two components : Link and Head

 - Link : Used for navigating pages (in project only). Preloads page content onMouseEnter
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
Plugins are used to provide content and routes structure    
    
*Sample Plugin* 
~~~    
const axios = require('axios').default;      
module.exports = {      
 "api/name.js": [     
    async () => {     
       let content = await axios.get("https://api.thevirustracker.com/free-api?global=stats");    
       content = content.data;    
       return [    
           { path: "/api/corona", content }    
       ]    
}]}    
~~~    
This plugin fetches some data from an api asynchronously and passes it to a route.    
    
File `api/name.js` which is found in src dir, is used to create the route `/api/corona`.

**Note** This project is in a very early stage, with incomplete docs and un tested blocks. Do not use for production.