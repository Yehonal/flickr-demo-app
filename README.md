# flickr-demo-api

Photo gallery demo that uses the public API from flickr to retrieve and display images on a web page.

Features:

* **Webcomponents and ShadowDOM:** Both the NavBar and the Gallery are separated webcomponents, thanks to the "closed" ShadowDOM they are 
  isolated by rest of the DOM.
* **Navbar with Search box:** The search box component dispatches an event caugth by the gallery to run the search action. 
  If you are lazy, press the Enter button to run a search. 
* **CacheAPI:** Integrated with the FlickrService.js, allows to cache the response of all fetch calls
* **Responsive:** the gallery uses flexbox rules to resamble the Flickr website and be fully responsive
* **Endless scroll:** you can scroll endlessy the page to load new pictures
* **Tested and linted:** eslint + jest + coverage
* **Optimized built:** webpack4 has been optimized to build a super-minified bundle


*This project follows the [DIRS 2 standard](https://www.azerothcore.org/directory-structure/)*

**Author:** Giuseppe Ronca

## Getting started

### Run the latest production version

```
npm run serve
```

### Development mode

Install all dependencies first

```
npm install
```

Then run the dev server

```
npm run start
```

### NPM scripts

```
* build         : Run all checks and create the bundle inside the dist folder
* start         : start the webpack dev server
* serve         : run a simple webserver to serve the dist folder
* serve:coverage: show the coverage information inside the browser
* check         : run lint and test together
* test          : run jest 
* lint          : run eslint without fix issues
* lint:fix      : run eslint and fix issues if possible
```



