import { withTranslation } from '../lib/i18n';

const Dinosaurs = ({ t }) => {
	return <div>{t('Hello Dinosaurs')}</div>;
};

export default withTranslation('common')(Dinosaurs);
