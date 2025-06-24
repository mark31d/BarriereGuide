// Components/Onboarding.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const CARD_H = height * 0.42;

const SLIDES = [
  {
    key: 'greet',
    bg: require('../assets/bg.png'),
    img: require('../assets/guide.png'),
    title: 'Greetings',
    text: `Bonjour! My name is Elise, I am your personal guide in the charming city of Barrière.\n\nTogether we will discover the most interesting corners that are not written about in guidebooks. Ready for an adventure?`,
  },
  {
    key: 'recommend',
    bg: require('../assets/bg2.png'),
    img: require('../assets/guide.png'),
    title: 'Recommended places',
    text: `I have already selected the most interesting locations of the city for you – from cozy cafes to unique historical places.\n\nJust browse the recommendations, and we will find what you like.`,
  },
  {
    key: 'map',
    bg: require('../assets/bg3.png'),
    img: require('../assets/guide.png'),
    title: 'Map and favorites',
    text: `All locations – on an interactive map so you don't get lost.\n\nYou can also save your favorite places to easily return to them.`,
  },
  {
    key: 'diary',
    bg: require('../assets/bg4.png'),
    img: require('../assets/guide1.png'),
    title: 'Tourist diary',
    text: `After visiting a place, don't forget to leave a comment, rate it and save the memory in your tourist diary.\n\nThis is your story at Barrière – make it special!`,
  },
];

export default function Onboarding() {
  const nav = useNavigation();
  const flatRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      nav.replace('Home');
    }
  };

  const onViewable = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.bg}
            style={styles.bg}
            resizeMode="cover"
            blurRadius={2}
          >
            <Image
              source={item.img}
              style={styles.guide}
              resizeMode="contain"
            />

            <ScrollView style={styles.card} contentContainerStyle={styles.cardContent}>
              {/* Title with gradient fill */}
              <MaskedView maskElement={<Text style={styles.title}>{item.title}</Text>}>
                <LinearGradient
                  colors={['#FFF3B0', '#C69439']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.title, { opacity: 0 }]}>{item.title}</Text>
                </LinearGradient>
              </MaskedView>

              {/* Body text in solid white */}
              <Text style={styles.text}>{item.text}</Text>

              <TouchableOpacity activeOpacity={0.85} onPress={handleNext}>
                <LinearGradient
                  colors={['#FFF3B0', '#C69439']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <Text style={styles.btnLabel}>
                    {index === SLIDES.length - 1 ? 'Start' : 'Next'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </ImageBackground>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    width,
    height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  guide: {
    width: width * 0.55,
    height: height * 0.55,
    marginTop: Platform.OS === 'ios' ? 33 : 36,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width,
    height: CARD_H + 16,
    backgroundColor: '#2A2929',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  btn: {
    marginTop: 24,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
