import React from 'react';
import MediaQuery from 'react-responsive';
import { breakpoints } from '../../config';
import './PageTitle.css';

const { M } = breakpoints;
let style = {};

const PageTitle = ({ children }) => {
	return (
		<MediaQuery minWidth={M}>
			{matches => {
				if (matches) {
					style = {
						fontSize: '24px',
						padding: '30px 15px'
					};
				}
				return (
					<h1 className="page-title" style={style}>
						{children}
					</h1>
				);
			}}
		</MediaQuery>
	);
};

export default PageTitle;
