import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import LoaderCss from "../loader.css"

export default () => {
    return (
        <div>
            <Loader effect={React.useEffect}>
                <div className={LoaderCss.LoadingProgress}/>
            </Loader>
            <h1>This is the about page</h1>
            <Link to={"/"}>Go Home</Link>
        </div>
    )
}