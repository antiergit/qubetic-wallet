import { View, Text, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
const QRCodeScannerNew = (props) => {
    const [isShowBlankView, setShowBlankView] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowBlankView(true)
        }, 150)
    }, [])

    return (
        <View style={{ flex: 0.95, justifyContent: "center", alignItems: "center" }}>

            <QRCodeScanner
                cameraStyle={props.cameraStyle}
                onRead={props?.onRead}
                reactivate={true}
                reactivateTimeout={1000}
            />

        </View>

    )
}

export { QRCodeScannerNew }