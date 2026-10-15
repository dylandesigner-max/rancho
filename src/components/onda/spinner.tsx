import LoaderCircle from 'lucide-react-native/icons/loader-circle';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Ícone loader-circle girando. Usado no estado Loading do Button. */
export function Spinner({ color, size = 20 }: { color: string; size?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 800, easing: Easing.linear }), -1);
  }, [rotation]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View style={style}>
      <LoaderCircle color={color} size={size} strokeWidth={2.5} />
    </Animated.View>
  );
}
