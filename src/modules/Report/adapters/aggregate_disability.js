import { sumByLevel } from "./utils";
import bindDataContext from "./data_context";

const labels = [
  "disabilityInSeeing",
  "disabilityInHearingSpeaking",
  "disabilityInLearning",
  "disabilityInBehaving",
  "disabilityInMovement",
];

const disabilityDEIds = [
  [
    "Gxezw4UQoXw", //seeing
    [
      "x93PtyuyJ6P", // hearing
      "SFtjfOMOqhC", // communicating
    ], // hearing-speaking
    "A6wiJF60Dxq", // learning
    "Hyaa1lln5gc", //behaving
    [
      "V1lWBXRaFOl", // legs/hands
      "PpmAQlkz248", // arms/legs
      "ZXUtPf4bF6q", // tingling on one side of body
      "bUcwd5hJBV8", // remembering or concentrating
      "C54AYCGZ4yz", // abnormal legs
    ], // movement
  ],
  [
    "wIzDqcKjmkN", // FI: Difficulty seeing, even if wearing glasses? (A Lot)
    [
      "Fjhjy1sAfoH", // lot hearing
      "huimFcUSvAj", // lot communicating
    ],
    "kgDUjmHDJtD", // FI: Difficulty in learning (A lot)
    "W4oKLRaCF0w", // FI: Difficulty in behaving (A lot)
    ["UzQ1LqhXavz", "k1kP5jCQNLv", "qhC2MsiSSKF", "SAnc2g0SP9n", "TbO68eaqTma"],
    // FI: Difficulty moving weakness in legs/hands (A lot)
    // FI: Difficulty moving (without arms/legs) (A lot)
    // FI: Difficulty moving (tingling on one side of body) (A lot)
    // FI: Difficulty in remembering or concentrating (A lot)
    // FI: Difficult moving (abnormal legs) (A lot)
  ],
  [
    "YEU5VICXNwZ", // FI: Difficulty seeing, even if wearing glasses? (Cannot do at all)
    [
      "GHiu2Bv4pB2", // fully hearing
      "jKCzLrcr7N1", // fully communicating
    ],
    "PtedVjCU0X6", // FI: Difficulty in learning (Cannot learn at all)
    "Zd72t9Bu4le", // FI: Difficulty in behaving (Cannot do at all)
    ["uQHuVw0nNpf", "dwAJpsKxrAo", "mLCpxxrrc9z", "zbBfUQI4mbt", "DTGiBP2EZbm"],
    // FI: Difficulty moving weakness in legs/hands (Cannot do at all)
    // FI: Difficulty moving (without arms/legs) (Cannot do at all)
    // FI: Difficulty moving (tingling on one side of body) (Cannot do at all)
    // FI: Difficulty in remembering or concentrating (Cannot do at all)
    // FI: Difficult moving (abnormal legs) (Cannot do at all)
  ],
]; // some/lot/fully // some - lot - fully

const calculateAggregatedDisabilityData = (data) =>
  sumByLevel(2)(bindDataContext(data).getValuesFromDeIds(disabilityDEIds));

export { labels, calculateAggregatedDisabilityData };
