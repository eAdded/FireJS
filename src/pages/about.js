import React from "react"
import ReactDom from "react-dom"
const App =  () => {
    return (
        <div>
            <h1>This is About Page</h1>
            <h2>The static engine is built by <a href="http://www.eadded.com">eAdded</a></h2>
            <ul>
                <li><a href="/">Home Page</a></li>
            </ul>
        </div>
    )
}
ReactDom.render(<App/>,document.getElementById("root"));