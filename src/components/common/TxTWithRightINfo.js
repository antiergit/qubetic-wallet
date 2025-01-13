import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
// import { images } from '../Theme/Images'
import { Colors } from '../../theme'
import { ThemeManager } from '../../../ThemeManager'
import images from '../../theme/Images'

const TxTWithRightINfo = ({

    main_CONTAINER,
    LeftTxtStyle,
    LeftTxt_Label,
    RightInfo_container,
    rigthTxtStyle,
    righttxt_label_first,
    right_Icon,
    img_styling,
    righttxt_label_scnd,
    rigthTxt_scnd_Style,
    righttxt_label_third,
    rigthTxt_third_Style



}) => {
    return (
        <View style={main_CONTAINER}>
            <Text style={LeftTxtStyle}>{LeftTxt_Label}</Text>
            <View style={RightInfo_container}>
                <Text style={rigthTxtStyle}>{righttxt_label_first}</Text>
                {right_Icon &&
                    <Image source={right_Icon} style={img_styling} />
                }
                {righttxt_label_scnd &&
                    <Text style={rigthTxt_scnd_Style}>{righttxt_label_scnd}</Text>
                }
                {righttxt_label_third &&
                    <Text style={rigthTxt_third_Style}>{righttxt_label_third}</Text>
                }
            </View>

        </View>
    )
}

export default TxTWithRightINfo

