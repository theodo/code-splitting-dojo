# Code splitting Dojo

You will learn during the next half hour how to split your javascript code, to keep your app performant.

Standard: each JS bundle you ship to the final user should be under 200 Kb gzipped.

## Start

Clone, install and lauch the app:

```bash
git clone git@github.com:theodo/code-splitting-dojo.git && cd code-splitting-dojo
yarn
yarn start
```

You will see that your application has 3 pages:

- a Home where you can open a popin (from material-ui), displaying a datepicker (from react-dates)
- a Graph page displaying some nice data (from highcharts)
- a Code page displaying some very interesting code (from react-syntax-highlighter)

## Initial state

Build your application:

```bash
yarn build
```

Lauch the python server that will serve your files with gzip on:

```bash
cd build
python ../GzipSimpleHTTPServer.py
```

Go to http://localhost:8000/, refresh your page with the Network tab opened: you can see that our website loads in 1.20s, and the time to see the first colored pixel (DOMContentLoaded in blue) is of 500ms.

When you launched your `yarn build`, you could see that the size of your chunks was displayed. Our biggest one has a size of 500Kb gzipped. That is waaaay too much. But why is that ?

I installed for you webpack bundle analyzer to see what contains this chunk.

```bash
yarn add --dev react-app-rewire-webpack-bundle-analyzer
```

I replaced the content of config-overrides.js with:

```js
module.exports = function override(config, env) {
  const analyzeBundle = process.argv.indexOf("--analyze-bundle") !== -1;

  if (analyzeBundle) {
    const rewireWebpackBundleAnalyzer = require("react-app-rewire-webpack-bundle-analyzer");
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: "static",
      reportFilename: "report.html"
    });
  }
  return config;
};
```

This project is based on create-react-app, and this is how we can override the webpack config.

Finally, I added the following command to your package.json:

```
"analyze": "react-app-rewired build --analyze-bundle",
```

And launch it:

```
yarn analyze
```

Now you can see whats in our bundle. We have several big big libraries: highlightjs is over 188Kb, highcharts 100Kb, moment 65Kb.

## Let's split

If you want more information about code splitting, you can read the [documentation](https://webpack.js.org/guides/code-splitting/).

Let's begin by splitting our code by route. In your App.js, import Suspense and lazy, and import your routes component dynamically:

```js
// src/App.js
...
import { Random } from "./components";
import "./App.css";

const Home = lazy(() => import("./components/Home"));
const Graph = lazy(() => import("./components/Graph"));
const Highlight = lazy(() => import("./components/Highlight"));
...
<Switch>
  <Suspense fallback={null}>
    <Route exact path="/" component={Home} />
    <Route exact path="/graph" component={Graph} />
    <Route exact path="/highlight" component={Highlight} />
  </Suspense>
</Switch>
...
```

Now let us see what happened. Launch a `yarn analyze`.

Now we have two bundles: one of 300Kb and one of 200Kb. Nice!

## Global exports

But wait, we have three routes, we should see four bundles? Highcharts should be in a separated bundle!
Whats happening here? As you can see, in our App.js, we have this line:

```js
import { Random } from "./components";
```

That means that webpack will import EVERYTHING that is exported in `./components`, and take only `Random` from it. So it cannot split!

And indeed, if you open the `./components/index.js` file, you will see we export `Home` and `Graph`, so webpack cannot split them.

So having a index.js exporting multiple js modules is a BAD PRACTICE. Lets fix it: delete this index.js and import Random like:

```js
import Random from "./components/Random";
```

Now let us see what happened. Launch a `yarn analyze`.

Now we have 4 bundles: one for each Route, and one that contains every package that will be needed for each route, react, react-router, react-dom... Not bad! But we are still over the standard.

## Heavy librairies

You cann see on our JS map that we have highlight js that is HUGE. We have all the files to highlight every kind of language, in every style possible. We do not need all that.

If you go on the package [ReadMe](https://github.com/conorhastings/react-syntax-highlighter#light-build), you will find a way to import less. As every huge libraries, they have a way for you to import only what you need.

Follow their instructions and rework the synthax hightlighter import:

```js
// src/components/Hightlight/Highlight.js

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

SyntaxHighlighter.registerLanguage("javascript", js);
```

Now let us see what happened. Launch a `yarn analyze`.

Wow! Fromm 200Kb to 10Kb for the synthax highlighter? Nice!

Let's do the same with moment: as you can see, we import in the `Modal` component every data of every language.
Replace the line:

```js
import "moment/min/locales.min";
```

With:

```js
import "moment/locale/en-gb";
import "moment/locale/fr";
```

As our users only speak english or french.

Do the same with react-dates:

```js
// src/components/Modal/Modal.js

import SingleDatePicker from "react-dates/lib/components/SingleDatePicker";
```

Now let us see what happened. Launch a `yarn analyze`.

Okay! We lost 50kb of useless locales, and some useless date picker components.

## More splitting ?

We have now split our app by routes, which is the most natural way. But we can split with react every component that we want. In particular, we want to split every component that is not directly visible. For example, the Modal component! This will allow us to split `react-dates` and `moment` from our biggest chunk.

Replace the static import in `Home.js` with:

```js
const Modal = lazy(() => import("../Modal"));
```

Now let us see what happened. Launch a `yarn analyze`.

Now we have another chunk with moment and react-dates within it, and our biggest chunks is the one with highstock in it!

## Bundle splitting

Ok, now, our users will download only the JS they need, when they arrive on our website. That is great!

But I like to put my code in production every other day. When I do that, I will rebuild my code. Webpack adds a hash to every chunk, that hashes its content. So when I rebuild my app, if nothing in my chunk has changed, its name will be the same. And our client's browser, that has our chunks stored in memory, will not download them again.

So when I deploy my code, the users that come to my website everyday will only download the chunks that changed. But still, we have chunks that reach 100KB, that contain our code and our librairies. If I change my website color, I do not want my user to download the full chunk, but only the JS that changed.

To make that happen, we will use bundle splitting. That means, we will split our chunks into much smaller chunks, containing only our code or one library.

To do that, we will add the following lines to our `config-overrides.js`:

```js
config.optimization.splitChunks = {
  chunks: "all",
  maxInitialRequests: Infinity,
  minSize: 0,
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      enforce: true,
      name(module) {
        // get the name. E.g. node_modules/packageName/not/this/part.js
        // or node_modules/packageName
        const packageName = module.context.match(
          /[\\/]node_modules[\\/](.*?)([\\/]|$)/
        )[1];

        // npm package names are URL-safe, but some servers don't like @ symbols
        return `npm.${packageName.replace("@", "")}`;
      }
    }
  }
};
```

Launch a `yarn analyze`. As you can see, our code is splitted in much more chunks, that contain only our code our a single library. So when a reccurent user comes to my website after I deployed, he will only download the minimal update JS.

## Result

We started with 510Kb of JS in one bundle. Now we have 250Kb of JS in 8 bundles, and the biggest one weights less thant 200Kb.

We decreased the loading time from 1.20s to 700ms, and the time to first paint from 500ms to 300ms (check it by relaunching the simple gzip server).

And we contributed to save the planet: 10GB takes 1KW/h of energy to transit to your client (1KWh is the energy needed to take a shower, or light your house for a day).
