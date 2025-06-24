// Components/DiaryListScreen.js
import React, { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
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

const { width } = Dimensions.get('window');
const CARD_W   = width * 0.9;
const CARD_H   = CARD_W * 0.4;
const BORDER_R = 18;          // скругление карточки
const BORDER_W = 2;           // толщина внешней рамки

/* ───── мелкие UI-компоненты ───── */
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
    <Image source={require('../assets/back.png')}
           style={styles.backIcon} resizeMode="contain" />
  </TouchableOpacity>
);

const PlusBtn = ({ onPress }) => (
  <TouchableOpacity style={styles.plusBtn} activeOpacity={0.85} onPress={onPress}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']}
                      start={{x:0,y:0}} end={{x:0,y:1}}
                      style={styles.plusGrad}>
      <Text style={styles.plusTxt}>+</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

const GradientTitle = ({ children }) => (
  <MaskedView maskElement={<Text style={styles.hTitle}>{children}</Text>}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']}
                      start={{x:0,y:0}} end={{x:1,y:0}}>
      {/* “призрак” служит маской */}
      <Text style={[styles.hTitle, {opacity:0}]}>{children}</Text>
    </LinearGradientRN>
  </MaskedView>
);

/* универсальная градиентная кнопка */
const GradientBtn = ({ title, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={style}>
    <LinearGradientRN colors={['#FFF0B0', '#AD7942']}
                      start={{x:0,y:0}} end={{x:0,y:1}}
                      style={styles.readGrad}>
      <Text style={styles.readTxt}>{title}</Text>
    </LinearGradientRN>
  </TouchableOpacity>
);

/* ───── основной экран ───── */
export default function DiaryListScreen() {
  const nav         = useNavigation();
  const { entries } = useContext(DiaryContext);

  /* рендер одной карточки */
  const renderCards = () =>
    entries.map(e => (
      <LinearGradientRN
        key={e.id}
        colors={['#FFF0B0', '#AD7942']}
        start={{x:0,y:0}} end={{x:1,y:1}}
        style={styles.cardGrad}
      >
        <View style={styles.cardInner}>
          <Image source={e.place.img} style={styles.img} resizeMode="cover" />

          <Text style={styles.title}>{e.place.name}</Text>

          {/* рейтинг */}
          <View style={styles.starsRow}>
            {Array.from({length:5}).map((_,i)=>(
              <Text key={i}
                    style={[styles.star, i < e.rating ? styles.starOn : styles.starOff]}>
                ★
              </Text>
            ))}
          </View>

          {/* описание: максимально 3 строки, хвост → … */}
          <Text
            style={styles.preview}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {e.description}
          </Text>

          {/* Read more */}
          <GradientBtn
            title="Read more"
            onPress={() => nav.navigate('DiaryDetail', { entryId: e.id })}
            style={styles.readWrap}
          />
        </View>
      </LinearGradientRN>
    ));

  /* ---------- UI ---------- */
  return (
    <>
      <SafeAreaView style={{flex:1}}>
        {/* Header */}
        <View style={styles.header}>
          <BackBtn onPress={() => nav.goBack()} />
          <View style={styles.titleWrap}>
            <GradientTitle>Tourist`s diary</GradientTitle>
          </View>
          <View style={{width:48}} />
        </View>

        {/* список или пустой экран */}
        {entries.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {renderCards()}
            <View style={styles.plusWrap}>
              <PlusBtn onPress={() => nav.navigate('DiaryForm')} />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyAbsolute}>
            <PlusBtn onPress={() => nav.navigate('DiaryForm')} />
            <Text style={styles.emptyText}>Add entry</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

/* ───── стили ───── */
const styles = StyleSheet.create({
  /* header */
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop: Platform.OS==='ios'?60:40,
    paddingHorizontal:20,
    marginBottom:10,
  },
  backBtn:{width:48,height:42,justifyContent:'center',alignItems:'center'},
  backIcon:{position:'absolute',width:20,height:20},
  titleWrap:{flex:1,alignItems:'center'},
  hTitle:{fontSize:24,fontWeight:'700',color:'#FFF'},

  /* list */
  scroll:{paddingHorizontal:20,paddingBottom:40},

  /* карточка */
  cardGrad:{borderRadius:BORDER_R+BORDER_W,marginBottom:30,overflow:'hidden'},
  cardInner:{margin:BORDER_W,borderRadius:BORDER_R,backgroundColor:'#2d2d2d',
             overflow:'hidden',padding:12},
  img:{width:CARD_W-(BORDER_W+12)*2,height:CARD_H,borderRadius:8,marginBottom:12},
  title:{fontSize:22,fontWeight:'700',color:'#FFF',marginBottom:8},

  starsRow:{flexDirection:'row',marginBottom:8},
  star:{fontSize:20,marginRight:4},
  starOn:{color:'#FFF0B0'}, starOff:{color:'#555'},

  preview:{fontSize:14,color:'#DDD',marginBottom:12,lineHeight:18},

  /* кнопка Read more */
  readWrap:{alignSelf:'flex-end'},
  readGrad:{width:120,height:40,borderRadius:8,justifyContent:'center',alignItems:'center'},
  readTxt:{fontSize:16,fontWeight:'700',color:'#3D1700'},

  /* plus */
  plusBtn:{width:64,height:64},
  plusGrad:{flex:1,borderRadius:12,justifyContent:'center',alignItems:'center'},
  plusTxt:{fontSize:52,fontWeight:'300',color:'#3D1700',lineHeight:52},
  plusWrap:{alignItems:'center',marginTop:10},

  /* empty */
  emptyAbsolute:{position:'absolute',top:0,left:0,right:0,bottom:0,
                 justifyContent:'center',alignItems:'center'},
  emptyText:{marginTop:12,fontSize:18,fontWeight:'700',color:'#FFF'},
});
