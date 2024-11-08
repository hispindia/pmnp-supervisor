import { generateUid } from "@/utils";

export const createFakeData = () => {
  const familyTeiId = generateUid();
  const familyEnrId = generateUid();

  const memberIds = [1, 2, 3, 4, 5, 6].reduce((acc, i) => {
    const d = {
      teiId: generateUid(),
      enrId: generateUid(),
      eventId: generateUid(),
    };

    acc[`member${i}`] = d;
    return acc;
  }, {});

  const template = {
    enrs: [
      {
        updatedAt: "2024-11-08",
        program: "L0EgY4EomHv",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: familyTeiId,
        incidentDate: "2024-12-31",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: familyEnrId,
        enrolledAt: "2024-12-31",
        occurredAt: "2024-12-31",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member1.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member1.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member2.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member2.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member3.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member3.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member4.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member4.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member5.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member5.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
      {
        updatedAt: "2024-11-08",
        program: "xvzrp56zKvI",
        orgUnit: "Q3PHpzrZzn8",
        trackedEntityType: "MCPQUTHX1Ze",
        trackedEntity: memberIds.member6.teiId,
        incidentDate: "2024-06-30",
        isOnline: 0,
        isFollowUp: 0,
        isDeleted: 0,
        enrollment: memberIds.member6.enrId,
        enrolledAt: "2024-06-30",
        occurredAt: "2024-06-30",
        status: "ACTIVE",
        events: [],
      },
    ],
    events: [
      {
        event: memberIds.member1.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member1.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member1.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "Z9a4Vim1cuJ",
            value: "primary-school",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "1999",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "head",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "a2",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "M",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
      {
        event: memberIds.member2.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member2.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member2.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "Z9a4Vim1cuJ",
            value: "secondary-school",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "2017",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "children",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "a2",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "M",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
      {
        event: memberIds.member3.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member3.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member3.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "Z9a4Vim1cuJ",
            value: "bachelor",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "1997",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "children",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "d",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "S",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
      {
        event: memberIds.member4.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member4.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member4.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "hV0pAEbJqZj",
            value: "active",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "1981",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "relatives",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "a2",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "S",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
      {
        event: memberIds.member5.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member5.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member5.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "Z9a4Vim1cuJ",
            value: "secondary-school",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "1990",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "children",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "a2",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "S",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
      {
        event: generateUid(),
        eventStatus: "ACTIVE",
        isOnline: 0,
        program: "L0EgY4EomHv",
        programStage: "vY4mlqYfJEH",
        enrollment: familyEnrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: familyTeiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "HJCjFyZe3fd",
            value: 6,
          },
          {
            dataElement: "yHQ9LbhuLPh",
            value: 3,
          },
          {
            dataElement: "SHCRzRWFaii",
            value: 3,
          },
          {
            dataElement: "Va3FC8Io1b0",
            value: 6,
          },
          {
            dataElement: "oC9jreyd9SD",
            value: `{"dataVals":[{"id":${memberIds.member1.teiId},"firstname":"FamilyFirstName","lastname":"FamilyLastName","sex":"M","ethnicity":"ລາວ","birthyear":"1999","nationality":"lao","agetype":"birthyear","relation":"head","education":"primary-school","insurance":"a2","maritalstatus":"M"},{"id":${memberIds.member2.teiId},"firstname":"twoo","lastname":"twoo","sex":"F","ethnicity":"ໄຕ","birthyear":"2017","nationality":"others","agetype":"birthyear","relation":"children","education":"secondary-school","insurance":"a2","maritalstatus":"M"},{"id":${memberIds.member5.teiId},"firstname":"five","lastname":"five","sex":"M","ethnicity":"ໄຕ","birthyear":"1990","nationality":"others","agetype":"birthyear","newFamilyBookNum":"dasd","covidNum":"asd","policeNum":"123","phoneNum":"12312","relation":"children","education":"secondary-school","insurance":"a2","maritalstatus":"S"},{"id":${memberIds.member3.teiId},"firstname":"three","lastname":"three","sex":"F","ethnicity":"ຜູ້ໄທ","birthyear":"1997","nationality":"others","agetype":"birthyear","relation":"children","education":"bachelor","insurance":"d","maritalstatus":"S"},{"id":${memberIds.member4.teiId},"firstname":"four","lastname":"four","sex":"M","ethnicity":"ຍວນ","birthyear":"1981","nationality":"others","status":"active","agetype":"birthyear","DOB":null,"relation":"relatives","insurance":"a2","maritalstatus":"S"},{"id":${memberIds.member6.teiId},"isNew":true,"sex":"F","firstname":"six","lastname":"six","relation":"relatives","ethnicity":"ຜູ້ໄທ","nationality":"lao","education":"secondary-school","insurance":"a2","maritalstatus":"S","agetype":"birthyear","birthyear":"2021","DOB":null,"age":null,"status":"active"}]}`,
          },
          {
            dataElement: "qaAsAc4DBlE",
            value: 1,
          },
          {
            dataElement: "PFwymX0Io0y",
            value: 3,
          },
          {
            dataElement: "SyPLRSV1NCn",
            value: 1,
          },
          {
            dataElement: "CCtvT9h1yB4",
            value: 1,
          },
          {
            dataElement: "DG9EvDsL801",
            value: 1,
          },
        ],
        deleted: 0,
      },
      {
        event: generateUid(),
        eventStatus: "ACTIVE",
        isOnline: 0,
        program: "L0EgY4EomHv",
        programStage: "vY4mlqYfJEH",
        enrollment: familyEnrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: familyTeiId,
        occurredAt: "2024-12-31",
        dueDate: "2024-12-31",
        dataValues: [
          {
            dataElement: "HJCjFyZe3fd",
            value: 6,
          },
          {
            dataElement: "yHQ9LbhuLPh",
            value: 3,
          },
          {
            dataElement: "SHCRzRWFaii",
            value: 3,
          },
          {
            dataElement: "Va3FC8Io1b0",
            value: 6,
          },
          {
            dataElement: "qaAsAc4DBlE",
            value: 1,
          },
          {
            dataElement: "PFwymX0Io0y",
            value: 3,
          },
          {
            dataElement: "SyPLRSV1NCn",
            value: 1,
          },
          {
            dataElement: "CCtvT9h1yB4",
            value: 1,
          },
          {
            dataElement: "DG9EvDsL801",
            value: 1,
          },
        ],
        deleted: 0,
      },
      {
        event: memberIds.member6.eventId,
        isOnline: 0,
        program: "xvzrp56zKvI",
        programStage: "Ux1dcyOiHe7",
        enrollment: memberIds.member6.enrId,
        orgUnit: "Q3PHpzrZzn8",
        trackedEntity: memberIds.member6.teiId,
        occurredAt: "2024-06-30",
        dueDate: "2024-06-30",
        dataValues: [
          {
            dataElement: "Z9a4Vim1cuJ",
            value: "secondary-school",
          },
          {
            dataElement: "kf8isugsc3x",
            value: "2021",
          },
          {
            dataElement: "u0Ke4EXsIKZ",
            value: "relatives",
          },
          {
            dataElement: "vbBhehiwNLV",
            value: "a2",
          },
          {
            dataElement: "xXybyxfggiE",
            value: "S",
          },
          {
            dataElement: "xvLv4LQGQuT",
            value: "birthyear",
          },
          {
            dataElement: "ig2YSpQdP55",
            value: familyTeiId,
          },
        ],
        deleted: 0,
      },
    ],
    teis: [
      {
        trackedEntity: memberIds.member1.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member1.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member1.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
          },
          {
            attribute: "DmuazFb368B",
            value: "M",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "FamilyLastName",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "FamilyFirstName",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "lao",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "1999",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ລາວ",
          },
          {
            attribute: "tQeFLjYbqzv",
          },
          {
            attribute: "W4aInCTn8p5",
          },
          {
            attribute: "rSETgSvyVpJ",
          },
          {
            attribute: "PYgXM3R2TQd",
          },
          {
            attribute: "g9wNk1T3MLE",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
      {
        trackedEntity: familyTeiId,
        trackedEntityType: "fG88PiaPoiN",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "L0EgY4EomHv",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntity: familyTeiId,
            incidentDate: "2024-12-31",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: familyEnrId,
            enrolledAt: "2024-12-31",
            occurredAt: "2024-12-31",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BUEzQEErqa7",
            value: "2024",
            valueType: "TEXT",
            displayName: "Registered Year",
          },
          {
            attribute: "xbwURy2jG2K",
            value: "9999",
            valueType: "TEXT",
            displayName: "Unit of Village",
          },
          {
            attribute: "W8WZcI1SUjC",
            value: "9999",
            valueType: "TEXT",
            displayName: "House number",
          },
          {
            attribute: "rzGghDo5ipI",
            value: "Residence",
            valueType: "TEXT",
            displayName: "Residence status",
          },
          {
            attribute: "AiwUJOsOC86",
            value: "true",
            valueType: "BOOLEAN",
            displayName: "Family registered",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "FamilyFirstName",
            valueType: "TEXT",
            displayName: "First name",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "FamilyLastName",
            valueType: "TEXT",
            displayName: "Last name",
          },
        ],
      },
      {
        trackedEntity: memberIds.member2.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member2.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member2.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
          },
          {
            attribute: "DmuazFb368B",
            value: "F",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "twoo",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "twoo",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "others",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "2017",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ໄຕ",
          },
          {
            attribute: "tQeFLjYbqzv",
          },
          {
            attribute: "W4aInCTn8p5",
          },
          {
            attribute: "rSETgSvyVpJ",
          },
          {
            attribute: "PYgXM3R2TQd",
          },
          {
            attribute: "g9wNk1T3MLE",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
      {
        trackedEntity: memberIds.member3.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member3.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member3.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
          },
          {
            attribute: "DmuazFb368B",
            value: "F",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "three",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "three",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "others",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "1997",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ຜູ້ໄທ",
          },
          {
            attribute: "tQeFLjYbqzv",
          },
          {
            attribute: "W4aInCTn8p5",
          },
          {
            attribute: "rSETgSvyVpJ",
          },
          {
            attribute: "PYgXM3R2TQd",
          },
          {
            attribute: "g9wNk1T3MLE",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
      {
        trackedEntity: memberIds.member4.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member4.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member4.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
            value: null,
          },
          {
            attribute: "DmuazFb368B",
            value: "M",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "four",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "four",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "others",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "1981",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
            value: "active",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ຍວນ",
          },
          {
            attribute: "tQeFLjYbqzv",
            value: null,
          },
          {
            attribute: "W4aInCTn8p5",
          },
          {
            attribute: "rSETgSvyVpJ",
          },
          {
            attribute: "PYgXM3R2TQd",
          },
          {
            attribute: "g9wNk1T3MLE",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
      {
        trackedEntity: memberIds.member5.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member5.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member5.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
          },
          {
            attribute: "DmuazFb368B",
            value: "M",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "five",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "five",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "others",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "1990",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ໄຕ",
          },
          {
            attribute: "tQeFLjYbqzv",
          },
          {
            attribute: "W4aInCTn8p5",
            value: "dasd",
          },
          {
            attribute: "rSETgSvyVpJ",
            value: "asd",
          },
          {
            attribute: "PYgXM3R2TQd",
            value: "123",
          },
          {
            attribute: "g9wNk1T3MLE",
            value: "12312",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
      {
        trackedEntity: memberIds.member6.teiId,
        trackedEntityType: "MCPQUTHX1Ze",
        enrollments: [
          {
            updatedAt: "2024-11-08",
            program: "xvzrp56zKvI",
            orgUnit: "Q3PHpzrZzn8",
            trackedEntityType: "MCPQUTHX1Ze",
            trackedEntity: memberIds.member6.teiId,
            incidentDate: "2024-06-30",
            isOnline: 0,
            isFollowUp: 0,
            isDeleted: 0,
            enrollment: memberIds.member6.enrId,
            enrolledAt: "2024-06-30",
            occurredAt: "2024-06-30",
            status: "ACTIVE",
            events: [],
          },
        ],
        isOnline: 0,
        orgUnit: "Q3PHpzrZzn8",
        deleted: 0,
        attributes: [
          {
            attribute: "BaiVwt8jVfg",
          },
          {
            attribute: "DmuazFb368B",
            value: "F",
          },
          {
            attribute: "IBLkiaYRRL3",
            value: "six",
          },
          {
            attribute: "IEE2BMhfoSc",
            value: "six",
          },
          {
            attribute: "NLth2WTyo7M",
            value: "lao",
          },
          {
            attribute: "bIzDI9HJCB0",
            value: "2021",
          },
          {
            attribute: "ck9h7CokxQE",
            value: "birthyear",
          },
          {
            attribute: "tASKWHyRolc",
          },
          {
            attribute: "tJrT8GIy477",
            value: "ຜູ້ໄທ",
          },
          {
            attribute: "tQeFLjYbqzv",
          },
          {
            attribute: "W4aInCTn8p5",
          },
          {
            attribute: "rSETgSvyVpJ",
          },
          {
            attribute: "PYgXM3R2TQd",
          },
          {
            attribute: "g9wNk1T3MLE",
          },
          {
            attribute: "gv9xX5w4kKt",
            value: familyTeiId,
          },
        ],
      },
    ],
  };

  return template;
};
