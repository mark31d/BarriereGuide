import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import LinearGradientRN from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { DiaryContext } from '../Components/DiaryContext';

const { width } = Dimensions.get('window');
const CARD_W   = width * 0.9;
const CARD_H   = CARD_W * 0.4;
const BORDER   = 3;
const RADIUS   = 18;

/*───────────── вспом-UI ─────────────*/
const BackBtn = ({ onPress }) => (
  <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onPress}>
    <Svg width={48} height={42}>
      <Defs>
        <SvgLinearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%"   stopColor="#FFF0B0" />
          <Stop offset="100%" stopColor="#AD7942" />
        </SvgLinearGradient>
      </Defs>
      <Rect x={1} y={1} width={46} height={40} rx={20} ry={20}
            fill="#000" stroke="url(#backGrad)" strokeWidth={2}/>
    </Svg>
    <Image source={require('../assets/back.png')} style={styles.backIcon} resizeMode="contain" />
  </TouchableOpacity>
);

const GradientTitle = ({ children }) => (
  <MaskedView maskElement={<Text style={styles.hTitle}>{children}</Text>}>
    <LinearGradientRN
      colors={['#FFF0B0', '#AD7942']}
      start={{x:0,y:0}} end={{x:1,y:0}}
    >
      <Text style={[styles.hTitle,{opacity:0}]}>{children}</Text>
    </LinearGradientRN>
  </MaskedView>
);

/* главная градиентная кнопка */
const GradientBtn = ({ title, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN
      colors={['#FFF0B0', '#AD7942']}
      start={{x:0,y:0}} end={{x:0,y:1}}
      style={styles.shareGrad}
    >
      <Text style={styles.shareTxt}>{title}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

/*───────────── экран Read more ─────────────*/
export default function DiaryDetailScreen() {
  const nav           = useNavigation();
  const { entryId }   = useRoute().params ?? {};
  const { entries }   = useContext(DiaryContext);

  /* нужная запись */
  const entry = entries.find(e => e.id === entryId);

  /* если ничего не нашли — назад */
  if (!entry) { nav.goBack(); return null; }

  const { place, rating, description } = entry;

  /* share */
  const onShare = async () => {
    try {
      await Share.share({
        title: place.name,
        message: `${place.name}\n${place.lat}, ${place.lng}\n\n${description}`,
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackBtn onPress={() => nav.goBack()} />
        <GradientTitle>Tourist`s diary</GradientTitle>
      </View>

      {/* карточка */}
      <LinearGradientRN
        colors={['#FFF0B0','#AD7942']}
        start={{x:0,y:0}} end={{x:1,y:1}}
        style={styles.cardGrad}
      >
        <View style={styles.cardInner}>
          <Image source={place.img} style={styles.img} resizeMode="cover" />

          <View style={styles.rowBetween}>
            <Text style={styles.title}>{place.name}</Text>
            <View style={styles.starsRow}>
              {Array.from({length:5}).map((_,i)=>(
                <Text key={i}
                      style={[styles.star,i<rating?styles.starOn:styles.starOff]}>★</Text>
              ))}
            </View>
          </View>

          {/* координаты */}
          <View style={styles.rowCoord}>
            <Image source={require('../assets/dote.png')}
                   style={styles.pin} resizeMode="contain" />
            <Text style={styles.coordTxt}>
              {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
            </Text>
          </View>

          {/* описание */}
          <Text style={styles.descTitle}>Description:</Text>
          <Text style={styles.descTxt}>{description || '—'}</Text>

          {/* Share */}
          <GradientBtn title="Share" onPress={onShare} />
        </View>
      </LinearGradientRN>
    </SafeAreaView>
  );
}

/*───────────── styles ─────────────*/
const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#000'},

  header:{flexDirection:'row',alignItems:'center',paddingTop:Platform.OS==='ios'?60:40,
          paddingHorizontal:20, marginBottom:10},
  backBtn:{width:48,height:42,justifyContent:'center',alignItems:'center',marginRight:12},
  backIcon:{position:'absolute',width:20,height:20},
  hTitle:{fontSize:24,fontWeight:'700',color:'#FFF'},

  /* Card */
  cardGrad:{borderRadius:RADIUS+BORDER,marginHorizontal:20},
  cardInner:{margin:BORDER,borderRadius:RADIUS,backgroundColor:'#2d2d2d',padding:12},
  img:{width:'100%',height:CARD_H,borderRadius:8,marginBottom:12},
  title:{fontSize:22,fontWeight:'700',color:'#FFF',flexShrink:1},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},

  starsRow:{flexDirection:'row',marginLeft:8},
  star:{fontSize:20,marginLeft:2},
  starOn:{color:'#FFF0B0'}, starOff:{color:'#555'},

  rowCoord:{flexDirection:'row',alignItems:'center',marginTop:6,marginBottom:12},
  pin:{width:18,height:18,tintColor:'#D5B46A',marginRight:6},
  coordTxt:{color:'#FFF',fontSize:15},

  descTitle:{color:'#FFF',fontSize:17,fontWeight:'700',marginBottom:4},
  descTxt:{color:'#DDD',fontSize:15,marginBottom:20,lineHeight:20},

  shareGrad:{alignSelf:'center',borderRadius:10,width:180,height:48,
             justifyContent:'center',alignItems:'center'},
  shareTxt:{fontSize:18,fontWeight:'700',color:'#000'},
});
