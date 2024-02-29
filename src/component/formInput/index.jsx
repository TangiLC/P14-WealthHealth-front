import React, { useState, useEffect } from "react";

import styles from "./styles.module.css";

const InputComponent = ({ label, regex, errorMessage, handleChange }) => {
	
	const [inputValue, setInputValue] = useState("");
	const [showErrorMessage, setShowErrorMessage] = useState(false);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		if (regex.test(value)) {
			setShowErrorMessage(false);
			handleChange(value);
		} else {
			setShowErrorMessage(true);
		}
	};

	return (
		<div>
			<div className={styles.label}>
				<label>{label}</label>
			</div>
			<div>
				<input
					type="text"
					className={showErrorMessage ? styles.errorInput : styles.input}
					value={inputValue}
					onChange={handleInputChange}
				/>
			</div>
			<div className={styles.error}>
				{showErrorMessage ? <span>{errorMessage}</span> : <span>&nbsp;</span>}
			</div>
		</div>
	);
};
export default InputComponent;
