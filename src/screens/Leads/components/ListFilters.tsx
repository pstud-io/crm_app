/**
 * ASSUMPTIONS ABOUT FIELD NAMES
 * -----------------------------
 * I don't have your KanbanExtraParams / KanbanFilterParams type definitions,
 * so draftFilters uses these keys. If your real type uses different names,
 * just rename them below (search & replace) — the rest of the logic is unaffected:
 *
 *   brand, project_type, lead_source, client, stage, assignee, start_date, end_date, search
 */

import AdditionalFieldsForm from "@/components/common/AddProject/components/AdditionalFieldsForm";
import { useAddProjectEndpoints } from "@/components/common/AddProject/hooks/useAddProjectEndpoints";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import { DatePicker2 } from "@/components/UI/GeneralComponents/DatePicker2";
import SelectionPopover from "@/components/UI/GeneralComponents/PopUps/SelectionPopover";
import { borderWidth } from "@/design/borders";
import { primaryColors } from "@/design/colors";
import {
  center,
  fullHeight,
  fullWidth,
  grow,
  xstack,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useTheme } from "@/hooks/useTheme";
import { CloseOutlineIcon, DownArrowOutlineIcon } from "@/svg";
import { capitalizeEachWord } from "@/utils";
import { useKeyboard } from "@react-native-community/hooks";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView, Text } from "react-native";
import {
  kanbanExtraParams,
  KanbanExtraParams,
  KanbanFilterParams,
} from "../hooks/useLeadsEndpoints";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { useDispatch } from "react-redux";

type FiltersState = KanbanExtraParams & KanbanFilterParams;

type VisibleState = {
  brand: boolean;
  projectType: boolean;
  leadSource: boolean;
  clients: boolean;
  assignees: boolean;
  stages: boolean;
};

const fieldWrapperStyle = {
  display: "flex" as const,
  flexDirection: "column" as const,
  justifyContent: "flex-start" as const,
  alignItems: "flex-start" as const,
  flex: 1,
  gap: 6,
  marginBottom: spacing.lg,
};

