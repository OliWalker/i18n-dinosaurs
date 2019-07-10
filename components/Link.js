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
