import React, { useEffect, useState, useRef, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../slice/newEmployee";

const InputComponent = lazy(() => import("../../component/formInput"));
const DropDownComponent = lazy(() => import("../../component/myDropDown"));
const DatePickerComponent = lazy(() => import("../../component/myDatePicker"));
const MyModal = lazy(() => import("../../component/myModal"));
const SaveButton = lazy(() => import("../../component/saveButton"));

import styles from "./styles.module.css";
import data from "./data.json";
import statesData from "../../assets/lists/states.json";
import departmentsData from "../../assets/lists/departments.json";

function CreateEmployee() {
	const dispatch = useDispatch();
	const newEmployee = useSelector((state) => state.newEmployee);
	const language = useSelector((state) => state.language);
	const today = useSelector((state) => state.date);
	const [isSaveClickable, setIsSaveClickable] = useState(false);
	const [isCheckEmpty, setIsCheckEmpty] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const isEmpty = useRef(false);

	const statesList = statesData.states.map((state) => state.fullName);
	const departmentsList = departmentsData.departments;

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};
	const handleChange = (field, value) => {
		dispatch(updateField({ field, value }));
	};

	const handleSave = () => {
		if (isSaveClickable) {
			console.log("SAVE");
			setIsModalOpen(true);
		} else {
			setIsCheckEmpty(true);
		}
	};

	useEffect(() => {
		if (isCheckEmpty) {
			const timer = setTimeout(() => {
				setIsCheckEmpty(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [isCheckEmpty]);

	const dropdownStyle = {
		labelStyle: { margin: "3px" },
		dropdownStyle: {
			width: "95%",
			padding: "8px 4px",
			margin: "3px",
			borderRadius: "4px",
			border: "1px solid #607c3c",
		},
		dropdownErrorStyle: {
			width: "95%",
			padding: "8px 4px",
			margin: "3px",
			borderRadius: "4px",
			border: "2px solid darkred",
			backgroundColor: "darksalmon",
		},
		focusedStyle: { backgroundColor: "#f7f7da", color: "#607c3c" },
		arrowStyle: { color: "#809c13" },
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.column50}>
					<div className={styles.column100} key={"firstName"}>
						<InputComponent
							label={data[language].labels.firstName}
							regex={new RegExp(data.regex.regexName)}
							errorMessage={data[language].errorMessageName}
							handleChange={(value) => handleChange("firstName", value)}
							isError={isCheckEmpty && newEmployee.firstName === null}
						/>
					</div>
					<div className={styles.column100} key={"lastName"}>
						<InputComponent
							label={data[language].labels.lastName}
							regex={new RegExp(data.regex.regexName)}
							errorMessage={data[language].errorMessageName}
							handleChange={(value) => handleChange("lastName", value)}
							isError={isCheckEmpty && newEmployee.lastName === null}
						/>
					</div>
					<div className={styles.column100} key={"dateOfBirth"}>
						<DatePickerComponent
							language={language}
							datesLabels={data[language].dates}
							label={data[language].labels.dateOfBirth}
							placeholder={data[language].labels.dateFormat}
							defaultDate={today}
							dateRange={{
								min: new Date(new Date(today).setFullYear(new Date(today).getFull() + 2)),
								max: new Date(today),
							}}
							handleChange={(value) => handleChange("dateOfBirth", value)}
							labelStyle={dropdownStyle.labelStyle}
							datePickerStyle={dropdownStyle.dropdownStyle}
							datePickerErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.state === null}
						/>
					</div>
					<div className={styles.column100} key={"startDate"}>
						<DatePickerComponent
							language={language}
							datesLabels={data[language].dates}
							label={data[language].labels.startDate}
							placeholder={data[language].labels.dateFormat}
							defaultDate={today}
							dateRange={{
								min: new Date("1990-01-01"),
								max: new Date(new Date(today).setMonth(new Date(today).getMonth() + 2)),
							}}
							handleChange={(value) => handleChange("startDate", value)}
							labelStyle={dropdownStyle.labelStyle}
							datePickerStyle={dropdownStyle.dropdownStyle}
							datePickerErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.state === null}
						/>
					</div>
				</div>
				<div className={`${styles.column50} ${styles.addressBorder}`}>
					<div className={styles.relativePosTitle}>
						{data[language].labels.address}
					</div>
					<div className={styles.column100} key={"street"}>
						<InputComponent
							label={data[language].labels.street}
							regex={new RegExp(data.regex.regexStreet)}
							errorMessage={data[language].errorMessageStreet}
							handleChange={(value) => handleChange("street", value)}
							isError={isCheckEmpty && newEmployee.street === null}
						/>
					</div>
					<div className={styles.column100} key={"city"}>
						<InputComponent
							label={data[language].labels.city}
							regex={new RegExp(data.regex.regexName)}
							errorMessage={data[language].errorMessageName}
							handleChange={(value) => handleChange("city", value)}
							isError={isCheckEmpty && newEmployee.city === null}
						/>
					</div>
					<div className={styles.column100} key={"state"}>
						<DropDownComponent
							label={data[language].labels.state}
							placeholder={data[language].labels.state + "..."}
							list={statesList}
							handleChange={(value) => handleChange("state", value)}
							labelStyle={dropdownStyle.labelStyle}
							dropdownStyle={dropdownStyle.dropdownStyle}
							dropdownErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.state === null}
						/>
						<div
							className={
								isCheckEmpty && newEmployee.state === null
									? `${styles.warning}`
									: `${styles.hidden}`
							}
						>
							{data[language].errorMessageEmpty}
						</div>
					</div>
					<div className={styles.column100} key={"zipCode"}>
						<InputComponent
							label={data[language].labels.zipCode}
							regex={new RegExp(data.regex.regexZip)}
							errorMessage={data[language].errorMessageZip}
							handleChange={(value) => handleChange("zipCode", value)}
							isError={isCheckEmpty && newEmployee.zipCode === null}
						/>
					</div>
				</div>
			</div>
			<div className={styles.modalPosition} key={"modal"}>
				<MyModal
					modalStyle={""}
					modalTitle={"Title"}
					titleStyle={""}
					modalMessage={"Message"}
					messageStyle={""}
					isModalOpen={isModalOpen}
					closeModal={handleCloseModal}
				/>
			</div>
			<div className={styles.container}>
				<div className={styles.column50}>
					<div className={styles.column100} key={"department"}>
						<DropDownComponent
							label={data[language].labels.department}
							placeholder={data[language].labels.department + "..."}
							list={departmentsList}
							handleChange={(value) => handleChange("department", value)}
							labelStyle={dropdownStyle.labelStyle}
							dropdownStyle={dropdownStyle.dropdownStyle}
							dropdownErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.department === null}
						/>
					</div>
					<div
						className={
							isCheckEmpty && newEmployee.department === null
								? `${styles.warning}`
								: `${styles.hidden}`
						}
					>
						{data[language].errorMessageEmpty}
					</div>
				</div>
				<div className={styles.column50}>
					<div className={styles.column100} key={"saveButton"}>
						<SaveButton
							label={data[language].labels.save}
							isClickable={isSaveClickable}
							handleSave={handleSave}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
export default CreateEmployee;
