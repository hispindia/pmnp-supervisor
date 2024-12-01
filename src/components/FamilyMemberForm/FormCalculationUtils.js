import moment from "moment";

const calculateAge = (year, month, day, curEvent) => {
  var today = moment(curEvent.occurredAt);

  var birth = moment([year, month, day]);
  var current = birth.clone();

  var years = today.diff(current, "years");
  current.add(years, "years");

  var months = today.diff(current, "months");
  current.add(months, "months");

  var days = today.diff(current, "days");
  current.add(days, "days");

  return {
    value: birth.format("YYYY-MM-DD"),
    years: years,
    months: months,
    days: days,
  };
};

const calcAgeFromDOB = (dateOfBirth, birthYear, age, curEvent, t) => {
  var returnResult = "";
  // var allowedDateFormats = ["DD/MM/YYYY", "YYYY-MM-DD"];
  var allowedDateFormats = ["YYYY-MM-DD"];
  let yrText = t ? t("year") : "yr";
  let monthText = t ? t("month") : "month";

  if (dateOfBirth) {
    var raw = null;
    for (var dateFormat of allowedDateFormats) {
      if (moment(dateOfBirth, dateFormat, true).isValid()) {
        raw = moment(`${dateOfBirth}`, dateFormat);
        break;
      } else {
        raw = moment(`${dateOfBirth}`);
        break;
      }
    }

    var data = calculateAge(raw.year(), raw.month(), raw.date(), curEvent);

    var result = "";
    // Age
    result += data.years + " " + yrText + " ";
    // Month
    if (data.months > 0) {
      result += data.months + " " + monthText + " ";
    }

    return result;
  }

  if (birthYear) {
    var data = calculateAge(birthYear, "01", "01", curEvent);
    var result = "";
    // Age
    result += data.years + " " + yrText + " ";
    // Month
    if (data.months > 0) {
      result += data.months + " " + monthText + " ";
    }

    return result;
  }

  // Legacy code, should be removed
  if (age != "" && age != null) {
    var result = "";
    result += age + " " + yrText + " ";
    return result;
  }

  return returnResult;
};
const calculateDataElements = [
  // "bXy7dRTxSUN",
  // "Pwttxh8qzbh",
  // "qMEd4h2s2jA",
  // "SyPLRSV1NCn",
  // "Oov8I1ZmXo3",
  // "C2zynun5YMh",
  // "fqdxmeIjMGq",
  // "HJCjFyZe3fd",
  // "ueeqalP1NnB",
  // "NnsZ7Yq0ZMl",
  // "AZULo0fgAPA",
  // "jObBjI31SHJ",
  // "Eqi1288N8Nd",
  // "eDwcbrF4Qsr",
  // "hx5FKOqT18B",
  // "xllqsmDiexq",
  // "cz6oa275ize",
  // "DG9EvDsL801",
  // "S91BBc2Op9Z",
  // "qaAsAc4DBlE",
  // "yHQ9LbhuLPh",
  // "CCtvT9h1yB4",
  // "osp7h6GLyV8",
  // "Gf8F7hQqygz",
  // "GTEknIuyEiO",
  // "AI5nHnkf5WR",
  // "y9zGBpMBAhQ",
  // "dE6mw0hXdAt",
  // "SHCRzRWFaii",
  // "PFwymX0Io0y",
  // "Va3FC8Io1b0",
];

