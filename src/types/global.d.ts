declare module NodeJS {
    interface Global {
        window: {
            __LIB_REL__: string,
            __MAP_REL__: string,
            __MAP__: {
                content: any,
                chunks: string[]
            },
            __SSR__: boolean,
            __HYDRATE__: boolean,
            __FIREJS_APP__: {
                default: any
            },
            React: any,
            ReactDOM: any,
            ReactDOMServer: any,
            LinkApi: {
                loadMap: (url: string) => void,
                preloadChunks: (chunks: string[]) => void,
                loadChunks: (chunks: string[]) => void
            },
            finish: () => void
            FireJS_Require: (chunkPromise: Promise<{ default: any }>, id: string, options: any, children: any) => void
            __COUNT__: number
        },
        __FIREJS_VERSION__: string;
    }
}
