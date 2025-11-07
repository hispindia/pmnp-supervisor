import { dataApi } from "@/api";
import {
  MEMBER_FIRST_NAME_ATTRIBUTE_ID,
  MEMBER_LAST_NAME_ATTRIBUTE_ID,
  MEMBER_MIDDLE_NAME_ATTRIBUTE_ID,
  MEMBER_PROGRAM_ID,
} from "@/constants/app-config";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { returnFilterString } from "@/utils";
import { calculateSoundexSimilarityScore, generateCombinedSoundex, generateSoundex } from "@/utils/soundex";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

export const useReviewDuplicates = () => {
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [error, setError] = useState(null);

  const { offlineStatus } = useSelector((state) => state.common);
  const { selectedOrgUnit } = useSelector((state) => state.metadata);

  /**
   * Search for potential duplicates based on name components
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.firstname - First name to search
   * @param {string} searchParams.lastname - Last name to search
   * @param {string} searchParams.middlename - Middle name to search (optional)
   * @param {string} searchParams.dateOfbirth - Date of birth to match (YYYY-MM-DD format)
   * @param {Array<string>} searchParams.excludeIds - Array of tracked entity IDs to exclude from results
   * @returns {Promise<Array>} - Array of potential duplicate members
   */
  const searchDuplicates = useCallback(
    async ({ firstname, lastname, middlename, extname, dateOfbirth, excludeIds = [] }) => {
      if (!selectedOrgUnit?.id) {
        setError("No organization unit selected");
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        // Generate soundex codes for input names
        const inputSoundex = generateSoundex({
          firstname: firstname || "",
          middlename: middlename || "",
          lastname: lastname || "",
          extname: "", // Not used for searching
        });

        // Generate combined soundex for input names to compare with results
        const inputCombinedSoundex = generateCombinedSoundex({
          firstname: firstname || "",
          middlename: middlename || "",
          lastname: lastname || "",
          extname: extname || "",
        });

        console.log("Soundex code:", inputCombinedSoundex);

        const searchTerms = [];

        // Add soundex-based search terms for each name component that has a value
        if (firstname && firstname.trim() && inputSoundex.firstname !== "0000") {
          searchTerms.push({
            attribute: MEMBER_FIRST_NAME_ATTRIBUTE_ID,
            value: firstname.trim(),
            soundexCode: inputSoundex.firstname,
            type: "firstname",
          });
        }

        if (lastname && lastname.trim() && inputSoundex.lastname !== "0000") {
          searchTerms.push({
            attribute: MEMBER_LAST_NAME_ATTRIBUTE_ID,
            value: lastname.trim(),
            soundexCode: inputSoundex.lastname,
            type: "lastname",
          });
        }

        if (middlename && middlename.trim() && inputSoundex.middlename !== "0000") {
          searchTerms.push({
            attribute: MEMBER_MIDDLE_NAME_ATTRIBUTE_ID,
            value: middlename.trim(),
            soundexCode: inputSoundex.middlename,
            type: "middlename",
          });
        }

        if (searchTerms.length === 0) {
          console.log("No search terms provided");
          setDuplicates([]);
          return [];
        }

        // Filter results based on soundex similarity (>80%)
        const similarResults = {};

        // Search for each name component using soundex codes with LIKE operator
        for (const searchTerm of searchTerms) {
          // Use soundex code for searching instead of raw name

          let searchResult;

          if (offlineStatus) {
            // Offline mode - use TrackedEntityManager

            searchResult = await trackedEntityManager.find({
              orgUnit: selectedOrgUnit.id,
              program: MEMBER_PROGRAM_ID,
              filters: returnFilterString([{ teiId: "mDdoqGKJDOU", value: searchTerm.soundexCode }])
                .split("&")
                .filter(Boolean),
              ouMode: "DESCENDANTS",
            });
          } else {
            const filters = [`filter=mDdoqGKJDOU:like:${searchTerm.soundexCode}`];

            // Online mode - use DataAPI
            searchResult = await dataApi.getTrackedEntityInstances({
              ou: selectedOrgUnit.id,
              program: MEMBER_PROGRAM_ID,
              filters,
              attributes: [],
              fields: ["trackedEntity", "trackedEntityType", "orgUnit", "attributes"],
              paging: false,
            });
          }

          if (searchResult?.instances?.length > 0) {
            // Process each instance to create object with mDdoqGKJDOU value as key
            searchResult.instances.forEach((instance) => {
              const attributes = instance.attributes || [];

              // Skip if this instance should be excluded
              if (excludeIds.includes(instance.trackedEntity)) {
                return;
              }

              // Find the mDdoqGKJDOU attribute value
              const soundexCode = attributes.find((attr) => attr.attribute === "mDdoqGKJDOU");

              if (soundexCode?.value) {
                const soundexCodeValue = soundexCode.value;

                // compare soundex codes to determine similarity
                const similarityScore = calculateSoundexSimilarityScore(inputCombinedSoundex, soundexCodeValue);

                // Get date of birth from the found instance for comparison
                const foundDateOfBirth = attributes.find((attr) => attr.attribute === "fJPZFs2yYJQ")?.value || "";
                const hasSameDateOfBirth = dateOfbirth && foundDateOfBirth && dateOfbirth === foundDateOfBirth;

                // Only keep results with similarity > 80% AND same date of birth
                if (similarityScore > 80 && hasSameDateOfBirth) {
                  similarResults[soundexCodeValue] = {
                    ...instance,
                    matchedOn: searchTerm.type,
                    matchedValue: searchTerm.value,
                    matchedSoundex: searchTerm.soundexCode,
                    similarityScore,
                    hasSameDateOfBirth,
                  };
                }
              }
            });
          }
        }

        // Transform results to expected format from the similarResults object
        const transformedResults = Object.values(similarResults).map((instance) => {
          const attributes = instance.attributes || [];

          // Get the actual names from the found instance
          const foundFirstName =
            attributes.find((attr) => attr.attribute === MEMBER_FIRST_NAME_ATTRIBUTE_ID)?.value || "";
          const foundLastName =
            attributes.find((attr) => attr.attribute === MEMBER_LAST_NAME_ATTRIBUTE_ID)?.value || "";
          const foundMiddleName =
            attributes.find((attr) => attr.attribute === MEMBER_MIDDLE_NAME_ATTRIBUTE_ID)?.value || "";
          const pmnpId = attributes.find((attr) => attr.attribute === "NOKzq4dAKF7")?.value || "";
          const sex = attributes.find((attr) => attr.attribute === "Qt4YSwPxw0X")?.value || "";
          const dateOfBirth = attributes.find((attr) => attr.attribute === "fJPZFs2yYJQ")?.value || "";
          const relationship = attributes.find((attr) => attr.attribute === "QAYXozgCOHu")?.value || "";

          return {
            id: instance.trackedEntity,
            trackedEntity: instance.trackedEntity,
            barangayCode: selectedOrgUnit.code || "",
            pmnpId: pmnpId,
            firstName: foundFirstName,
            lastName: foundLastName,
            middleName: foundMiddleName,
            sex: sex,
            dateOfBirth: dateOfBirth,
            relationship: relationship,
            foundCombinedSoundex: instance.foundCombinedSoundex, // Combined soundex of found names
            similarityScore: instance.similarityScore, // Similarity score percentage
            orgUnit: instance.orgUnit,
          };
        });

        console.log(`Total duplicates with >80% similarity and same DOB: ${transformedResults.length}`);
        setDuplicates(transformedResults);
        return transformedResults;
      } catch (err) {
        console.error("Error searching for duplicates:", err);
        setError(err.message || "Failed to search for duplicates");
        setDuplicates([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [selectedOrgUnit, offlineStatus],
  );

  /**
   * Clear search results and reset state
   */
  const clearDuplicates = useCallback(() => {
    setDuplicates([]);
    setError(null);
  }, []);

  /**
   * Search by single name (for quick searches)
   * @param {string} name - Name to search across all name fields
   * @param {Array<string>} excludeIds - Array of tracked entity IDs to exclude from results
   */
  const searchByName = useCallback(
    async (name, excludeIds = []) => {
      return await searchDuplicates({
        firstname: name,
        lastname: name,
        middlename: name,
        excludeIds,
      });
    },
    [searchDuplicates],
  );

  return {
    loading,
    potentialDuplicates: duplicates,
    error,
    searchDuplicates,
    searchByName,
    clearDuplicates,
  };
};

export default useReviewDuplicates;
