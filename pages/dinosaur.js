import { withTranslation } from '../lib/i18n';
import { data } from '../data';

const dinosaur = ({ t, dinosaur }) => {
	return (
		<div>
			{t('Hello Dinosaurs')} {dinosaur.name}
		</div>
	);
};

dinosaur.getInitialProps = ({ query }) => {
	let error = false;
	const dinosaur = data.find((dino) => dino.name === query.slug);
	if (!dinosaur) error = true;
	return { dinosaur, error };
};

export default withTranslation('common')(dinosaur);
