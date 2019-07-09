import { Link as RouterLink } from '../router';
import { withTranslation } from '../i18n';
import routeMap from '../routes';
import { routes } from '../router';

const Link = ({ path, params = {}, i18n, children }) => {
  // if the path is to the home - there are no translations
  if (path === '/') {
    return <RouterLink route='/'>{children}</RouterLink>;
  }
  // take the current language
  const { language } = i18n;

  // find the translated route
  const translatedRoute = routeMap.find(
    (route) => route.page === path && route.lang === language
  );

  // const translatedRoute = routes.find(
  //   (route) => route.page === path && route.lang === language
  // );

  return (
    <RouterLink route={translatedRoute.name} params={params}>
      {children}
    </RouterLink>
  );
};

export default withTranslation()(Link);
