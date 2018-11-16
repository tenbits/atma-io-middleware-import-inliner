ES6 Module Builder by Inlining
-----

> The Plugin provides also custom middleware to import content from other files:
- [`atma-io`](https://github.com/atmajs/atma-io) 
- [`Atma Toolkit`](https://github.com/atmajs/Atma.Toolkit) 
- [`App Bundler`](https://github.com/atmajs/app-bundler) 


1. Modules are wrapped to IIFE adding external reference (`export`) as a Variable.
2. Handle all dependencies so that a module is included only once.

##### Inline sample

```js
import { Foo } from './foo'
export const Data = Foo();
```
```js
export function Foo () { return 'foo' };
```

> Inlined module:

```js
var Data;
(function() {
    var Foo;
    (function() {
        Foo = function () { return 'foo' };
    }());

    Data = Foo();
}());
```


###### Embed into the project

+ **Atma Toolkit** 

    ```bash
    $ atma plugin install atma-io-middleware-import-inliner --save-dev
    ```

	This adds `atma-io-middleware-import-inliner` npm dependency and the `package.json` would look like:
    ```javascript
    {
        "devDependencies": {
            "atma-io-middleware-import-inliner"
        },
        "atma": {
            "plugins": [
                "atma-io-middleware-import-inliner"
            ],
            "settings": {
                "atma-io-middleware-import-inliner": {
                    "extension": "js",
                    "withPathComments": true
                }
            }
        }
    }
    ```
+ **App Bundler** 
    
    ```bash
    $ npm i atma-io-middleware-import-inliner --save-dev
    ```

    Extend AppBundler config with IO settings, for example in `package.json` for typescript extensions.
    ```javascript
    {
        /* ... any package json settings */
        "app-bundler": {
            /* ... any app-bundler settings */
            "middlewares": {                
                "ts": [
                    "atma-io-middleware-import-inliner:read",
                    "atma-loader-ts:read"
                ]
            }
        },
    }
    ```

+ Run

    + **Atma Toolkit**  Dev Server
        ```bash
        $ atma server
        # open some static file in browser.
        ```

    + **App Bundler**  Just run app bundler commands as usual
        
----
The MIT License