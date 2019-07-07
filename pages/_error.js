import React from 'react';
import Error from 'next/error';
import { withTranslation } from '../i18n';

const ErrorPage = () => <Error />;

ErrorPage.getInitialProps = () => {
	return {
		namespacesRequired: [],
	};
};

export default withTranslation('')(ErrorPage);
