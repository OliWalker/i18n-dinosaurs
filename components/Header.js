import React from 'react';
import { withTranslation } from '../i18n';
import { Link } from '../router';

const LanguagePicker = ({ i18n }) => {
  const { language } = i18n; //This gets the current language
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <header>
      <Link route='/'>
        <a>
          <h1>Logo</h1>
        </a>
      </Link>

      <select onChange={changeLanguage} defaultValue={language}>
        <option value='de'>De</option>
        <option value='en'>En</option>
        <option value='fr'>Fr</option>
        <option value='it'>It</option>
      </select>
    </header>
  );
};

export default withTranslation('')(LanguagePicker);
