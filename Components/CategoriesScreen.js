// Components/Recommended/CategoriesScreen.js

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
  Text as SvgText,
  Path,
} from 'react-native-svg';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';

import { CATEGORIES } from '../Components/places';

/* ─────────── геометрия ─────────── */
const { width } = Dimensions.get('window');
const CARD_W   = width * 0.75;
const CARD_H   = CARD_W;
const SPACING  = 16;
const SIDE_PAD = (width - CARD_W) / 2;
const SHIFT_X  = -40;

/* ─────────── HTML-hourglass ─────────── */
const htmlLoader = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
 html,body{margin:0;padding:0;height:100%;display:flex;justify-content:center;align-items:center;background:transparent;}
 .box{width:160px;height:160px;background:#262626;border-radius:6px;display:flex;justify-content:center;align-items:center;}
 .lds-hourglass{position:relative;width:80px;height:80px;}
 .lds-hourglass:after{content:" ";display:block;border-radius:50%;width:64px;height:64px;margin:8px;box-sizing:border-box;border:32px solid #fff;border-color:#fff transparent #fff transparent;animation:hourglass 1.2s infinite;}
 @keyframes hourglass{0%{transform:rotate(0);}50%{transform:rotate(900deg);}100%{transform:rotate(1800deg);}}
</style>
</head>
<body><div class="box"><div class="lds-hourglass"></div></div></body>
</html>`;

/* ─────────── BackBtn ─────────── */
const BackBtn = ({ onPress, hidden }) => (
  <TouchableOpacity
    style={[styles.backBtn, hidden && styles.invisible]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Svg width={48} height={42}>
      <Defs>
        <SvgLinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFF0B0" />
          <Stop offset="100%" stopColor="#AD7942" />
        </SvgLinearGradient>
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
    <Image source={require('../assets/back.png')} style={styles.backIcon} />
  </TouchableOpacity>
);

/* ─────────── SVG стрелки ─────────── */
const ArrowSVG = ({ direction }) => (
  <Svg width={34} height={34} viewBox="0 0 24 24">
    <Defs>
      <SvgLinearGradient id={`${direction}Grad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFF0B0" />
        <Stop offset="100%" stopColor="#AD7942" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      fill="none"
      stroke={`url(#${direction}Grad)`}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function CategoriesScreen() {
  const nav       = useNavigation();
  const scrollRef = useRef(null);

  const [centerIdx, setCenterIdx] = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      nav.navigate('LocationsScreen', { categoryId: CATEGORIES[selected].id });
    }, 4000);
    return () => clearTimeout(t);
  }, [loading, nav, selected]);

  const handlePrev = () =>
    centerIdx > 0 &&
    scrollRef.current.scrollTo({ x: (centerIdx - 1) * (CARD_W + SPACING), animated: true });

  const handleNext = () =>
    centerIdx < CATEGORIES.length - 1 &&
    scrollRef.current.scrollTo({ x: (centerIdx + 1) * (CARD_W + SPACING), animated: true });

  const onMomentumScrollEnd = e =>
    setCenterIdx(Math.round(e.nativeEvent.contentOffset.x / (CARD_W + SPACING)));

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <BackBtn onPress={() => nav.navigate('Home')} hidden={loading} />
        <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.title}>Recommended locations</Text>}
        >
          <LinearGradient colors={['#FFF0B0', '#AD7942']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={[styles.title, { opacity: 0 }]}>Recommended locations</Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <Text style={styles.subtitle}>Select a category:</Text>

      {/* PAGER */}
      <View style={styles.pager}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={centerIdx === 0}
          style={[
            styles.arrowBtn,
            centerIdx === 0 && styles.disabledArrow,
            loading && styles.invisible,
          ]}
          hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
        >
          <ArrowSVG direction="left" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_W + SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingLeft: SIDE_PAD - SPACING / 2 + SHIFT_X,
            paddingRight: SIDE_PAD - SPACING / 2 - SHIFT_X,
          }}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {CATEGORIES.map((cat, i) => {
            const isCentered = i === centerIdx;
            const isSelected = i === selected;
            const Wrapper = isSelected ? LinearGradient : View;
            const wrapperProps = isSelected
              ? {
                  colors: ['#FFF0B0', '#AD7942'],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 1 },
                  style: styles.cardGradient,
                }
              : { style: styles.card };
            return (
              <Wrapper
                key={cat.id}
                {...wrapperProps}
                style={[wrapperProps.style, { marginHorizontal: SPACING / 2 }]}
              >
                <TouchableOpacity
                  style={styles.cardInner}
                  activeOpacity={0.85}
                  onPress={() => setSelected(i)}
                >
                  <Image source={cat.cover} style={styles.image} resizeMode="cover" />
                  {!isCentered && (
                    <BlurView
                      style={StyleSheet.absoluteFill}
                      blurType="light"
                      blurAmount={10}
                      reducedTransparencyFallbackColor="rgba(255,255,255,0.15)"
                    />
                  )}
                  <View style={styles.labelBg}>
                    <Text style={styles.cardLabel}>{cat.title}</Text>
                  </View>
                </TouchableOpacity>
              </Wrapper>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={handleNext}
          disabled={centerIdx === CATEGORIES.length - 1}
          style={[
            styles.arrowBtn,
            centerIdx === CATEGORIES.length - 1 && styles.disabledArrow,
            loading && styles.invisible,
          ]}
          hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
        >
          <ArrowSVG direction="right" />
        </TouchableOpacity>
      </View>

      {/* OK-кнопка */}
      {selected !== null && !loading && (
        <TouchableOpacity
          style={styles.okBtn}
          activeOpacity={0.85}
          onPress={() => setLoading(true)}
        >
          <Svg width={width * 0.9} height={56}>
            <Defs>
              <SvgLinearGradient id="okGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFF0B0" />
                <Stop offset="100%" stopColor="#AD7942" />
              </SvgLinearGradient>
            </Defs>
            <Rect x={3} y={3} width={width * 0.9 - 6} height={50} rx={12} fill="url(#okGrad)" />
            <SvgText
              x={(width * 0.9) / 2}
              y={35}
              fontSize="20"
              fill="#000"
              fontWeight="700"
              textAnchor="middle"
            >
              OK
            </SvgText>
          </Svg>
        </TouchableOpacity>
      )}

      {/* СПИННЕР */}
      {loading && (
        <View style={styles.spinnerWrap}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlLoader }}
            scrollEnabled={false}
            androidLayerType="none"
            style={styles.webView}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 12 },
  title:         { fontSize: 24, fontWeight: '700', color: '#FFF' },
  subtitle:      { fontSize: 20, color: '#FFF', textAlign: 'center', marginBottom: 10 },

  backBtn:       { width: 48, height: 42, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  backIcon:      { position: 'absolute', width: 20, height: 20, resizeMode: 'contain' },

  pager:         { flexDirection: 'row', alignItems: 'center' },
  arrowBtn:      { width: 40, justifyContent: 'center', alignItems: 'center' },
  disabledArrow: { opacity: 0.4 },

  invisible:     { opacity: 0 }, // скрыть, но сохранить layout

  card:          { width: CARD_W, height: CARD_H, borderRadius: 12, overflow: 'hidden' },
  cardGradient:  { width: CARD_W + 4, height: CARD_H + 4, borderRadius: 14, padding: 2, overflow: 'hidden' },
  cardInner:     { flex: 1, borderRadius: 12, overflow: 'hidden' },
  image:         { width: '103%', height: '110%', borderRadius: 12 },
  labelBg:       { position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  cardLabel:     { color: '#FFF', fontSize: 18, fontWeight: '700' },

  okBtn:         { alignSelf: 'center', marginTop: 30 },
  spinnerWrap:   { alignSelf: 'center', marginTop: 30, width: 160, height: 160 },
  webView:       { flex: 1, backgroundColor: 'transparent' },
});
