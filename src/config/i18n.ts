import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// demo
// https://codesandbox.io/s/1zxox032q?file=/src/app.js
const context = (require as any).context("../", true, /\.i18n.ts$/);
const modalFiles = context.keys();
const resources = modalFiles.map((ele: string) => {
  return context(ele).default;
});
const transMap: {
  [key: string]: {
    translations: { [key: string]: string };
  };
} = {};
resources.forEach(
  (ele: {
    [key: string]: {
      translations: { [key: string]: string };
    };
  }) => {
    Object.keys(ele).forEach((lan) => {
      if (!transMap[lan]) {
        transMap[lan] = {
          translations: {},
        };
      }
      transMap[lan].translations = {
        ...transMap[lan].translations,
        ...ele[lan].translations,
      };
    });
  }
);
console.log(transMap);
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: transMap,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    ns: ["translations"],
    defaultNS: "translations",
  });
//   .init({
//     resources: {
//       en: {
//         translations: {
//           'To get started, edit <1>src/App.js</1> and save to reload.':
//             'To get started, edit <1>src/App.js</1> and save to reload.',
//           'Welcome to React': 'Welcome to React and react-i18next',
//           welcome: 'Hello <br/> <strong>World</strong>',
//         },
//       },
//       zh: {
//         translations: {
//           'To get started, edit <1>src/App.js</1> and save to reload.':
//             'Starte in dem du, <1>src/App.js</1> editierst und speicherst.',
//           'Welcome to React': 'Willkommen bei React und react-i18next',
//         },
//       },
//     },
//     fallbackLng: 'en',
//     debug: true,

//     // have a common namespace used around the full app

//     keySeparator: false, // we use content as keys

//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;
