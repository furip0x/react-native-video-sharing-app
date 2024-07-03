import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import EmptyState from "../../components/EmptyState"
import SearchInput from "../../components/SearchInput"
import VideoCard from "../../components/VideoCard"
import { searchPosts } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppwrite"

const Search = () => {
  const { query } = useLocalSearchParams()
  const {
    data: posts,
    isLoading,
    refetch,
  } = useAppwrite(() => searchPosts(query))
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary w-full h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Search results
              </Text>
              <Text className="font-psemibold text-2xl text-gray-100">
                {query}
              </Text>
            </View>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found."
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search
