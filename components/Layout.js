import React from 'react';
import LanguagePicker from './LanguagePicker';

const Layout = ({ children }) => (
	<>
		<header>
			<LanguagePicker />
		</header>
		<main>{children}</main>
		<footer>Footer</footer>
	</>
);

export default Layout;
