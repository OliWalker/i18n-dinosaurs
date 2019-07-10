const routeMap = [
  {
    page: 'dinosaur',
    pattern: '/dinosaur/:dinosaur',
    name: 'en-dinosaur',
  },
  {
    page: 'dinosaur',
    pattern: '/dinosaurier/:dinosaur',
    name: 'de-dinosaur',
  },
  {
    page: 'dinosaur',
    pattern: '/dinosaure/:dinosaur',
    name: 'fr-dinosaur',
  },
  {
    page: 'dinosaur',
    lang: 'it',
    pattern: '/dinosauro/:dinosaur',
    name: 'it-dinosaur',
  },
];

module.exports = routeMap;
