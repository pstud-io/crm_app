import { Text, View } from "react-native";
import { groupAdditionalFieldsBySection } from "../utils/leadsFunctions";
import { RenderLeadAdditionalFieldItem } from "./RenderLeadAdditionalFieldItem";

export const LeadAdditionalFields = ({
  additionalFields,
  editProjectFunctions,
  additionalFieldsWithValue,
  leadDetails,
}: {
  additionalFields: any[];
  editProjectFunctions: any;
  additionalFieldsWithValue: any[];
  leadDetails: Record<string, any>;
}) => {
  const groupedAdditionalFields =
    groupAdditionalFieldsBySection(additionalFields);
  console.log(
    "These are the grouped additional fields",
    groupedAdditionalFields,
  );

  return (
    <>
      {Object.entries(groupedAdditionalFields).map(([section, fields]) => (
        <RenderLeadAdditionalFieldItem
          key={section}
          section={section}
          fields={fields}
          editProjectFunctions={editProjectFunctions}
          allFields={additionalFields}
          additionalFieldsWithValue={additionalFieldsWithValue}
          leadDetails={leadDetails}
        />
      ))}
    </>
  );
};
