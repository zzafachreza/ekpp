import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {storeData, getData} from '../../utils/localStorage';
import axios from 'axios';
import {colors} from '../../utils/colors';
import {windowWidth, fonts} from '../../utils/fonts';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({navigation, route}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataBarang();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getDataBarang();
  }, []);

  const getDataBarang = () => {
    axios.get('https://zavalabs.com/ekpp/api/pinjam.php').then(res => {
      setData(res.data);
    });
  };

  const renderItem = ({item}) => (
    <>
      <View style={{padding: 10, backgroundColor: colors.secondary}}>
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.white,
            fontFamily: fonts.secondary[600],
          }}>
          {item.status}
        </Text>
      </View>

      <View
        //   onPress={() => navigation.navigate('Pinjam', item)}
        style={{
          padding: 10,
          backgroundColor: 'white',

          // height: 80,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: windowWidth / 30,
              color: colors.black,
              fontFamily: fonts.secondary[600],
            }}>
            {item.nama_lengkap}
          </Text>
          <Text
            style={{
              fontSize: windowWidth / 30,
              color: colors.secondary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.tanggal_pinjam}
          </Text>

          <Text
            style={{
              fontSize: windowWidth / 30,
              color: colors.primary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.nama_barang}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',

            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Montserrat-Medium',
              color: colors.black,
            }}>
            {item.qty}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: colors.secondary,
            }}>
            Jumlah
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          Alert.alert('LOGBOOK ALAT', 'Kembalikan Alat & Bahan Sekarang ?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () =>
                axios
                  .post('https://zavalabs.com/ekpp/api/transaksi_update.php', {
                    id: item.id,
                    qty: item.qty,
                    id_barang: item.id_barang,
                  })
                  .then(res => {
                    console.log(res);
                    getDataBarang();
                  }),
            },
          ]);
        }}
        style={{padding: 10, backgroundColor: '#CDCDCD', marginBottom: 10}}>
        <Text
          style={{
            fontSize: windowWidth / 30,
            textAlign: 'center',
            color: colors.black,
          }}>
          KEMBALIKAN SEKARANG
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      style={{
        padding: 10,
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
