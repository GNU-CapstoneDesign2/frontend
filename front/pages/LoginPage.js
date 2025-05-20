import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();

  // 구글 로그인 설정
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '212736676895-mfgqg1ra1cpejuig9jaqle389fvgu2ai.apps.googleusercontent.com',
    webClientId: '212736676895-mfgqg1ra1cpejuig9jaqle389fvgu2ai.apps.googleusercontent.com',
    iosClientId: '212736676895-hc26otlk5bmpc202jc3d8din04cc7kp3.apps.googleusercontent.com',
    androidClientId: '212736676895-abc123abc123abc123abc123abc123ab.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Access Token:', authentication.accessToken);
      navigation.replace('Home');
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Finder</Text>

      {/* Google 로그인 버튼 */}
      <TouchableOpacity
        style={[styles.button, styles.google]}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>구글로 계속하기</Text>
      </TouchableOpacity>

      {/* Kakao 로그인 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.kakao]}
        onPress={() => navigation.navigate('KakaoLoginWebView')}
      >
        <Text style={styles.buttonText}>카카오로 계속하기</Text>
      </TouchableOpacity>

      {/* Naver 로그인 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.naver]}
        onPress={() => navigation.navigate('NaverLoginWebView')}
      >
        <Text style={styles.buttonText}>네이버로 계속하기</Text>
      </TouchableOpacity>

      {/* Apple 로그인 버튼 (iOS에서만 표시) */}
      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType="signIn"
          buttonStyle="black"
          cornerRadius={5}
          style={{ width: '80%', height: 44, marginTop: 10 }}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              console.log('Apple 로그인 성공:', credential);
              navigation.replace('Home');
            } catch (e) {
              if (e.code === 'ERR_CANCELED') {
                console.log('Apple 로그인 취소됨');
              } else {
                console.log('Apple 로그인 에러:', e);
              }
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold' },
  button: { width: '80%', padding: 15, borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  google: { backgroundColor: '#F2F2F2' },
  kakao: { backgroundColor: '#FEE500' },
  naver: { backgroundColor: '#03C75A' },
  apple: { borderWidth: 1, borderColor: '#000', backgroundColor: '#fff' },
  buttonText: { fontSize: 16, color: '#000' },
  appleText: { fontSize: 16, color: '#000' },
});
