# A guide to fully internationalising a universal web app.

## Part Two of Four

### Clean-up

In the previous part we set-up our translations and even translated some strings from our app, however eagle-eyed dev's might notice we have some errors in the terminal - lets fix these!

It states that we have not declared a namespace array, so lets declare this.

Next pages have a special asynchronous function called `getInitialProps` - this means any data required for the page to be rendered can be prefetched, meaning on SSR you send all required data to the client - this also includes translations.

We must declare which translation JSON files for the page, and all sub-components (this will be important later), on the page level `getInitialProps`. Under our HomePage component let's add:

```
HomePage.getInitialProps = () => {
  return {
    namespacesRequired: ['homePage']
  };
};
```

Great! The error message is gone, and - more importantly we have specified which json files we need, so we dont send all of them (less data to client = faster load times) and also prevented a flicker of untranslated content, which can happen on larger apps since the json data is not ssr, but only availiable when the client is hydrated.

Sometimes we will get error messages in the terminal about not having namespaces for our Error Page - to solve this simply create an `_error.js` in the pages directory and add:

```
import Error from 'next/error';
import { withTranslation } from '../lib/i18n';

const ErrorPage = () => <Error />;

ErrorPage.getInitialProps = () => {
  return {
    namespacesRequired: [],
  };
};

export default withTranslation('')(ErrorPage);
```

### Adding CSS

TODO

### Changing languages

It is essential that we have a way to change languages, we cannot rely on the client to manually change the url as it is poor UX - and also it would hit the server again meaning a refresh of all page data.

Lets build a language picker!

```
mkdir components && cd components && touch Header.js
```

The header will be super simple, a "logo" and a language picker. It will also be wrapped in the withTranslation HOC - which gives us access to our i18n instance. From this we can find the current language and also have the ability to change the language of the page!

```
import { withTranslation } from '../lib/i18n';

const LanguagePicker = ({ i18n }) => {
  const { language } = i18n; //This gets the current language
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <header>
      <h1>Logo</h1>

      <select onChange={changeLanguage} defaultValue={language}>
        <option value="de">De</option>
        <option value="en">En</option>
        <option value="fr">Fr</option>
        <option value="it">It</option>
      </select>
    </header>
  );
};

export default withTranslation('')(LanguagePicker);
```

And if we import this and use it in our index page we can change languages on the fly - cool!

### Linking between pages

To change pages, first we need another page to go to. The premise of the app is on the home page we will get a list of dinosaurs to choose from, and by clicking on one, you got to the dinosaur page where you can see more info about that particular dinosaurs

First we will add some well known dinosaurs to our index page, and Link them to the dinosaur page, which we will create after.

We import the Link component from our `i18n instance` as we will need to use this link instead of the native `next/link` to keep the language functionality.

Our home page should now look like

```
...

import { withTranslation, Link } from '../lib/i18n';

const HomePage = ({ t }) => {
  return (
    <>
    <Header />
    <div>
      <h1>{t('banner')}</h1>
    </div>
    <div>

      <Link>
        <a>
          Tyranosaurus
        </a>
      </Link>

      <Link>
        <a>
          Velocoraptor
        </a>
      </Link>

    </div>
    <>
    );
};
...
```

The Link component takes an object as the `href` prop, which has a `pathname` string and a `query` object which is not required. We will pass our Link the pathname of `dinosaur` the page we are about to create, and the `query` of the `name: yourChosenDinosaurName`. eg

```
<Link href={{ pathname: '/dinosaur', query: { dinosaur: 'Tyrannosaurus' } }}>
  ...
```

To be able to access the dinosaur query param in the dinosaur page we must perform a little bit of magic in the `_app` component to pass on the query in the url to the page.

```
import App, { Container } from 'next/app';
import { appWithTranslation } from '../lib/i18n';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    // create a default pageProps object
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // this allows us to access the query in url on the page
    pageProps.query = ctx.query;
    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default appWithTranslation(MyApp);
```

So here we are using the `_app.getInitialProps` to take the url query off the Next Context and passing it to the page. This means we can create a `pages/dinosaur.js` with access to the dinosaur query we are linking to from the homePage!

```
import { withTranslation } from '../i18n'
import Header from '../components/Header'

const Dinosaur = ({t, dinosaur}) => {
  return (
    <>
    <Header />
    <h1>{t('myNameIs ', {dinosaur})} </h1>
    </>
  )
}

// query is what we pass down from pagePros in _app
Dinosaur.getInitialProps = ({ query }) => {
  const {dinosaur} = query;

  // pass dinosaur as a prop to the page
  return {
    dinosaur,
    namespacesRequired: ['dinosaur']
    }
}

export default withTranslation('dinosaur')(Dinosaur)
```

Cool! so we should be able to have access to the Dinosaur from the URL and are even passing it to the translation function!

This means we can create a new Json file - `static/locales/en/json` - for each language and are able to interpolate the variable into the translation string such as

```
{
  "myNameIs": "I am a {{dinosaur}} - rawr"
}
```

Since we updated the json we must reload the server, and for good measure lets wrap the "Logo" with a Link from our `i18n instance` to be able to navigate back:

```
<Link href='/'>LOGO</Link>
```

and we should have a navigatable, translated Application!
