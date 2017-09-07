import React, { Component } from 'react';
import {
	PageTitle,
	MobileViewSelector,
	ConnectionsGraph,
	RelatedContent
} from '../../components';

class ConnectionsMobileView extends Component {
	constructor(props) {
		super(props);
		this.connectionsClickHandler = this.connectionsClickHandler.bind(this);
		this.storiesClickHandler = this.storiesClickHandler.bind(this);
		this.contentTabClickHandler = this.contentTabClickHandler.bind(this);
		this.state = {
			activeView: 'connections',
			activeStoriesTitle: ''
		};
	}

	connectionsClickHandler() {
		this.setState(() => {
			return {
				activeView: 'connections',
				activeStoriesTitle: ''
			};
		});
	}

	storiesClickHandler() {
		this.setState(() => {
			return {
				activeView: 'stories'
			};
		});
	}

	contentTabClickHandler(title) {
		this.setState(() => {
			return {
				activeStoriesTitle: title
			};
		});
	}

	render() {
		const { titleText, graph, onNodeClick, tabsData, loading } = this.props;
		const { activeView, activeStoriesTitle } = this.state;
		return (
			<div style={{ height: '100%' }}>
				{activeView === 'connections' ? (
					<PageTitle>{titleText}</PageTitle>
				) : activeView === 'stories' ? (
					<PageTitle>
						{activeStoriesTitle ||
							tabsData[tabsData.length - 1].title}
					</PageTitle>
				) : (
					''
				)}
				<MobileViewSelector
					onConnectionsClick={this.connectionsClickHandler}
					onStoriesClick={this.storiesClickHandler}
					activeView={activeView}
				/>
				<ConnectionsGraph
					activeView={activeView}
					loading={loading}
					graph={graph}
					onNodeClick={onNodeClick}
				/>
				<RelatedContent
					onTabClick={this.contentTabClickHandler}
					activeView={activeView}
					hideTitle={true}
					tabsData={tabsData}
				/>
			</div>
		);
	}
}

export default ConnectionsMobileView;
