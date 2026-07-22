import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Colors, SH, SW, SF } from "../../utils";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { Spacing } from "../../components/common";
import { SecondaryButton } from "../../components/UI/GeneralComponents/SecondaryButton";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import { CommentCard } from "../../components/UI/GeneralComponents/CommentCard";
import { NewCommentSheet } from "../../components/UI/GeneralComponents/NewCommentSheet";
import { openNewCommentBottomSheet } from "../../components/common/NewCommentBottomSheetService";
import { CCContactCard } from "../../components/UI/GeneralComponents/CCContactCard";
import apiEndpoint from "../../config/apiConfig";
import { useGetComment } from "../../hooks/useGetComment";
import RenderMediaList from "../../components/UI/GeneralComponents/RenderMediaList";
import NoteCard from "./components/NoteCard";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { useNoteEndpoints } from "./hooks/useNoteEndPoints";

const NoteDetails = ({ navigation, route }) => {
  const [note, setNote] = useState({ ...route.params.note });
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const [loading, setLoading] = useState({
    getSingleNote: false,
  });
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("comments");
  const [commentsData, setCommentsData] = useState([]);
  const [ccData, setCCData] = useState([]);
  const { getSingleNote } = useNoteEndpoints();
  const commentGetURL = `${apiEndpoint}/core/comments/?context_id=${note.id}&context_type=note`;
  const commentPostURL = `${apiEndpoint}/core/comments/?context_id=${note.id}&context_type=note`;

  const { getComments } = useGetComment({
    setCommentsData,
    commentGetURL,
  });

  useFocusEffect(
    useCallback(() => {
      getComments();
      getCCForDropdown();
      getSingleNote(note?.id, setLoading, setNote);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("note-details"));
    }, []),
  );

  const getCCForDropdown = async () => {
    setLoading((prev) => ({ ...prev, getCCForDropdown: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/core/organization/contacts/lite/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      if (response.status >= 200 && response.status < 300) {
        const assignees = response.data.result.map((item) => ({
          id: item.id,
          name: item.contact_details?.name || "Unknown", // Fallback for missing name
        }));
        console.log("Assigneess", assignees);

        const uniqueAssignees = Array.from(
          new Map(assignees.map((a) => [a.id, a])).values(),
        );
        setCCData(uniqueAssignees);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, getCCForDropdown: false }));
    }
  };

  const tabs = [
    { id: "comments", title: "Comments" },
    { id: "files", title: "Files" },
    { id: "cc", title: "CC" },
  ];

  const getMediaForMediaTab = (assets) => {
    console.log("assets in converter", assets);
    const media = assets.map((asset) => {
      return {
        created_on: note?.created_on,
        id: asset.asset_details.id,
        type: asset.asset_details.type,
        url: asset.asset_details.url,
        name: asset.asset_details.name,
      };
    });
    return media;
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NoteCard note={note} onPress={() => {}} showNoteText={false} />

        <View style={styles.tabWrapper}>
          {tabs.map((tab, index) => (
            <SecondaryButton
              key={tab.id}
              title={tab.title}
              type={activeTab === tab.id ? "default" : "outlined"}
              hasBorderWidth={index !== 0}
              onPress={() => setActiveTab(tab.id)}
            />
          ))}
        </View>

        <Spacing space={SH(16)} />

        {activeTab === "comments" && (
          <View style={styles.tabContent}>
            {commentsData.map((data, i) => (
              <View key={i}>
                {data.comments.map((c, j) => (
                  <CommentCard key={j} commentData={c} />
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === "files" && (
          <RenderMediaList
            moduleAssets={note?.notes_assets_details}
            assetsConverter={getMediaForMediaTab}
          />
        )}

        {activeTab === "cc" && note?.additional_contacts?.length > 0 && (
          <View style={styles.tabContent}>
            {note?.additional_contact_details?.map((contact) => (
              <CCContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}
      </ScrollView>

      {activeTab === "comments" && (
        <View style={styles.bottomNav}>
          <BottomButton
            title="New Message"
            onPress={openNewCommentBottomSheet}
            type="default"
          />
        </View>
      )}

      <NewCommentSheet
        fk_project={note?.fk_project}
        commentPostURL={commentPostURL}
        onPost={getComments}
      />
      {/* <Toast /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.gray[50],
  },
  scrollContent: {
    padding: SW(16),
    paddingBottom: SH(100),
  },
  titleCard: {
    backgroundColor: primaryColors.gray[700],
    padding: SW(12),
    borderRadius: SW(10),
  },
  titleLabel: {
    color: "white",
    fontSize: SF(11),
    fontFamily: "Inter-Regular",
  },
  titleText: {
    color: "white",
    fontSize: SF(18),
    fontFamily: "Inter-Bold",
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: SW(1),
    width: "100%",
    borderColor: primaryColors.gray[200],
    gap: SW(16),
    overflow: "hidden",
  },
  tabContent: {
    width: "100%",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SW(12),
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    borderRadius: SW(10),
    marginBottom: SH(8),
    backgroundColor: "white",
  },
  fileInfo: {
    flex: 1,
    marginLeft: SW(10),
  },
  fileName: {
    fontSize: SF(14),
    color: Colors.primary,
    fontFamily: "Inter-Medium",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: SW(16),
    paddingVertical: SH(12),
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[200],
    zIndex: 99,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  mediaFrame: {
    width: "100%",
    height: "80%",
  },
});

export default NoteDetails;
