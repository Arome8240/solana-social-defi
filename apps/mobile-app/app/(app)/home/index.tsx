import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  return (
    <SafeAreaView className='flex-1 p-5'>
      <View>
        <Text>index</Text>
      </View>
    </SafeAreaView>
  )
}