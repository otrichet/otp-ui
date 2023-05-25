import { checkLocale, combineExceptionFiles } from "../validate-i18n";

import { mocksFolderFromCwd } from "./util";

describe("validate-i18n", () => {
  describe("combineExceptionFiles", () => {
    it("should combine ignored ids", async () => {
      const exceptionFiles = [
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`,
        `${mocksFolderFromCwd}/i18n2/i18n-exceptions.json`
      ];
      const { groups, ignoredIds } = await combineExceptionFiles(
        exceptionFiles
      );

      const groupKeys = Object.keys(groups);
      expect(groupKeys.length).toBe(1);
      expect(groupKeys[0]).toBe("otpUi.OtherComponent.*Message");

      expect(ignoredIds.size).toBe(2);
      expect(
        ignoredIds.has("otpUi.TestComponent1.unusedTextThatIsIgnored")
      ).toBe(true);
      expect(
        ignoredIds.has("otpUi.TestComponent2.unusedTextThatIsIgnored")
      ).toBe(true);
    });
  });

  describe("checkLocale", () => {
    it("should detect unused message ids, excluding declared groups", async () => {
      const ignoredIds = new Set([
        "otpUi.TestComponent1.unusedTextThatIsIgnored",
        "otpUi.ExtraId.fromCodeThatIsIgnored"
      ]);
      const groups = {
        "otpUi.OtherComponent.*Message": ["key1", "key2", "extraKey"]
      };
      const ymlFiles = [`${mocksFolderFromCwd}/i18n1/en-US.yml`];
      const messageIdsFromCode = [
        "otpUi.FromToLocationPicker.from",
        "otpUi.FromToLocationPicker.planATrip",
        "otpUi.FromToLocationPicker.to",
        // Extra ones not in the language files for detecting untranslated ids.
        "otpUi.ExtraId.fromCode",
        "otpUi.ExtraId.fromCodeThatIsIgnored"
      ];

      const { idsNotInCode, missingIdsForLocale } = await checkLocale(
        ymlFiles,
        messageIdsFromCode,
        ignoredIds,
        groups
      );

      expect(missingIdsForLocale.length).toBe(2);
      expect(missingIdsForLocale.includes("otpUi.ExtraId.fromCode")).toBe(true);
      expect(
        missingIdsForLocale.includes("otpUi.OtherComponent.extraKeyMessage")
      ).toBe(true);

      expect(idsNotInCode.length).toBe(1);
      expect(idsNotInCode[0]).toBe("otpUi.TestComponent1.unusedText");
    });
  });
});
