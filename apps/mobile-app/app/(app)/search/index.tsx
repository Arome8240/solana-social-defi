import { View, ScrollView, Pressable, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { searchAPI } from "@/lib/api";
import { SearchNormal1, User, TrendUp, Clock } from "iconsax-react-nativejs";
import { X } from "lucide-react-native";

type SearchCategory = "all" | "users" | "tokens" | "posts";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    searchOpacity.value = withTiming(1, { duration: 600 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchQuery, activeCategory],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;

      switch (activeCategory) {
        case "users":
          return searchAPI.searchUsers(searchQuery);
        case "tokens":
          return searchAPI.searchTokens(searchQuery);
        case "posts":
          return searchAPI.searchPosts(searchQuery);
        default:
          return searchAPI.searchAll(searchQuery);
      }
    },
    enabled: searchQuery.length > 0,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: searchAPI.getTrending,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches(recentSearches.filter((q) => q !== query));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Search Header */}
        <Animated.View style={searchAnimatedStyle} className="px-6 pt-6">
          <View className="mb-4 flex-row items-center gap-3 rounded-xl bg-gray-50 px-4">
            <SearchNormal1 size={20} color="#6b7280" />
            <TextInput
              placeholder="Search users, tokens, posts..."
              value={searchQuery}
              onChangeText={handleSearch}
              className="flex-1 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch}>
                <X size={20} color="#6b7280" />
              </Pressable>
            )}
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              <CategoryTab
                label="All"
                active={activeCategory === "all"}
                onPress={() => setActiveCategory("all")}
              />
              <CategoryTab
                label="Users"
                active={activeCategory === "users"}
                onPress={() => setActiveCategory("users")}
              />
              <CategoryTab
                label="Tokens"
                active={activeCategory === "tokens"}
                onPress={() => setActiveCategory("tokens")}
              />
              <CategoryTab
                label="Posts"
                active={activeCategory === "posts"}
                onPress={() => setActiveCategory("posts")}
              />
            </View>
          </ScrollView>
        </Animated.View>

        {/* Content */}
        <Animated.View style={contentAnimatedStyle} className="flex-1">
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {searchQuery.length === 0 ? (
              <View>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <View className="mb-6">
                    <Text className="mb-3 text-lg font-semibold text-gray-900">
                      Recent Searches
                    </Text>
                    <View className="gap-2">
                      {recentSearches.map((query, index) => (
                        <RecentSearchItem
                          key={index}
                          query={query}
                          onPress={() => handleRecentSearch(query)}
                          onRemove={() => removeRecentSearch(query)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Trending */}
                {trending && (
                  <View className="mb-6">
                    <View className="mb-3 flex-row items-center gap-2">
                      <TrendUp size={20} color="#ef4444" variant="Bold" />
                      <Text className="text-lg font-semibold text-gray-900">
                        Trending Now
                      </Text>
                    </View>
                    <View className="gap-2">
                      {trending.topics?.map((topic: any, index: number) => (
                        <TrendingItem
                          key={index}
                          topic={topic}
                          onPress={() => handleSearch(topic.name)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Popular Tokens */}
                {trending?.tokens && (
                  <View className="mb-6">
                    <Text className="mb-3 text-lg font-semibold text-gray-900">
                      Popular Tokens
                    </Text>
                    <View className="gap-2">
                      {trending.tokens.map((token: any) => (
                        <TokenCard key={token.symbol} token={token} />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="pb-6">
                {isLoading ? (
                  <View className="items-center py-12">
                    <Text className="text-gray-500">Searching...</Text>
                  </View>
                ) : searchResults ? (
                  <View className="gap-6">
                    {/* Users Results */}
                    {searchResults.users && searchResults.users.length > 0 && (
                      <View>
                        <Text className="mb-3 text-lg font-semibold text-gray-900">
                          Users
                        </Text>
                        <View className="gap-2">
                          {searchResults.users.map((user: any) => (
                            <UserCard key={user.id} user={user} />
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Tokens Results */}
                    {searchResults.tokens &&
                      searchResults.tokens.length > 0 && (
                        <View>
                          <Text className="mb-3 text-lg font-semibold text-gray-900">
                            Tokens
                          </Text>
                          <View className="gap-2">
                            {searchResults.tokens.map((token: any) => (
                              <TokenCard key={token.symbol} token={token} />
                            ))}
                          </View>
                        </View>
                      )}

                    {/* Posts Results */}
                    {searchResults.posts && searchResults.posts.length > 0 && (
                      <View>
                        <Text className="mb-3 text-lg font-semibold text-gray-900">
                          Posts
                        </Text>
                        <View className="gap-2">
                          {searchResults.posts.map((post: any) => (
                            <PostCard key={post.id} post={post} />
                          ))}
                        </View>
                      </View>
                    )}

                    {/* No Results */}
                    {(!searchResults.users ||
                      searchResults.users.length === 0) &&
                      (!searchResults.tokens ||
                        searchResults.tokens.length === 0) &&
                      (!searchResults.posts ||
                        searchResults.posts.length === 0) && (
                        <View className="items-center py-12">
                          <SearchNormal1 size={48} color="#d1d5db" />
                          <Text className="mt-4 text-center text-gray-500">
                            No results found for &quot;{searchQuery}&quot;
                          </Text>
                          <Text className="mt-2 text-center text-sm text-gray-400">
                            Try different keywords
                          </Text>
                        </View>
                      )}
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function CategoryTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${
        active ? "bg-blue-600" : "bg-gray-100"
      }`}
    >
      <Text
        className={`font-medium ${active ? "text-white" : "text-gray-700"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function RecentSearchItem({
  query,
  onPress,
  onRemove,
}: {
  query: string;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100"
    >
      <View className="flex-row items-center gap-3">
        <Clock size={20} color="#6b7280" />
        <Text className="text-gray-900">{query}</Text>
      </View>
      <Pressable onPress={onRemove}>
        <X size={18} color="#9ca3af" />
      </Pressable>
    </Pressable>
  );
}

function TrendingItem({ topic, onPress }: { topic: any; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100"
    >
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{topic.name}</Text>
        <Text className="text-sm text-gray-500">
          {topic.count} {topic.count === 1 ? "post" : "posts"}
        </Text>
      </View>
      <TrendUp size={20} color="#ef4444" variant="Bold" />
    </Pressable>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <Pressable className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-4 active:bg-gray-100">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-600">
        <Text className="text-lg font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{user.username}</Text>
        <Text className="text-sm text-gray-500">
          {user.followers} followers
        </Text>
      </View>
      <User size={20} color="#6b7280" />
    </Pressable>
  );
}

function TokenCard({ token }: { token: any }) {
  return (
    <Pressable
      onPress={() => router.push("/(app)/home/swap")}
      className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4 active:bg-gray-100"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <Text className="text-lg font-bold text-gray-700">
            {token.symbol.charAt(0)}
          </Text>
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{token.symbol}</Text>
          <Text className="text-sm text-gray-500">{token.name}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-gray-900">
          ${token.price.toFixed(2)}
        </Text>
        <Text
          className={`text-sm font-medium ${
            token.change24h >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {token.change24h >= 0 ? "+" : ""}
          {token.change24h.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Pressable className="rounded-xl bg-gray-50 p-4 active:bg-gray-100">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-600">
          <Text className="text-sm font-bold text-white">
            {post.author.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="font-semibold text-gray-900">
          {post.author.username}
        </Text>
      </View>
      <Text className="text-gray-700" numberOfLines={3}>
        {post.content}
      </Text>
      <View className="mt-2 flex-row items-center gap-4">
        <Text className="text-sm text-gray-500">{post.likes} likes</Text>
        <Text className="text-sm text-gray-500">{post.comments} comments</Text>
      </View>
    </Pressable>
  );
}
