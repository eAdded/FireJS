const _path = require("path");
module.exports = class {
    #path;
    #map = {
        path: "",
        chunks: [],
        content: {},
    };
    #map_path;

    constructor(mapComponent, path, content, $) {
        this.#path = path;
        this.#map = {
            chunks: mapComponent.chunks,
            content
        }
        this.#map_path = _path.join(_path.relative($.config.paths.dist, $.config.paths.map), path.concat(".map.js"));
    }

    getMap() {
        return this.#map;
    }

    getMapPath() {
        return this.#map_path;
    }

    getPath() {
        return this.#path;
    }
}