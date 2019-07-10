import { Link as RouterLink } from '../router';
import { withTranslation } from '../i18n';
import { routes } from '../router';

const Link = ({ path, params = {}, i18n, children }) => {
  // if the path is to the home - there are no translations
  if (path === '/') {
    return <RouterLink route='/'>{children}</RouterLink>;
  }
  // take the current language
  const { language } = i18n;

  const translatedRoute = routes.find(
    (route) => route.page === '/' + path && route.name.startsWith(language)
  );

  const newPath = translatedRoute.toPath(params);

  return <RouterLink route={newPath}>{children}</RouterLink>;
};

export default withTranslation()(Link);