const calculateAgeGroup = (data, currentEvent) => {
  var mapping = {
    [`value["ethnicity"] ==="ລາວ" ||value["ethnicity"] ==="ຜູ້ໄທ" ||value["ethnicity"] ==="ໄຕ" ||value["ethnicity"] ==="ລື້" ||value["ethnicity"] ==="ຍວນ" ||value["ethnicity"] ==="ຢັ້ງ" ||value["ethnicity"] ==="ແຊກ" ||value["ethnicity"] ==="ໄທເໜືອ" ||value["ethnicity"] ==="Lao" ||value["ethnicity"] ==="Phouthai" ||value["ethnicity"] ==="Tai" ||value["ethnicity"] ==="Lue" ||value["ethnicity"] ==="Nyouan" ||value["ethnicity"] ==="Nyung" ||value["ethnicity"] ==="Sek" ||value["ethnicity"] ==="Thai-nua"`]:
      "HJCjFyZe3fd",
    [`value["ethnicity"] ==="ກຶມມຸ" ||value["ethnicity"] ==="ໄປຣ" ||value["ethnicity"] ==="ຊິງມູນ" ||value["ethnicity"] ==="ຜ້ອງ" ||value["ethnicity"] ==="ແທ່ນ" ||value["ethnicity"] ==="ເອີດູ" ||value["ethnicity"] ==="ບິດ" ||value["ethnicity"] ==="ລະເມດ" ||value["ethnicity"] ==="ສາມຕ່າວ" ||value["ethnicity"] ==="ກະຕ່າງ" ||value["ethnicity"] ==="ມະກອງ" ||value["ethnicity"] ==="ຕຣີ" ||value["ethnicity"] ==="ຢຣຸ" ||value["ethnicity"] ==="ຕຣຽງ" ||value["ethnicity"] ==="ຕະໂອ້ຍ" ||value["ethnicity"] ==="ແຢະ" ||value["ethnicity"] ==="ເບຣົາ" ||value["ethnicity"] ==="ກະຕູ" ||value["ethnicity"] ==="ຮາຮັກ" ||value["ethnicity"] ==="ໂອຍ" ||value["ethnicity"] ==="ກຣຽງ" ||value["ethnicity"] ==="ເຈັງ" ||value["ethnicity"] ==="ສະດ່າງ" ||value["ethnicity"] ==="ຊ່ວຍ" ||value["ethnicity"] ==="ຍະເຫີນ" ||value["ethnicity"] ==="ລະວີ" ||value["ethnicity"] ==="ປະໂກະ" ||value["ethnicity"] ==="ຂະແມ່" ||value["ethnicity"] ==="ຕຸ້ມ" ||value["ethnicity"] ==="ງວນ" ||value["ethnicity"] ==="ມ້ອຍ" ||value["ethnicity"] ==="ກຣີ" ||value["ethnicity"] ==="ບຣູ" ||value["ethnicity"] ==="Khmou" ||value["ethnicity"] ==="Prai" ||value["ethnicity"] ==="Xingmoun" ||value["ethnicity"] ==="Phong" ||value["ethnicity"] ==="Then" ||value["ethnicity"] ==="Oeu-dou" ||value["ethnicity"] ==="Bid" ||value["ethnicity"] ==="Lamed" ||value["ethnicity"] ==="Samtao" ||value["ethnicity"] ==="Ka-tang" ||value["ethnicity"] ==="Makong" ||value["ethnicity"] ==="Tri" ||value["ethnicity"] ==="Nyrou" ||value["ethnicity"] ==="Triang" ||value["ethnicity"] ==="Ta-oy" ||value["ethnicity"] ==="Nyeh" ||value["ethnicity"] ==="Brao" ||value["ethnicity"] ==="Katou" ||value["ethnicity"] ==="Harak" ||value["ethnicity"] ==="Oy" ||value["ethnicity"] ==="Kriang" ||value["ethnicity"] ==="Cheng" ||value["ethnicity"] ==="Sadang" ||value["ethnicity"] ==="Xouay" ||value["ethnicity"] ==="Nyaheun" ||value["ethnicity"] ==="Lavi" ||value["ethnicity"] ==="Pako" ||value["ethnicity"] ==="Kha-meh" ||value["ethnicity"] ==="Toum" ||value["ethnicity"] ==="Ngouan" ||value["ethnicity"] ==="Moy" ||value["ethnicity"] ==="Kri" ||value["ethnicity"] ==="Brou"`]:
      "ueeqalP1NnB",
    [`value["ethnicity"] ==="ມົ້ງ" ||value["ethnicity"] ==="ອີວມຽນ" ||value["ethnicity"] ==="Hmong" ||value["ethnicity"] ==="Eio-miang"`]:
      "NnsZ7Yq0ZMl",
    [`value["ethnicity"] ==="ອາຄາ" ||value["ethnicity"] ==="ພູນ້ອຍ" ||value["ethnicity"] ==="ລາຫູ" ||value["ethnicity"] ==="ສີລາ" ||value["ethnicity"] ==="ຮາຍີ" ||value["ethnicity"] ==="ໂລໂລ" ||value["ethnicity"] ==="ຫໍ້" ||value["ethnicity"] ==="Akha" ||value["ethnicity"] ==="Phou-noy" ||value["ethnicity"] ==="Lahou" ||value["ethnicity"] ==="Sila" ||value["ethnicity"] ==="Hayi" ||value["ethnicity"] ==="Lolo" ||value["ethnicity"] ==="Ho"`]:
      "AZULo0fgAPA",
    [`value["ethnicity"] === "Others" || value["ethnicity"] === "ອື່ນໆ"`]:
      "jObBjI31SHJ",

    [`value["insurance"] === "a"`]: "bXy7dRTxSUN",
    [`value["insurance"] === "b"`]: "Pwttxh8qzbh",
    [`value["insurance"] === "c"`]: "qMEd4h2s2jA",
    [`value["insurance"] === "d"`]: "SyPLRSV1NCn",
    [`value["insurance"] === "e"`]: "Oov8I1ZmXo3",
    [`value["insurance"] === "f"`]: "C2zynun5YMh",
    [`value["insurance"] === "g"`]: "fqdxmeIjMGq",

    [`parseInt(evalValue["age"].split(" ")[0]) < 1 && value["sex"] === "M"`]:
      "Eqi1288N8Nd",
    [`parseInt(evalValue["age"].split(" ")[0]) < 1 && value["sex"] === "F"`]:
      "eDwcbrF4Qsr",
    [`parseInt(evalValue["age"].split(" ")[0]) === 1 && value["sex"] === "M"`]:
      "hx5FKOqT18B",
    [`parseInt(evalValue["age"].split(" ")[0]) === 1 && value["sex"] === "F"`]:
      "xllqsmDiexq",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=2 && parseInt(evalValue["age"].split(" ")[0]) <= 4) && value["sex"] === "M"`]:
      "cz6oa275ize",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=2 && parseInt(evalValue["age"].split(" ")[0]) <= 4) && value["sex"] === "F"`]:
      "DG9EvDsL801",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=5 && parseInt(evalValue["age"].split(" ")[0]) <= 14) && value["sex"] === "M"`]:
      "S91BBc2Op9Z",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=5 && parseInt(evalValue["age"].split(" ")[0]) <= 14) && value["sex"] === "F"`]:
      "qaAsAc4DBlE",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=15 && parseInt(evalValue["age"].split(" ")[0]) <= 44) && value["sex"] === "M"`]:
      "yHQ9LbhuLPh",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=15 && parseInt(evalValue["age"].split(" ")[0]) <= 44) && value["sex"] === "F"`]:
      "CCtvT9h1yB4",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=45 && parseInt(evalValue["age"].split(" ")[0]) <= 49) && value["sex"] === "M"`]:
      "osp7h6GLyV8",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=45 && parseInt(evalValue["age"].split(" ")[0]) <= 49) && value["sex"] === "F"`]:
      "Gf8F7hQqygz",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=50 && parseInt(evalValue["age"].split(" ")[0]) <= 59) && value["sex"] === "M"`]:
      "GTEknIuyEiO",
    [`(parseInt(evalValue["age"].split(" ")[0]) >=50 && parseInt(evalValue["age"].split(" ")[0]) <= 59) && value["sex"] === "F"`]:
      "AI5nHnkf5WR",
    [`parseInt(evalValue["age"].split(" ")[0]) >= 60 && value["sex"] === "M"`]:
      "y9zGBpMBAhQ",
    [`parseInt(evalValue["age"].split(" ")[0]) >= 60 && value["sex"] === "F"`]:
      "dE6mw0hXdAt",
    [`value["sex"] === "M"`]: "SHCRzRWFaii",
    [`value["sex"] === "F"`]: "PFwymX0Io0y",
    // true: "Va3FC8Io1b0",
  };

  var tempValues = calculateDataElements.reduce((acc, value) => {
    acc[value] = 0;
    return acc;
  }, {});

  data.forEach((value) => {
    // Calculate from dob
    let res = calcAgeFromDOB(
      value["DOB"],
      value["birthyear"],
      value["age"],
      currentEvent,
      null
    );
    var evalValue1 = { age: res };
    Object.entries(mapping).forEach((m) => {
      if (
        eval(
          `let value = ${JSON.stringify(
            value
          )} ; let evalValue = ${JSON.stringify(evalValue1)};` +
            m[0] +
            `&& value["status"] !== "dead"`
        ) &&
        // Skip all if member is dead
        eval(
          `let value = ${JSON.stringify(value)};` + `value["status"] !== "dead"`
        )
      ) {
        tempValues[m[1]] = tempValues[m[1]] + 1;
      }
    });
  });

  return tempValues;
};

export {
  calculateAgeGroup,
  calculateAge,
  calcAgeFromDOB,
  calculateDataElements,
};
