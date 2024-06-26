import React from "react";
/*************mise en forme du cadre *********************/
export function extractBorderRadius(borderRadius, side) {
	const values = borderRadius.split(" ");

	let bottomRadius;

	if (values.length === 1) {
		bottomRadius = values[0];
	} else if (values.length === 2) {
		bottomRadius = side === "left" ? values[0] : values[1];
	} else if (values.length === 4) {
		bottomRadius = side === "left" ? values[1] : values[3];
	} else {
		console.error("Format non pris en charge");
	}

	return bottomRadius;
}

/**************tableau 7x5 des jours du mois courant ********/
export function createDaysTable({
	weekDays,
	selectDate,
	onDateClick,
	focusStyle,
	dateRange,
}) {
	const daysInMonth = new Date(
		selectDate.getFullYear(),
		selectDate.getMonth() + 1,
		0
	).getDate();
	const firstDayOfMonth = new Date(
		selectDate.getFullYear(),
		selectDate.getMonth(),
		0
	).getDay();
	const table = [];

	let dayDate = 1 - firstDayOfMonth;
	for (let i = 0; i < 6; i++) {
		const week = [];
		for (let j = 0; j < 7; j++) {
			let date;
			if (dayDate <= 0) {
				if (selectDate.getMonth() === 0) {
					const daysInPreviousMonth = new Date(
						selectDate.getFullYear() - 1,
						12,
						0
					).getDate();
					date = new Date(
						selectDate.getFullYear() - 1,
						11,
						daysInPreviousMonth + dayDate
					);
				} else {
					const daysInPreviousMonth = new Date(
						selectDate.getFullYear(),
						selectDate.getMonth(),
						0
					).getDate();
					date = new Date(
						selectDate.getFullYear(),
						selectDate.getMonth() - 1,
						daysInPreviousMonth + dayDate
					);
				}
			} else if (dayDate > daysInMonth) {
				if (selectDate.getMonth() === 11) {
					date = new Date(
						selectDate.getFullYear() + 1,
						0,
						dayDate - daysInMonth
					);
				} else {
					date = new Date(
						selectDate.getFullYear(),
						selectDate.getMonth() + 1,
						dayDate - daysInMonth
					);
				}
			} else {
				date = new Date(
					selectDate.getFullYear(),
					selectDate.getMonth(),
					dayDate
				);
			}
			week.push({ date, day: dayDate });
			dayDate++;
		}
		table.push(week);
	}
	const isCurrentDay = (dd) => {
		return dd.getDate() === selectDate.getDate();
	};

	const isCurrentMonth = (dd) => {
		return dd.getMonth() === selectDate.getMonth();
	};

	const isInRange = (date) => {
		if (dateRange === undefined) {
			return true;
		} else {
			const minDefined = dateRange.min !== undefined;
			const maxDefined = dateRange.max !== undefined;

			if (minDefined && maxDefined) {
				return date >= dateRange.min && date <= dateRange.max;
			} else if (minDefined && !maxDefined) {
				return date >= dateRange.min;
			} else if (!minDefined && maxDefined) {
				return date <= dateRange.max;
			}
		}
	};

	return (
		<div
			className="table-container"
			style={{
				textAlign: "center",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				className="table-head"
				style={{
					width: "100%",
					textAlign: "center",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				{weekDays.map((day, index) => (
					<div key={index} style={{ width: "14.2%" }}>
						{day.charAt(0).toUpperCase() + day.charAt(1).toLowerCase()}
					</div>
				))}
			</div>
			<div
				className="table-body"
				style={{
					width: "100%",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{table.map((week, index) => (
					<div
						className="table-line"
						key={index}
						style={{
							textAlign: "center",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						{week.map((cell, index) => (
							<div
								className="calendar-day"
								key={index}
								onClick={() => {
									isInRange(cell.date) ? onDateClick("d", cell.date) : null;
								}}
								style={{
									width: "14.2%",
									...(!isCurrentMonth(cell.date) ? { color: "lightgray" } : {}),
									...(isCurrentDay(cell.date) && isCurrentMonth(cell.date)
										? focusStyle
										: {}),
									...(!isInRange(cell.date) ? { color: "red" } : {}),
								}}
							>
								{cell.date.getDate()}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

/**************Tableau 4x3 des mois de l'année  *************/
export function createMonthTable({
	monthList,
	selectDate,
	onMonthClick,
	focusStyle,
}) {
	const handleClick = (monthIndex) => {
		let newDate = new Date(selectDate);
		newDate.setMonth(monthIndex);
		onMonthClick(newDate);
	};
	const chunkArray = (arr, size) => {
		const chunkedArray = [];
		for (let i = 0; i < arr.length; i += size) {
			chunkedArray.push(arr.slice(i, i + size));
		}
		return chunkedArray;
	};

	const monthsInRows = chunkArray(monthList, 4);

	return (
		<div className="month-selector">
			{monthsInRows.map((row, rowIndex) => (
				<div
					key={rowIndex}
					className="month-row"
					style={{
						textAlign: "center",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					{row.map((month, columnIndex) => {
						const index = rowIndex * 4 + columnIndex;
						return (
							<div
								key={index}
								style={{
									width: "25%",
									marginTop: "10px",
									...(index === selectDate.getMonth() ? focusStyle : {}),
								}}
								onClick={() => handleClick(index)}
							>
								{month}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

/***************Tableau 5xn des années (-99/+99) ****/
export function createYearTable({
	selectDate,
	dateRange,
	onYearClick,
	scrollToYear,
	focusStyle,
}) {
	const selectYear = selectDate.getFullYear();

	const handleClick = (year) => {
		let newDate = new Date(selectDate);
		newDate.setFullYear(year);
		onYearClick(newDate);
		scrollToYear();
	};
	const generateYearRange = (selectYear, dateRange) => {
		const yearRange = [];
		let minYear =
			dateRange?.min !== undefined
				? dateRange.min.getFullYear()
				: selectYear - 101;
		let maxYear =
			dateRange?.max !== undefined
				? dateRange.max.getFullYear()
				: selectYear + 100;

		for (let i = minYear; i <= maxYear; i++) {
			yearRange.push(i);
		}
		return yearRange;
	};

	const yearRange = generateYearRange(selectYear, dateRange);
	const chunkArray = (arr, size) => {
		const chunkedArray = [];
		for (let i = 0; i < arr.length; i += size) {
			chunkedArray.push(arr.slice(i, i + size));
		}
		return chunkedArray;
	};

	const yearsInRows = chunkArray(yearRange, 5);

	return (
		<div
			className="year-selector"
			id="year-selector"
			style={{ overflow: "auto", maxHeight: "20dvh" }}
		>
			{yearsInRows.map((row, rowIndex) => (
				<div
					key={rowIndex}
					className="year-row"
					style={{
						textAlign: "center",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					{row.map((year, columnIndex) => {
						const isFocused = year === selectYear;
						return (
							<div
								key={year}
								className={isFocused ? "focused-year" : ""}
								id={year}
								style={{
									width: "20%",
									marginTop: "10px",
									...(isFocused ? focusStyle : {}),
								}}
								onClick={() => {
									handleClick(year);
								}}
							>
								{year}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
