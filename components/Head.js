window.__Helmet__ = require("react-helmet").Helmet;

export default ({children}) => {
    return (
        <window.__Helmet__>
            {children}
        </window.__Helmet__>
    )
}