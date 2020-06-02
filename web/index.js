import Wrapper from "./Wrapper";

if (window.__SSR__)
    ReactDOM.hydrate(<Wrapper/>,
        document.getElementById("root")
    );
else
    ReactDOM.render(<Wrapper/>,
        document.getElementById("root")
    );