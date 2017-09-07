import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import isEqual from 'lodash/isEqual';
import graphOptions from './graphOptions';
import './ConnectionsGraph.css';

class ConnectionsGraph extends Component {
	constructor() {
		super();
		this.setNetworkInstance = this.setNetworkInstance.bind(this);
	}

	setNetworkInstance(nw) {
		this.network = nw;
	}

	componentDidUpdate() {
		const nw = this.network;
		clearTimeout(this.time);
		nw.on('stabilized', () => {
			nw.fit();
		});
		this.time = setTimeout(() => {
			nw.stopSimulation();
		}, 3000);
	}

	shouldComponentUpdate(nextProps) {
		return (
			!isEqual(nextProps.graph, this.props.graph) ||
			nextProps.activeView !== this.props.activeView
		);
	}

	render() {
		let style = {
			width: '100%',
			autoSize: true,
			height: '500px'
		};
		const { loading, graph, onNodeClick, activeView } = this.props;
		const graphClassName =
			activeView && activeView !== 'connections' ? 'hidden' : '';
		if (activeView) {
			style = { ...style, height: '400px' };
		}

		return (
			<div className={graphClassName}>
				<div className="connections-graph">
					{loading ? (
						<div>Loading...</div>
					) : (
						<Graph
							style={style}
							graph={graph}
							options={graphOptions}
							events={onNodeClick}
							getNetwork={this.setNetworkInstance}
						/>
					)}
				</div>
			</div>
		);
	}
}

ConnectionsGraph.PropTypes = {
	loading: PropTypes.bool.isRequired,
	graph: PropTypes.shape({
		nodes: PropTypes.arrayOf(PropTypes.object),
		edges: PropTypes.arrayOf(PropTypes.object)
	}).isRequired,
	onNodeClick: PropTypes.func.isRequired
};

export default ConnectionsGraph;
