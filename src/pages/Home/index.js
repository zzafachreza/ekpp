import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
  StatusBar,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {storeData, getData} from '../../utils/localStorage';
import {Icon} from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import MyTerbaik from '../../components/MyTerbaik';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import 'intl';
import 'intl/locale-data/jsonp/en';
import MyTerbaik2 from '../../components/MyTerbaik2';
import MyTerbaik3 from '../../components/MyTerbaik3';
import MyDashboard from '../../components/MyDashboard';

export default function Home({navigation}) {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('');
  const [tipe, setTipe] = useState('');
  const [company, setCompany] = useState({});

  messaging().onMessage(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    const json = JSON.stringify(remoteMessage);
    const obj = JSON.parse(json);
    // alert(obj.notification);
    // console.log('list transaksi', obj.notification);
    getData('user').then(res => {
      setUser(res);
      // console.log(res);
      // alert('email' + res.email + ' dan password ' + res.password);

      axios
        .post('https://zavalabs.com/sigadisbekasi/api/point.php', {
          id_member: res.id,
        })
        .then(respoint => {
          setPoint(respoint.data);
          console.log('get apoint', respoint.data);
        });

      axios
        .post('https://zavalabs.com/sigadisbekasi/api/get_member.php', {
          email: res.email,
          password: res.password,
        })
        .then(rese => {
          setUser(rese.data);
          storeData('user', rese.data);
        });
    });
  });

  useEffect(() => {
    getData('company').then(res => {
      setCompany(res);
    });

    getData('tipe').then(res => {
      setTipe(res);
    });

    getData('user').then(res => {
      console.log(res);
      setUser(res);

      axios
        .post('https://zavalabs.com/sigadisbekasi/api/point.php', {
          id_member: res.id,
        })
        .then(respoint => {
          setPoint(respoint.data);
          console.log('get apoint', respoint.data);
        });

      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
      });
    });

    axios
      .post('https://zavalabs.com/sigadisbekasi/api/update_token.php', {
        id_member: user.id,
        token: token,
      })
      .then(res => {
        console.log('update token', res);
      });
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;
  const _renderItem = ({item, index}) => {
    return (
      <Image
        resizeMode="contain"
        source={{uri: item.image}}
        style={{
          width: windowWidth,
          height: Math.round((windowWidth * 9) / 16),
        }}
      />
    );
  };

  const DataKategori = ({icon, nama, nama2, onPress}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: colors.white,
          padding: 5,
          borderRadius: 10,
          width: windowWidth / 3.5,
          height: windowHeight / 6,
          elevation: 5,
          justifyContent: 'center',
        }}>
        <View>
          <Icon
            type="ionicon"
            name={icon}
            color={colors.primary}
            size={windowWidth / 10}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.secondary,
              fontSize: windowWidth / 40,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.secondary,
              fontSize: windowWidth / 40,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama2}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      // source={require('../../assets/back.jpeg')}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={'transparent'}
      /> */}

      <ScrollView>
        {/* bagian untuk point dan redeem */}

        <View
          style={{
            marginHorizontal: 10,
            height: windowHeight / 9,
            padding: 10,
            marginBottom: 20,
            // backgroundColor: colors.white,
            flexDirection: 'row',
            // borderBottomLeftRadius: 10,
            // borderBottomRightRadius: 10,
          }}>
          <View style={{flex: 1, paddingTop: 15, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Image
                source={{
                  uri:
                    user.foto == null
                      ? 'https://zavalabs.com/nogambar.jpg'
                      : user.foto,
                }}
                style={{width: 60, height: 60, borderRadius: 30}}
              />
            </TouchableOpacity>
            <View style={{paddingLeft: 10}}>
              <Text
                style={{
                  fontSize: windowWidth / 30,
                  color: colors.black,
                  fontFamily: fonts.secondary[400],
                }}>
                Selamat datang,
              </Text>
              <Text
                style={{
                  fontSize: windowWidth / 25,
                  color: colors.black,
                  fontFamily: fonts.secondary[600],
                }}>
                {user.nama_lengkap}
              </Text>
              <Text
                style={{
                  fontSize: windowWidth / 25,
                  color: colors.secondary,
                  fontFamily: fonts.secondary[600],
                }}>
                ( {user.tipe} )
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/logo.png')}
              style={{width: 60, height: 30, resizeMode: 'stretch'}}
            />
          </View>
        </View>

        <MyCarouser />

        {/* <MyDashboard tipe={tipe} /> */}

        <View
          style={{
            padding: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() => navigation.navigate('Account')}
              icon="person-outline"
              nama="USER"
              nama2="ACCOUNT"
            />
            <DataKategori
              onPress={() => navigation.navigate('ProfileLab')}
              icon="analytics"
              nama="PROFILE"
              nama2="LAB"
            />
            <DataKategori
              onPress={() => navigation.navigate('Akses')}
              icon="finger-print-outline"
              nama="ABSEN"
              nama2="ONLINE"
            />
          </View>
          {/*  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() => navigation.navigate('Jadwal')}
              icon="calendar-outline"
              nama="PENJADWALAN"
              nama2="PENGGUNAAN LAB"
            />
            <DataKategori
              onPress={() => navigation.navigate('Barang')}
              icon="flag-outline"
              nama="DAFTAR ALAT"
              nama2="DAN BAHAN"
            />
            <DataKategori
              onPress={() => navigation.navigate('ListData2')}
              icon="book-outline"
              nama="LOGBOOK"
              nama2="ALAT"
            />
          </View>

          {/*  */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
