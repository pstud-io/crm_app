import { useCallback, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Colors, SH, SW, SF } from "../../utils";
import { Button, Spacing } from "../../components/common";
import apiEndpoint from "../../config/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import { openNewCommentBottomSheet } from "../../components/common/NewCommentBottomSheetService";
import { NewCommentSheet } from "../../components/UI/GeneralComponents/NewCommentSheet";
import { useGetComment } from "../../hooks/useGetComment";
import { CommentCard } from "../../components/UI/GeneralComponents/CommentCard";
import { SecondaryButton } from "../../components/UI/GeneralComponents/SecondaryButton";
import RenderMediaList from "../../components/UI/GeneralComponents/RenderMediaList";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { UserCustomFieldsModal } from "../../components/UI/GeneralComponents/PopUps/UserCustomFieldsPopUp";
import { useCustomFieldEndpoints } from "../../hooks/useCustomFieldEndpoints";
import { CustomFieldDetailView } from "../../components/UI/GeneralComponents/CustomFieldDetailView";
import { useTaskUpdateOptions } from "../tasks/hooks/useTaskUpdateOptions";
import { useTaskEndpoints } from "../tasks/hooks/useTasksEndpoints";
import { RenderTaskItem } from "../tasks/components/RenderTaskItem";
import { TaskHistoryBottomSheet } from "../tasks/components/TaskHistoryBottomSheet";

