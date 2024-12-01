const all_dx = [
  "L0EgY4EomHv.xllqsmDiexq;L0EgY4EomHv.hx5FKOqT18B",
  "L0EgY4EomHv.CCtvT9h1yB4;L0EgY4EomHv.yHQ9LbhuLPh",
  "L0EgY4EomHv.DG9EvDsL801;L0EgY4EomHv.cz6oa275ize;",
  "L0EgY4EomHv.Gf8F7hQqygz;L0EgY4EomHv.osp7h6GLyV8;",
  "L0EgY4EomHv.qaAsAc4DBlE;L0EgY4EomHv.S91BBc2Op9Z;",
  "L0EgY4EomHv.AI5nHnkf5WR;L0EgY4EomHv.GTEknIuyEiO;",
  "L0EgY4EomHv.dE6mw0hXdAt;L0EgY4EomHv.y9zGBpMBAhQ;",
  "L0EgY4EomHv.eDwcbrF4Qsr;L0EgY4EomHv.Eqi1288N8Nd;",
  "L0EgY4EomHv.SyPLRSV1NCn;L0EgY4EomHv.C2zynun5YMh;",
  "L0EgY4EomHv.fqdxmeIjMGq;L0EgY4EomHv.Pwttxh8qzbh;",
  "L0EgY4EomHv.qMEd4h2s2jA;L0EgY4EomHv.Oov8I1ZmXo3;",
  "L0EgY4EomHv.bXy7dRTxSUN;L0EgY4EomHv.yWS9Oc8Dpm7;",
  "L0EgY4EomHv.TbO68eaqTma;L0EgY4EomHv.DTGiBP2EZbm;",
  "L0EgY4EomHv.C54AYCGZ4yz;L0EgY4EomHv.c1PnNx0NfeI;",
  "L0EgY4EomHv.Fjhjy1sAfoH;L0EgY4EomHv.GHiu2Bv4pB2;",
  "L0EgY4EomHv.x93PtyuyJ6P;L0EgY4EomHv.AOB8FXqXfFH;",
  "L0EgY4EomHv.W4oKLRaCF0w;L0EgY4EomHv.Zd72t9Bu4le;",
  "L0EgY4EomHv.Hyaa1lln5gc;L0EgY4EomHv.SFtjfOMOqhC;",
  "L0EgY4EomHv.huimFcUSvAj;L0EgY4EomHv.jKCzLrcr7N1;",
  "L0EgY4EomHv.iZsJfz7LFdn;L0EgY4EomHv.kgDUjmHDJtD;",
  "L0EgY4EomHv.PtedVjCU0X6;L0EgY4EomHv.A6wiJF60Dxq;",
  "L0EgY4EomHv.SAnc2g0SP9n;L0EgY4EomHv.zbBfUQI4mbt;",
  "L0EgY4EomHv.bUcwd5hJBV8;L0EgY4EomHv.qhC2MsiSSKF;",
  "L0EgY4EomHv.mLCpxxrrc9z;L0EgY4EomHv.ZXUtPf4bF6q;",
  "L0EgY4EomHv.k1kP5jCQNLv;L0EgY4EomHv.dwAJpsKxrAo;",
  "L0EgY4EomHv.PpmAQlkz248;L0EgY4EomHv.UzQ1LqhXavz;",
  "L0EgY4EomHv.uQHuVw0nNpf;L0EgY4EomHv.V1lWBXRaFOl;",
  "L0EgY4EomHv.c4GBo8riegZ;L0EgY4EomHv.ExF3BWudPb8;",
  "L0EgY4EomHv.nVK6ORIaHcF;L0EgY4EomHv.t66G9K2yVao;",
  "L0EgY4EomHv.ZF2HH7MwGeW;L0EgY4EomHv.awmjBpXpy58;",
  "L0EgY4EomHv.wIzDqcKjmkN;L0EgY4EomHv.YEU5VICXNwZ;",
  "L0EgY4EomHv.Gxezw4UQoXw;L0EgY4EomHv.AZULo0fgAPA;",
  "L0EgY4EomHv.NnsZ7Yq0ZMl;L0EgY4EomHv.HJCjFyZe3fd;",
  "L0EgY4EomHv.ueeqalP1NnB;L0EgY4EomHv.jObBjI31SHJ;",
  "L0EgY4EomHv.jxfyOMxkbIw;L0EgY4EomHv.U4fdHCMef6x;",
  "L0EgY4EomHv.y3h4wxW3w50;L0EgY4EomHv.XM59B0Lw2Md;",
  "L0EgY4EomHv.w19F9i9XORa;L0EgY4EomHv.SJ0Cvi4jeGy;",
  "L0EgY4EomHv.ispm3X8fxSY;L0EgY4EomHv.DZqf1SBDDqv;",
  "L0EgY4EomHv.c8E0s3lqCmD;L0EgY4EomHv.FOTKm0DKO4Q;",
  "L0EgY4EomHv.iYpP9mXDw1W;L0EgY4EomHv.YIg4eMjDYLg;",
  "L0EgY4EomHv.hRlVw3IeQ45;L0EgY4EomHv.LmGX6VpLkIX;",
  "L0EgY4EomHv.akAYIsCrRwV;L0EgY4EomHv.mPTyd0nP5Xx;",
  "L0EgY4EomHv.m5y4aLbmIOO;L0EgY4EomHv.QteYoL0Yy6K;L0EgY4EomHv.AB4m6KuUXF8;",
];

const getAggregatedData = (year, orgUnit, dataApi) => {
  return dataApi.get(`/api/analytics.json`, { paging: false }, [
    `dimension=pe:${year}&dimension=dx:${all_dx.join(";")};&filter=ou:LEVEL-5;${
      orgUnit.id
    }&displayProperty=NAME`,
  ]);
};

const getOptionDataByDeId = (deId) => async (year, orgUnit, dataApi) =>
  dataApi.get(
    `/api/analytics/events/aggregate/L0EgY4EomHv.json`,
    { paging: false },
    [
      `dimension=pe:${year}&dimension=vY4mlqYfJEH.${deId}&filter=ou:${orgUnit.id}&stage=vY4mlqYfJEH&displayProperty=NAME&outputType=EVENT`,
    ]
  );

const getFamilyRegisteredData = async (year, orgUnit, dataApi) =>
  dataApi.get(
    `/api/analytics/events/aggregate/L0EgY4EomHv.json`,
    { paging: false },
    [
      `dimension=ou:${orgUnit.id}&dimension=pe:${year}&stage=vY4mlqYfJEH&displayProperty=NAME&outputType=ENROLLMENT`,
    ]
  );

const getTotalPopulationData = async (year, orgUnit, dataApi) =>
  dataApi.get(
    `/api/analytics/events/aggregate/L0EgY4EomHv.json`,
    { paging: false },
    [
      `dimension=pe:${year}&dimension=ou:${orgUnit.id}&stage=vY4mlqYfJEH&displayProperty=NAME&outputType=EVENT&value=Va3FC8Io1b0&aggregationType=SUM`,
    ]
  );

export {
  all_dx,
  getAggregatedData,
  getOptionDataByDeId,
  getFamilyRegisteredData,
  getTotalPopulationData,
};
