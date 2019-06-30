import React from 'react';
import { withTranslation } from '../lib/i18n';
import Layout from '../components/Layout';
import Banner from '../components/Banner';

const Home = () => {
	return (
		<Layout>
			<Banner />
		</Layout>
	);
};

Home.getInitialProps = () => {
	return {
		namespacesRequired: ['common', 'banner'],
	};
};

export default withTranslation('common')(Home);
