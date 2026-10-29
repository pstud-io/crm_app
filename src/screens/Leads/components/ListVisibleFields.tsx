import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import { borderWidth } from "@/design/borders";
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
import { Checkbox, CloseOutlineIcon } from "@/svg";
import { useKeyboard } from "@react-native-community/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { SW, SH, capitalizeEachWord } from "@/utils";
import { VisibleFieldsState } from "@/store/slices/visibleFields";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";

export const ListVisibleFields = ({
  loading,
  setOpen,
  onRefresh,
  fieldsToggle,
  preferences,
  setPreferences,
  resetKey,
}: {
  loading: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onRefresh: () => Promise<void>;
  beforeOpenRef: React.RefObject<any>;
  fieldsToggle: VisibleFieldsState;
  preferences: string[];
  setPreferences: Dispatch<SetStateAction<string[]>>;
  resetKey: boolean;
}) => {
  const dispatch = useDispatch();
  const keyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const formElementsStyles = useFormElementsStyles();
  const { theme } = useTheme();
  const { addPreferences } = useGeneralEndpoints();

  // Local checkbox state. Preferences contains the IDs that are saved.
  const [localFieldsToggle, setLocalFieldsToggle] =
    useState<VisibleFieldsState>(() =>
      Object.fromEntries(
        Object.entries(fieldsToggle).map(([id, field]) => [
          id,
          {
            ...field,
            value: preferences.includes(id),
          },
        ]),
      ),
    );

  // Sync when the initial API data or saved preferences change.
  useEffect(() => {
    if (!resetKey) {
      setLocalFieldsToggle(
        Object.fromEntries(
          Object.entries(fieldsToggle).map(([id, field]) => [
            id,
            {
              ...field,
              value: preferences.includes(id),
            },
          ]),
        ),
      );
    }
  }, [resetKey, fieldsToggle, preferences]);

  const handleDismiss = () => {
    // Discard any unsaved checkbox changes.
    setLocalFieldsToggle(
      Object.fromEntries(
        Object.entries(fieldsToggle).map(([id, field]) => [
          id,
          {
            ...field,
            value: preferences.includes(id),
          },
        ]),
      ),
    );

    setOpen(false);

    setTimeout(() => {
      dispatch(setIsSheetOpen(false));
    }, 400);
  };

  const handleSave = async () => {
    const selectedFieldIds = Object.entries(localFieldsToggle)
      .filter(([, field]) => field.value)
      .map(([id]) => id);

    try {
      await addPreferences(selectedFieldIds);

      // Update the saved IDs only after the API request succeeds.
      setPreferences(selectedFieldIds);

      setOpen(false);

      setTimeout(() => {
        dispatch(setIsSheetOpen(false));
      }, 400);

      await onRefresh();
    } catch (error) {
      console.error("Failed to save field preferences:", error);
    }
  };

  const standardFields = Object.entries(localFieldsToggle).filter(
    ([, field]) => field.type === "standard",
  );

  const additionalFields = Object.entries(localFieldsToggle).filter(
    ([, field]) => field.type === "additional",
  );

  const selectedFieldsCount = Object.values(localFieldsToggle).filter(
    (field) => field.value,
  ).length;

  const renderField = ([id, field]: (typeof standardFields)[number]) => {
    const isDisabled = !field.value && selectedFieldsCount >= 4;

    return (
      <TouchableOpacity
        key={id}
        activeOpacity={isDisabled ? 1 : 0.9}
        disabled={isDisabled}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: spacing.md,
          paddingVertical: SH(4),
          overflow: "hidden",
        }}
        onPress={() => {
          setLocalFieldsToggle((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              value: !prev[id].value,
            },
          }));
        }}
      >
        <Checkbox
          isSelected={field.value}
          width={SW(20)}
          height={SH(20)}
          stroke={isDisabled ? theme.border : theme.text}
          style={{}}
          strokeWidth={0.5}
        />

        <Text
          style={[
            body.md.regular,
            { color: theme.text, marginLeft: spacing.md },
          ]}
        >
          {capitalizeEachWord(field.name)}
        </Text>
      </TouchableOpacity>
    );
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
        <Text style={[body.lg.medium, { color: theme.text }]}>Settings</Text>

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
        {loading ? (
          <ActivityIndicator size="small" color={theme.text} />
        ) : (
          <View style={ystack}>
            <Text
              style={[
                body.md.medium,
                { color: theme.text, marginBottom: spacing.md },
              ]}
            >
              Standard Fields
            </Text>

            {standardFields.map(renderField)}

            {additionalFields.length > 0 && (
              <>
                <Text
                  style={[
                    body.md.medium,
                    {
                      color: theme.text,
                      marginTop: spacing.lg,
                      marginBottom: spacing.md,
                    },
                  ]}
                >
                  Additional Fields
                </Text>

                {additionalFields.map(renderField)}
              </>
            )}
          </View>
        )}
      </ScrollView>

      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title="Cancel"
          onPress={handleDismiss}
          type="outlined"
          disabled={false}
        />

        <BottomButton
          title="Save"
          onPress={handleSave}
          type="default"
          disabled={false}
        />
      </View>
    </View>
  );
};
