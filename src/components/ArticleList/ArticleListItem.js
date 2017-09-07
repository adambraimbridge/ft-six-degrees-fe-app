import React from 'react';
import { segmentId } from '../../config';
import { getArticleUrl } from '../../helpers/connection';
import FtButton from '../Origami/FtButton/FtButton';
import './ArticleListItem.css';

const ArticleListItem = ({ article }) => (
	<div data-o-grid-colspan="12 M6 L4">
		<div className="article-list-item">
			<a
				target="_blank"
				href={`${article.webUrl ||
					getArticleUrl(article.apiUrl)}?segmentId=${segmentId}`}
			>
				{article.title}
			</a>
			<div className="article-list-item-cta">
				<FtButton
					label={'Save to myFT'}
					onClick={e => e.preventDefault()}
				/>
			</div>
		</div>
	</div>
);

export default ArticleListItem;
