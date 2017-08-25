import React from 'react';
import { FtButton } from '../../components';
import { PEOPLE_SELECTOR, PEOPLE_DATE_RANGE } from '../../config';
import './PeopleFilter.css';

const PeopleFilterContainer = ({
	dateRange,
	peopleSelector,
	peopleSelectorChange,
	peopleDateRangeChange
}) => {
	const selectorClickHandler = val => e => {
		e.preventDefault();
		peopleSelectorChange(val);
	};
	return (
		<div className="people-filter-wrapper">
			<form className="people-filter-form">
				<fieldset>
					<legend>FILTER</legend>
					<div
						className="people-filter-section"
						data-o-grid-colspan="6"
					>
						<div className="people-filter-label">
							Select people that appear
						</div>
						<div data-colspan="6" className="o-buttons__group">
							{Object.keys(PEOPLE_SELECTOR).map(key => {
								const label = PEOPLE_SELECTOR[key]['LABEL'];
								const value = PEOPLE_SELECTOR[key]['VAL'];
								return (
									<FtButton
										key={key}
										selected={peopleSelector === value}
										label={label}
										className="o-buttons"
										onClick={selectorClickHandler(value)}
									/>
								);
							})}
						</div>
					</div>
					<div
						className="people-filter-section"
						data-o-grid-colspan="6"
					>
						<div className="people-filter-label">from the last</div>
						<div className="o-buttons__group">
							{PEOPLE_DATE_RANGE.map(r => {
								return (
									<FtButton
										key={r}
										label={r}
										selected={dateRange === r}
										className="o-buttons"
										onClick={e => {
											e.preventDefault();
											peopleDateRangeChange(r);
										}}
									/>
								);
							})}
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	);
};

export default PeopleFilterContainer;