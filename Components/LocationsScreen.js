// screens/LocationsScreen.js
import React, { useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import LinearGradientRN from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { CATEGORIES }       from '../Components/places';
import { SavedContext }     from '../Components/SavedContext';      // ← контекст

/* ─────────── UI constants ─────────── */
const BORDER_R = 18;
const CARD_H   = 200;

/* ─────────── BackButton ─────────── */
const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backBtn} onPress={onPress} activeOpacity={0.85}>
    <Svg width={48} height={42}>
      <Defs>
        <LinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%"   stopColor="#FFF0B0" />
          <Stop offset="100%" stopColor="#AD7942" />
        </LinearGradient>
      </Defs>
      <Rect
        x={1} y={1}
        width={46} height={40}
        rx={20} ry={20}
        fill="#000"
        stroke="url(#backGrad)"
        strokeWidth={2}
      />
    </Svg>
    <Image source={require('../assets/back.png')} style={styles.backIcon} resizeMode="contain" />
  </TouchableOpacity>
);

/* ─────────── Screen ─────────── */
export default function LocationsScreen() {
  const nav            = useNavigation();
  const { categoryId } = useRoute().params;

  /* ----- контекст сохранённых ----- */
  const { saved, addPlace, removePlace } = useContext(SavedContext);

  /* безопасные данные категории */
  const catObj = Array.isArray(CATEGORIES)
    ? CATEGORIES.find(c => c.id === categoryId)
    : null;

  const title = catObj?.title || 'Locations';

  /* сами локации */
  const data = useMemo(
    () => (Array.isArray(catObj?.items) ? catObj.items : []),
    [catObj],
  );

  /* Share */
  const sharePlace = async place => {
    try {
      await Share.share({
        title:   place.name,
        message: `${place.name}\n${place.lat}, ${place.lng}`,
      });
    } catch {}
  };

  /* карточка */
  const renderItem = ({ item }) => {
    const isSaved = saved.some(p => p.id === item.id);

    const toggleSave = () =>
      isSaved ? removePlace(item.id) : addPlace(item);

    return (
      <LinearGradientRN
        colors={['#FFF0B0', '#AD7942']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGrad}
      >
        <View style={styles.cardInner}>
          <Image source={item.img} style={styles.img} resizeMode="cover" />
          <Text style={styles.title}>{item.name}</Text>

          <View style={styles.row}>
            <GradBtn
              txt="Open"
              onPress={() => nav.navigate('LocationDetails', { id: item.id })}
            />
            <GradBtn txt="Share" onPress={() => sharePlace(item)} />
            <SaveBtn active={isSaved} onPress={toggleSave} />
          </View>
        </View>
      </LinearGradientRN>
    );
  };

  /* ─────────── UI ─────────── */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
      <BackButton onPress={() => nav.navigate('Categories')} />

        <MaskedView style={styles.h1Wrap} maskElement={<Text style={styles.h1}>{title}</Text>}>
          <LinearGradientRN
            colors={['#FFF0B0', '#AD7942']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.h1, { opacity: 0 }]}>{title}</Text>
          </LinearGradientRN>
        </MaskedView>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={i => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Nothing found</Text>}
      />
    </View>
  );
}

/* ─────────── Buttons ─────────── */
const GradBtn = ({ txt, onPress }) => (
  <TouchableOpacity style={styles.btnWrap} onPress={onPress} activeOpacity={0.85}>
    <LinearGradientRN
      colors={['#FFF0B0', '#AD7942']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.btn}
    >
      <Text style={styles.btnTxt}>{txt}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

const SaveBtn = ({ active, onPress }) => (
  <TouchableOpacity style={styles.iconWrap} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN
      colors={['#FFF0B0', '#AD7942']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconBtn}
    >
      <Image
        source={
          active
            ? require('../assets/save2.png') // заполненная версия
            : require('../assets/save.png')  // контурная версия
        }
        style={styles.iconImg}
        resizeMode="contain"
      />
    </LinearGradientRN>
  </TouchableOpacity>
);

/* ─────────── Styles ─────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  /* header */
  header:   { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 10, marginBottom: 10 },
  backBtn:  { width: 48, height: 42, justifyContent: 'center', alignItems: 'center' },
  backIcon: { position: 'absolute', width: 20, height: 20 },

  h1Wrap: { flex: 1, marginLeft: 8 },
  h1:     { fontSize: 24, fontWeight: '700', color: '#FFF' },

  /* list */
  list:  { paddingHorizontal: 16, paddingBottom: 120 },

  /* card */
  cardGrad: {
    borderRadius: BORDER_R + 2,
    marginBottom: 30,
    overflow: 'hidden',
  },
  cardInner: {
    margin: 2,
    borderRadius: BORDER_R,
    overflow: 'hidden',
    backgroundColor: '#2d2d2d',
  },
  img: {
    width: '100%',
    height: CARD_H,
    borderTopLeftRadius: BORDER_R,
    borderTopRightRadius: BORDER_R,
  },
  title: { color: '#FFF', fontSize: 22, fontWeight: '700', margin: 14 },
  row:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, marginBottom: 14 },

  /* Grad buttons */
  btnWrap: { flex: 1, marginRight: 14 },
  btn:     { height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnTxt:  { fontSize: 17, fontWeight: '700', color: '#000' },

  /* Save button */
  iconWrap: { width: 44, height: 44, borderRadius: 10 },
  iconBtn:  { flex: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  iconImg:  { width: 20, height: 20 },

  empty: { color: '#FFF', fontSize: 18, textAlign: 'center', marginTop: 80 },
});
