import {CONFIG} from '../config-constants';

export default {
    ajaxCallsInProgress: 0,
    sentences: [],
    loginState: false,
    hint: CONFIG.TEXT.HINT.SELECT_PERSON,
    dateRange: CONFIG.TEXT.DATE_RANGE.MONTH,
    peopleRange: 10, // 1, 5, 10, 20
    peopleGroup: CONFIG.TEXT.PEOPLE_GROUP.MENTIONED,
    peopleData: [],
    legend: {
        topLabel: '',
        bottomLabel: '',
        inner: null
    },
    user: null
};