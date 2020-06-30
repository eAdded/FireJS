export default ({children, delay}) => {
    const [loader, setLoader] = React.useState(children);
    FireJS.showLoader = () => {
        FireJS.showLoader = undefined;
        setLoader(children)
    };
    FireJS.appEffect(() => {
        if (delay)
            setTimeout(() => setLoader(<></>), delay)
        else
            setLoader(<></>)
    }, [])
    return loader;
}