import { withTranslation, Link } from '../i18n';
import css from '../styles.css';

const DinosaurCard = ({ dinosaur, t }) => {
	return (
		// Let's take the Link out of the index and use it here
		<Link href={{ pathname: '/dinosaur', query: { dinosaur: dinosaur.name } }}>
			<a>
				<div className={css.dinosaurCard}>
					<img src={dinosaur.image} />
					<h2>{t('name', { name: dinosaur.name })}</h2>
					<h3>{t('diet', { diet: dinosaur.diet })}</h3>
				</div>
			</a>
		</Link>
	);
};

export default withTranslation('dinosaurCard')(DinosaurCard);
