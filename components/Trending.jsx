import { ResizeMode, Video } from "expo-av"
import React, { useState } from "react"
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native"
import * as Animatable from "react-native-animatable"
import { icons } from "../constants"

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.05,
  },
}

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
}

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false)

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }}
          className="w-52 h-72 rounded-[35px] bg-white/10 mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false)
            }
          }}
          onError={(error) => console.error("Video playback error:", error)}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0])

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.$id}
      renderItem={({ item: post }) => (
        <TrendingItem item={post} activeItem={activeItem} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{
        x: 145,
      }}
    />
  )
}

export default Trending
