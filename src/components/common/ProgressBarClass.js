import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet ,Image} from "react-native";
import { moderateScale, verticalScale } from "../../layouts/responsive";
import { ThemeManager } from "../../../ThemeManager";
import images from "../../theme/Images";

const ProgressBarClass = () => {
  const [selectedStep, setSelectedStep] = useState(null);

  const handleStepSelect = (step) => {
    setSelectedStep(step);
  };
    const [selectedProgress, setSelectedProgress] = useState('low');
  
    const handleProgressClick = (value) => {
      setSelectedProgress(value);
    };
  
    const getProgressStyle = () => {
      const progressWidth = '33.33%'; // Adjust based on desired dot size
  
      switch (selectedProgress) {
        case 'low':
          return { width: progressWidth };
        case 'average':
          return { width: progressWidth * 2 };
        case 'high':
          return { width: '100%' };
        default:
          return { width: progressWidth };
      }
    };
  
    return (
      <View style={{ marginTop: verticalScale(60) }}>
        <Image
          source={images.progressbar}
          resizeMode={"contain"}
          style={{ width: "100%" }}
        />
        
        
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLine: {
    flexDirection: 'row',
    width: '80%',
    height: 4, // Adjust height as needed
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  progressLineInner: {
    flex: 1,
    backgroundColor: '#bbb',
  },
  progressDot: {
    width: 10, // Adjust dot size
    height: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 5, // Adjust spacing between dots
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotFilled: {
    backgroundColor: 'blue', // Change fill color
    width: 6, // Adjust filled dot size
    height: 6,
    borderRadius: 50,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 10, // Adjust spacing between dots and text
  },
  text: {
    fontSize: 12,
  },
});

export default ProgressBarClass;
