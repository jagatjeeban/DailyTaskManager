// CelebrationAnimation.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';

interface CelebrationAnimationProps {
  onAnimationFinish: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ onAnimationFinish }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(
      1,
      { duration: 500, easing: Easing.out(Easing.exp) },
      (isFinished) => {
        if (isFinished) {
          opacity.value = withTiming(1, { duration: 500 }, (opacityFinished) => {
            if (opacityFinished) {
              opacity.value = withDelay(1000, withTiming(0, { duration: 500 }, (finalOpacityFinished) => {
                if (finalOpacityFinished) {
                  runOnJS(onAnimationFinish)();
                }
              }));
            }
          });
        }
      }
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.celebrationContainer, animatedStyle]}>
        <Text style={styles.celebrationText}>🎉 Task Completed! 🎉</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContainer: {
    position:'absolute',
    width:"90%",
    alignSelf:'center',
    padding: 20,
    backgroundColor: 'purple',
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  celebrationText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});

export default CelebrationAnimation;
