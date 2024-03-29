import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../slice/language";
import styles from "./styles.module.css";

const LanguageSelect = () => {
	const dispatch = useDispatch();
	const language = useSelector((state) => state.language);
	const [isOpen, setIsOpen] = useState(false);

	const languages = {
		fr: { code: "fr", label: "français" },
		en: { code: "en", label: "english" },
		es: { code: "es", label: "español" },
	};

	const detectBrowserLanguage = () => {
		const userLanguage = navigator.language || navigator.userLanguage;
		const availableLanguages = Object.keys(languages);
		if (availableLanguages.includes(userLanguage)) {
			dispatch(setLanguage(userLanguage));
		} else {
			dispatch(setLanguage("en"));
		}
	};
	useEffect(() => {
		detectBrowserLanguage();
		// eslint-disable-next-line
	}, []);

	const flagClasses = {};
	Object.keys(languages).forEach((lang) => {
		flagClasses[lang] = `flag-${lang}`;
	});

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const selectLang = (lang) => {
		dispatch(setLanguage(lang));
		setIsOpen(false);
	};

	return (
		<>
			<div className={styles.flexRow}>
				<div
					className={`${styles.flag} ${styles[flagClasses[language]]}`}
					onClick={toggleMenu}
				/>
				{isOpen && (
					<>
						{Object.keys(languages).map((langCode) => {
							const lang = languages[langCode];
							if (language === lang.code) {
								return null;
							}
							return (
								<div
									key={lang.code}
									onClick={() => selectLang(lang.code)}
									className={`${styles.miniFlag} ${
										styles[flagClasses[lang.code]]
									}`}
									alt={lang.label}
									title={lang.label}
									style={{ textTransform: "capitalize" }}
								><br/>
									{lang.code}
								</div>
							);
						})}
					</>
				)}
			</div>
		</>
	);
};

export default LanguageSelect;
