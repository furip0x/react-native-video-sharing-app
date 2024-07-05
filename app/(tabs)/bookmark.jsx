import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { getSavedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Bookmark = () => {
  const { data: savedPosts, refetch } = useAppwrite(getSavedPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView className="bg-primary w-full h-full">
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} handleOnSave={() => refetch()} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <Text className="font-psemibold text-2xl text-gray-100">
              Saved Videos
            </Text>

            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Saved Videos Found." subtitle="" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
