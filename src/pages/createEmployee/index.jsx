import React, { useEffect, useState, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetFields } from "../../slice/newEmployee";

import InputComponent from "../../component/formInput";
import DropDownComponent from "../../component/myDropDown";
import DatePickerComponent from "../../component/myDatePicker";
import MyModal from "../../component/myModal";
import SaveButton from "../../component/saveButton";
import whLogo from "../../assets/images/WH_logo.webp";

import { addEmployee } from "../../utils/utils";

import styles from "./styles.module.css";
import data from "../data.json";
import statesData from "../../assets/lists/states.json";
import departmentsData from "../../assets/lists/departments.json";
import { fetchEmployeesList } from "../../slice/employeesList";

function CreateEmployee() {
	const dispatch = useDispatch();
	const newEmployee = useSelector((state) => state.newEmployee);
	const language = useSelector((state) => state.language);
	const today = useSelector((state) => state.date);
	const [isSaveClickable, setIsSaveClickable] = useState(false);
	const [isCheckEmpty, setIsCheckEmpty] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [addEmployeeResult, setAddEmployeeResult] = useState({
		success: false,
		error: "",
	});

	const logo = () => {
		return (
			<div>
				<img src={whLogo} width="35px" height="35px" alt="Wealth Health" />
			</div>
		);
	};
	const statesList = statesData.states.map((state) => state.fullName);
	const departmentsList = departmentsData.departments;

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		setIsModalOpen(false);
		setIsSaveClickable(false);
	}, []);

	useEffect(() => {
		const isDataFull = Object.values(newEmployee).every(
			(value) => value !== null
		);
		setIsSaveClickable(isDataFull);
	}, [newEmployee]);

	const handleChange = (field, value) => {
		dispatch(updateField({ field, value }));
		if (field === "state") {
			const stateInfo = data.states.find((state) => state.name === value);
			const shortName = stateInfo ? stateInfo.abbreviation : "N/A";
			handleChange("shortState", shortName);
		}
	};

	useEffect(() => {
		setModalMessage(
			addEmployeeResult.success
				? data[language].modalSuccess
				: data[language].modalFail + addEmployeeResult.error
		);
	}, [addEmployeeResult]);

	const handleSave = async () => {
		if (isSaveClickable) {
			//console.log("SAVE", newEmployee);
			const addResult = await addEmployee(newEmployee);
			setAddEmployeeResult(addResult);
			setIsModalOpen(true);
			if (addResult.success) {
				dispatch(fetchEmployeesList());
				dispatch(resetFields());
			}
		} else {
			setIsCheckEmpty(true);
		}
	};

	useEffect(() => {
		if (isCheckEmpty) {
			const timer = setTimeout(() => {
				setIsCheckEmpty(false);
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [isCheckEmpty]);

	const createRangeDate = (initDate, years, months, days) => {
		let newDate = new Date(initDate);
		newDate.setFullYear(newDate.getFullYear() + years);
		newDate.setMonth(newDate.getMonth() + months);
		newDate.setDate(newDate.getDate() + days);
		return newDate;
	};

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
							initVal={newEmployee.firstName}
							errorMessage={data[language].errorMessageName}
							handleChange={(value) => handleChange("firstName", value)}
							isError={isCheckEmpty && newEmployee.firstName === null}
						/>
					</div>
					<div className={styles.column100} key={"lastName"}>
						<InputComponent
							label={data[language].labels.lastName}
							regex={new RegExp(data.regex.regexName)}
							initVal={newEmployee.lastName}
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
							defaultDate={createRangeDate(today, -12, 0, 0)}
							dateRange={{
								min: createRangeDate(today, -99, 0, 0),
								max: createRangeDate(today, -12, 0, 0),
							}}
							handleChange={(value) => handleChange("dateOfBirth", value)}
							labelStyle={dropdownStyle.labelStyle}
							datePickerStyle={dropdownStyle.dropdownStyle}
							datePickerErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.dateOfBirth === null}
							errorMessage={data[language].errorMessageDate}
						/>
					</div>
					{/*<div>&nbsp;</div>*/}
					<div className={styles.column100} key={"startDate"}>
						<DatePickerComponent
							language={language}
							datesLabels={data[language].dates}
							label={data[language].labels.startDate}
							placeholder={data[language].labels.dateFormat}
							defaultDate={today}
							dateRange={{
								min: new Date("1990-01-01"),
								max: createRangeDate(today, 0, 2, 0),
							}}
							handleChange={(value) => handleChange("startDate", value)}
							labelStyle={dropdownStyle.labelStyle}
							datePickerStyle={dropdownStyle.dropdownStyle}
							datePickerErrorStyle={dropdownStyle.dropdownErrorStyle}
							focusedStyle={dropdownStyle.focusedStyle}
							arrowStyle={dropdownStyle.arrowStyle}
							isError={isCheckEmpty && newEmployee.startDate === null}
							errorMessage={data[language].errorMessageDate}
						/>
					</div>
					{/*<div>&nbsp;</div>*/}
				</div>
				<div className={`${styles.column50} ${styles.addressBorder}`}>
					<div className={styles.relativePosTitle}>
						{data[language].labels.address}
					</div>
					<div className={styles.column100} key={"street"}>
						<InputComponent
							label={data[language].labels.street}
							regex={new RegExp(data.regex.regexStreet)}
							initVal={newEmployee.street}
							errorMessage={data[language].errorMessageStreet}
							handleChange={(value) => handleChange("street", value)}
							isError={isCheckEmpty && newEmployee.street === null}
						/>
					</div>
					<div className={styles.column100} key={"city"}>
						<InputComponent
							label={data[language].labels.city}
							regex={new RegExp(data.regex.regexName)}
							initVal={newEmployee.city}
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
							initVal={newEmployee.zipCode}
							errorMessage={data[language].errorMessageZip}
							handleChange={(value) => handleChange("zipCode", value)}
							isError={isCheckEmpty && newEmployee.zipCode === null}
						/>
					</div>
				</div>
			</div>
			<div className={styles.modalPosition} key={"modal"}>
				<MyModal
					modalStyle={{
						border: "2px solid #abc32f",
						boxShadow: "2px 2px 3px #607c3c",
						padding: "0px",
					}}
					modalTitle={
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-evenly",
							}}
						>
							{logo()}
							<div style={{ paddingTop: "5px" }}>
								{data[language].modalTitle}
							</div>
							<div>{logo()}</div>
						</div>
					}
					titleStyle={{ backgroundColor: "#abc32f", padding: "5px" }}
					modalMessage={modalMessage}
					messageStyle={{ padding: "10px" }}
					closeStyle={{ backgroundColor: "#607c3c" }}
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
