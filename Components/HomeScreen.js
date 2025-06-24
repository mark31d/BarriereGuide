// Components/HomeScreen.js
/* eslint-disable global-require */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const BTN_H  = 58;
const CARD_W = width * 0.9;
const CARD_H = CARD_W * 0.5;

const MenuBtn = ({ label, onPress }) => (
  <TouchableOpacity
    style={styles.menuBtn}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <LinearGradient
      colors={['#FFF0B0', '#AD7942']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.btn}
    >
      <Text style={styles.btnLabel}>{label}</Text>
      <Image
        source={require('../assets/arrow.png')}
        style={styles.arrow}
        resizeMode="contain"
      />
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const nav = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Логотип */}
        <Image
          source={require('../assets/logoB.png')}
          style={styles.logoB}
          resizeMode="contain"
        />

        {/* Меню */}
        <View style={styles.menu}>
          <MenuBtn
            label="Recommended locations"
            onPress={() => nav.navigate('Categories')}
          />
          <MenuBtn
            label="Saved locations"
            onPress={() => nav.navigate('Saved')}
          />
          <MenuBtn
            label="Tourist’s diary"
            onPress={() => nav.navigate('DiaryList')}
          />
        </View>

        {/* Превью-карта с градиентной рамкой */}
        <LinearGradient
          colors={['#FFF0B0', '#AD7942']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.mapCardGradient }
          
        >
          <View style={styles.mapCard}>
            <Image
              source={require('../assets/map_placeholder.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />

            <View style={styles.mapOverlay}>
              <Text style={styles.mapLabel}>Interactive map</Text>
              <TouchableOpacity onPress={() => nav.navigate('Map')}>
                <LinearGradient
                  colors={['#FFF0B0', '#AD7942']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.openBtn}
                >
                  <Text style={styles.openTxt}>Open</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:            { flex: 1, width: '100%' },
  scroll:        { flex: 1 },
  scrollContent: { alignItems: 'center', paddingTop: 70, paddingBottom: 40 },

  logoB: {
    width: 220,
    height: 220,
    marginBottom: -10,
    marginTop: -50,
  },

  menu: {
    width: CARD_W,
    alignSelf: 'center',
  },
  menuBtn: {
    width: '100%',
    marginBottom: 18,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: BTN_H,
    borderRadius: 15,
    width: 340,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  btnLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  arrow: {
    width: 34,
    height: 34,
    right: 15,
  },

  // градиентная рамка
  mapCardGradient: {
    width: CARD_W,
    height: CARD_H,
    marginTop: 26,
    borderRadius: 14, // чуть больше, чем внутренняя карта
    padding: 2,       // толщина рамки
    
  },
  // внутренняя «карта»
  mapCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1,
  },
  mapLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  openBtn: {
    width: 150,
    height: 45,
    paddingHorizontal: 27,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 2,
    left: 30,
  },
  openTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