export const ListFilters = ({
  open,
  setOpen,
  kanbanFilters,
  setKanbanFilters,
}: {
  open: boolean;
  // Optional: call this when you want the drawer to actually close
  // (wire it up from the parent, e.g. onClose={() => setOpen(false)})
  setOpen: Dispatch<SetStateAction<boolean>>;
  kanbanFilters: FiltersState;
  setKanbanFilters: Dispatch<SetStateAction<FiltersState>>;
}) => {
  // ---- SINGLE SOURCE OF TRUTH FOR ALL EDITED-BUT-NOT-YET-APPLIED FILTERS ----
  const [draftFilters, setDraftFilters] = useState<FiltersState>(kanbanFilters);
  const [additionalValues, setAdditionalValues] = useState<Record<string, any>>(
    {},
  );
  const dispatch = useDispatch();
  const keyboardVisible = useKeyboardStatus();
  const mounted = useRef(false);
  const keyboard = useKeyboard();

  const [visible, setVisible] = useState<VisibleState>({
    brand: false,
    projectType: false,
    leadSource: false,
    clients: false,
    assignees: false,
    stages: false,
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [additionalFields, setAllAdditionalFields] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formElementsStyles = useFormElementsStyles();
  const { theme } = useTheme();

  const {
    getAllAdditionalFields,
    addProjectLoading,
    getAllBrands,
    getAllProjectTypes,
    getAllLeadSource,
    getAllAssignees,
    getAllClients,
    getAllStages,
  } = useAddProjectEndpoints();

  // Fetch all dropdown data once, the first time the drawer is opened.
  useEffect(() => {
    if (!open) return;

    if (open && !mounted.current) {
      mounted.current = true;
      const fetchAdditionalFields = async () => {
        await Promise.all([
          getAllAdditionalFields(setAllAdditionalFields),
          getAllBrands(setBrands),
          getAllProjectTypes(setProjectTypes),
          getAllLeadSource(setLeadSources),
          getAllClients(setClients),
          getAllAssignees(setAssignees),
          getAllStages(setStages),
        ]);
      };
      fetchAdditionalFields();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setDraftFilters(kanbanFilters);

      setAdditionalValues(
        buildAdditionalValues(
          kanbanFilters.additional_fields,
          kanbanFilters.field_search,
        ),
      );
    }
  }, [open, kanbanFilters]);

  const updateDraft = (patch: Partial<FiltersState>) => {
    setDraftFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleDismiss = () => {
    setDraftFilters(kanbanFilters);
  };

  const handleClearFilters = () => {
    setKanbanFilters({ ...kanbanExtraParams });
    setTimeout(() => {
      dispatch(setIsSheetOpen(false));
      setOpen(false);
    }, 400);
  };

  const handleApplyFilters = () => {
    const additionalPayload = buildAdditionalFieldsPayload(
      additionalFields,
      additionalValues,
    );

    setKanbanFilters({
      ...draftFilters,
      ...additionalPayload,
    });

    setTimeout(() => {
      dispatch(setIsSheetOpen(false));
      setOpen(false);
    }, 400);
  };

  const createPayload = (fields: any, values: any) => {
    return fields
      .filter((field: any) => {
        const value = values[field.id]?.value;

        return value !== undefined && value !== null && value !== "";
      })
      .map((field: any) => ({
        fk_project_additional_field: field.id,
        value: values[field.id].value,
      }));
  };

  const buildAdditionalFieldsPayload = (fields: any, values: any) => {
    const payload = createPayload(fields, values);

    return {
      additional_fields: payload.map(
        (item: any) => item.fk_project_additional_field,
      ),
      field_search: payload.map((item: any) => item.value),
    };
  };

  const buildAdditionalValues = (
    additional_fields: string[] = [],
    field_search: string[] = [],
  ) => {
    const values: Record<string, any> = {};

    additional_fields.forEach((fieldId, index) => {
      values[fieldId] = {
        value: field_search[index] ?? "",
      };
    });

    return values;
  };

  return (
    <View
      style={[ystack, center, fullHeight, { justifyContent: "flex-start" }]}
    >
      <View
        style={[
          xstack,
          fullWidth,
          {
            padding: spacing.xxl,
            borderBottomColor: theme.border,
            borderBottomWidth: borderWidth.hw,
            boxShadow: theme.shadow.sm,
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[body.lg.medium, { color: theme.text }]}>All Filters</Text>
        <TouchableOpacity
          onPress={handleDismiss}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 24,
          }}
        >
          <CloseOutlineIcon fill={theme.text} width={14} height={14} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[grow, fullWidth]}
        contentContainerStyle={[
          fullWidth,
          {
            padding: spacing.lg,
            paddingBottom: keyboardVisible
              ? keyboard.keyboardHeight
              : spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Start Date */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>
            Start Date
          </Text>
          <DatePicker2
            selectedDate={
              draftFilters?.start_date
                ? new Date(draftFilters.start_date)
                : null
            }
            setSelectedDate={(date: Date) =>
              updateDraft({
                start_date: date.toISOString(),
              } as Partial<FiltersState>)
            }
            showDatePicker={showDatePicker}
            setShowDatePicker={(isOpen: boolean) => setShowDatePicker(isOpen)}
            placeholder="Select Start Date"
            minDate={null}
            maxDate={null}
          />
        </View>

        {/* End Date */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>End Date</Text>
          <DatePicker2
            selectedDate={
              draftFilters?.end_date ? new Date(draftFilters.end_date) : null
            }
            setSelectedDate={(date: Date) =>
              updateDraft({
                end_date: date.toISOString(),
              } as Partial<FiltersState>)
            }
            showDatePicker={showDatePicker}
            setShowDatePicker={(isOpen: boolean) => setShowDatePicker(isOpen)}
            placeholder="Select End Date"
            minDate={null}
            maxDate={null}
          />
        </View>

        {/* Brand */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>Brand</Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() => setVisible((prev) => ({ ...prev, brand: true }))}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.brand && { color: primaryColors.gray[400] },
                { flex: 1 },
              ]}
            >
              {brands.find((b) => b.id === draftFilters?.brand)?.name ||
                "Select Brand"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.brand}
              onClose={() => setVisible((prev) => ({ ...prev, brand: false }))}
              title={"Brand"}
              data={brands}
              selectedIds={draftFilters?.brand}
              onConfirm={(selected: any) =>
                updateDraft({ brand: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllBrands}
            />
          </TouchableOpacity>
        </View>

        {/* Project Type */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>
            Project Type
          </Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() =>
              setVisible((prev) => ({ ...prev, projectType: true }))
            }
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.project_type && {
                  color: primaryColors.gray[400],
                },
                { flex: 1 },
              ]}
            >
              {projectTypes.find((b) => b.id === draftFilters?.project_type)
                ?.name || "Select Project Type"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.projectType}
              onClose={() =>
                setVisible((prev) => ({ ...prev, projectType: false }))
              }
              title={"Project Type"}
              data={projectTypes}
              selectedIds={draftFilters?.project_type}
              onConfirm={(selected: any) =>
                updateDraft({ project_type: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllProjectTypes}
            />
          </TouchableOpacity>
        </View>

        {/* Lead Source */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>
            Lead Source
          </Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() =>
              setVisible((prev) => ({ ...prev, leadSource: true }))
            }
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.lead_source && {
                  color: primaryColors.gray[400],
                },
                { flex: 1 },
              ]}
            >
              {leadSources.find((b) => b.id === draftFilters?.lead_source)
                ?.name || "Select Lead Source"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.leadSource}
              onClose={() =>
                setVisible((prev) => ({ ...prev, leadSource: false }))
              }
              title={"Lead Source"}
              data={leadSources}
              selectedIds={draftFilters?.lead_source}
              onConfirm={(selected: any) =>
                updateDraft({ lead_source: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllLeadSource}
            />
          </TouchableOpacity>
        </View>

        {/* Client */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>Client</Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() => setVisible((prev) => ({ ...prev, clients: true }))}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.client && { color: primaryColors.gray[400] },
                { flex: 1 },
              ]}
            >
              {clients.find((b) => b.id === draftFilters?.client)
                ?.contact_details?.name || "Select Client"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.clients}
              onClose={() =>
                setVisible((prev) => ({ ...prev, clients: false }))
              }
              title={"Clients"}
              data={clients}
              selectedIds={draftFilters?.client}
              onConfirm={(selected: any) =>
                updateDraft({ client: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllClients}
            />
          </TouchableOpacity>
        </View>

        {/* Stage */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>Stage</Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() => setVisible((prev) => ({ ...prev, stages: true }))}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.stage && { color: primaryColors.gray[400] },
                { flex: 1 },
              ]}
            >
              {stages.find((b) => b.id === draftFilters?.stage)?.name ||
                "Select Stage"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.stages}
              onClose={() => setVisible((prev) => ({ ...prev, stages: false }))}
              title={"Stages"}
              data={stages}
              selectedIds={draftFilters?.stage}
              onConfirm={(selected: any) =>
                updateDraft({ stage: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllStages}
            />
          </TouchableOpacity>
        </View>

        {/* Assigned To */}
        <View style={fieldWrapperStyle}>
          <Text style={{ ...body.sm.medium, color: theme.text }}>
            Assigned To
          </Text>
          <TouchableOpacity
            style={[
              formElementsStyles.triggerStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 44,
                backgroundColor: primaryColors.gray[25],
              },
            ]}
            onPress={() => setVisible((prev) => ({ ...prev, assignees: true }))}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !draftFilters?.assigned_to && {
                  color: primaryColors.gray[400],
                },
                { flex: 1 },
              ]}
            >
              {assignees.find((b) => b.id === draftFilters?.assigned_to)
                ?.contact_details?.name || "Select Assignee"}
            </Text>
            <DownArrowOutlineIcon
              width={16}
              height={16}
              color={primaryColors.gray[900]}
            />
            <SelectionPopover
              visible={visible.assignees}
              onClose={() =>
                setVisible((prev) => ({ ...prev, assignees: false }))
              }
              title={"Assignees"}
              data={assignees}
              selectedIds={draftFilters?.assigned_to}
              onConfirm={(selected: any) =>
                updateDraft({ assigned_to: selected } as Partial<FiltersState>)
              }
              loading={addProjectLoading.getAllAssignees}
            />
          </TouchableOpacity>
        </View>

        <AdditionalFieldsForm
          values={additionalValues}
          setValues={setAdditionalValues}
          allFields={additionalFields}
        />
      </ScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Clear Filters"}
          onPress={handleClearFilters}
          type={"outlined"}
          disabled={false}
        />
        <BottomButton
          title={"Add Filters"}
          disabled={false}
          onPress={handleApplyFilters}
          type={"default"}
        />
      </View>
    </View>
  );
};
