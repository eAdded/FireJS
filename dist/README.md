# Fire JS 🔥

**A zero-config, highly customizable, progressive react static site generator with blazingly fast SSR and on the fly builds.**

Build professional quality static websites with no limitations whatsoever. FireJS sites are fully functional React apps, so you can create high-quality, dynamic web apps, from blogs to e-commerce sites to user dashboards.

FireJS handles page preloading, builds optimised chunks, grows with you using powerful plugin API, saves your sweet-sweet money because FireJS sites are very very efficient and cheap to host. Go Serverless, SSR or just dump your export to an S3 bucket. There is no limit to what you can do with FireJS. 

Excited to learn more?

Visit the [quick start](https://github.com/eAdded/FireJS/wiki/Quick-Start) guide to get your site spinning within a minute.

# Features

+ **Fast WebPages** FireJS preloads external chunks such as react, react-dom and provides a Link Component which helps preload in-project pages beforehand for faster and snappier websites.

+ **Node interface for on the fly rendering (SSR)** FireJS provides an `export-fly` mechanism which extracts the min chunks required for SSR and bundles it into a single unit, which when combined with the CustomRenderer helps render FireJS pages on the fly. You can render them on a serverless function or on a full-fledged Server.

+ **Dev friendly CLI interface** FireJS provides a fast and dev friendly CLI interface.

+ **Plugins** FireJS provides a rich plugin API which helps users to develop or install required features as per their need. Customize webpack or your routes. Use plugins to load Data From Anywhere. FireJS pulls in data from any data source, whether it’s Markdown files, a headless CMS like Contentful or WordPress, or a REST or GraphQL API. Use plugins to load and pass on data to your pages as props.

+ **Routes** FireJS allows any page to have multiple routes without rewriting the same code a thousand times. FireJS routes are similar to file-system dirs, so you never get a page conflict when pushing the site to a static host.

+ **Highly customizable project structure and webpack** FireJS don't bind you to a fixed thought. If you don't like something, then just change it.

## Documentation

Documentation is available at the official [FireJS Github Wiki](https://github.com/eAdded/FireJS/wiki)

**NOTE** `v0.18.0` is currently in `beta` testing and its docs are yet to be published. The release previously planned for `20th July 2020` has been postponed to `24th July 2020`.
This release brings a brand-new mechanism for SSR lazy loaded components using `FireJS.lazyLoad`. No more `FOUC`. Small bundle size with a full featured SS DOM.

## Code of conduct

Code of conduct can be found at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing

Make sure to read **Contribution Guidelines** at [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## License & Copyright

Copyright (C) 2020 Aniket Prajapati

Licensed under the [GNU GENERAL PUBLIC LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)

**Note** Stable `beta` releases will be published to the `latest` channel. `nitely` channel shall be used for unstable builds.