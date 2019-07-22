# A guide to building a fully international, universal web app.

## Part One of Four

- [Part Two]('https://google.com')
- [Part Three]('https://google.com')
- [Part Four]('https://google.com')

## pre - note

Here at Ginetta we strive to give our users the best possible web experience. We care a lot about performance and we care more about accessability. Our creations are for everyone to enjoy and a huge part of accessability is crossing the language barrier.

## Intro

Here at Ginetta we use Next.js to build our web applications - it is a framework on top of React which allows server-side rendering, static-exporting and client-side hydration for a full, fast universal web-app experience. However this is not a Next.js, React or CSS tutorial. Though we will not be doing anything too complex, some basic knowledge is of React is required.

This article takes you through the steps building a Next.js app, with translated content _and_ translated URL slugs - you also get to learn a little bit about dinosaurs along the way!

By the end of this guidfe you will have a fully international dinosaur related Next.js application that is translated into the four main languages of Switzerland - German, French, Italian and English so that everyone can get the full JP experience.

[Here is what the final app will look like when finished](https://i18n-dinosaurs.herokuapp.com/)

## Set-up

Lets create a new directory and install all the necessary dependencies:

```
mkdir i18nDinosaurs && cd i18nDinosaurs && npm init -y && npm i react react-dom next
```

To run a Next.js app we need to add a couple of scripts to our package.json:

```
"scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
```

First lets get something on the screen! Next is great in the way the routing works, all you just need a `pages` directory in the root level with and index file to create a `/` route of the website.

```
mkdir pages && cd pages && touch index.js
```

Lets export a simple React component with a banner for our home page:

```
const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Jurassic Park International!</h1>
    </div>
  )
}
export default HomePage
```

now if we start the application by running

```
npm run dev
```

and head to http://localhost:3000 we should see our banner!

## Styles

A side note, as stated, this is not a CSS tutorial, but if you would like some basic styles feel free to

```
npm i @zeit/next-css
```

and create a root level `next.config.js` with this snippet

```
const withCSS = require('@zeit/next-css')
module.exports = withCSS()
```

Then add this [stylesheet](https://github.com/OliWalker/i18n-dinosaurs/blob/master/styles.css) in the root directory.

We will soon import this into our not yet created `_app` component and then `import css from '../styles.css'` in any component to be styled. We then add classNames to the components such as:

```
<component className={css.classNameToUse}/>
```

## Internationalization

### Adding our translation service

Our translation package will be [i18-next](https://www.i18next.com/) which has a huge amount of functionality not just for basic strings but for plurals, counts etc. We will use Next-i18next, a package designed for Next.js which is a wrapper for React-i18Next to allow the SSR functionalities of Next.

```
npm i next-i18next
```

To use Next-i18next we have a bit of config to do, so create a i18n.js file in the root:

```
const NextI18Next = require('next-i18next').default;

const NextI18NextInstance = new NextI18Next({
	defaultLanguage: 'en',
	otherLanguages: ['en', 'de', 'fr', 'it'],
  fallbackLng: 'en',
  localeSubpaths: 'all'
});

module.exports = NextI18NextInstance;
```

n.b. we are using "require" because anything outside of our `_app`s sub-components will be used in a Node environment.

This `Nexti18NextInstance` can take a whole host of options to tailor your translation needs. We set a `defaultLanguage` - which will be the language set on start up for the user, an array of `otherLanguages` that Next is configured to use, and a `fallbackLng` - the translation that will be used if the current language cannot be found and `localeSubpaths: 'all'` will add the language prefix in the url.

Head [to the docs](https://www.i18next.com/overview/configuration-options) to see a full list of options that can be passed.

### Adding translations to our app

To get the translations into the app, Next-i18Next expects them to be in a root level `static` directory, alongside other static assets (images, icons, etc.) inside a `locales` director. Inside this we will need one folder per language:

```
.
└── static
|   └── locales
|       ├── de
|       |   └── homePage.json
|       ├── en
|       |   └── homePage.json
|       ├── fr
|       |   └── homePage.json
|       └── it
|           └── homePage.json
...
```

and in the homePage.json we can add our banner to be translated.

static/locales/de/homePage.json

```
{
  "banner": "Willkommen im Jurassic Park International!"
}
```

static/locales/en/homePage.json:

```
{
  "banner": "Welcome to Jurassic Park International!"
}
```

etc.

Next will take these translations at `build` time, therefore any change to the json files means a restart of the server.

Important. Next-i18 Next also needs a `common.json` file in each of the locales sub-folders. This is where you would put translations used all over the app such as the title of the app, or the content of call to action buttons. We won't be using it, but please add in an empty `common.json` file to be safe.

### Translating our app

To start we need to wrap our whole app in a the `appWithTranslation` Higher Order Component that is provided to us by next-i18Next.

Let's create an `_app.js` file in our pages directory, here we can customize our app to do a whole host of useful things, but for now, lets just connect it to out translation service.

```
import React from 'react';
import App, { Container } from 'next/app';
import { appWithTranslation } from '../i18n';
import '../styles.css'; // if you would like some great styles

class MyApp extends App {

  render() {
    const { Component } = this.props;
    return (
      <Container>
        <Component />
      </Container>
    )
  }
}

export default appWithTranslation(MyApp);
```

Great - now the app is connected to the translations, we need to connect our page.

So in `pages/index.js` lets

```
import { withTranslation } from '../i18n'
```

and then

```
export default withTranslation('homePage')(HomePage)
```

note that we are passing the translations needed to the HOC - in this page we just need the 'homePage' translation strings, but if we needed more, we can pass an array of translation strings to the HOC.

By wrapping the page in the withTranslation HOC we have access to a couple of functions, one being `t` which is how we will translate our content. We pass the `t` function the key of the string we want translated and Next-i18Next figures out which JSON to take the value from, based on the current language.

Our finished `pages/index` should look like:

```
import { withTranslation } from '../i18n';

const HomePage = ({ t }) => {
  return (
    <div>
      <h1>{t('banner')}</h1>
    </div>
    );
};
export default withTranslation('homePage')(HomePage);
```

But if you restart the server and head to `http://localhost:3000` again, you just see the string `banner`, oops, not done yet. But see that we are redirected to `http://localhost:3000/en` - something is working!

### Adding a custom server

Next is server side rendered and allows us the possibility of adding our own custom server, which is awesome because it allows us to add custom functionality, including adding a middleware for our translations. So let's build a custom server using express to add our translation middleware:

```
npm i express
```

and create a top level `server.js` file. We are back in Node land - using require - so we create the server like:

```
const express = require('express');
const next = require('next');

// middleware to add translations
const nextI18NextMiddleware = require('next-i18next/middleware').default;

// our i18next instance
const nextI18next = require('./i18n');

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const fireUp = async () => {
  await app.prepare();
  const server = express();

  // add the middleware and pass our i18Next instance
  server.use(nextI18NextMiddleware(nextI18next));

  // for all routes use the next-handler
  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  console.log(`> Dino's ready on http://localhost:${port}`);
}

fireUp();

```

So, simply, we import everything that we need, express, next, our i18nInstance and the i18nMiddleware and then create an express server, which uses the middleware and listens for the routes, which we pass over to the next-app-handler to handle all the page routing.

Now we must change our package.json scripts, because we are not using the next server, but our own.

```
"scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
```

Now if we fire up the server by running:

```
npm run dev
```

this time, using our new server, we should see in the terminal

`> Dino's ready on http://localhost:3000`

meaning we are good to go!

over on `http://localhost:3000/en` we should see our translated banner!

switching the url from `http://localhost:3000/en` to `http://localhost:3000/de` or to any other of your languages you will see the language changes as expected - great!
