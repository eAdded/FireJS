window.onpopstate = function () {
    FireJS.linkApi.preloadPage(location.pathname, () =>
        FireJS.linkApi.loadPage(location.pathname, false)
    )
};

ReactDOM.render(React.createElement(require('react-hot-loader/root').hot(
    (props) => {
        const [app, setApp] = React.useState(React.createElement(FireJS.app, props));
        FireJS.runApp = () => setApp(React.createElement(FireJS.app, {content: FireJS.map.content}));
        FireJS.appEffect = React.useEffect;
        return app;
    }
    ), {content: FireJS.map.content}),
    document.getElementById("root")
);
FireJS.isHydrated = false;