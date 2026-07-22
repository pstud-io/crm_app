import { Text, View } from "react-native";
import { groupAdditionalFieldsBySection } from "../utils/leadsFunctions";
import { RenderLeadAdditionalFieldItem } from "./RenderLeadAdditionalFieldItem";

export const LeadAdditionalFields = ({
  additionalFields,
  editProjectFunctions,
}: {
  additionalFields: any[];
  editProjectFunctions: any;
}) => {
  const groupedAdditionalFields =
    groupAdditionalFieldsBySection(additionalFields);

  return (
    <>
      {Object.entries(groupedAdditionalFields).map(([section, fields]) => (
        <RenderLeadAdditionalFieldItem
          section={section}
          fields={fields}
          editProjectFunctions={editProjectFunctions}
          allFields={additionalFields}
        />
      ))}
    </>
  );
};
