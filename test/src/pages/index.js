import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import LoaderCss from "../loader.css";

export default () => {
    return (
        <div>
            <Loader effect={React.useEffect}>
                <div className={LoaderCss.LoadingProgress}/>
            </Loader>
            <h1>Hello Next.js 👋</h1>
            <Link to={"/about"}>About</Link>
        </div>
    )
}