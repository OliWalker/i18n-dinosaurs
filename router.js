const nextRoutes = require('@yolkai/next-routes').default;
const routeMap = require('./routes');
const Link = require('./i18n').Link;

// Initialise our next-routes
const nextRoutesRouter = nextRoutes({ Link });

// add each route in our routeMap to the next-routes router
routeMap.forEach((route) => nextRoutesRouter.add(route));

module.exports = nextRoutesRouter;
