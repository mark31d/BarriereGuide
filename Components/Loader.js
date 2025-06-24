// Components/Loader.js
import React, { useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

/* ------------------------------------------------------------------
   hourglass-спиннер + УВЕЛИЧЕННАЯ подложка-квадрат 120 × 120 px
------------------------------------------------------------------- */
const htmlLoader = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<style>
  html,body{
    margin:0;padding:0;height:100%;
    display:flex;justify-content:center;align-items:center;
    background:transparent;
  }

  /* подложка: было 80 × 80 → стало 120 × 120 */
  .box{
    width:160px;height:160px;
    background:#262626;
    border-radius:6px;
    display:flex;justify-content:center;align-items:center;
  }

  /* hourglass от Uiverse */
  .lds-hourglass{
    position:relative;
    width:80px;height:80px;
  }
  .lds-hourglass:after{
    content:" ";
    display:block;
    border-radius:50%;
    width:64px;height:64px;
    margin:8px;
    box-sizing:border-box;
    border:32px solid #ffffff;
    border-color:#ffffff transparent #ffffff transparent;
    -webkit-animation:hourglass 1.2s infinite;
            animation:hourglass 1.2s infinite;
  }

  @-webkit-keyframes hourglass{
    0%   {-webkit-transform:rotate(0);   animation-timing-function:cubic-bezier(.55,.055,.675,.19);}
    50%  {-webkit-transform:rotate(900deg);animation-timing-function:cubic-bezier(.215,.61,.355,1);}
    100% {-webkit-transform:rotate(1800deg);}
  }
  @keyframes hourglass{
    0%   {transform:rotate(0);   animation-timing-function:cubic-bezier(.55,.055,.675,.19);}
    50%  {transform:rotate(900deg);animation-timing-function:cubic-bezier(.215,.61,.355,1);}
    100% {transform:rotate(1800deg);}
  }
</style>
</head>
<body>
  <div class="box"><div class="lds-hourglass"></div></div>
</body>
</html>`;
/* ------------------------------------------------------------------ */

export default function Loader({ onFinish, delay = 3000 }) {
  useEffect(() => {
    if (!onFinish) return;
    const t = setTimeout(onFinish, delay);
    return () => clearTimeout(t);
  }, [onFinish, delay]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.bg}
        resizeMode="cover"
        
      >
        {/* логотип */}
        <View style={styles.logoBlock}>
          <Image
            source={require('../assets/logoB.png')}
            style={styles.logoB}
            resizeMode="contain"
          />
        </View>

        {/* спиннер */}
        <View style={styles.spinnerContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlLoader }}
            style={styles.webView}
            scrollEnabled={false}
            androidLayerType="none"
          />
        </View>
      </ImageBackground>
    </View>
  );
}

/* ----------------------------- стили RN ----------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bg:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBlock: { alignItems: 'center', marginBottom: 40 },
  logoB:     { width: 340, height: 340, marginBottom: 190 },
  /* подложка тоже 120 × 120, чтобы вместить новую .box */
  spinnerContainer: {
    position: 'absolute',
    bottom: 80,
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  webView:   { flex: 1, backgroundColor: 'transparent' },
});
