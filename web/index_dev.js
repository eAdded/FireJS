import "../src/scripts/HistoryListener";

ReactDOM.render(React.createElement(
    App.default,
    {content: JSON.parse(JSON.stringify(window.__MAP__.content))}//SIMPLEST WAY TOO DEEP COPY
    ),
    document.getElementById("root")
);