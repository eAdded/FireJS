import Wrapper from "./Wrapper";

if (window.__SSR__)
    ReactDOM.hydrate(<Wrapper content={window.__MAP__.content}/>,
        document.getElementById("root")
    );
else
    ReactDOM.render(<Wrapper content={window.__MAP__.content}/>,
        document.getElementById("root")
    );