const TaskDetails = ({ navigation, route }) => {
  const { autoOpenComments } = route.params || {};
  const { showActionSheetWithOptions } = useActionSheet();
  const [task, setTask] = useState({ ...route.params.task });
  console.log("This is the task", task);
  const taskId = task.id;
  const completedStages = ["completed", "approved", "rejected", "discarded"];
  const profile = useSelector((state) => state.profile);
  const canEdit =
    profile.is_admin || profile.name === task.creator_contact_details.name;
  const canUpdateTask = !completedStages.includes(task.stage);
  const [userFieldsModal, setUserFieldsModal] = useState({
    visible: false,
    fields: [],
    pendingAction: null,
  });
  const [submitting, setIsSubmitting] = useState(false);

  const getMediaForMediaTab = (assets) => {
    console.log("assets in converter", assets);
    const media = assets.map((asset) => {
      return {
        created_on: asset.asset_details.created_on,
        id: asset.asset_details.id,
        type: asset.asset_details.type,
        url: asset.asset_details.url,
        name: asset.asset_details.name,
      };
    });
    return media;
  };

  useEffect(() => {
    if (autoOpenComments === true) {
      setTimeout(() => {
        openNewCommentBottomSheet();
      }, 500);
    }
  }, []);

  const hasCustomFields = task?.custom_field_item_details?.length > 0;
  const initialState = hasCustomFields ? "custom" : "all-messages";

  const [commentsData, setCommentsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSubButton, setActiveSubButton] = useState(initialState);

  const subButtons = [
    { id: "all-messages", title: "All Messages" },
    { id: "media", title: "Media" },
  ];

  if (hasCustomFields) {
    subButtons.unshift({ id: "custom", title: "Custom Fields" });
  }

  const [loading, setLoading] = useState({
    updatingTask: false,
    getComments: false,
    postComment: false,
  });

  const commentPostURL = `${apiEndpoint}/core/comments/?context_id=${taskId}&context_type=task`;
  const commentGetURL = `${apiEndpoint}/core/comments/?context_id=${taskId}&context_type=task`;

  const { getComments, loadingGetComments } = useGetComment({
    setCommentsData,
    commentGetURL,
  });

  const { getSingleTask, updateCustomFieldInPopup } = useTaskEndpoints();

  useFocusEffect(
    useCallback(() => {
      getComments();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getComments();
    await getSingleTask(loading, setLoading, taskId, setTask);
    setRefreshing(false);
  };

  const { taskUpdateOptions } = useTaskUpdateOptions({
    task,
    onShowUserFields: (fields, action) =>
      setUserFieldsModal({ visible: true, fields, pendingAction: action }),
    onRefresh,
  });

  const handleUpdateTask = async () => {
    try {
      const options = [
        "Cancel",
        ...taskUpdateOptions.map((option) => option.title),
      ];

      const cancelButtonIndex = 0;

      const handleSelection = async (buttonIndex) => {
        // Ignore Cancel
        setLoading((prev) => ({ ...prev, updatingTask: true }));
        if (buttonIndex === cancelButtonIndex) {
          setLoading((prev) => ({ ...prev, updatingTask: false }));
          return;
        }
        const selectedOption = taskUpdateOptions[buttonIndex - 1];
        // ✅ Execute the original onPress
        await selectedOption?.onPress?.();
        setLoading((prev) => ({ ...prev, updatingTask: false }));
        await onRefresh();
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      } else {
        showActionSheetWithOptions(
          { options, cancelButtonIndex, useModal: true },
          handleSelection,
        );
      }
    } catch (error) {
      console.error("Error opening action sheet:", error);
    }
  };

  const handleUserFieldsSubmit = async (values) => {
    setIsSubmitting(true);
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => !key.endsWith("_modal")),
    );
    try {
      // 1. Save Field data
      await Promise.all(
        Object.entries(cleanedValues).map(([itemId, val]) =>
          updateCustomFieldInPopup(itemId, taskId, val.value, val.is_parent),
        ),
      );

      // 2. Run status change (Complete/Approve/Discard)
      if (userFieldsModal.pendingAction) {
        await userFieldsModal.pendingAction();
      }

      // 3. Clear UI
      setUserFieldsModal({ visible: false, fields: [], pendingAction: null });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Task status updated.",
      });
    } catch (e) {
      console.error(e);
      Toast.show({ type: "error", text1: "Error", text2: "Update failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primaryColors.gray[50],
        borderWidth: 0,
        borderColor: Colors.blue_color,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: SW(16),
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColors.brand[1000]}
            colors={[primaryColors.brand[1000]]}
            progressBackgroundColor={Colors.white}
          />
        }
      >
        <RenderTaskItem
          task={task}
          navigation={navigation}
          onRefresh={onRefresh}
          fromOverview={false}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            borderBottomWidth: SW(1),
            width: "100%",
            borderColor: primaryColors.gray[200],
            gap: SW(16),
            overflow: "hidden",
            // elevation: 1,
            // shadowColor: "#0A0D12",
            // shadowOffset: {
            //   width: 0,
            //   height: 1,
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 2,
          }}
        >
          {subButtons.map((subButton, index) => {
            const isActive = subButton.id === activeSubButton;
            return (
              <SecondaryButton
                key={index}
                title={subButton.title}
                type={isActive ? "default" : "outlined"}
                onPress={() => setActiveSubButton(subButton.id)}
              />
            );
          })}
        </View>

        <Spacing space={SH(16)} />

        {activeSubButton === "all-messages" &&
          commentsData?.length > 0 &&
          commentsData.map((commentData, commentIndex) => (
            <FlatList
              key={commentIndex}
              data={commentData.comments}
              horizontal={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={{ width: "100%" }}
              renderItem={({ item, index }) => {
                return <CommentCard commentData={item} key={index} />;
              }}
            />
          ))}
        {activeSubButton === "media" && task.task_assets_details.length > 0 && (
          <RenderMediaList
            moduleAssets={task.task_assets_details}
            assetsConverter={getMediaForMediaTab}
          />
        )}
        {activeSubButton === "custom" && (
          <CustomFieldDetailView
            customFieldItemDetails={task.custom_field_item_details}
          />
        )}
      </ScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"New Message"}
          onPress={openNewCommentBottomSheet}
          type={!canUpdateTask ? "default" : "outlined"}
        />
        {canUpdateTask && (
          <BottomButton
            title={"Update Task"}
            onPress={async () => await handleUpdateTask()}
            type={"default"}
            disabled={loading.updatingTask}
            icon={
              loading.updatingTask ? (
                <ActivityIndicator size={16} color={"white"} />
              ) : null
            }
          />
        )}
      </View>
      <NewCommentSheet
        fk_project={task.fk_project}
        commentPostURL={commentPostURL}
        onPost={onRefresh}
      />
      <UserCustomFieldsModal
        visible={userFieldsModal.visible}
        fields={userFieldsModal.fields}
        onClose={() =>
          setUserFieldsModal({
            visible: false,
            fields: [],
            pendingAction: null,
          })
        }
        onConfirm={handleUserFieldsSubmit}
        loading={submitting}
      />
      <TaskHistoryBottomSheet />
    </View>
  );
};

export default TaskDetails;
