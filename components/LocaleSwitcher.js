import React from 'react';
import {useTranslation} from "react-i18next";

const LocaleSwitcher = () => {
    const { i18n} = useTranslation();

    const changeLanguage = (lng) => i18n.changeLanguage(lng);

    return (
            <div className="relative">
                {/* Desktop view: buttons */}
                <div className="hidden min-[450px]:flex space-x-2">
                    {['en', 'ru', 'am'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                i18n.language === lang
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600'
                            }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Mobile view: dropdown */}
                <div className="min-[450px]:hidden">
                    <select
                        value={i18n.language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="px-2 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        {['en', 'ru', 'am'].map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
    );
};

export default LocaleSwitcher;