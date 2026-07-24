import { useSelector } from "react-redux";
import axios from "axios";
import apiEndpoint from "../../../config/apiConfig";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { Platform, Alert } from "react-native";
import { generateTimestampString } from "../utils/noteUtils";
import { useGeneralEndpoints } from "../../../hooks/useGeneralEndpoints";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigation } from "@react-navigation/native";
import { api } from "@/api/client";
import { fetchNotes } from "./notesEndpoints";
import { useState } from "react";

export const useNoteEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const { uploadMedia } = useGeneralEndpoints();
  const selectedProject = useSelector((state) => state.project);

  const navigation = useNavigation();
  const [notesLoading, setNotesLoading] = useState({
    getNotes: false,
  });
  const handleAddNote = async (externalPayload) => {
    const {
      project_id,
      noteTitle,
      note,
      cc,
      selectedMedia,
      setLoading,
      showToast = true,
    } = externalPayload;
    setLoading((prev) => ({ ...prev, AddNote: true }));
    try {
      const payload = {
        title: noteTitle,
        description: note,
        additional_contacts: cc,
      };

      const response = await axios.post(
        `${apiEndpoint}/crm/notes/?project_id=${project_id}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (
        response.status >= 200 &&
        response.status < 300 &&
        selectedMedia.length > 0
      ) {
        const note_id = response.data.result.id;
        const assetResponse = await uploadMedia(selectedMedia, project_id);

        const folderAssetsPayload = assetResponse.data.result.map((asset) => ({
          fk_asset: asset.id,
          fk_note: note_id,
        }));

        await axios.post(
          `${apiEndpoint}/crm/multinoteassets/?note_id=${note_id}`,
          folderAssetsPayload,
          {
            headers: {
              Authorization: `token ${token}`,
              "X-OrganizationID": organization_id,
            },
          },
        );
      }
      if (showToast) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Note added successfully.",
        });
        navigation.pop();
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      if (showToast) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error.response?.data?.result ||
            "Failed to add Note. Check your network connection.",
        });
        await addToSyncQueue("note", {
          id: nanoid(),
          ...externalPayload,
        });
      } else {
        throw error;
      }
    } finally {
      setLoading((prev) => ({ ...prev, AddNote: false }));
    }
  };

  const getNotes = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
  }) => {
    if (!hasMore && page !== 1) return;
    setNotesLoading((prev) => ({ ...prev, getNotes: true }));
    try {
      const response = await fetchNotes(
        page,
        searchTerm,
        pageSize,
        abortSignal,
        selectedProject.id,
      );
      if (response.status >= 200 && response.status < 300) {
        const allData = response.data.results;
        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(updatedData);
        const hasMore = response.data.next !== null;

        return { hasMore };
      }
    } catch (error) {
      console.error("Fetch Notes Error:", error);
    } finally {
      setNotesLoading((prev) => ({ ...prev, getNotes: false }));
    }
  };

  const getSingleNote = async (note_id, setLoading, setNote) => {
    setLoading((prev) => ({ ...prev, getSingleNote: true }));
    try {
      const response = await api.get(
        `${apiEndpoint}/crm/notes/solo/?note_id=${note_id}`,
      );
      if (response.status >= 200 && response.status < 300) {
        setNote(response.data.result);
      }
    } catch (error) {
      console.error("Fetch Notes Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, getSingleNote: false }));
    }
  };

  return { handleAddNote, getNotes, getSingleNote, notesLoading };
};
