# A guide to fully internationalising a universal web app.

## Part Four of Four

### Localising the url paths

One thing in our application that isn't localised is the URL paths. We have an index page, which will obviously be the same in all languages as the url is just `/` however our `/dinousaur` route should be translated to the four languages we support.

To use this we will utilise a package called `next-routes` however, unfortunately, it seems like next-routes is not maintained anymore, so we will use a better maintained fork from `@yolkai` called `@yolkai/next-routes`

```
npm i @yolkai/next-routes
```

The aim is to create a custom router to have translated url slugs point to the correct page in the pages directory.

Lets add a `router.js` file in the top level directory and also a `routeMap.js`.

The `routeMap.js` is very simple, it will be the route map for our application. Here, each route needs various properties, required for next-routes are:

1. The page we want to point the route too
2. The url pattern we want to match
3. A name which must be unique - we will use the lang and the page

so the `routeMap.js` file should look like:

```
const routeMap = [
  {
    page: 'dinosaur',
    pattern: '/dinosaur',
    name: 'en-dinosaur',
  },
  {
    page: 'dinosaur',
    pattern: '/dinosaurier',
    name: 'de-dinosaur',
  },
  {
    page: 'dinosaur',
    pattern: '/dinosaure',
    name: 'fr-dinosaur',
  },
  {
    page: 'dinosaur',
    pattern: '/dinosauro',
    name: 'it-dinosaur',
  },
];

module.exports = routeMap;

```

Now lets start building out our next-routes router, in the router.js file lets:

```
import nextRoutes from '@yolkai/next-routes';
import { routeMap } from './routeMap';

// Initialise our next-routes
const nextRoutes = nextRoutes();

// add each route in our routeMap to the next-routes router
routeMap.forEach((route) => nextRoutes.add(route));

export default nextRoutes;
```

Now in our server.js file we must change it from the app using the requestHandler, but the router will getRequestHandler and pass the app as an argument.

So if we require our `nextRouter` in the `server.js` file and then change

```
const handle = app.getRequestHandler();
```

to

```
const handle = nextRouter.getRequestHandler(app);
```

and then restart the server we should be able to access the translated dinosaur routes! woo.

### Removing the query

Great! now the url is translated, we notice that the query is still `?dinosaur=Tyranasaurus` - we want the localised too. Fortunately another benefit that next-routes adds is we can add a `:id` at the end of a route, making it more similar to traditional routing. Obviously we are not looking for an id but a `dinosaur` so lets add `/:dinosaur` to the end of each pattern in the routes.

eg:

```
  {
    page: 'dinosaur',
    pattern: '/dinosaur/:dinosaur',
    name: 'en-dinosaur',
  },
```

Now if we head to `http://localhost:3000/dinosaur/Tyrannosaurus` then we are in business!

TODO : NEXT 9?

### Linking

The problem now is that we are using the next-i18next link, which adds the `lang prefix` before the route and the next-i18next link will send out query such as `route?query=query`.

Next-Routes also gives us a Link component, but if we were to use the Next-Routes Link then we would not get the language prefix :TODO thinkingface:

The Solution?

The Next-Routes can take a Link in the Constructor! so we can pass the next-i18next link when we initalise the next-router and get bothe benefits!

In the router.js file lets

```
const { Link } = require ('./i18n).Link
```

and then pass the Link when we initialise next-routes

```
const nextRoutesRouter = nextRoutes({ Link });
```

then finally wherever we use the Link comonent (Header.js and DinosaurCard.js) we need to instead import the Link from this router file and instead of using the 'href' property on the link we can use the route property like

```
<Link route={`/dinosaur/${dinosaur.name}`}>
```

Everything kinda works but one problem here would be we are always linking to `/dinosaur` and not the translated url slug. Lets fix this by building yet another Link component.

### Our Link component

So we have the Link from Next.js, the Link from next-i18next which both get passed to the Link from Next-Routes, we deffinately need another one.

in Components lets create a `Link.js` file and import our router link.

The idea is to create a Link, which will take a `route` string that points to the desired `page` to render and also a `params` prop to pass to the url query. Then we will take this page and the language then use these to look through the routes to find the correctly translated route.

