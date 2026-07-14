import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import { generateTimestampString } from "../utils";
import apiEndpoint from "../config/apiConfig";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { closeNewCommentBottomSheet } from "../components/common/NewCommentBottomSheetService";
import { useGeneralEndpoints } from "./useGeneralEndpoints";

export const usePostComment = ({
  loading,
  setLoading,
  commentPostURL,
  comment,
  selectedMedia,
  fk_project,
  mentions,
  onPost,
  project_asset_group_id,
  project_asset_id,
}) => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const { uploadMedia } = useGeneralEndpoints();

  const buildCommentTags = (comment, mentions) => {
    const tags = [];
    const usedPositions = new Set();

    mentions.forEach(({ name, id }) => {
      let startIndex = 0;

      console.log("🔍 Mention found:", name, id);

      while (startIndex < comment.length) {
        const index = comment.indexOf(name, startIndex);
        if (index === -1) break;

        const start = index;
        const end = index + name.length;
        const tagKey = `${start}-${end}`;

        if (!usedPositions.has(tagKey)) {
          tags.push({
            start,
            end,
            fk_organization_contact: id, // keep mapping to backend field
          });
          usedPositions.add(tagKey);
          // ✅ move past this full match so we can find the next occurrence
          startIndex = end;
        } else {
          // fallback advance if same span somehow re-matches
          startIndex = index + 1;
        }
      }
    });

    return tags.filter((tag) => tag.end <= comment.length);
  };

  const postComment = async () => {
    if (comment.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Comment cannot be empty.",
      });
      return;
    }

    // const plainTextComment = stripMentionMarkup(comment);
    setLoading({ ...loading, postComment: true });
    try {
      const assetResponse = await uploadMedia(selectedMedia, fk_project);
      if (assetResponse.status >= 200 && assetResponse.status < 300) {
        console.log("Asset response:", assetResponse.data);
        const fk_asset = assetResponse?.data?.result.map((asset) => asset.id);
        console.log("Asset IDs:", fk_asset);
        const comment_tags = buildCommentTags(comment, mentions || []);

        // Step 4: Post comment with asset ID
        const payload = {
          fk_asset: fk_asset ? fk_asset : [],
          text: comment,
          comment_tags: comment_tags || [],
        };

        if (project_asset_group_id) {
          payload.project_asset_group_id = project_asset_group_id;
          payload.project_asset_id = project_asset_id;
        }

        console.log(
          "Payload in new comment sheet",
          payload,
          project_asset_group_id,
          project_asset_id,
        );
        const commentPostResponse = await axios.post(commentPostURL, payload, {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        });

        if (
          commentPostResponse.status >= 200 &&
          commentPostResponse.status < 300
        ) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Comment added successfully.",
            visibilityTime: 1000,
            autoHide: true,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to add comment. Check your network connection.",
        visibilityTime: 1000,
        autoHide: true,
      });
    } finally {
      setLoading({ ...loading, postComment: false });

      closeNewCommentBottomSheet();
      await onPost();
    }
  };

  return { postComment };
};
