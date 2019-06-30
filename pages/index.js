import React from 'react';
import { withTranslation, Link } from '../lib/i18n';
import Layout from '../components/Layout';
import Banner from '../components/Banner';
import { data } from '../data';

const Home = () => {
	return (
		<Layout>
			<Banner />
			{data.map((dino) => (
				<Link
					href={{
						pathname: '/dinosaur',
						query: { slug: dino.name },
					}}
				>
					<p>{dino.name}</p>
				</Link>
			))}
		</Layout>
	);
};

Home.getInitialProps = () => {
	return {
		namespacesRequired: ['common', 'banner'],
	};
};

export default withTranslation('common')(Home);