Once we have this we can use a handy "toPath" function which allows us to pass a query to a route and it will give us the full URL to link to - cool!

```
import { Link as RouterLink } from '../router';
import { withTranslation } from '../i18n';

// Here we take our already configured next-routes
import { routes } from '../router';

const Link = ({ path, params = {}, i18n, children }) => {
  // if the path is to the home - there are no translations
  if (path === '/') {
    return <RouterLink route='/'>{children}</RouterLink>;
  }
  // take the current language
  const { language } = i18n;

  // Find the correct route based on page and the correct language
  const translatedRoute = routes.find(
    (route) => route.page === path && route.name.startsWith(language)
  );

  // nextRoutes gives a handy "toPath" function
  // where you pass the params and it spits out the correct URL
  const newPath = translatedRoute.toPath(params);

  return <RouterLink route={newPath}>{children}</RouterLink>;
};

export default withTranslation()(Link);
```

Cool! and now to use this Link we can simply pass the page from the pages directory and also any query params needed and then boom, this Link component will handle which language url to push to!

Lets change the Link in the `DinosaurCard.js` to look like

```
<Link path='/dinosaur' params={{ dinosaur: dinosaur.name }}>
```

and in the header to simply

```
<Link path='/'>
```

### Icing on the cake

So far everything is looking great, moving around our small, but international app feel perfect, however, currently we are able to go to `localhost:3000/it/dinosaur/Tyrannosaurus`. We should not be able to mismatch the url slug with the language prefix.

This wont happen when linking around the app now we have build our magic Language finder Link component, the only time it will happen will be when manually changing the url - which will go back a hit the server one more time... Aha, if we are hitting the server we can just `redirect` the client!

The top level `_app.js` component is where we shall do this, lets add a function called `redirectForIncorrectLocale` inside the `getInitialProps` method of the \_app, it will need access to the `ctx` and the `router`, both of which get passed to `_app.getInitialProps` by default - perfect. Your \_app should look like:

```
...
class MyApp extends App {
	static async getInitialProps({ Component, ctx, router }) {

		redirectIfIncorrectLocale(ctx, router);
...
```

and now lets create this function.

### Redirecting for an incorrect locale

This will have a few stages:

1. first we will check if we are on the home page - i.e no need to redirect as the url is not translated
2. then we must find which route we are on
3. once found we must check if the language is correct or not
4. if the language is not correct we must find the correct route
5. and then use the toPath function again to find the correct URL
6. and finally redirect to that url.

The finished function should look like:

```
const routes = require('./router').routes;
const i18n = require('./i18n');

export function redirectIfIncorrectLocale(ctx, router) {
  //console.log(router.asPath, router);

  // if there is no request or we are going home where the url is not tranlsated - do nothing
  if (ctx.req && router.asPath !== '/') {
    // take the language out of the request, or, if first time load, from i18n
    const language = ctx.req === null ? i18n.language : ctx.req.language;
    const { query } = router;

    // just a check to stop any wierd errors
    if (!query || !router.asPath) return;

    // find our current route
    const currentRoute = routes.find(
      (route) => route.toPath(query) === router.asPath
    );

    // check if the route is with the correct lang
    if (currentRoute && !currentRoute.name.startsWith(language)) {
      // find the route to the same page, with the correct lang
      const newRoute = routes.find(
        (route) =>
          route.page === currentRoute.page && route.name.startsWith(language)
      );

      // use the toPath to get the exact path
      const path = newRoute.toPath(query);

      // another check to stop wierd errors
      if (ctx.res && newRoute) {
        // redirect
        ctx.res.writeHead(301, {
          Location: `/${language}${path}`,
        });
        ctx.res.end();
      }
    }
  }
}
```

and when importing that into our `_app` and heading to a URL such as `http://localhost:3000/de/dinosauro/Stegosaurus` we should get redirected to the italian version! Perfect!

### End Note

Now we have a fully translated app. When deploying I have also added a try/catch around the `route.toPath` functions as occasionally they will throw errors in a production enviroment.

TODO write more stuff
