import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import SingleCard from '../molecules/singleCard'
import { verticalScale } from '../../../layouts/responsive'

const Datalist = () => {
    return (
        <View style={{ height: verticalScale(500) }}>

            <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8, 9]} renderItem={() => <SingleCard />} />

        </View>)
}

export default Datalist

const styles = StyleSheet.create({})