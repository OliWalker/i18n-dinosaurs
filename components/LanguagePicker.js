import React from 'react';
import { withTranslation } from '../lib/i18n';

const LanguagePicker = ({ i18n }) => {
	const { language } = i18n; //This gets the current language
	const changeLanguage = (e) => {
		i18n.changeLanguage(e.target.value);
	};
	return (
		<select onChange={changeLanguage} defaultValue={language}>
			<option value="de">De</option>
			<option value="en">En</option>
			<option value="fr">Fr</option>
			<option value="it">It</option>
		</select>
	);
};

export default withTranslation()(LanguagePicker);
