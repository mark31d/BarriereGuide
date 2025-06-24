// screens/LocationDetails.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradientRN from 'react-native-linear-gradient';

import { CATEGORIES }   from '../Components/places';
import { SavedContext } from '../Components/SavedContext';   // ← контекст

/* ─────────── UI constants ─────────── */
const BORDER_R = 18;
const CARD_H   = 220;

/* ─────────── helpers ─────────── */
const findPlaceById = id => {
  for (const cat of CATEGORIES) {
    const item = cat.items?.find(p => p.id === id);
    if (item) return { ...item, categoryId: cat.id };
  }
  return null;
};

/* ─────────── BackButton ─────────── */
const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backBtn} onPress={onPress} activeOpacity={0.85}>
    <Svg width={48} height={42}>
      <Defs>
        <LinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFF0B0" />
          <Stop offset="100%" stopColor="#AD7942" />
        </LinearGradient>
      </Defs>
      <Rect x={1} y={1} width={46} height={40} rx={20} ry={20}
            fill="#000" stroke="url(#backGrad)" strokeWidth={2}/>
    </Svg>
    <Image source={require('../assets/back.png')} style={styles.backIcon} resizeMode="contain" />
  </TouchableOpacity>
);

/* ─────────── Screen ─────────── */
export default function LocationDetails() {
  const nav            = useNavigation();
  const { id }         = useRoute().params || {};
  const place          = findPlaceById(id);

  /* --- контекст сохранённых --- */
  const { saved, addPlace, removePlace } = useContext(SavedContext);
  const isSaved = saved.some(p => p.id === place?.id);
  const toggleSave = () => (isSaved ? removePlace(place.id) : addPlace(place));

  if (!place) {
    return (
      <View style={[styles.container, { justifyContent:'center', alignItems:'center' }]}>
        <Text style={{ color:'#fff', fontSize:18 }}>Location not found</Text>
        <GradBtn txt="Back" onPress={() => nav.goBack()} />
      </View>
    );
  }

  /* ――― handlers ――― */
  const handleShare = async () => {
    try {
      await Share.share({
        title  : place.name,
        message: `${place.name}\n${place.lat}, ${place.lng}`,
      });
    } catch {}
  };

  /** внутренний экран-карта вместо внешнего браузера */
  const openMap = () =>
    nav.navigate('Map', { lat: place.lat, lng: place.lng, title: place.name });

  /* ――― UI ――― */
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom:40 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <BackButton onPress={() => nav.goBack()} />
        <MaskedView style={styles.h1Wrap} maskElement={<Text style={styles.h1}>Recommended locations</Text>}>
          <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={[styles.h1,{opacity:0}]}>Recommended locations</Text>
          </LinearGradientRN>
        </MaskedView>
      </View>

      {/* CARD */}
      <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.cardGrad}>
        <View style={styles.cardInner}>
          <Image source={place.img} style={styles.img} resizeMode="cover"/>

          <Text style={styles.title}>{place.name}</Text>

          {/* координаты */}
          <View style={styles.coordRow}>
            <Svg width={20} height={24} viewBox="0 0 24 24">
              <Defs>
                <LinearGradient id="pin" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#FFF0B0"/><Stop offset="100%" stopColor="#AD7942"/>
                </LinearGradient>
              </Defs>
              <Path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"
                    fill="none" stroke="url(#pin)" strokeWidth={2}/>
              <Circle cx="12" cy="9" r="2.5" fill="url(#pin)" />
            </Svg>
            <Text style={styles.coords}>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</Text>
          </View>

          <Text style={styles.subtitle}>Description:</Text>
          <Text style={styles.desc}>{place.desc}</Text>

          <View style={styles.row}>
            <GradBtn txt="Map"   onPress={openMap} />
            <GradBtn txt="Share" onPress={handleShare} />
            <SaveBtn active={isSaved} onPress={toggleSave} />
          </View>
        </View>
      </LinearGradientRN>
    </ScrollView>
  );
}

/* ─────────── Buttons ─────────── */
const GradBtn = ({ txt, onPress }) => (
  <TouchableOpacity style={styles.btnWrap} onPress={onPress} activeOpacity={0.85}>
    <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.btn}>
      <Text style={styles.btnTxt}>{txt}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

const SaveBtn = ({ active, onPress }) => (
  <TouchableOpacity style={styles.iconWrap} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.iconBtn}>
      <Image
        source={active ? require('../assets/save2.png') : require('../assets/save.png')}
        style={styles.iconImg}
        resizeMode="contain"
      />
    </LinearGradientRN>
  </TouchableOpacity>
);

/* ─────────── styles ─────────── */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#000' },

  header:{ flexDirection:'row', alignItems:'center', paddingTop:60, paddingHorizontal:10, marginBottom:20 },
  backBtn:{ width:48, height:42, justifyContent:'center', alignItems:'center' },
  backIcon:{ position:'absolute', width:20, height:20 },

  h1Wrap:{ flex:1, marginLeft:8 },
  h1:{ fontSize:24, fontWeight:'700', color:'#FFF' },

  cardGrad:{ borderRadius:BORDER_R+2, marginHorizontal:16, overflow:'hidden' },
  cardInner:{ margin:2, borderRadius:BORDER_R, overflow:'hidden', backgroundColor:'#2d2d2d', paddingBottom:24 },

  img:{ width:'100%', height:CARD_H, borderTopLeftRadius:BORDER_R, borderTopRightRadius:BORDER_R },
  title:{ color:'#FFF', fontSize:24, fontWeight:'700', margin:14, marginBottom:6 },

  coordRow:{ flexDirection:'row', alignItems:'center', marginLeft:14, marginBottom:14 },
  coords:{ color:'#FFF', fontSize:17, marginLeft:6 },

  subtitle:{ color:'#FFF', fontSize:18, fontWeight:'700', marginHorizontal:14, marginBottom:8 },
  desc:{ color:'#FFF', fontSize:16, lineHeight:22, marginHorizontal:14, marginBottom:24 },

  row:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:14 },

  btnWrap:{ flex:1, marginRight:14 },
  btn:{ height:44, borderRadius:10, justifyContent:'center', alignItems:'center' },
  btnTxt:{ fontSize:17, fontWeight:'700', color:'#000' },

  iconWrap:{ width:44, height:44, borderRadius:10 },
  iconBtn:{ flex:1, borderRadius:10, justifyContent:'center', alignItems:'center' },
  iconImg:{ width:20, height:20 },
});
