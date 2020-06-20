export default ({children, effect}) => {
    const [loader, setLoader] = React.useState(children);
    FireJS.showLoader = () => {
        setLoader(children)
        FireJS.showLoader = undefined;
    };
    effect(() => {
        setLoader(<></>)
    }, [])
    return loader;
}