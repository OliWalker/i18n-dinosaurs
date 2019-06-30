import React from 'react';
import App, { Container } from 'next/app';
import { appWithTranslation } from '../lib/i18n';

class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		// this exposes query to user in url
		pageProps.query = ctx.query;
		return { pageProps };
	}

	render() {
		const { Component, pageProps } = this.props;
		return (
			<Container>
				<Component {...pageProps} />
			</Container>
		);
	}
}

export default appWithTranslation(MyApp);
