const CODE_VARIANTS = {
  JS: "JS",
  TS: "TS",
};

const FORM_ACTION_TYPES = {
  ADD_NEW: "ADD_NEW",
  EDIT: "EDIT",
  NONE: "NONE",
};

// Valid languages to server-side render in production
const LANGUAGES = ["en", "zh", "ru", "pt", "es", "fr", "de", "ja"];

// Server side rendered languages
const LANGUAGES_SSR = ["en", "zh", "ru", "pt", "es"];

// Work in progress
const LANGUAGES_IN_PROGRESS = LANGUAGES.slice();

// Valid languages to use in production
const LANGUAGES_LABEL = [
  {
    code: "en",
    text: "English",
  },
  {
    code: "zh",
    text: "中文",
  },
  {
    code: "ru",
    text: "Русский",
  },
  {
    code: "pt",
    text: "Português",
  },
  {
    code: "es",
    text: "Español",
  },
  {
    code: "fr",
    text: "Français",
  },
  {
    code: "de",
    text: "Deutsch",
  },
  {
    code: "ja",
    text: "日本語",
  },
];

const SOURCE_CODE_ROOT_URL = "https://github.com/mui-org/material-ui/blob/next";

const TYPE_OF_ACTION = {
  EQUAL_TO: 'EQUAL_TO',
  EQUAL_NOT: 'EQUAL_NOT'
}

const FAMILY_MEMBER_METADATA_CUSTOMUPDATE = {
  DOB: 'rB3psCPmxwE',
  AGE: 'BaiVwt8jVfg',
  SEX: 'MYaNKVVYIQT',
  CONTECT_NUMBER: 'HyGJqEzbxD4',
  MEMBERSHIP_STATUS: 'cP1EanFicmA',
  TRANFER_TO: 'F6ed0skrJQw',

}

const FAMILY_MEMBER_VALUE = {
  cP1EanFicmA: 'Present',


}
export {
  CODE_VARIANTS,
  FORM_ACTION_TYPES,
  LANGUAGES,
  LANGUAGES_SSR,
  LANGUAGES_LABEL,
  LANGUAGES_IN_PROGRESS,
  SOURCE_CODE_ROOT_URL,
  TYPE_OF_ACTION,
  FAMILY_MEMBER_METADATA_CUSTOMUPDATE,
  FAMILY_MEMBER_VALUE
};
