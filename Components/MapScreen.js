// Components/MapScreen.js
import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Share,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import LinearGradientRN from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { SavedContext } from '../Components/SavedContext';
import { CATEGORIES }    from '../Components/places';

/* ─────────── размеры ─────────── */
const { width, height } = Dimensions.get('window');
const CARD_W = width  * 0.95;   // ширина карточки
const CARD_H = height * 0.50;   // высота карточки (50 % экрана)
const BORDER = 3;
const RADIUS = 12;

/* ─────────── вспомогательные кнопки ─────────── */
const GradBtn = ({ txt, onPress }) => (
  <TouchableOpacity style={styles.gBtnWrap} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.gBtn}>
      <Text style={styles.gBtnTxt}>{txt}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

const SaveBtn = ({ active, onPress }) => (
  <TouchableOpacity style={styles.saveWrap} onPress={onPress} activeOpacity={0.85}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.saveBtn}>
      <Image
        source={active ? require('../assets/save2.png') : require('../assets/save.png')}
        style={{ width:20, height:20 }}
        resizeMode="contain"
      />
    </LinearGradientRN>
  </TouchableOpacity>
);

/* ─────────── BackButton ─────────── */
const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backBtn} onPress={onPress} activeOpacity={0.8}>
    <Svg width={48} height={42}>
      <Defs>
        <SvgLinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFF0B0"/>
          <Stop offset="100%" stopColor="#AD7942"/>
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

/* ─────────── MapScreen ─────────── */
export default function MapScreen() {
  const nav        = useNavigation();
  const { params } = useRoute();
  const { saved, addPlace, removePlace } = useContext(SavedContext);

  /* все локации */
  const allPlaces = useMemo(() => CATEGORIES.flatMap(cat => cat.items), []);

  /* стартовый регион карты */
  const initialRegion = useMemo(() => {
    const lat = params?.lat ?? allPlaces[0].lat;
    const lng = params?.lng ?? allPlaces[0].lng;
    return { latitude:lat, longitude:lng, latitudeDelta:0.08, longitudeDelta:0.08 };
  }, [params, allPlaces]);

  const [selected, setSelected] = useState(
    () => allPlaces.find(p => p.lat === params?.lat && p.lng === params?.lng) || null
  );

  const sharePlace = async place => {
    try {
      await Share.share({
        title:   place.name,
        message: `${place.name}\n${place.lat}, ${place.lng}`,
      });
    } catch {}
  };

  const isSaved   = id   =>  saved.some(p => p.id === id);
  const toggleSave = place => (isSaved(place.id) ? removePlace(place.id) : addPlace(place));

  return (
    <SafeAreaView style={{flex:1}}>
      {/* Header поверх карты */}
      <View style={styles.header}>
        <BackButton onPress={() => nav.goBack()} />
        <MaskedView style={{flex:1, marginLeft:8}}
                    maskElement={<Text style={styles.title}>Map</Text>}>
          <LinearGradientRN colors={['#FFF0B0','#AD7942']} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={[styles.title,{opacity:0}]}>Map</Text>
          </LinearGradientRN>
        </MaskedView>
      </View>

      {/* Map */}
      <MapView style={{flex:1}} initialRegion={initialRegion}>
        {allPlaces.map(pl => (
          <Marker
            key={pl.id}
            coordinate={{ latitude:pl.lat, longitude:pl.lng }}
            pinColor="#FFF0B0"
            onPress={() => setSelected(pl)}
          />
        ))}
      </MapView>

      {/* Bottom card */}
      {selected && (
        <View style={styles.cardWrap}>
          <Svg width={CARD_W} height={CARD_H} style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF0B0"/>
                <Stop offset="100%" stopColor="#AD7942"/>
              </SvgLinearGradient>
            </Defs>
            <Rect
              x={BORDER/2} y={BORDER/2}
              width={CARD_W-BORDER} height={CARD_H-BORDER}
              rx={RADIUS} fill="#2d2d2d"
              stroke="url(#cardGrad)" strokeWidth={BORDER}
            />
          </Svg>

          <View style={styles.cardContent}>
            <Image source={selected.img} style={styles.cardImg} resizeMode="cover"/>
            <Text style={styles.cardTitle}>{selected.name}</Text>
            <Text style={styles.coords}>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</Text>
            <Text style={styles.desc}>{selected.desc}</Text>

            <View style={styles.btnRow}>
              <GradBtn
                txt="Read more"
                onPress={() => nav.navigate('LocationDetails',{ id:selected.id })}
              />
              <GradBtn txt="Share" onPress={() => sharePlace(selected)} />
              <SaveBtn active={isSaved(selected.id)} onPress={() => toggleSave(selected)} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ─────────── styles ─────────── */
const styles = StyleSheet.create({
  /* header поверх карты */
  header:{
    position:'absolute',
    top:  Platform.OS === 'ios' ? 60 : 40,
    left:10, right:10,
    flexDirection:'row',
    alignItems:'center',
    zIndex:2,
  },
  backBtn:{ width:48, height:42, justifyContent:'center', alignItems:'center' },
  backIcon:{ position:'absolute', width:20, height:20 },

  title:{ fontSize:24, fontWeight:'700', color:'#FFF', alignSelf:'center', right:28 },

  /* card */
  cardWrap:{
    position:'absolute',
    bottom:20,
    width:CARD_W,
    height:CARD_H,
    alignSelf:'center',
  },
  cardContent:{ padding:12 },
  cardImg:{ width:'100%', height:CARD_H*0.4, borderRadius:8, marginBottom:12 },
  cardTitle:{ color:'#FFF', fontSize:20, fontWeight:'700', marginBottom:4 },
  coords:{ color:'#D5B46A', fontSize:15, marginBottom:8 },
  desc:{ color:'#CCC', fontSize:14, marginBottom:14 },

  btnRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' },

  /* grad button */
  gBtnWrap:{ flex:1, marginRight:8 },
  gBtn:{ height:40, borderRadius:10, justifyContent:'center', alignItems:'center' },
  gBtnTxt:{ fontSize:15, fontWeight:'700', color:'#000' },

  /* save */
  saveWrap:{ width:44, height:44, borderRadius:10 },
  saveBtn:{ flex:1, borderRadius:10, justifyContent:'center', alignItems:'center' },
});
