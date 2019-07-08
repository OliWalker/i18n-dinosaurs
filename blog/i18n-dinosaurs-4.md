# A guide to fully internationalising a universal web app.

## Part Four of TODO

### Localising the url paths

One thing in our application that isn't localised is the URL paths. We have an index page, which will obviously be the same in all languages as the url is just `/` however our `/dinousaur` route should be translated to the four languages we support.

To use this we will utilise a package called `next-routes` however, unfortunately, it seems like next-routes is not maintained anymore, so we will use a better maintained fork from `@yolkai` called `@yolkai/next-routes`

```
npm i @yolkai/next-routes
```

The aim is to create a custom router to have translated url slugs point to the correct page in the pages directory.

Lets add a `router.js` file in the top level directory and also a `routes.js`.

The `routes.js` is very simple, it will be the route map for our application. Here, each route needs various properties, required for next-routes are:

1. The page we want to point the route too
2. The url pattern we want to match
3. A name which must be unique

We will also add a `lang` for our own sake later.

so the `routes.js` file should look like:

```
export const routeMap = [
    { page: 'dinosaur', lang: 'en', pattern: '/dinosaur' },
  { page: 'dinosaur', lang: 'de', pattern: '/anwalt' },
  { page: 'dinosaur', lang: 'fr', pattern: '/avocat' },
  { page: 'dinosaur', lang: 'it', pattern: '/avvocato' },
]

```
