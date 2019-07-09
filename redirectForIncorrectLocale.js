const routes = require('./router').routes;
const routeMap = require('./routes');
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

    const theRoute = routes.find((route) => {
      return route.toPath(query) === router.asPath;
    });

    if (theRoute && !theRoute.name.startsWith(language)) {
      const page = theRoute.page.slice(1);
      const newRoute = routeMap.find((route) => {
        route.page === page && router.lang === language;
      });

      console.log('NEWROUTE', newRoute);
    }
  }
}

// 		return
//     const route = routes.find((route) => {
// 				(route) => route.lang === language && route.name ===
// 			);
//       // toPath() will throw in production if the params object is invalid
//       try {
//         return route.toPath(getRouteParams(query)) === pathname;
//       } catch {
//         return false;
//       }
//     });

//     if (route && !route.name.startsWith(language)) {
//       // route.page starts with a '/' so we slice that off
//       const newRoute = getRoute(route.page.slice(1), language);

//       if (ctx.res && newRoute) {
//         const newPath = search
//           ? newRoute.toPath({}) + search
//           : newRoute.toPath(getRouteParams(query));

//         ctx.res.writeHead(301, {
//           Location: `/${language}${newPath}`,
//         });
//         ctx.res.end();
//       }
//     }
//   }
// }
