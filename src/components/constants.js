const CODE_VARIANTS = {
  JS: "JS",
  TS: "TS",
};

const FORM_ACTION_TYPES = {
  ADD_NEW: "ADD_NEW",
  EDIT: "EDIT",
  VIEW: "VIEW",
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

const MOBILE_NUM_REGEX = {
  exp: /^[17]\d{7}$/,
  msg: "Contact number should be of 8 digits starting from 1 or 7;",
};

const TYPE_OF_ACTION = {
  EQUAL_TO: "EQUAL_TO",
  EQUAL_NOT: "EQUAL_NOT",
  MALE: "Male",
  FEMALE: "Female",
  YES: "true",
  NO: "false",
  NEVER_MARRIED: "Never married",
  ACCIDENTAL: "Accidental",
  NEVER: "Never",
};

export const HOUSEHOLD_MEMBER_ID = "Cn37lbyhz6f";
export const HH_STATUS_ATTR_ID = "CNqaoQva9S2";
export const PMNP_ID = "NOKzq4dAKF7";
export const MEMBER_HOUSEHOLD_UID = "RDQQ3t9oXw5";
export const REPORT_ID_CONSTANT = "lfMDT7HdaFh";
export const REPORT_ID_CONSTANT_ATTRIBUTE_ID = "TElcDF7Vzyx";
export const GOV_PROGRAMS_DE_ID = "RC5B8EETrOM";
export const SOCIAL_AND_BEHAVIOR_DE_ID = "gNBFmUFtW6a";

export const MOTHER_CHILD_SECTION = [
  "Z4zfIkKCP7R",
  "VQRxvN71m5l",
  "jswy7SbqErA",
  "zxllKSJ52U1",
  "UjLxTtDk9qc",
  "mt37cOH28F9",
  "uQg4s7Jd8WW",
  "JgHcoI8Vs9v",
  "BdVVPG3a82M",
];
export const HHM2_PRENGENT = ["pxqEppI9NuY", "CszAgcZlA2I", "KfRuikfQldK", "DBKh0M3rsKO"];
export const HHM2_DIABETESDOCTOR_SECTION = [
  "yi3wYvQ9aAt",
  "n5n0yLyVwuA",
  "UkChrCwAdnm",
  "S185gnI1Jyq",
  "ywmbicYTIhw",
  "MY7X9t0l8r3",
];
export const HHM2_BLOODSUGER_MEASERD_SECTION = ["QY3jBX7waUm", ...HHM2_DIABETESDOCTOR_SECTION];
export const HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR = ["ow3jWPZceeS", "lQZCEKfKrvx", "Oi1PtLq78V8"];
export const HHM2_BLOODSUGER_MEASERDBY_DOCTOR = [
  "k0xgunv5thB",
  "RlTylqBRM17",
  "ow3jWPZceeS",
  "lQZCEKfKrvx",
  "Oi1PtLq78V8",
];
export const HHM2_SPORTS_MODERATE_INTENSITY = ["ckV0yOEytlG", "t90UIe4vFSX"];
export const HHM2_INTENSE_SPORTS = ["egLB4q5WL2n", "ZLQF5qBLWlQ"];
export const HHM2_MINS_CYCLING = ["x4rAVIrHNQW", "v6h7EhZw5Ui"];
export const HHM2_MODERATE_EXERTION = ["RoH08osPgJe", "rhOQjp901FX"];
export const HHM2_WORK_RELATED_PHYSICAL_EXERTION = ["I09jWdGQDsn", "NAZ7d8bUbjd"];
export const HHM2_WEEKLY_VEGETABLE_CONSUMTION = ["Nt3mxnRg81J"];
export const HHM2_WEEKLY_FRUIT_CONSUMTION = ["Di8AmkzbgVG"];
export const HHM2_ALCOHOL_CONSUMTION_FREQUENCY = ["kb8mwrpjGGU", "IWmyyzSPchd", "xOAkG4s0XYb", "A4cdhctkNzu"];
export const HHM2_ALCOHAL_CONSUMPTION12_MONTH = [
  "Y8Y097LoIrP",
  "kb8mwrpjGGU",
  "IWmyyzSPchd",
  "xOAkG4s0XYb",
  "A4cdhctkNzu",
];
export const HHM2_ALCOHOL_CONSUMPTION = [
  "Z1AIOXyZEdo",
  "Y68nILE3Hbm",
  "Y8Y097LoIrP",
  "kb8mwrpjGGU",
  "IWmyyzSPchd",
  "xOAkG4s0XYb",
  "A4cdhctkNzu",
  "XbokNSO2zVH",
  "LRWUTlsJIQP",
];
export const HHM2_ARECANUT_CONSUMPTION_FREQUENCY = ["nZgJU0CKihb", "vQUMCUTDtzn", "I064ESZkgag"];
export const HHM2_ARECANUT_CONSUMPTION = [
  "WgCarY7Ko0w",
  "ZcfMOSb2YAW",
  "nZgJU0CKihb",
  "vQUMCUTDtzn",
  "I064ESZkgag",
  "x4Vn8TFDtol",
  "TC0ysGa0ji0",
];
export const HHM2_TABACCO_PRODUCTS_FREQUENCY = ["ZTjoxxpLJRt", "KJ05f4WOeCO", "EKGSw9xQZSC"];
export const HHM2_TOBACCO_PRODUCTS = [
  "DlZeFlKCRGr",
  "fhcVXetFGxn",
  "ZTjoxxpLJRt",
  "KJ05f4WOeCO",
  "EKGSw9xQZSC",
  "TT3KCBECRUZ",
];
export const HHM2_SMOKING_FREQUENCY = ["NJYj8K15jBK", "UzYD7jqOBqp", "l9A9zUdal3y"];
export const HHM2_SMOKED_TOBACCO_PRODUCTS = [
  "ytkIZFQcene",
  "PsY5SWSq583",
  "NJYj8K15jBK",
  "UzYD7jqOBqp",
  "l9A9zUdal3y",
  "gVbtSt6UaCK",
  "w4zA0GSrnY2",
];
export const MORTALITY_INFORMATION = [
  "McJaMbzcxAS",
  "dzeTdP1U1b1",
  "KZbBK7iKP3T",
  "A7UlEPDnV3C",
  "XpnpuBUtcT2",
  "ztinvfhAZnN",
  "Fr5ML76aJNF",
];
export const DEMOGRAPHIC_DETAILS = [
  "ycGbZeG8LeX",
  "LyBiqvOGFGc",
  "zh9y01mPiMD",
  "kcJX2YCBB3v",
  "DPlIkV0XnI8",
  "D8IeOPkU4dF",
  "nxzNOl3Qjwc",
  "R64k3NNm72d",
  "jeDxGYlYBPx",
  "toFNuY0zR2a",
  "pyzd5HgSFPb",
];
export const WG_SORT_SET = [
  "tSkN17334Pz",
  "NsyZ9HTZMMa",
  "DKT4HMi6oSn",
  "ZbunNrGNEx7",
  "jrOVR4fNd3H",
  "jQ83rALANCm",
  "blkMcSWuz4L",
  "KrSqdwQgJoe",
  "e0Tg69b3KDD",
  "ejY7zEReQea",
  "hf97Ye9CrT4",
];
export const PHYSICAL_MEASUREMENT_BLOOD_PRESSURE = ["vWP61ahAkEn"];
export const TOBACCO_USE = [
  "JYX7fyIMwrh",
  "ytkIZFQcene",
  "PsY5SWSq583",
  "NJYj8K15jBK",
  "UzYD7jqOBqp",
  "l9A9zUdal3y",
  "gVbtSt6UaCK",
  "w4zA0GSrnY2",
  "pul07TNK7nX",
  "DlZeFlKCRGr",
  "fhcVXetFGxn",
  "ZTjoxxpLJRt",
  "KJ05f4WOeCO",
  "EKGSw9xQZSC",
  "TT3KCBECRUZ",
  "KLQOqxBSInZ",
  "qaBIOjngXpL",
];
export const AREANUT_CONSUMPTION = ["Tb38VQldkEr", ...HHM2_ARECANUT_CONSUMPTION];
export const FULL_ALCOHAL_CONSUMPTION = [...HHM2_ALCOHOL_CONSUMPTION, "dmBGs4QGUbu"];
export const HHM2_DIET = [
  ...HHM2_WEEKLY_VEGETABLE_CONSUMTION,
  "xl2mqLHkDff",
  ...HHM2_WEEKLY_FRUIT_CONSUMTION,
  "qys7jQQ8Ecs",
];
export const PHYSICAL_ACTIVITY_WORK = [
  "kEL5hSBu6gC",
  ...HHM2_WORK_RELATED_PHYSICAL_EXERTION,
  "T5ph3cF6LtQ",
  ...HHM2_MODERATE_EXERTION,
];
export const PHYSICAL_ACTIVITY_TRAVEL = ["zbQG9VzXEwQ", ...HHM2_MINS_CYCLING];
export const PHYSICAL_ACTIVITY_RECREATIONAL = [
  "vxYznE6Y6NX",
  ...HHM2_INTENSE_SPORTS,
  "vuQ97rrVTZH",
  ...HHM2_SPORTS_MODERATE_INTENSITY,
];
export const HISTORY_RISEDBLOOD_PRESSURE = ["hWWA6W6Vvgf", ...HHM2_BLOODSUGER_MEASERDBY_DOCTOR];
export const HISTORY_OF_DIABETES = ["cMd8GGJgTLT", ...HHM2_BLOODSUGER_MEASERD_SECTION];
export const HISTORY_OF_CHOLESTEROL = [
  "N3aQ8FrbXga",
  "TBo8Lw8Rfis",
  "OJaXOHWDGwU",
  "j8vPhrQ93Ye",
  "aUFofe87M5z",
  "gKEcTk9bVeg",
];
export const HISTORY_OF_CARDIOVASCULAR = ["PBDkdqR3yWo", "eWjobHqRmVR", "En7TKezqhAz"];
export const HEIGHT_WEIGHT = ["iWaeCiMpBV9", "pxqEppI9NuY", "CszAgcZlA2I"];
export const WAISE_HIP_CIRCUMFERENCE = ["KfRuikfQldK", "DBKh0M3rsKO"];

export const BLOOD_PRESSURE_READING1 = ["CMyXmIIL2Pg", "RDXCYFo4Uv8", "kzp9TltHi2M"];
export const BLOOD_PRESSURE_READING2 = ["ZwfMynjw1Ys", "ofyknwue3kI", "JJoDq26kmmy"];
export const BLOOD_PRESSURE_READING3 = ["wEWyO97SUBc", "Bf0l1lc8HdR", "whGSwuEwp6B"];

const defaultProgramTrackedEntityAttributeDisable = ["hDE1WNqTTwF", "BaiVwt8jVfg", "xDSSvssuNFs", "H42aYY9JMIR"];

const FAMILY_MEMBER_METADATA_CUSTOMUPDATE = {
  DOB: "rB3psCPmxwE",
  AGE: "BaiVwt8jVfg",
  SEX: "MYaNKVVYIQT",
  CONTECT_NUMBER: "HyGJqEzbxD4",
  MEMBERSHIP_STATUS: "cP1EanFicmA",
  TRANFER_TO: "F6ed0skrJQw",
  HHM_1_ACTIVITY_LAST6MONTH: "zh9y01mPiMD",
  HHM_1_MORDEN_EDUCATION: "kcJX2YCBB3v",
  HHM_1_ATTENDING_TRADITIONAL_LERNING: "DPlIkV0XnI8",
  HHM_1_TESTEDFOR_CERVICAL_CANCER: "D8IeOPkU4dF",
  HHM_1_TESTED_BREAST_CANCER: "R64k3NNm72d",
  HHM_1_PYLORI_SCREENING: "toFNuY0zR2a",
  HHM_1_LIVE_BIRTH_LASTYEAR: "jswy7SbqErA",
  HHM_1_STILL_BIRTH_LASTYEAR: "zxllKSJ52U1",
  HHM_1_MISCARRIAGE_OR_ABORTION_LASTYEAR: "UjLxTtDk9qc",
  HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR: "nxzNOl3Qjwc",
  HHM_1_LATEST_BREAST_CANCER_LASTYEAR: "jeDxGYlYBPx",
  HHM_1_RECENT_PYLORI_TEST: "pyzd5HgSFPb",
  HHM_1_DIFFICUULTY_SEEING: "NsyZ9HTZMMa",
  HHM_1_DIFFICUULTY_SEEING_GLASSES: "DKT4HMi6oSn",
  HHM_1_DIFFICUULTY_HEARING: "jrOVR4fNd3H",
  HHM_1_DIFFICUULTY_HEARING_WITH_AID: "jQ83rALANCm",
  HHM_1_PLACE_OF_DELIVERY: "mt37cOH28F9",
  HHM_1_PLACE_OF_INCIDENCE: "uQg4s7Jd8WW",
  HHM_1_GLASSES_OR_CONTANT_LENCES: "tSkN17334Pz",
  HHM_1_HEARING_AID: "ZbunNrGNEx7",
  HHM_1_MANNER_OF_DEATH: "KZbBK7iKP3T",
  HHM_1_ACCIDENTAL: "A7UlEPDnV3C",
  HHM_1_42_DAYS_OF_PREGNANCY: "Fr5ML76aJNF",
  HHM_2_PREGNANT: "iWaeCiMpBV9",
  HHM_2_DIABETES_DIAGNOSEDBY_DOCTOR: "QY3jBX7waUm",
  HHM_2_BLOODSUGER_MEASURED: "cMd8GGJgTLT",
  HHM_2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR: "k0xgunv5thB",
  HHM_2_BLOOD_PRESSURE_MEASUREDBY_DOCTOR: "hWWA6W6Vvgf",
  HHM_2_SPORTS_MODERATE_INTENSITY: "vuQ97rrVTZH",
  HHM_2_INTENSE_SPORTS: "vxYznE6Y6NX",
  HHM_2_MINS_CYCLING: "zbQG9VzXEwQ",
  HHM_2_MODERATE_EXERTION: "T5ph3cF6LtQ",
  HHM_2_WORK_RELATED_PHYSICAL_EXERTION: "kEL5hSBu6gC",
  HHM_2_WEEKLY_VEGETABLE_CONSUMTION: "xl2mqLHkDff",
  HHM_2_WEEKLY_FRUIT_CONSUMTION: "qys7jQQ8Ecs",
  HHM_2_ALCOHOL_CONSUMTION_FREQUENCY: "Y8Y097LoIrP",
  HHM_2_ALCOHAL_CONSUMPTION12_MONTH: "Y68nILE3Hbm",
  HHM_2_ALCOHOL_CONSUMPTION: "dmBGs4QGUbu",
  HHM_2_ARECANUT_CONSUMPTION_FREQUENCY: "ZcfMOSb2YAW",
  HHM_2_ARECANUT_CONSUMPTION: "Tb38VQldkEr",
  HHM_2_TABACCO_PRODUCTS_FREQUENCY: "fhcVXetFGxn",
  HHM_2_TOBACCO_PRODUCTS: "pul07TNK7nX",
  HHM_2_SMOKING_FREQUENCY: "PsY5SWSq583",
  HHM_2_SMOKED_TOBACCO_PRODUCTS: "JYX7fyIMwrh",
  HHM_2_NCDMODULE_INDIVIDUAL: "AMuk90nUTfs",
  HHM2_2_AGE_OF_DEATH: "dzeTdP1U1b1",
  HHM2_2_DATE_OF_DEATH: "McJaMbzcxAS",

  CURRENT_MARITAL_STATUS: "ycGbZeG8LeX",
  FIRST_MARRIGE_AGE: "LyBiqvOGFGc",
};

const FAMILY_MEMBER_VALUE = {
  cP1EanFicmA: "Present",
  PRESENT: "Present",
  DEMISE: "Demise",
  TRANSFERRED: "Transferred",
  EX_COUNTRY: "Ex country",
};

export const VACCINE_DATE_DE_IDS = [
  "K37pq3b5Qra",
  "DHXhabUfBHA",
  "i4gomCWd0y9",
  "ew3lMYvyfeV",
  "bsPGbR6F18a",
  "LE5EQiIK7Lz",
  "WfeWZFMoy6E",
  "NL22zOZXlvb",
  "vxIQzyyUq1M",
  "EH1L3NCv2tC",
  "AVpmlIXDUmW",
  "qD6ZrhRMGjk",
  "By0qcLTxEPN",
  "d5WhzyidsX8",
  "jnumk6j4OJ3",
  "kzaCPuPzy6o",
  "PQS3vSrsIBO",
  "EhIlZ6OO8Fu",
];

// const HAS_INITIAN_NOVALUE = ['mt37cOH28F9', 'uQg4s7Jd8WW', 'UjLxTtDk9qc']
const HAS_INITIAN_NOVALUE = ["uQg4s7Jd8WW", "mt37cOH28F9"];

const MIN_MAX_TEXT = {
  CMyXmIIL2Pg: {
    min: 50,
    max: 300,
  },
  RDXCYFo4Uv8: {
    min: 30,
    max: 150,
  },
  kzp9TltHi2M: {
    min: 20,
    max: 300,
  },
};
// const MIN_MAX_TEXT = {
//   ele: ['CMyXmIIL2Pg', 'RDXCYFo4Uv8', 'kzp9TltHi2M'],
//   msg: 'Value range: Minimum 30 and maximum 150!!'
// }

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
  FAMILY_MEMBER_VALUE,
  MOBILE_NUM_REGEX,
  HAS_INITIAN_NOVALUE,
  defaultProgramTrackedEntityAttributeDisable,
  MIN_MAX_TEXT,
};
