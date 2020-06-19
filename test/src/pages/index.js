import Link from "../../../src/components/Link.js";

export default () => {
    return (
        <div>
            <h1>Hello Next.js 👋</h1>
            <Link to={"/about"}>About</Link>
        </div>
    )
}