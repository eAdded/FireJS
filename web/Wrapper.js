import Head from "../components/Head";
import {join} from "path";
import {loadPage, preloadPage} from "../components/LinkApi";

export default class extends React.Component {
    constructor() {
        super();
        window.onpopstate = function () {
            preloadPage(location.pathname, () => {
                loadPage(location.pathname, false)
            })
        }
    }

    render() {
        return (
            <>
                <WrapperHeadChunks/>
                <WrapperBody/>
                <WrapperBodyChunks/>
            </>
        )
    }
}

class WrapperHeadChunks extends React.Component {
    constructor() {
        super();
        this.state = {init: window.__SSR__};
        window.updatePreChunks = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <Head>
                {
                    window.__MAP__.chunks.map((chunk,index) => {
                        const href = join(`/${window.__LIB_REL__}/${chunk}`);
                        switch (chunk.substring(chunk.lastIndexOf("."))) {
                            case ".js":
                                return (
                                    <link key={index} rel="preload" as="script" href={href} crossOrigin="anonymous"/>
                                )
                            case ".css":
                                return (
                                    <link key={index} rel="preload" as="style" href={href} crossOrigin="anonymous"/>
                                )
                        }
                    })
                }
            </Head>
        )
    }
}

class WrapperBodyChunks extends React.Component {
    constructor() {
        super();
        this.state = {init: window.__SSR__};
        window.updateChunks = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <>
                {
                    window.__MAP__.chunks.map((chunk,index) => {
                        const href = join(`/${window.__LIB_REL__}/${chunk}`);
                        switch (chunk.substring(chunk.lastIndexOf("."))) {
                            case ".js":
                                return (
                                    <script key={index} src={href} crossOrigin="anonymous"/>
                                )
                            case ".css":
                                return (
                                    <link key={index} rel="stylesheet" href={href} crossOrigin="anonymous"/>
                                )
                            default:
                                return (
                                    <link key={index} href={href}/>
                                )
                        }
                    })
                }
            </>
        )
    }
}

class WrapperBody extends React.Component {
    constructor() {
        super();
        this.state = {init: true};
        window.updateApp = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <>
                {this.state.init && <window.__FIREJS_APP__.default content={window.__MAP__.content}/>}
            </>
        )
    }
}