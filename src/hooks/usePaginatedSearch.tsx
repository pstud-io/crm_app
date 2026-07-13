import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export interface GetDataProps<T> {
  data: T[];
  setData: Dispatch<SetStateAction<T[]>> | (() => void);
  page: number;
  hasMore: boolean;
  searchTerm: string;
  abortSignal: AbortSignal | undefined;
  pageSize: number;
}

export interface PaginatedSearch<T> {
  data: T[];
  setData: Dispatch<SetStateAction<T[]>> | (() => void);
  getData: (
    params: GetDataProps<T>,
  ) => Promise<Record<"hasMore", boolean> | undefined>;
  loading: boolean;
  pageSize: number;
}

export function usePaginatedSearch<T>({
  data,
  setData,
  getData,
  loading,
  pageSize,
}: PaginatedSearch<T>) {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const createController = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
  }, []);

  const onSearch = useCallback(
    async (text: string) => {
      if (text === "" && searchTerm === "") return;
      setSearchTerm(text);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        setPage(1);
        setHasMore(true);
        const controller = await createController();
        const res = await getData({
          data,
          setData,
          page: 1,
          hasMore: true,
          searchTerm: text,
          abortSignal: controller.signal,
          pageSize,
        });
        if (res) setHasMore(res.hasMore);
      }, 500);
    },
    [searchTerm, data, setData, getData, pageSize, createController],
  );

  const onEndReached = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log("From on end reached");
      const controller = await createController();
      const res = await getData({
        data,
        setData,
        page: nextPage,
        hasMore: hasMore,
        searchTerm: searchTerm,
        abortSignal: controller.signal,
        pageSize: pageSize,
      });
      console.log("This is next page and has more", nextPage, res?.hasMore);
      setPage(nextPage);
      if (res) setHasMore(res.hasMore);
    }
  }, [
    loading,
    hasMore,
    page,
    data,
    searchTerm,
    setData,
    getData,
    pageSize,
    createController,
  ]);

  const onFocus = useCallback(async () => {
    console.log("From on animate");
    const controller = await createController();
    const res = await getData({
      data,
      setData,
      page: 1,
      hasMore: true,
      searchTerm: "",
      abortSignal: controller.signal,
      pageSize: pageSize,
    });
    if (res) setHasMore(res?.hasMore);
  }, [data, setData, getData, pageSize, createController]);

  const onRefresh = useCallback(async () => {
    console.log("From on animate");
    const controller = await createController();
    const res = await getData({
      data,
      setData,
      page: 1,
      hasMore: true,
      searchTerm: "",
      abortSignal: controller.signal,
      pageSize: pageSize,
    });
    if (res) setHasMore(res?.hasMore);
  }, [data, setData, getData, pageSize, createController]);

  const onAbort = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  return {
    onFocus,
    onSearch,
    onEndReached,
    onRefresh,
    refreshing,
    setRefreshing,
    onAbort,
  };
}
