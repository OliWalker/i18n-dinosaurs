# A guide to fully internationalising a universal web app.

## Part One of Four

## pre - note

Here at Ginetta we use Next.js to build our web applications - it is a framework on top of React which allows server-side rendereing and client-side hydration for a full, fast universal web-app experience. However this is not a Next.js, React or CSS tutorial. Though we will not be doing anything too complex, some basic knowledge is required

## intro

I thought Jurassic park was great, but, I found that it only really catered to one group of people - English speakers. Here at Ginetta accessability is at the heart of our creations, and having an application in multiple languages is essential to reach as many users as possible.

In this tutorial we will look at translating our Dinosaur related Next.js application into the four main languages of Switzerland - German, French, Italian and English so that everyone can get the full JP experience.

[Here is what the full app will look like when finished](https://i18n-dinosaurs.herokuapp.com/)

## Set-up

Lets create a new directory and install all the nescersary depenedencies.

```
mkdir i18nDinos && cd i18nDinos && npm init -y && npm i react react-dom next
```

To run a Next.js app we need a couple of handy scripts to our package.json

```
"scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
```

So lets get something on the screen! Next is great in the way the routing works, all you just need a `pages` directory in the root level with and index file to create a `/` route.

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

Then add the [stylesheet from here](TODO) in the root directory.

We will import this into our `_app` component when we make it and then `import css from '../styles.css'` in any component to be styled and add a className to the component like

```
<component className={css.classNameToUse}/>
```

## Internationalisation

### Adding our translation service

Our translation package will be [i18-next](https://www.i18next.com/) which is has a huge amount of functionality. We will use Next-i18next, a fairly new Library for Next.js which is a wrapper to allow for SSR on top of React-i18next, which in turn is a react Wrapper for i18-next - pass the parcel or what?

```
npm i next-i18next
```

To use Next-i18next we have a bit of config to do, so create a i18n.js file in the root and add

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

n.b. we are using "require" because anything outside of our app will be used in a Node enviroment.

This `Nexti18NextInstance` can take a whole host of options, to tailor your translation needs. We set a `defaultLanguage` - which will be the language set on start up for the user, an array of `otherLanguages` that Next is configured to use, and a `fallbackLng` - the translation that will be used if the current language cannot be found and `localeSubpaths: 'all'` will add the language prefix in the url - handy!

Head to [here](https://www.i18next.com/overview/configuration-options) to see a full list of options that can be passed.

### Adding translations to our app

To get the translations into the app, Next expects them there on build time, so we need to put them in a root level static folder, where Next find all static assets (images, icons, etc.) - we will need one folder per language:

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

and in the homePage.json lets add our banner to translate!

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

An important point to note, Next will take these translations at `build` time, therefore any change to the json files means a restart of the server.

Next-i18 Next also needs a common.json in each of the locales sub-folders. This is where you would put translations used all over the app such as the title of the app, or the content of call to action buttons.

### Translating our app

First we need to translate our app. To do this, we need to wrap our app with the `appWithTranslation` Higher Order Component that is provided to us by next-i18Next.

lets create an `_app.js` file in our pages directory, here we can customise our app to do a whole host of useful things, but for now, lets just connect it to out translation API.

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

Great! now the app is connected to the translations, we need to connect our page.

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

But if you restart the server and head to `http://localhost:3000` again, you just see banner, oops, not done yet. But note that we are redirected to `http://localhost:3000/en` - something is working!

### Adding a custom server

Next runs on a server, which is awesome because it allows for tons of custom functionality, one of which is adding our translations. We will build a custom server using express to add our translation middleware. Let's start by:

```
npm i express
```

and create a top level `server.js` file. We are back in Node land so lets create our custom server like:

```
const express = require('express');
const next = require('next');

// middlewware to add translations
const nextI18NextMiddleware = require('next-i18next/middleware').default;

// our i18next instance
const nextI18next = require('./i18n');

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const fireUp = async () => {
  await app.prepare();
  const server = express();

  // add the middlewhere and pass our i18Next instance
  server.use(nextI18NextMiddleware(nextI18next));

  // for all routes use the next-handler
  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  console.log(`> Dino's ready on http://localhost:${port}`);
}

fireUp();

```

So, simply, we import everything that we need, express, next, our i18nInstance and the i18nMiddleware and then create an express server, which uses the middleware and listens for the routes, which we pass over to the next-app-handler so it acts normally.

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

over on `http://localhost:3000/en` we should see our beautifully interpolated banner!

switching the url from `http://localhost:3000/en` to `http://localhost:3000/de` or to any other of your languages you will see the language changes as expected - perfect!

### Final note

When building and running the application, next-i18next expects a `common.json` file in each of the locales. This is where you would put common used tranlsations accross multiple pages. We will not be using this in our app but it is nescerary for running a built version of Next so even though it will remain empty we will still add it to each locale.

```
.
└── static
|   └── locales
|       ├── de
|       |   ├── common.json
|       |   └── homePage.json
...
```
