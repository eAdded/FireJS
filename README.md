# FireJS
Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.

## Features

 - Highly customizable
 - Very fast dev builds
 - Vey fast on the fly pro builds
 - Dev Server (live reload)
 - Easy parralel builds
 - Event hooks
 - Plugins
 - Easy dynamic routes

## Why another React Static Site Gen... ?
This project was ignited with the [requirement](https://dev.to/aniketfuryrocks/dynamically-building-static-react-pages-upon-request-4pg3) of very fast on the fly, highly customizable builds. We solved this issue with **FireJS**. You can change each and every dir with the help of **firejs.config.js** file. You can easily customize webpack with **webpack.config.js**.

  
## Getting Started

> index.js file
~~~
const FireJS = require("@eadded/firejs")  
const app = new FireJS({});  
app.build().then(_=>{  
  console.log("built")  
}).catch(e=>{  
  throw e;  
});
~~~
## Dev Server

~~~
require("@eadded/fire-js/server")
~~~
## Project Structure
Below is a typical project structure which can be highly modified using firejs.config.js
```
Project
└─── out
|	└─── .cache
│	└─── dist
└─── src
│   └─── pages
│       │   index.js
│       │   about.js
│       │   ...
│
│	└─── plugins
│   	│   plugin-name.js
|		| 	...
|
| firejs.config.js
| webpack.config.js
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
This plugin fetches some data from an api asynchronasly and passes it to a route.

File `api/name.js` which is found in src dir, is used to create the route `/api/corona`.

**Note**
This project is in a very early stage, with incomplete docs and un tested blocks. Do not use for production. 