import "./HistoryListener";

// @ts-ignore
ReactDOM.render(React.createElement(
    // @ts-ignore
    App.default,
    // @ts-ignore
    {content: JSON.parse(JSON.stringify(window.__MAP__.content))}//SIMPLEST WAY TOO DEEP COPY
    ),
    document.getElementById("root")
);