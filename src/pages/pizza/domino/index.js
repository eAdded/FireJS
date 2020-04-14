import React from "react"
import ReactDom from "react-dom"
const App =  () => {
    return (
        <div>
            <h1>Welcome to dominos</h1>
            <h2>We have a new extra cheese pizza</h2>
        </div>
    )
}
ReactDom.render(<App/>,document.getElementById("root"));