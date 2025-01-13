import React from 'react';

import { StyleSheet, View, Image, Dimensions } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import { Images } from '../../../theme';


function CustomQRCode({ address }: { address: string }) {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const pieceSize = Math.min(screenWidth, screenHeight) * 0.019;
  console.log("pieceSize>>>", pieceSize);
  console.log("address>>>", address?.length);

  return (
    <View>
      <QRCodeStyled
        height={300}
        width={300}

        data={address}
        style={styles.svg}
        pieceScale={0.6}
        padding={address?.length > 43 ? 30 : 28}
        pieceSize={address?.length > 43
          ? pieceSize * 1.24
          : pieceSize * 1.22}
        // pieceSize={8}
        pieceBorderRadius={address?.length > 43 ? 5 : 4}
        gradient={{
          type: 'radial',
          options: {
            center: [0.5, 0.6],
            radius: [0.5, 0.5],
            colors: ['#AA89D4', '#FFFFFF'],
            locations: [0, 1],
          },
        }}
        outerEyesOptions={{
          gradient: {},
          // color: '#AA89D4',
          // borderRadius: 20,
        }}
        innerEyesOptions={{
          gradient: {},
          // color: '#AA89D4',
          // borderRadius: 12,
          // scale: 0.85,
        }}

        logo={{
          href: Images.welcomelogo,
          padding: 1,
          scale: address?.length > 43 ? 1 : 1.2,
        }}
      />

      <Image
        source={Images.qrSideIcon}

        style={[{
          minHeight: 65,
          minWidth: 65,
          position: "absolute", top: 25, left: 30, height: 60, width: 60,
        }]} />
      <Image
        source={Images.qrSideIcon}
        style={[{
          minHeight: 65,
          minWidth: 65,
          position: "absolute", top: 25, right: 30, zIndex: 1, height: 60, width: 60
        }]} />
      <Image
        source={Images.qrSideIcon}
        style={[{
          minHeight: 65,
          minWidth: 65, position: "absolute", bottom: 25, left: 30, zIndex: 2, height: 60, width: 60
        }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default CustomQRCode;