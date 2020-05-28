import Wrapper from "./Wrapper";

ReactDOM.hydrate(<Wrapper content={window.__MAP__.content}/>,
    document.getElementById("root")
);