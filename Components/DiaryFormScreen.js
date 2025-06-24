// Components/DiaryFormScreen.js
import React, { useContext, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradientRN from 'react-native-linear-gradient';

import { DiaryContext } from '../Components/DiaryContext';
import { CATEGORIES }   from '../Components/places';

const { width, height } = Dimensions.get('window');
const BORDER = 3;

/*──────────────────── UI-компоненты ────────────────────*/
const BackBtn = ({ onPress }) => (
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

const GradientTitle = ({ children }) => (
  <MaskedView maskElement={<Text style={styles.hTitle}>{children}</Text>}>
    <LinearGradientRN
      colors={['#FFF0B0', '#AD7942']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.hTitle, { opacity: 0 }]}>{children}</Text>
    </LinearGradientRN>
  </MaskedView>
);

/*──────────────────── Основной экран ────────────────────*/
export default function DiaryFormScreen() {
  const nav          = useNavigation();
  const { addEntry } = useContext(DiaryContext);

  /* все места из всех категорий */
  const allPlaces = useMemo(() => CATEGORIES.flatMap(c => c.items), []);

  const [dropdownOpen,  setDropdownOpen ] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [description,   setDescription ]  = useState('');
  const [rating,        setRating]        = useState(0);

  const handleSave = () => {
    if (!selectedPlace || !description.trim()) return;
    addEntry({
      id: Date.now().toString(),
      place: selectedPlace,
      description,
      rating,
    });
    nav.goBack();
  };

  /*──────────────────── UI ────────────────────*/
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackBtn onPress={() => nav.goBack()} />
        <View style={styles.titleWrap}>
          <GradientTitle>Tourist`s diary</GradientTitle>
        </View>
        <View style={{ width: 48 }} />
      </View>

      {/* Форма */}
      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="always">
        {/* Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.85}
          onPress={() => setDropdownOpen(o => !o)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedPlace && styles.placeholder,
            ]}
          >
            {selectedPlace ? selectedPlace.name : 'Choose a place'}
          </Text>
          <Image
            source={
              dropdownOpen
                ? require('../assets/arrowUp.png')
                : require('../assets/arrowDown.png')
            }
            style={styles.dropdownArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {dropdownOpen && (
          <ScrollView style={styles.dropdownList} nestedScrollEnabled>
            {allPlaces.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.dropdownItem}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedPlace(p);
                  setDropdownOpen(false);
                }}
              >
                <Image source={p.img} style={styles.itemImage} resizeMode="cover" />
                <Text style={styles.itemText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Description */}
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Description"
          placeholderTextColor="#555"
          value={description}
          onChangeText={setDescription}
        />

        {/* Rating */}
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Text style={[styles.star, i < rating ? styles.starOn : styles.starOff]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save button */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
          <LinearGradientRN
            colors={['#FFF0B0', '#AD7942']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <Text style={styles.saveText}>Ok</Text>
          </LinearGradientRN>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/*──────────────────── Стили ────────────────────*/
const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: { width: 48, height: 42, justifyContent: 'center', alignItems: 'center' },
  backIcon: { position: 'absolute', width: 20, height: 20 },
  titleWrap: { flex: 1, alignItems: 'center' },
  hTitle: { fontSize: 24, fontWeight: '700', color: '#FFF' },

  /* Form content */
  formContent: { paddingHorizontal: 20, paddingBottom: 40 },

  /* Dropdown */
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownText: { color: '#FFF', fontSize: 16 },
  placeholder: { color: '#555' },
  dropdownArrow: { width: 20, height: 20, tintColor: '#D5B46A' },

  dropdownList: {
    maxHeight: height * 0.3,
    marginBottom: 12,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemImage: { width: 40, height: 40, borderRadius: 6, marginRight: 12 },
  itemText: { color: '#FFF', fontSize: 16 },

  /* Description */
  textArea: {
    height: height * 0.2,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    textAlignVertical: 'top',
    marginBottom: 12,
  },

  /* Stars */
  starsRow: { flexDirection: 'row', marginBottom: 20 },
  star: { fontSize: 32, marginRight: 8 },
  starOn: { color: '#FCE220' },
  starOff: { color: '#555' },

  /* Save button ─ обновлено */
  saveBtn: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',           // ширина = 100 % контейнера
  },
  saveText: { fontSize: 18, fontWeight: '700', color: '#000' },
});
