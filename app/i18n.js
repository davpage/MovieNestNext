import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    // Header.js
                    home: 'Home',
                    myData: 'My Data',
                    user: 'User',
                    personalData: 'Personal Data',
                    logout: 'Logout',
                    welcome: 'Welcome',
                    thisIsYourHome: 'This is your home page',

                    // Login.js
                    login: 'Login',
                    verify: 'Verify',
                    email: 'Email',
                    password: 'Password',
                    verificationCode: 'Verification Code',
                    loginButton: 'Log In',
                    verifyButton: 'Verify',
                    loginFailed: 'Login failed',
                    verificationFailed: 'Verification failed',
                    somethingWentWrong: 'Something went wrong',
                    notRegisteredYet: 'Not registered yet?',
                    register: 'Register',

                    // User.js
                    name: 'Name',
                    newPasswordOptional: 'New Password (leave blank if unchanged)',
                    update: 'Update',
                    cancel: 'Cancel',
                    edit: 'Edit',
                    deleteAccount: 'Delete Account',
                    confirmDelete: 'Are you sure you want to delete your account?',
                    fetchUserFailed: 'Failed to fetch user data',
                    updateFailed: 'Failed to update user',
                    deleteFailed: 'Failed to delete account',

                    // Register.js
                    registerButton: 'Register',
                    alreadyRegistered: 'Already registered?',
                    registerFailed: 'Registration failed',

                    // General
                    loading: 'Loading...',
                },
            },
            ru: {
                translation: {
                    // Header.js
                    home: 'Главная',
                    myData: 'Мои данные',
                    user: 'Пользователь',
                    personalData: 'Личные данные',
                    logout: 'Выйти',
                    welcome: 'Добро пожаловать',
                    thisIsYourHome: 'Это ваша домашняя страница',

                    // Login.js
                    login: 'Вход',
                    verify: 'Подтверждение',
                    email: 'Эл. почта',
                    password: 'Пароль',
                    verificationCode: 'Код подтверждения',
                    loginButton: 'Войти',
                    verifyButton: 'Подтвердить',
                    loginFailed: 'Вход не удался',
                    verificationFailed: 'Подтверждение не удалось',
                    somethingWentWrong: 'Что-то пошло не так',
                    notRegisteredYet: 'Ещё не зарегистрированы?',
                    register: 'Зарегистрироваться',

                    // User.js
                    name: 'Имя',
                    newPasswordOptional: 'Новый пароль (оставьте пустым, если не меняете)',
                    update: 'Обновить',
                    cancel: 'Отмена',
                    edit: 'Редактировать',
                    deleteAccount: 'Удалить аккаунт',
                    confirmDelete: 'Вы уверены, что хотите удалить свой аккаунт?',
                    fetchUserFailed: 'Не удалось загрузить данные пользователя',
                    updateFailed: 'Не удалось обновить пользователя',
                    deleteFailed: 'Не удалось удалить аккаунт',

                    // Register.js
                    registerButton: 'Зарегистрироваться',
                    alreadyRegistered: 'Уже зарегистрированы?',
                    registerFailed: 'Регистрация не удалась',

                    // General
                    loading: 'Загрузка...',
                },
            },
            am: {
                translation: {
                    // Header.js
                    home: 'Գլխավոր',
                    myData: 'Իմ տվյալները',
                    user: 'Օգտատեր',
                    personalData: 'Անձնական տվյալներ',
                    logout: 'Դուրս գալ',
                    welcome: 'Բարի գալուստ',
                    thisIsYourHome: 'Սա Ձեր գլխավոր էջն է',

                    // Login.js
                    login: 'Մուտք',
                    verify: 'Հաստատում',
                    email: 'Էլ. հասցե',
                    password: 'Գաղտնաբառ',
                    verificationCode: 'Հաստատման կոդ',
                    loginButton: 'Մուտք գործել',
                    verifyButton: 'Հաստատել',
                    loginFailed: 'Մուտքը ձախողվեց',
                    verificationFailed: 'Հաստատումը ձախողվեց',
                    somethingWentWrong: 'Ինչ-որ բան սխալ է',
                    notRegisteredYet: 'Դեռ գրանցված չե՞ք:',
                    register: 'Գրանցվել',

                    // User.js
                    name: 'Անուն',
                    newPasswordOptional: 'Նոր գաղտնաբառ (թողեք դատարկ, եթե չեք ցանկանում փոխել)',
                    update: 'Թարմացնել',
                    cancel: 'Չեղարկել',
                    edit: 'Խմբագրել',
                    deleteAccount: 'Ջնջել հաշիվը',
                    confirmDelete: 'Հաստատո՞ւմ եք Ձեր հաշիվը ջնջելը:',
                    fetchUserFailed: 'Հաշվի տվյալները բեռնելը ձախողվեց',
                    updateFailed: 'Հաշիվը թարմացնելը ձախողվեց',
                    deleteFailed: 'Հաշիվը ջնջելը ձախողվեց',

                    // Register.js
                    registerButton: 'Գրանցվել',
                    alreadyRegistered: 'Արդեն գրանցվա՞ծ եք:',
                    registerFailed: 'Գրանցումը ձախողվեց',

                    // General
                    loading: 'Բեռնում...',
                },
            },
        },
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
