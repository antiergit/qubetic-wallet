import React from 'react'
import Svg, { Line } from 'react-native-svg';
import { ThemeManager } from '../../../ThemeManager';

const DottedLine = () => {
    return (
        <Svg height="10" width="60%">
            <Line
                x1="0"
                y1="5"
                x2="100%"
                y2="5"
                stroke={ThemeManager.colors.blackWhiteText}
                strokeWidth="1.5"
            />
        </Svg>
    );
};

export default DottedLine