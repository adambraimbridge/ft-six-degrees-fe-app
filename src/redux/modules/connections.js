import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { CALL_API, getJSON } from 'redux-api-middleware';
import { createSelector } from 'reselect';
import { API_ROOT, PLACEHOLDER_IMG } from '../../config';
import { extractId } from '../../helpers/uuid';

export const CONNECTIONS_REQUEST = 'CONNECTIONS_REQUEST';
export const CONNECTIONS_SUCCESS = 'CONNECTIONS_SUCCESS';
export const CONNECTIONS_FAILURE = 'CONNECTIONS_FAILURE';

export const SET_ACTIVE_ROOT_CONNECTION = 'SET_ACTIVE_ROOT_CONNECTION';
export const SET_ROOT_CONNECTION = 'SET_ROOT_CONNECTION';
export const RESET_CONNECTIONS = 'RESET_CONNECTIONS';

const getConnections = (state, props) => state.connectionsChain;
const getRootConnection = (state, props) => state.rootConnection;

const fetchConnections = (rootId, key = 'month') => ({
	[CALL_API]: {
		types: [
			CONNECTIONS_REQUEST,
			{
				type: CONNECTIONS_SUCCESS,
				meta: rootId,
				payload: (action, state, res) => res.ok && getJSON(res)
			},
			CONNECTIONS_FAILURE
		],
		method: 'GET',
		endpoint: `${API_ROOT}/connections/${key}/${rootId}`
	}
});

const activeRootConnection = connection => ({
	type: SET_ACTIVE_ROOT_CONNECTION,
	connection
});

const rootConnection = connection => ({
	type: SET_ROOT_CONNECTION,
	connection
});

const getPerson = (personId, people) => {
	return people[`${people.peopleSelector}People`].find(
		c => extractId(c.id) === personId
	);
};

export const loadConnections = rootId => (dispatch, getState) => {
	const key = getState().people.dateRange;
	const rootIds = Object.keys(getState().connections.connectionsChain);
	if (rootId && rootIds.indexOf(rootId) === -1) {
		return Promise.resolve(dispatch(fetchConnections(rootId, key)));
	}
	return Promise.resolve(null);
};

const getActiveRootConnection = (id, connectionsChain) => {
	const haystack = [].concat(...values(connectionsChain));
	return haystack.find(c => extractId(c.person.id) === id);
};

export const setActiveRootConnection = personId => (dispatch, getState) => {
	let rootPerson = getActiveRootConnection(
		personId,
		getState().connections.connectionsChain
	);

	if (!rootPerson) {
		rootPerson = { person: getState().connections.rootConnection };
	}

	return Promise.resolve(dispatch(activeRootConnection(rootPerson)));
};

export const setRootConnection = rootPersonId => (dispatch, getState) => {
	const rootPerson = getPerson(rootPersonId, getState().people);

	if (rootPerson) {
		return Promise.resolve(dispatch(rootConnection(rootPerson)));
	}
};

export const resetConnections = () => dispatch => {
	return Promise.resolve(
		dispatch({
			type: RESET_CONNECTIONS
		})
	);
};

const getNodeProps = node => {
	return {
		id: extractId(node.id),
		label: node.abbrName,
		size: node.isRoot ? 40 : 20,
		shape: 'circularImage',
		image: node.img || PLACEHOLDER_IMG
	};
};
export const getGraphNodes = () => {
	return createSelector(
		[getConnections, getRootConnection],
		(connections, rootConnection) => {
			let graphNodes = [];
			const rootIds = Object.keys(connections);
			rootConnection = { ...rootConnection, isRoot: true };
			rootIds.forEach(rootId => {
				let conns = connections[rootId]
					.map(c => ({
						...c.person,
						isRoot: rootIds.indexOf(extractId(c.person.id)) > -1
					}))
					.map(getNodeProps);
				graphNodes.push(...conns, getNodeProps(rootConnection));
			});
			return [...graphNodes];
		}
	);
};

const getEdges = (node, rootId) => ({
	from: rootId,
	to: extractId(node.id),
	length: 80
});

export const getGraphEdges = () => {
	return createSelector([getConnections], connections => {
		let graphEdges = [];
		const rootIds = Object.keys(connections);
		rootIds.forEach(rootId => {
			let edges = connections[rootId].map(c =>
				getEdges(c.person, rootId)
			);
			graphEdges.push(...edges);
		});
		return [...graphEdges];
	});
};

const initialState = {
	isFetching: false,
	error: '',
	activeRootConnection: {},
	lastActiveRootConnection: {},
	connectionsChain: {},
	rootConnection: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CONNECTIONS_REQUEST:
			if (action.error) {
				return {
					...state,
					isFetching: false,
					error: action.payload.message
				};
			}
			return {
				...state,
				isFetching: true
			};
		case CONNECTIONS_FAILURE:
			return {
				...state,
				isFetching: false,
				error: 'Something went wrong while getting connections'
			};
		case CONNECTIONS_SUCCESS:
			return {
				...state,
				isFetching: false,
				connectionsChain: {
					...state.connectionsChain,
					[action.meta]: isEmpty(action.payload) ? [] : action.payload
				}
			};
		case SET_ACTIVE_ROOT_CONNECTION:
			return {
				...state,
				activeRootConnection: action.connection
			};
		case SET_ROOT_CONNECTION:
			return {
				...state,
				rootConnection: action.connection
			};
		case RESET_CONNECTIONS:
			return {
				...state,
				connectionsChain: [],
				rootConnection: {},
				activeRootConnection: {}
			};
		default:
			return state;
	}
};