import React from 'react';
import { withTranslation } from '../lib/i18n';

const Banner = ({ t }) => {
	return <div>{t('Learn About Dinosaurs')}</div>;
};

export default withTranslation('banner')(Banner);
