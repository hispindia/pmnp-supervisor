import { sumByLevel } from "./utils";
import bindDataContext from "./data_context";

const labels = [
  "disabilityInSeeing",
  "disabilityInHearingSpeaking",
  "disabilityInLearning",
  "disabilityInBehaving",
  "disabilityInMovement"
];

const disabilityDEIds = [
  [
    "Gxezw4UQoXw", //seeing
    [
      "x93PtyuyJ6P", // hearing
      "SFtjfOMOqhC" // communicating
    ], // hearing-speaking
    "A6wiJF60Dxq", // learning
    "Hyaa1lln5gc", //behaving
    [
      "V1lWBXRaFOl", // legs/hands
      "PpmAQlkz248", // arms/legs
      "ZXUtPf4bF6q", // tingling on one side of body
      "bUcwd5hJBV8", // remembering or concentrating
      "C54AYCGZ4yz" // abnormal legs
    ] // movement
  ],
  [
    "wIzDqcKjmkN",
    [
      "Fjhjy1sAfoH", // lot hearing
      "huimFcUSvAj" // lot communicating
    ],
    "kgDUjmHDJtD",
    "W4oKLRaCF0w",
    ["UzQ1LqhXavz", "k1kP5jCQNLv", "qhC2MsiSSKF", "SAnc2g0SP9n", "TbO68eaqTma"]
  ],
  [
    "YEU5VICXNwZ",
    [
      "GHiu2Bv4pB2", // fully hearing
      "jKCzLrcr7N1" // fully communicating
    ],
    "PtedVjCU0X6",
    "Zd72t9Bu4le",
    ["uQHuVw0nNpf", "dwAJpsKxrAo", "mLCpxxrrc9z", "zbBfUQI4mbt", "DTGiBP2EZbm"]
  ]
]; // some/lot/fully // some - lot - fully

const calculateAggregatedDisabilityData = data =>
  sumByLevel(2)(bindDataContext(data).getValuesFromDeIds(disabilityDEIds));

export { labels, calculateAggregatedDisabilityData };
