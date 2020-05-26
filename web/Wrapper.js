import Head from "../components/Head";
import {join} from "path";

export default class extends React.Component {
    constructor() {
        super();
        this.state = {App: window.__FIREJS_APP__.default, map: window.__MAP__};
    }

    render() {
        return (
            <div>
                <Head>
                    {
                        this.state.map.chunks.map(chunk => {
                            const href = join(`/${window.__LIB_REL__}/${chunk}`);
                            switch (chunk.substring(chunk.lastIndexOf("."))) {
                                case "js":
                                    return (
                                        <link rel="preload" as="script" href={href} crossOrigin="anonymous"/>
                                    )
                                case "css":
                                    return (
                                        <link rel="preload" as="style" href={href} crossOrigin="anonymous"/>
                                    )
                            }
                        })
                    }
                </Head>
                <App content={this.state.map.content}/>
                {
                    this.state.map.chunks.map(chunk => {
                        const href = join(`/${window.__LIB_REL__}/${chunk}`);
                        switch (chunk.substring(chunk.lastIndexOf("."))) {
                            case "js":
                                return (
                                    <script src={href} crossOrigin="anonymous"/>
                                )
                            case "css":
                                return (
                                    <link rel="stylesheet" href={href} crossOrigin="anonymous"/>
                                )
                            default:
                                return (
                                    <link href={href}/>
                                )
                        }
                    })
                }
            </div>
        )
    }
}