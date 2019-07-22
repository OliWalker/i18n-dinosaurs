# A guide to building a fully international, universal web app.

- [Part One]('https://google.com')
- [Part Two]('https://google.com')
- [Part Three]('https://google.com')

## Part Four of Four

## pre - note

Here at Ginetta we strive to give our users the best possible web experience. We care a lot about performance and we care more about accessability. Our creations are for everyone to enjoy and a huge part of accessability is crossing the language barrier.

### Localising the url paths

The last thing in our application we need to localize is the URL paths. We have an index page, which will obviously be the same in all languages as the url is just `/` however our `/dinosaur` route should be translated to the four languages we support.

To use this we will utilise a package called `next-routes` however, unfortunately, it seems like next-routes is not maintained anymore, so we will use a better maintained fork from `@yolkai` called `@yolkai/next-routes`

```
npm i @yolkai/next-routes
```

The aim is to create a custom router to take the translated url slugs and point the translated url slugs to the correct page in the pages directory.

Lets add a `nextRouter.js` file in the top level directory and also a `routeMap.js`.

The `routeMap.js` is very simple, it will be where we keep all the translated routes for our application. Here, each route needs various properties, required for next-routes are:

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

Now lets start building out our next-routes router, in the nextRouter.js file lets:

```
const nextRoutes = require('@yolkai/next-routes').default;
const routeMap = require('./routeMap');

// Initialise our next-routes
const nextRoutesRouter = nextRoutes();

// add each route in our routeMap to the next-routes router
routeMap.forEach((route) => nextRoutesRouter.add(route));

module.exports = nextRoutesRouter;

```

Now in our server.js file we must change from the app using the requestHandler to our custom router using getRequestHandler and passing the app to it as an argument.

So if we require our newly created `nextRoutesRouter` in the `server.js` file and then change

```
const handle = app.getRequestHandler();
```

to

```
const handle = nextRoutesRouter.getRequestHandler(app);
```

### Removing the query

Now the url is translated,the query is still `?dinosaur=Tyranasaurus` - we want the localized also. Fortunately another benefit that next-routes adds is we can add a `:id` at the end of a route, making it more similar to traditional routing. Obviously we are not looking for an id but a `dinosaur` so lets add `/:dinosaur` to the end of each pattern in the routes.

eg:

```
  {
    page: 'dinosaur',
    pattern: '/dinosaur/:dinosaur',
    name: 'en-dinosaur',
  },
```

Now if we head to `http://localhost:3000/dinosaur/Tyrannosaurus` everything is looking good.

### Linking

The problem now is that we are using the next-i18next link, which adds the `lang prefix` before the route and the next-i18next link will send out query such as `route?query=query`.

Next-Routes also gives us a Link component, but if we were to use the Next-Routes Link then we would not get the language prefix.

The Solution?

The Next-Routes can take a Link in it's constructor meaning we can pass the next-i18next link when we initialize the next-router and get the benefits of both links!

In the router.js file we can import the next-i18n link component:

```
const { Link } = require ('./i18n').Link
```

and then pass the Link when we initialize next-routes:

```
const nextRoutesRouter = nextRoutes({ Link });
```

then finally wherever we use the Link component (Header.js and DinosaurCard.js) we need to instead import the Link from this router file and instead of using the 'href' property on the link we can use the route property such as:

```
<Link route={`/dinosaur/${dinosaur.name}`}>
```

Everything kinda works but one problem here would be we are always linking to `/dinosaur` and not the translated url slug. Lets fix this by building yet another Link component.

### Our Link component

In the components directory lets create a `Link.js` file and import our router link.

The idea is to create a Link, which will take a `route` string that points to the desired `page` to render and also a `params` prop to pass to the url query. Then we will take this page and the language then use these to look through the routes to find the correctly translated route.

Once we have this we can use a handy "toPath" function which allows us to pass a query to a route and it will give us the full translated URL to link to - cool!

```
import { withTranslation } from '../i18n';

// Here we take our already configured next-routes and link
import { routes, Link as RouterLink } from '../nextRouter';

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

  // nextRoutes "toPath" function allows you pass the params and returns the correct URL
  const newPath = translatedRoute.toPath(params);

  return <RouterLink route={newPath}>{children}</RouterLink>;
};

export default withTranslation()(Link);

```

Now to use this Link we can simply pass the page from the pages directory and also any query params needed and then this Link component will handle which language url to push to.

Lets import our Link into `DinosaurCard.js` and then then change the Link in the to look like

```
<Link path='/dinosaur' params={{ dinosaur: dinosaur.name }}>
```

and in the header to simply

```
<Link path='/'>
```

Due to Packages changing, this may not always work. If for you you are losing the language when linking through the pages, you can interpolate it in the route.

```
<RouterLink route={`/${language}${newPath}}>
```

### Keepin The Languages Aligned

So far everything is looking great, moving around our small, but internationasl app feels almost perfect, however, currently we are able to go to `localhost:3000/it/dinosaur/Tyrannosaurus`. We should not be able to mismatch the url slug with the language prefix.

This wont happen when linking around the app in the client now we have built our Link component which finds the correct path, the only time it will happen will be when manually changing the url - which means we ping the server again. If we are hitting the server this means we are able to `redirect` the client.

The top level `_app.js` component is where we should do this, lets add a function called `redirectForIncorrectLocale` inside the `getInitialProps` method of the `_app`, it will need access to the `ctx` and the `router`, both of which get passed to `_app.getInitialProps` by default:

```
...
class MyApp extends App {
	static async getInitialProps({ Component, ctx, router }) {

		redirectIfIncorrectLocale(ctx, router);
...
```

Lets create this function.

### Redirecting for an incorrect locale

This will have a few steps:

1. first we will check if we are on the home page - i.e no need to redirect as the url is not translated
2. then we must find which route we are currently on
3. once found we must check if the language is correct or not
4. if the language is not correct we must find the correct page
5. and then use the toPath function again to find the correct URL (page & query)
6. and finally redirect to that url.

The finished function should look like:

```
const routes = require('./nextRouter').routes;
const i18n = require('./i18n');

export function redirectIfIncorrectLocale(ctx, router) {

  // if there is no request or we are going home where the url is not translated - do nothing
  if (ctx.req && router.asPath !== '/') {
    // take the language out of the request, or, if first time load, from i18n
    const language = ctx.req === null ? i18n.language : ctx.req.language;
    const { query } = router;

    // check everything to prevent errors
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

      // another check to make sure we are on the server
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

and when importing that into our `_app` and heading to a URL such as `http://localhost:3000/de/dinosauro/Stegosaurus` we should get redirected to the italian version!

### End Note

Now we have a fully translated app. When deploying I have also added a try/catch around the `route.toPath` functions as occasionally they will throw errors in a production environment. Though they do add some code bloat in the examples so I left them off.

We as developers spend a lot of time building our apps and websites, however, unless they are available in multiple languages, we are cutting a huge amount of our user group.

Lets make the web a great place for everybody!

### p.s

All the library used are getting updated all the time (thanks javascript) - drop me a message if you feel any of this content needs an update. It can only get better!
