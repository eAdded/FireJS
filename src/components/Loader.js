export default ({children, effect, delay}) => {
    const [loader, setLoader] = React.useState(children);
    if (FireJS.isSSR)
        delay = 0;
    FireJS.showLoader = () => {
        setLoader(children)
        FireJS.showLoader = undefined;
    };
    effect(() => {
        if (delay)
            setTimeout(() => setLoader(<></>), delay)
        else
            setLoader(<></>)
    }, [])
    return loader;
}