import { getMaxHHMemberID } from "../member.js";

describe("getMaxHHMemberID", () => {
  describe("Input validation", () => {
    it('should return "001" for null input', () => {
      expect(getMaxHHMemberID(null)).toBe("001");
    });

    it('should return "001" for undefined input', () => {
      expect(getMaxHHMemberID(undefined)).toBe("001");
    });

    it('should return "001" for non-array input', () => {
      expect(getMaxHHMemberID("not an array")).toBe("001");
      expect(getMaxHHMemberID(123)).toBe("001");
      expect(getMaxHHMemberID({})).toBe("001");
    });

    it('should return "001" for empty array', () => {
      expect(getMaxHHMemberID([])).toBe("001");
    });
  });

  describe("Basic functionality", () => {
    it('should return "002" for single member with ID "001"', () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("002");
    });

    it("should return next ID for multiple members", () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }, { Cn37lbyhz6f: "002" }, { Cn37lbyhz6f: "003" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("004");
    });

    it("should handle unordered member IDs", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "005" },
        { Cn37lbyhz6f: "001" },
        { Cn37lbyhz6f: "003" },
        { Cn37lbyhz6f: "002" },
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("006");
    });

    it("should handle large member IDs", () => {
      const cascadeData = [{ Cn37lbyhz6f: "100" }, { Cn37lbyhz6f: "999" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("1000");
    });
  });

  describe("Duplicate removal", () => {
    it("should remove duplicate member IDs", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "001" },
        { Cn37lbyhz6f: "002" },
        { Cn37lbyhz6f: "002" }, // duplicate
        { Cn37lbyhz6f: "003" },
        { Cn37lbyhz6f: "001" }, // duplicate
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("004");
    });

    it("should handle all duplicates", () => {
      const cascadeData = [{ Cn37lbyhz6f: "005" }, { Cn37lbyhz6f: "005" }, { Cn37lbyhz6f: "005" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("006");
    });

    it("should remove duplicates with mixed data types", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "001" },
        { Cn37lbyhz6f: 2 }, // number
        { Cn37lbyhz6f: "002" }, // string
        { Cn37lbyhz6f: 2 }, // duplicate number
        { Cn37lbyhz6f: "003" },
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("004");
    });
  });

  describe("Invalid data handling", () => {
    it("should filter out null and undefined member IDs", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "001" },
        { Cn37lbyhz6f: null },
        { Cn37lbyhz6f: undefined },
        { Cn37lbyhz6f: "003" },
        {}, // missing Cn37lbyhz6f property
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("004");
    });

    it("should filter out empty string member IDs", () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }, { Cn37lbyhz6f: "" }, { Cn37lbyhz6f: "002" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("003");
    });

    it("should filter out non-numeric member IDs", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "001" },
        { Cn37lbyhz6f: "abc" },
        { Cn37lbyhz6f: "xyz123" },
        { Cn37lbyhz6f: "002" },
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("003");
    });

    it("should filter out negative and zero member IDs", () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }, { Cn37lbyhz6f: "0" }, { Cn37lbyhz6f: "-1" }, { Cn37lbyhz6f: "002" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("003");
    });

    it('should return "001" when all member IDs are invalid', () => {
      const cascadeData = [
        { Cn37lbyhz6f: null },
        { Cn37lbyhz6f: "" },
        { Cn37lbyhz6f: "abc" },
        { Cn37lbyhz6f: "0" },
        {},
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("001");
    });
  });

  describe("Number formatting", () => {
    it("should pad single digit numbers with leading zeros", () => {
      const cascadeData = [{ Cn37lbyhz6f: "1" }, { Cn37lbyhz6f: "2" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("003");
    });

    it("should pad double digit numbers with leading zeros", () => {
      const cascadeData = [{ Cn37lbyhz6f: "10" }, { Cn37lbyhz6f: "99" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("100");
    });

    it("should handle numbers already with leading zeros", () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }, { Cn37lbyhz6f: "005" }, { Cn37lbyhz6f: "010" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("011");
    });

    it("should handle 4-digit and larger numbers", () => {
      const cascadeData = [{ Cn37lbyhz6f: "1000" }, { Cn37lbyhz6f: "9999" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("10000");
    });
  });

  describe("Mixed scenarios", () => {
    it("should handle complex real-world data", () => {
      const cascadeData = [
        { Cn37lbyhz6f: "001", name: "John" },
        { Cn37lbyhz6f: null, name: "Invalid" },
        { Cn37lbyhz6f: "003", name: "Mary" },
        { Cn37lbyhz6f: "", name: "Empty" },
        { Cn37lbyhz6f: "002", name: "Bob" },
        { Cn37lbyhz6f: "003", name: "Mary Duplicate" }, // duplicate
        { name: "No ID" }, // missing Cn37lbyhz6f
        { Cn37lbyhz6f: "abc", name: "Invalid ID" },
        { Cn37lbyhz6f: "005", name: "Alice" },
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("006");
    });

    it("should handle empty objects and malformed data", () => {
      const cascadeData = [
        {},
        { Cn37lbyhz6f: "001" },
        { someOtherField: "value" },
        { Cn37lbyhz6f: "003" },
        null, // null element in array
        { Cn37lbyhz6f: "002" },
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("004");
    });
  });

  describe("Edge cases", () => {
    it("should handle array with only invalid entries", () => {
      const cascadeData = [
        { Cn37lbyhz6f: null },
        { Cn37lbyhz6f: undefined },
        { Cn37lbyhz6f: "" },
        { Cn37lbyhz6f: "invalid" },
        {},
      ];
      expect(getMaxHHMemberID(cascadeData)).toBe("001");
    });

    it("should handle very large arrays", () => {
      const cascadeData = Array.from({ length: 1000 }, (_, i) => ({
        Cn37lbyhz6f: (i + 1).toString().padStart(3, "0"),
      }));
      expect(getMaxHHMemberID(cascadeData)).toBe("1001");
    });

    it("should handle sparse member IDs", () => {
      const cascadeData = [{ Cn37lbyhz6f: "001" }, { Cn37lbyhz6f: "100" }, { Cn37lbyhz6f: "500" }];
      expect(getMaxHHMemberID(cascadeData)).toBe("501");
    });
  });
});
