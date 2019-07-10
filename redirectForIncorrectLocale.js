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
