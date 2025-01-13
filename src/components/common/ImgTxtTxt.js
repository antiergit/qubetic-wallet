import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const ImgTxtTxt = ({
    txt1,
    txt2,
    imgSrc,
    main_container = styles.BNB_Container,
    ImageStyle = styles.Token_Icon,
    txt1_style = styles.Token_Name,
    txt2_style = styles.BEP_txt,

}) => {


    return (
        <View style={main_container}>
            {imgSrc &&
                <Image style={ImageStyle} source={{ uri: imgSrc }} />

            }
            <Text style={[txt1_style]}>{txt1}</Text>
            <Text style={txt2_style}>{txt2}</Text>
        </View>
    )
}

export default ImgTxtTxt

const styles = StyleSheet.create({

    BNB_Container: {
        alignItems: "center",

    },
    Token_Icon: {
        height: 39,
        width: 39,
        marginBottom: "3%"
    },
    Token_Name: {
        fontSize: 18,
        fontWeight: "600",
    },
    BEP_txt: {
        fontSize: 11,
    },

})