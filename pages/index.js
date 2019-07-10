import React from 'react';
import { withTranslation } from '../i18n';
import css from '../styles.css';

import data from '../data';
import Header from '../components/Header';
import DinosaurCard from '../components/DinosaurCard';

const HomePage = ({ t }) => {
  return (
    <>
      <Header />
      <div className={css.banner}>
        <h1>{t('banner')}</h1>
      </div>
      <div className={css.dinosaurList}>
        {data.map((dinosaur) => (
          <DinosaurCard dinosaur={dinosaur} key={dinosaur.name} />
        ))}
      </div>
    </>
  );
};

HomePage.getInitialProps = () => {
  return {
    namespacesRequired: ['homePage'],
  };
};

export default withTranslation('homePage')(HomePage);
