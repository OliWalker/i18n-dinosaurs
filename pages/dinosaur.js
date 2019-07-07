import { withTranslation } from '../i18n';
import Header from '../components/Header';
import data from '../data';
import css from '../styles.css';

const dinosaur = ({ t, dinosaur }) => {
	return (
		<>
			<Header />
			<img src={dinosaur.image} className={css.dinosaurImg} />
			<div className={css.dinosaurContent}>
				<h1>{t('dinosaur:myNameIs', { dinosaur: dinosaur.name })} </h1>
				<div>
					<p>
						<span>{t('dinosaurCard:diet')}:</span>
						{dinosaur.diet}
					</p>
					<p>
						<span>{t('dinosaur:length')}:</span>
						{dinosaur.length}
					</p>
					<p>
						<span>{t('dinosaur:weight')}:</span>
						{dinosaur.weight}
					</p>
				</div>
				<p>{dinosaur.info}</p>
			</div>
		</>
	);
};

dinosaur.getInitialProps = ({ query }) => {
	const { dinosaur } = query;
	const dino = data.find((dino) => dino.name === dinosaur);
	return {
		dinosaur: dino,
		namespacesRequired: ['dinosaur', 'dinosaurCard'],
	};
};

export default withTranslation(['dinosaur', 'dinosaurCard'])(dinosaur);
