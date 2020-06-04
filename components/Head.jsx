window.__FIREJS_HELMET_USED__ = true;
export default ({children}) => {
    return (
        <ReactHelmet.Helmet>
            {children}
        </ReactHelmet.Helmet>
    )
}