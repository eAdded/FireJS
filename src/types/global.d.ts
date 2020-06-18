declare module NodeJS {
    interface Global {
        window: Global,
        FireJS: {
            libRel?: string,
            mapRel?: string,
            map?: {
                content: any,
                chunks: string[]
            },
            isSSR?: boolean,
            isHydrated?: boolean,
            linkApi?: {
                loadMap: (url: string) => void,
                preloadPage: (url: string, callback: () => void) => void,
                loadPage: (url: string, pushState?: boolean) => void,
                runApp: (el: any, root: Element) => void,
                preloadChunks: (chunks: string[]) => void,
                loadChunks: (chunks: string[]) => void
            },
            lazyLoad?: (chunkPromise: Promise<{ default: any }>, id: string, options: any, children: any) => void,
            finishRender?: () => void,
            lazyCount?: number,
            pages?: {
                404: string
            }
        },
        __FIREJS_APP__?: {
            default: any
        },
        React?: any,
        ReactDOM?: any,
        ReactDOMServer?: any,
        __FIREJS_VERSION__: string;
    }
}
