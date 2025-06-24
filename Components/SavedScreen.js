// Components/SavedScreen.js
import React, { useContext } from 'react';
import {
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Share,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradientRN from 'react-native-linear-gradient';

import { SavedContext } from '../Components/SavedContext';

/* ─────────── размеры ─────────── */
const { width } = Dimensions.get('window');
const CARD_W   = width * 0.9;
const CARD_H   = CARD_W * 0.5;   // чуть выше, чем раньше
const BORDER   = 3;
const RADIUS   = 12;

/* ─────────── Grad-/Save-/Back-кнопки ─────────── */
const GradBtn = ({ txt, onPress }) => (
  <TouchableOpacity style={styles.gBtnWrap} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.gBtn}>
      <Text style={styles.gBtnTxt}>{txt}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

const SaveBtn = ({ active, onPress }) => (
  <TouchableOpacity style={styles.saveWrap} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.saveBtn}>
      <Image
        source={active ? require('../assets/save2.png') : require('../assets/save.png')}
        style={{ width:20, height:20 }}
        resizeMode="contain"
      />
    </LinearGradientRN>
  </TouchableOpacity>
);

const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onPress}>
    <Svg width={48} height={42}>
      <Defs>
        <SvgLinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFF0B0" />
          <Stop offset="100%" stopColor="#AD7942" />
        </SvgLinearGradient>
      </Defs>
      <Rect
        x={1} y={1} width={46} height={40} rx={20} ry={20}
        fill="#000" stroke="url(#backGrad)" strokeWidth={2}
      />
    </Svg>
    <Image source={require('../assets/back.png')} style={styles.backIcon} resizeMode="contain" />
  </TouchableOpacity>
);

/* ─────────── SavedScreen ─────────── */
export default function SavedScreen() {
  const nav                  = useNavigation();
  const { saved, removePlace } = useContext(SavedContext);

  const sharePlace = async place => {
    try { await Share.share({ title: place.name, message: `${place.name}\n${place.desc}` }); }
    catch {}
  };

  /* ---------- пустой список ---------- */
  if (!saved.length) {
    return (
     
        <SafeAreaView style={{flex:1}}>
          <View style={styles.header}>
            <BackButton onPress={() => nav.goBack()} />
            <GradientTitle>Saved locations</GradientTitle>
          </View>

          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>You don’t have any saved locations yet.</Text>
            <Text style={styles.emptyText}>
              Go back to recommended locations and save what you like.
            </Text>
          </View>
        </SafeAreaView>

    );
  }

  /* ---------- список карточек ---------- */
  return (
    <ImageBackground source={require('../assets/background.png')} style={{flex:1}} resizeMode="cover">
      <SafeAreaView style={{flex:1}}>
        <View style={styles.header}>
          <BackButton onPress={() => nav.goBack()} />
          <GradientTitle>Saved locations</GradientTitle>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {saved.map(place => (
            <View key={place.id} style={styles.cardWrap}>
              {/* рамка */} 
              <Svg width={CARD_W} height={CARD_H + 110} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id={`grad-${place.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#FFF0B0" />
                    <Stop offset="100%" stopColor="#AD7942" />
                  </SvgLinearGradient>
                </Defs>
                <Rect
                  x={BORDER/2} y={BORDER/2}
                  width={CARD_W - BORDER} height={CARD_H + 110 - BORDER}
                  rx={RADIUS}
                  fill="#2d2d2d"
                  stroke={`url(#grad-${place.id})`}
                  strokeWidth={BORDER}
                />
              </Svg>

              {/* содержимое карточки */}
              <View style={styles.cardContent}>
                <Image source={place.img} style={styles.img} resizeMode="cover" />
                <Text style={styles.title}>{place.name}</Text>

                <View style={styles.row}>
                  <GradBtn txt="Open"
                           onPress={() => nav.navigate('Map', { lat:place.lat, lng:place.lng })}/>
                  <GradBtn txt="Share" onPress={() => sharePlace(place)} />
                  <SaveBtn active onPress={() => removePlace(place.id)} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

/* ─────────── заголовок с градиентом ─────────── */
const GradientTitle = ({ children }) => (
  <MaskedView maskElement={<Text style={styles.hTitle}>{children}</Text>}>
    <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:0}}>
      <Text style={[styles.hTitle,{opacity:0}]}>{children}</Text>
    </LinearGradientRN>
  </MaskedView>
);

/* ─────────── styles ─────────── */
const styles = StyleSheet.create({
  /* общий фон / контейнеры */
  scroll:     { paddingBottom:40, paddingHorizontal:20 },
  cardWrap:   { width:CARD_W, alignSelf:'center', marginBottom:20 },
  cardContent:{ padding:12 },
  img:        { width:CARD_W-24, height:CARD_H, borderRadius:8, marginBottom:12 },
  title:      { fontSize:18, fontWeight:'700', color:'#FFF', marginBottom:12 },
  row:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },

  /* Header */
  header:{ flexDirection:'row',      // горизонтальная шапка
              alignItems:'center',
               justifyContent:'center',   // 👉 центрируем содержимое
               paddingTop: Platform.OS==='ios'?60:40,
               paddingHorizontal:20,
               marginBottom:30  , marginTop:-40},
  hTitle:{ fontSize:24, fontWeight:'700', color:'#fff' },

  backBtn:{ position:'absolute',     // 👉 вынимаем из потока
                left:20, top: Platform.OS==='ios'?50:40,
                width:48, height:42,
                justifyContent:'center', alignItems:'center' },
  backIcon:{ position:'absolute', width:20, height:20 },

  /* Пустой экран */
  emptyWrap:{ flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:30 },
  emptyTitle:{ fontSize:18, fontWeight:'700', color:'#FFF', textAlign:'center', marginBottom:12 },
  emptyText:{ fontSize:14, color:'#DDD', textAlign:'center' },

  /* Grad-кнопка */
  gBtnWrap:{ flex:1, marginHorizontal:4 },
  gBtn:{ height:40, borderRadius:10, justifyContent:'center', alignItems:'center' },
  gBtnTxt:{ fontSize:15, fontWeight:'700', color:'#000' },

  /* Save-кнопка */
  saveWrap:{ width:44, height:44, borderRadius:10 },
  saveBtn:{ flex:1, borderRadius:10, justifyContent:'center', alignItems:'center' },
});
