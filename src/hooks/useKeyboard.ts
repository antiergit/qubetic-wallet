import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { hasDynamicIsland, hasNotch } from 'react-native-device-info';

const useKeyboard = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const newBottomMargin = hasNotch() || hasDynamicIsland() ? 25 : 15;

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(
                Platform.OS == 'ios' ? e.endCoordinates.height + 10 : e.endCoordinates.height,
            );

            setIsKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setIsKeyboardOpen(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const resetKeyboardHeight = () => {
        setKeyboardHeight(0)
    }

    return { isKeyboardOpen, keyboardHeight, newBottomMargin, resetKeyboardHeight };
};

export { useKeyboard };
