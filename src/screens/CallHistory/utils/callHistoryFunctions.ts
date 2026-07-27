import { createRef } from "react";

export interface CallHistoryRefreshRef {
  onRefresh: () => Promise<void> | void;
}

export const callHistoryRefreshRef = createRef<CallHistoryRefreshRef>();
