import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Image, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, IconRegistry, Avatar, Input, Icon, Modal, Button, Divider, List, Card, ListItem } from '@ui-kitten/components';
import { useFonts, Rubik_500Medium, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { SvgXml } from 'react-native-svg';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';


const Tab = createMaterialBottomTabNavigator();

const data = [
  {id: 0, image: "https://consu-med.ru/upload/resize_cache/iblock/ed7/450_450_1/ed7638c237d49c14bd36adfa4b21bfc6.jpg", title: "ГистАктив крем, 50 мл", description: "образует натуральную защитную пленку на поверхности кожи \ncпособствует восстановлению защитного барьера кожи; \nуменьшает неприятные ощущения на коже от негативного воздействия окружающей среды", price: 1300},
  {id: 1, image: "https://consu-med.ru/upload/resize_cache/iblock/5a6/450_450_1/xz68s4j0aqx33fdq72r52gdaq3rmnqnp5.jpg.pagespeed.ic.CWQ2CkXUOk.webp", title: "Витаминно-минеральный комплекс от A до Zn", description: "Содержит: Витамин А, Витамин Е, Витамин D3, Витамин К1, Витамин С, Витамин В1, Витамин В2, Витамин В3, Витамин В5, Витамин В6, Витамин В9, Витамин В12, Биотин, Цинк, Железо, Магний, Кальций, Медь, Марганец, Хром, Селен, Йод, Молибден.", price: 1500},
  {id: 2, image: "https://consu-med.ru/upload/resize_cache/iblock/6ee/450_450_1/x6ee0602429552f19989e6851664a9217.jpg.pagespeed.ic._oaf7ZgrJs.webp", title: "Артишока экстракт", description: "Содержащиеся в артишоке инулин, аскорбиновая кислота, каротин, витамины В1 и В2 поддерживают основной обмен веществ и оказывают положительное влияние на метаболизм липидов, благодаря чему артишок способствует: улучшениям пищеварения, холестеринового обмена и т.д.", price: 1990},
  {id: 3, image: "https://consu-med.ru/upload/resize_cache/iblock/4aa/450_450_1/znho3jbvthw56muhkpro85ydqq38zngg.jpg", title: "Магния оротат 500 мг", description: "Магний – важный микроэлемент организма - участвует в переносе, хранении и утилизации энергии, синтезе белка и нуклеиновых кислот. Магний важен для метаболизма кальция, фосфора, натрия, калия, витамина С. Большое значение имеет магний в функционировании нервной ткани и системы сердца. Хорошая обеспеченность организма магнием способствует лучшей переносимости стрессовых ситуаций, подавлению депрессии. Магний обеспечивает нормальное функционирование как отдельных клеток, так и отделов сердца в целом – предсердий, желудочков.", price: 2790},
  {id: 4, image: "https://consu-med.ru/upload/resize_cache/iblock/0d0/450_450_1/pshxr38s6ge3aw968wamrf7igb4h42mm.jpg", title: "Алоэ сироп, 150мл", description: "Сок алоэ, благодаря горькому вкусу, ферментам и витаминам, возбуждает аппетит и усиливает секрецию пищеварительных желез. Сироп алоэ Consumed® улучшает клеточный метаболизм и регенерацию тканей, обладает биостимулирующим и общетонизирующим действием, улучшает функциональное состояние желудочно-кишечного тракта.*", price: 1090},
  {id: 5, image: "https://consu-med.ru/upload/resize_cache/iblock/b73/450_450_1/fo1dmfkgwv9apx6u57bqx3meckk24g9v.jpg", title: "Комплекс экстрактов клюквы, толокнянки и хвоща для мочевыводящих путей", description: "Комплекс содержит витамин С и растительные экстракты ягод клюквы, травы хвоща, листьев брусники и толокнянки. Эти растения используются в народной медицине при воспалениях мочевыводящих путей и дискомфортном диурезе. Прием комплекса осуществляется в виде раствора, что увеличивает объем выпиваемой жидкости и способствует усилению диуреза — для более активного выведения из мочевого пузыря вредных веществ и микроорганизмов.", price: 1990},
]


export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  const [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_700Bold,
  });
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  function CartScreen( { navigation }) {
    const [cartData, setCartData] = React.useState([]);
    const [fadeAnim] = React.useState(new Animated.Value(0));

    function removeFromCart(item) {
        AsyncStorage.getItem('cart').then(cart => {
          console.log("\n\nitem for deleting from cart: ", item);
          console.log("\n\nfirstCart Before removing in removeFromCart func:", cart)
            
            if (cart !== null) {
              cart = JSON.parse(cart);
              cart = cart.filter(i => i.id === item.id && item.quantity > 1).length !== 0 ? cart.map(it => it.id === item.id ? { id: it.id, quantity: it.quantity - 1 } : it) : cart.filter(i => i.id !== item.id);
              console.log("\n\nCartBefore reducing them together:", cart)
              cart = cart.filter(item => item.quantity)
              console.log("\n\nchangedCart:", cart)
              AsyncStorage.setItem('cart', JSON.stringify(cart));
              cart = cart.map((i, index) => {
                return {...data.find(i1 => i1.id === i.id), ...i}
              })
              console.log("\n\ndata Succesfully changed for removing item, new cart:", cart)
              setCartData(cart)
            } else{
              AsyncStorage.setItem('cart', []);
            }
          })
        }
      
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action below

      const loadDataOnlyOnce = (data2) => {
        data2 = JSON.parse(data2);
        data2 = data2.filter(item => item.quantity)
        console.log("\n\ndata2 before operation:", data2)
        console.log("\n\nObject.assign:", data2.map((i, index) => {
          return {...data.find(i1 => i1.id === i.id), ...i}
        }));
        data2 = data2.map((i, index) => {
          return {...data.find(i1 => i1.id === i.id), ...i}
        })
        console.log("\n\ndata2:", data2)
        setCartData(data2)
      }
      
      AsyncStorage.getItem('cart').then(cartData => {
            if (cartData !== null) {
              console.log("\n\ncartDataForCart:", cartData)
              loadDataOnlyOnce(cartData)
              console.log("\n\nData loaded")
              } else{
                console.log("\n\ncartData:", cartData)
              }
            })

      });

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  console.log("cartData after every fucking event:", cartData)
  return(
    <SafeAreaView>
        
    <Animated.View style={{opacity: fadeAnim, backgroundColor: "white", height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
    {/* <Root theme="dark"> */}
      { cartData.length !== 0 ? (
        <Button size='medium' disabled={false} accessoryLeft={(props) => <Icon {...props} name="car" />} style={{backgroundColor: "#8FB445", borderColor: "#8FB445", width: "90%", height: 50, borderRadius: 12, marginTop: 20,}} 
        onPress={() => {
          // console.log('Opening cart...')
          AsyncStorage.getItem('userAccount').then((ret) => {
            console.log(ret)
            ret = JSON.parse(ret)
            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
              }).start();
            }, 6000)

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Скоро доставим!',
                textBody: '🚚 Доставим по адресу: \n' + ret.address,
                closeOnOverlayTap: false,
                autoClose: 4000
              })

            setTimeout(() => {
              AsyncStorage.removeItem("cart");
              setCartData([])
            }, 1000)

            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true
            }).start();          
            

          })
          }}>
          <Text style={{fontSize: 16}}>
            Заказать (курьером)
          </Text>
        </Button>
      ) : null}
      { cartData.length !== 0 ? <FlatList
          data={cartData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{alignItems: "center", left: "5%", paddingBottom: 10}}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
              <View
                style={{flexDirection: "row", width: width, height: 178, marginBottom: 48, borderRadius: 10}}>
              <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <View style={{height: 160, width: 100, borderRadius: 12}}>
                  <Image resizeMode='contain' style={{height: 160, width: 100}} source={{uri: item.image}}/>
                </View>
                <Text style={{color: "black", fontFamily: "Rubik_500Medium", fontSize: 16, textAlign: "center", top: 10}}>₸ {item.price} x {item.quantity ? item.quantity : 0}</Text>
              </View>{/* <Image resizeMode="contain" height={300} width={300} source={{uri: require('./assets/drug.png')}} /> */}
              
              <View style={{flexDirection: 'column', left: 10, top: 20, justifyContent: "center"}}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "black", maxWidth: 250, fontFamily: "Rubik_700Bold", fontSize: 18, maxHeight: 50}}>{item.title}</Text>
                <TouchableOpacity onPress={() => {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: item.title,
                    textBody: item.description,
                    closeOnOverlayTap: true
                  })
                }}>
                  <Text numberOfLines={4} ellipsizeMode="tail" style={{color: "#000000", opacity: 0.3, maxWidth: 240, fontFamily: "Rubik_500Medium", fontSize: 12, height: 80, maxHeight: 80}}>{item.description}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderRadius: 10, backgroundColor: "black", width: 204, height: 40, alignItems: 'center', justifyContent: "center" }}
                onPress={() => {
                  console.log("cartDataWhileRemoving:", cartData)
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Готово!',
                    autoClose: 1000,
                    textBody: 'Товар убран из корзины',
                  })
                  removeFromCart(item)
                  }}>
                  <Text style={{textAlign: "center", fontSize: 14, fontFamily: "Rubik_500Medium", color: "white"}}>
                    Убрать из корзины
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}  
      /> : (
        <View style={{alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontFamily: "Rubik_700Bold", textAlign: "center", fontSize: 20}}>
            Пусто {"\n"} Добавьте товар в корзину
          </Text>
        </View>
      )}
      {/* <View style={{bottom: 80, borderRadius: 12, width: "100%", alignItems: "center"}}>
        <Button size='medium' disabled={false}  accessoryLeft={(props) => <Icon {...props} name="shopping-cart-outline" />} style={{elevation: 6, shadowOpacity: 0.7, position: "absolute", backgroundColor: "black", borderColor: "black", width: "65%", height: 50, borderRadius: 12, shadowOffset: {height: 5}}} onPress={() => {
          // console.log('Opening cart...')
          setVisible(true)
          }}>
          <Text>
            Корзина
          </Text>
        </Button>
      </View> */}
    {/* </Root> */}
    </Animated.View>
    
  </SafeAreaView>
);
}

  function HomeScreen({ navigation }) {
    const [fadeAnim] = React.useState(new Animated.Value(0));

    function addToCart(item) {
      AsyncStorage.getItem('cart').then(cart => {
        // console.log("cart1:", cart)
        if (cart !== null) {
          cart = JSON.parse(cart);
          cart = cart.filter(i => i.id == item.id).length !== 0 ? cart.map(it => it.id === item.id ? { id: it.id, quantity: it.quantity + 1 } : it) : [...cart, { id: item.id, quantity: 1 } ];
          AsyncStorage.setItem('cart', JSON.stringify(cart));
          // setCartData(cart)
        } else{
          AsyncStorage.setItem('cart', JSON.stringify([{id: item.id, quantity: 1}]));
        }
        // console.log("cart2:", cart)
      })
    }

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        // toValue: 1,
        // duration: 950,
        // velocity: 0.95,
        // deceleration: 0.998,
        useNativeDriver: true
      }).start();
    }, []);

    return (  
        <SafeAreaView>
          
          <Animated.View style={{opacity: fadeAnim, backgroundColor: "white", height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          {/* <Root theme="dark"> */}
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{alignItems: "center", left: "5%", paddingBottom: 10}}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={{flexDirection: "row", width: width, height: 178, marginBottom: 48, borderRadius: 10}}>
                  <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <View style={{height: 160, width: 100, borderRadius: 12}}>
                      <Image resizeMode='contain' style={{height: 160, width: 100}} source={{uri: item.image}}/>
                    </View>
                    <Text style={{color: "black", fontFamily: "Rubik_500Medium", fontSize: 16, textAlign: "center", top: 10}}>₸ {item.price}</Text>
                  </View>{/* <Image resizeMode="contain" height={300} width={300} source={{uri: require('./assets/drug.png')}} /> */}
                  
                  <View style={{flexDirection: 'column', left: 10, top: 20, justifyContent: "center"}}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "black", maxWidth: 250, fontFamily: "Rubik_700Bold", fontSize: 18, maxHeight: 50}}>{item.title}</Text>
                    <TouchableOpacity onPress={() => {
                      Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: item.title,
                        textBody: item.description,
                        closeOnOverlayTap: true
                      })
                    }}>
                      <Text numberOfLines={4} ellipsizeMode="tail" style={{color: "#000000", opacity: 0.3, maxWidth: 240, fontFamily: "Rubik_500Medium", fontSize: 12, height: 80, maxHeight: 80}}>{item.description}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius: 10, backgroundColor: "black", width: 204, height: 40, alignItems: 'center', justifyContent: "center" }}
                    onPress={() => {
                      Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Отлично!',
                        autoClose: 1000,
                        textBody: 'Товар добавлен в корзину',
                      })
                      addToCart(item)
                      }}>
                      <Text style={{textAlign: "center", fontSize: 14, fontFamily: "Rubik_500Medium", color: "white"}}>
                        Добавить в корзину
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}  
            />
          </Animated.View>
          
        </SafeAreaView>
  );
}

  const SignUp = () => {
    const [value, setValue] = React.useState('');
    const [value2, setValue2] = React.useState('');

    const xmlsvgVirus = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1135 5.52001V3.60001H14.8865V5.52001H17.04V7.30883C17.0013 7.31234 16.9626 7.31607 16.924 7.32001C14.8109 7.53546 12.8834 8.37862 11.3261 9.66079C11.2699 9.70707 11.2142 9.75392 11.159 9.80133L9.89947 8.54185L11.4461 6.99522L10.0885 5.63758L5.63755 10.0885L6.9952 11.4461L8.54183 9.8995L9.80131 11.159C9.7539 11.2142 9.70705 11.2699 9.66077 11.3261C8.3786 12.8834 7.53544 14.8109 7.31999 16.924C7.31605 16.9626 7.31233 17.0013 7.30881 17.04H5.51999L5.51999 14.8865H3.59999V21.1135H5.51999L5.51999 18.96H7.30881C7.31233 18.9987 7.31605 19.0374 7.31999 19.076C7.53545 21.1892 8.37866 23.1168 9.66089 24.674C9.70713 24.7302 9.75393 24.7858 9.8013 24.841L8.54181 26.1005L6.99518 24.5539L5.63753 25.9115L10.0884 30.3624L11.4461 29.0048L9.89945 27.4582L11.1589 26.1987C11.2141 26.246 11.2698 26.2929 11.326 26.3391C12.8832 27.6213 14.8108 28.4645 16.924 28.68C16.9626 28.6839 17.0013 28.6877 17.04 28.6912V30.48H14.8865V32.4H21.1135V30.48H18.96V28.6912C18.9987 28.6877 19.0374 28.6839 19.076 28.68C21.1891 28.4646 23.1166 27.6214 24.6739 26.3392C24.7301 26.2929 24.7858 26.2461 24.841 26.1987L26.1005 27.4582L24.5539 29.0048L25.9115 30.3624L30.3624 25.9115L29.0048 24.5539L27.4582 26.1005L26.1987 24.841C26.2461 24.7858 26.2929 24.7301 26.3392 24.6739C27.6214 23.1166 28.4645 21.1891 28.68 19.076C28.6839 19.0374 28.6877 18.9987 28.6912 18.96H30.48V21.1135H32.4V14.8865L30.48 14.8865V17.04H28.6912C28.6877 17.0013 28.6839 16.9626 28.68 16.924C28.4645 14.8108 27.6213 12.8832 26.3391 11.326C26.2928 11.2698 26.246 11.2142 26.1987 11.159L27.4582 9.89949L29.0048 11.4461L30.3624 10.0885L25.9115 5.63757L24.5539 6.99521L26.1005 8.54184L24.841 9.80134C24.7859 9.75397 24.7302 9.70715 24.674 9.66091C23.1168 8.37868 21.1892 7.53547 19.076 7.32001C19.0374 7.31607 18.9987 7.31234 18.96 7.30883V5.52001H21.1135ZM17.7136 9.36777C15.4436 9.46234 13.4008 10.4143 11.9035 11.9032C11.2492 12.5611 10.6986 13.3244 10.2789 14.1659C9.7033 15.3199 9.37377 16.6211 9.36041 18C9.36175 18.1377 9.36623 18.2746 9.3738 18.4106C9.40381 18.9501 9.48228 19.4764 9.60486 19.9851C9.98677 21.5699 10.7968 22.984 11.9035 24.0968C12.2317 24.4232 12.5861 24.7237 12.9634 24.9951C14.3794 26.0137 16.1173 26.6213 17.9999 26.6396C18.1092 26.6385 18.218 26.6355 18.3262 26.6305C18.9785 26.6004 19.6117 26.4995 20.2185 26.3355C21.7086 25.9325 23.0388 25.1486 24.0967 24.0967C25.648 22.5366 26.6165 20.3843 26.6396 17.9999C26.6243 16.4229 26.1954 14.9474 25.4579 13.6776C25.3749 13.5347 25.288 13.3944 25.1973 13.2569C24.8755 12.7688 24.5064 12.3154 24.0966 11.9033C22.6225 10.4375 20.6196 9.49199 18.3918 9.37279C18.262 9.36584 18.1313 9.3617 18 9.36043C17.9041 9.36136 17.8087 9.36381 17.7136 9.36777ZM11.7183 15.3399C10.8448 15.8847 10.379 16.9409 10.6216 17.9878C10.6235 17.9959 10.6255 18.0041 10.6274 18.0122C10.6322 18.0317 10.6371 18.0512 10.6424 18.0707C10.7575 18.5004 10.9793 18.873 11.2716 19.1678C11.7037 19.6035 12.29 19.8689 12.9138 19.8968C13.16 19.9078 13.4121 19.8817 13.6628 19.8146C14.4695 19.5984 15.0752 19.0062 15.3417 18.2772C15.4033 18.1085 15.4468 17.9325 15.4705 17.7522C15.5113 17.4408 15.4929 17.1164 15.4066 16.7942C15.3261 16.4937 15.1934 16.2211 15.021 15.9836C14.7828 15.6555 14.4686 15.3942 14.1111 15.2186C13.5941 14.9645 12.9863 14.8895 12.3862 15.0503C12.1442 15.1152 11.9203 15.2138 11.7183 15.3399ZM15.9087 14.2883C15.8598 14.7539 15.8938 15.2361 16.0222 15.7153C16.1008 16.0085 16.2105 16.285 16.3468 16.5422C16.525 16.8783 16.7486 17.1815 17.0076 17.446C17.0955 17.5358 17.1876 17.6211 17.2833 17.7018C18.1178 18.4049 19.2325 18.7515 20.3662 18.5906C20.5227 18.5683 20.6795 18.5365 20.836 18.4945C22.7259 17.9881 23.9232 16.1872 23.7297 14.3014C23.7085 14.095 23.6706 13.8876 23.6152 13.6808C23.5274 13.353 23.4006 13.046 23.2412 12.7636C23.24 12.7615 23.2389 12.7595 23.2377 12.7574C22.3761 11.237 20.568 10.4282 18.8015 10.9016C18.5555 10.9675 18.3212 11.0553 18.1002 11.1624C16.8681 11.7596 16.0486 12.9557 15.9087 14.2883ZM19.6606 20.4278C19.0026 19.607 17.9589 19.1498 16.8801 19.2587C16.7365 19.2732 16.5923 19.2977 16.4483 19.3327C16.4241 19.3386 16.3999 19.3448 16.3758 19.3512C15.2599 19.6502 14.4444 20.5106 14.1516 21.547C14.002 22.0762 13.9888 22.6514 14.1415 23.2211C14.1912 23.4065 14.2563 23.5836 14.3352 23.7514C14.9704 25.1023 16.4955 25.8498 17.9885 25.4614C17.9961 25.4595 18.0037 25.4574 18.0114 25.4554C18.5432 25.3129 19.0067 25.0429 19.378 24.6871C20.1836 23.9152 20.5548 22.7393 20.2456 21.5855C20.1287 21.1493 19.9261 20.7589 19.6606 20.4278ZM20.3701 16.7559C21.5066 16.4513 22.1811 15.2832 21.8765 14.1467C21.572 13.0102 20.4038 12.3357 19.2673 12.6402C18.1308 12.9448 17.4564 14.1129 17.7609 15.2494C18.0654 16.3859 19.2336 17.0604 20.3701 16.7559ZM17.5455 23.7167C18.2709 23.5224 18.7013 22.7768 18.507 22.0514C18.3126 21.326 17.567 20.8955 16.8416 21.0899C16.1163 21.2843 15.6858 22.0299 15.8802 22.7552C16.0745 23.4806 16.8201 23.9111 17.5455 23.7167ZM12.381 17.6049C12.4763 17.9602 12.8415 18.1711 13.1969 18.0759C13.5522 17.9807 13.7631 17.6154 13.6679 17.26C13.5727 16.9047 13.2074 16.6938 12.8521 16.789C12.4967 16.8842 12.2858 17.2495 12.381 17.6049Z" fill="black"/></svg>`
    
    const xmlsvgHand = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.0949 5.92918C13.0949 4.15182 14.5272 2.70001 16.3075 2.70001C17.6234 2.70001 18.7492 3.4932 19.247 4.62476C19.7094 4.34955 20.2495 4.19135 20.8276 4.19135C22.5498 4.19135 23.935 5.59576 23.935 7.31464V8.92374C24.332 8.73845 24.7748 8.63489 25.2425 8.63489C26.9648 8.63489 28.35 10.0393 28.35 11.7582V18.6039C27.8386 18.361 27.2664 18.225 26.6625 18.225C26.6249 18.225 26.5874 18.2255 26.55 18.2266V11.7582C26.55 11.0213 25.9586 10.4349 25.2425 10.4349C24.5265 10.4349 23.935 11.0213 23.935 11.7582V16.472H22.135V7.31464C22.135 6.57774 21.5436 5.99135 20.8276 5.99135C20.1115 5.99135 19.5201 6.57774 19.5201 7.31464V16.472H17.7201V5.92918C17.7201 5.13381 17.0816 4.50001 16.3075 4.50001C15.5334 4.50001 14.8949 5.1338 14.8949 5.92918V16.472H13.0949V8.79074C13.0949 8.05384 12.5034 7.46745 11.7874 7.46745C11.0713 7.46745 10.4799 8.05384 10.4799 8.79074V22.7253L6.90921 19.1291C6.35806 18.574 5.46716 18.574 4.91602 19.1291C4.36134 19.6877 4.36134 20.5961 4.91602 21.1548L12.7758 29.0708L13.6263 29.8298C14.981 30.878 16.6745 31.5 18.514 31.5C20.0519 31.5 21.49 31.0641 22.7124 30.3076C23.089 30.4948 23.5135 30.6 23.9625 30.6C25.4785 30.6 26.7143 29.4006 26.7728 27.899C26.7743 27.862 26.775 27.8248 26.775 27.7875C26.775 27.1057 26.5324 26.4805 26.1288 25.9936C26.3453 25.3473 26.483 24.6642 26.5305 23.9559C27.1858 24.3957 27.722 24.9989 28.0806 25.7074C27.0485 30.0586 23.1613 33.3 18.514 33.3C16.248 33.3 14.1593 32.5276 12.4967 31.2316L12.4731 31.2132L11.5368 30.3777L3.63869 22.423C2.38712 21.1625 2.38712 19.1214 3.63869 17.8608C4.89381 16.5967 6.93142 16.5967 8.18653 17.8608L8.67991 18.3577V8.79074C8.67991 7.07186 10.0651 5.66745 11.7874 5.66745C12.2551 5.66745 12.6979 5.77101 13.0949 5.9563V5.92918Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.1351 24.4917C19.1284 24.4287 19.125 24.3647 19.125 24.3C19.125 23.3059 19.9309 22.5 20.925 22.5L20.9348 22.5C21.5533 22.5033 22.098 22.8186 22.4195 23.2964C22.4452 23.3347 22.4696 23.374 22.4924 23.4143C22.4976 23.4235 22.5027 23.4327 22.5078 23.442C22.6049 23.6208 22.6726 23.8179 22.7044 24.0268C22.706 24.0375 22.7076 24.0483 22.709 24.0591L22.7105 24.0708L22.725 24.3C22.725 24.8403 22.487 25.325 22.11 25.6549C21.7934 25.9321 21.3788 26.1 20.925 26.1C20.7571 26.1 20.5945 26.077 20.4402 26.034L20.4322 26.0317C20.2124 25.9693 20.0097 25.8661 19.8328 25.7309C19.4503 25.4385 19.1885 24.9961 19.1351 24.4917ZM24.0586 22.5272C24.0691 22.5457 24.0793 22.5642 24.0894 22.5828C24.1907 22.7693 24.2762 22.966 24.3438 23.1707L24.7655 23.245C26.2589 23.5079 27.5048 24.4874 28.134 25.8164C29.5819 25.2327 30.6 23.8144 30.6 22.1625C30.6 19.9879 28.8371 18.225 26.6625 18.225C24.8361 18.225 23.2959 19.4702 22.8531 21.1608L22.8309 21.2457C23.2617 21.5151 23.6309 21.8725 23.9129 22.2916C23.9643 22.368 24.013 22.4466 24.0586 22.5272ZM21.1118 20.7048C21.0706 20.7027 21.0292 20.7013 20.9876 20.7005C20.9732 20.7003 20.9588 20.7001 20.9443 20.7001C20.9379 20.7 20.9314 20.7 20.925 20.7C18.9368 20.7 17.325 22.3118 17.325 24.3C17.325 25.7184 18.1453 26.9452 19.3374 27.5319C19.3438 27.5351 19.3501 27.5382 19.3565 27.5412C19.3522 27.6228 19.35 27.7049 19.35 27.7875C19.35 27.8404 19.3509 27.893 19.3527 27.9455C19.3947 29.1947 19.9335 30.318 20.7778 31.1241C21.6057 31.9146 22.7274 32.4 23.9625 32.4C24.1179 32.4 24.2715 32.3923 24.423 32.3773C25.4763 32.2729 26.4254 31.8143 27.1494 31.1221C28.0062 30.3029 28.5478 29.1569 28.574 27.8842C28.5746 27.8558 28.5749 27.8274 28.575 27.7989C28.575 27.7951 28.575 27.7913 28.575 27.7875C28.575 27.7253 28.5738 27.6634 28.5713 27.6018C28.571 27.5929 28.5706 27.5841 28.5702 27.5752C30.8011 26.7889 32.4 24.6624 32.4 22.1625C32.4 18.9938 29.8312 16.425 26.6625 16.425C23.9975 16.425 21.7568 18.242 21.1118 20.7048ZM26.7749 27.761C26.7684 27.0593 26.505 26.4191 26.0742 25.9298C25.8957 25.727 25.6884 25.5502 25.4588 25.4056C25.1961 25.2403 24.9042 25.1172 24.5926 25.0459C24.5466 25.0353 24.5002 25.0259 24.4535 25.0177C24.4442 25.0634 24.4341 25.1087 24.4232 25.1538C24.2589 25.8291 23.9042 26.4299 23.4192 26.896C22.8231 27.4688 22.0302 27.8383 21.152 27.893C21.1537 27.9411 21.1567 27.9889 21.1609 28.0364C21.162 28.0493 21.1632 28.0622 21.1645 28.0751C21.2243 28.6641 21.4659 29.1993 21.8322 29.6239C22.348 30.2216 23.1111 30.6 23.9625 30.6C25.4785 30.6 26.7143 29.4006 26.7728 27.899C26.7729 27.8981 26.7729 27.8971 26.7729 27.8962C26.7743 27.8602 26.775 27.8239 26.775 27.7875C26.775 27.7786 26.775 27.7698 26.7749 27.761Z" fill="black"/></svg>`

    const xmlsvgDistance = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.74937 13.7713C8.74967 13.7708 8.74996 13.7703 8.75026 13.7698L12.0454 8.0979L13.6018 9.00211L11.7288 12.2261C12.1791 12.2618 12.6283 12.3943 13.0448 12.6312C14.5512 13.4881 15.0778 15.3979 14.1997 16.8964C13.3264 18.3868 11.4039 18.8875 9.90517 18.035C8.39931 17.1783 7.87258 15.2695 8.74937 13.7713ZM23.0068 8.46L28.5868 8.46V10.26H26.6968V18H24.8968V10.26H23.0068V8.46ZM16.7968 8.46L21.3868 8.46V10.26H18.5968L18.5968 12.78H20.7118V14.58H18.5968V18H16.7968L16.7968 8.46ZM12.1548 14.1958C11.5016 13.8242 10.6724 14.0499 10.3033 14.6798C9.93887 15.3017 10.1496 16.1031 10.7952 16.4704C11.4484 16.842 12.2776 16.6162 12.6467 15.9863C13.0111 15.3644 12.8004 14.563 12.1548 14.1958ZM5.12956 24.3L6.63674 27.0129L5.06326 27.8871L2.57043 23.4L5.06326 18.9129L6.63674 19.7871L5.12956 22.5H30.8704L29.3633 19.7871L30.9367 18.9129L33.4296 23.4L30.9367 27.8871L29.3633 27.0129L30.8704 24.3H5.12956Z" fill="black"/></svg>`

    const xmlsvgProfile = `<svg width="343" height="33" viewBox="0 0 343 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66 26C2.45467 26 2.28667 25.9347 2.156 25.804C2.02533 25.6733 1.96 25.5053 1.96 25.3V7.1C1.96 6.89467 2.02533 6.72667 2.156 6.596C2.28667 6.46533 2.45467 6.4 2.66 6.4H18.2C18.4053 6.4 18.5733 6.46533 18.704 6.596C18.8347 6.72667 18.9 6.89467 18.9 7.1V25.3C18.9 25.5053 18.8347 25.6733 18.704 25.804C18.5733 25.9347 18.4053 26 18.2 26H14.588C14.3827 26 14.2147 25.9347 14.084 25.804C13.9533 25.6733 13.888 25.5053 13.888 25.3V10.88H6.972V25.3C6.972 25.5053 6.90667 25.6733 6.776 25.804C6.64533 25.9347 6.47733 26 6.272 26H2.66ZM23.3353 31.32C23.1299 31.32 22.9619 31.2547 22.8313 31.124C22.7006 30.9933 22.6353 30.8253 22.6353 30.62V12.14C22.6353 11.9347 22.7006 11.7667 22.8313 11.636C22.9619 11.5053 23.1299 11.44 23.3353 11.44H26.4993C26.6859 11.44 26.8446 11.5053 26.9753 11.636C27.1246 11.7667 27.1993 11.9347 27.1993 12.14V13.176C27.6286 12.5973 28.1979 12.1213 28.9073 11.748C29.6166 11.356 30.4939 11.16 31.5393 11.16C32.4726 11.16 33.2939 11.3093 34.0033 11.608C34.7126 11.888 35.3193 12.308 35.8233 12.868C36.3273 13.428 36.7193 14.1093 36.9993 14.912C37.2979 15.7147 37.4659 16.6387 37.5033 17.684C37.5219 18.0573 37.5313 18.4027 37.5313 18.72C37.5313 19.0373 37.5219 19.3827 37.5033 19.756C37.4659 20.764 37.3073 21.6693 37.0273 22.472C36.7473 23.2747 36.3553 23.956 35.8513 24.516C35.3473 25.076 34.7313 25.5147 34.0033 25.832C33.2939 26.1307 32.4726 26.28 31.5393 26.28C30.6246 26.28 29.8219 26.1213 29.1313 25.804C28.4593 25.468 27.8993 25.0013 27.4513 24.404V30.62C27.4513 30.8253 27.3859 30.9933 27.2553 31.124C27.1246 31.2547 26.9566 31.32 26.7513 31.32H23.3353ZM30.0273 22.528C30.6619 22.528 31.1566 22.3973 31.5113 22.136C31.8659 21.8747 32.1179 21.52 32.2673 21.072C32.4353 20.624 32.5379 20.1293 32.5753 19.588C32.6126 19.0093 32.6126 18.4307 32.5753 17.852C32.5379 17.3107 32.4353 16.816 32.2673 16.368C32.1179 15.92 31.8659 15.5653 31.5113 15.304C31.1566 15.0427 30.6619 14.912 30.0273 14.912C29.4113 14.912 28.9166 15.052 28.5433 15.332C28.1699 15.5933 27.8993 15.9387 27.7313 16.368C27.5633 16.7973 27.4699 17.264 27.4513 17.768C27.4326 18.1227 27.4233 18.468 27.4233 18.804C27.4233 19.14 27.4326 19.4947 27.4513 19.868C27.4699 20.3347 27.5726 20.7733 27.7593 21.184C27.9459 21.576 28.2259 21.9027 28.5993 22.164C28.9726 22.4067 29.4486 22.528 30.0273 22.528ZM47.3073 26.28C45.7393 26.28 44.414 26.028 43.3313 25.524C42.2673 25.02 41.446 24.3013 40.8673 23.368C40.3073 22.416 39.99 21.2867 39.9153 19.98C39.8967 19.6067 39.8873 19.1867 39.8873 18.72C39.8873 18.2347 39.8967 17.8147 39.9153 17.46C39.99 16.1347 40.326 15.0053 40.9233 14.072C41.5207 13.1387 42.3513 12.42 43.4153 11.916C44.498 11.412 45.7953 11.16 47.3073 11.16C48.838 11.16 50.1353 11.412 51.1993 11.916C52.282 12.42 53.122 13.1387 53.7193 14.072C54.3167 15.0053 54.6527 16.1347 54.7273 17.46C54.746 17.8147 54.7553 18.2347 54.7553 18.72C54.7553 19.1867 54.746 19.6067 54.7273 19.98C54.6527 21.2867 54.326 22.416 53.7473 23.368C53.1873 24.3013 52.366 25.02 51.2833 25.524C50.2193 26.028 48.894 26.28 47.3073 26.28ZM47.3073 22.864C48.1473 22.864 48.754 22.612 49.1273 22.108C49.5193 21.604 49.7433 20.848 49.7993 19.84C49.818 19.56 49.8273 19.1867 49.8273 18.72C49.8273 18.2533 49.818 17.88 49.7993 17.6C49.7433 16.6107 49.5193 15.864 49.1273 15.36C48.754 14.8373 48.1473 14.576 47.3073 14.576C46.486 14.576 45.8793 14.8373 45.4873 15.36C45.0953 15.864 44.8807 16.6107 44.8433 17.6C44.8247 17.88 44.8153 18.2533 44.8153 18.72C44.8153 19.1867 44.8247 19.56 44.8433 19.84C44.8807 20.848 45.0953 21.604 45.4873 22.108C45.8793 22.612 46.486 22.864 47.3073 22.864ZM65.6092 31.32C65.4039 31.32 65.2359 31.2547 65.1052 31.124C64.9745 30.9933 64.9092 30.8253 64.9092 30.62V26C63.2105 26 61.7919 25.7573 60.6532 25.272C59.5332 24.768 58.6839 24.0587 58.1052 23.144C57.5265 22.2293 57.1999 21.1373 57.1252 19.868C57.0692 19.1027 57.0692 18.3373 57.1252 17.572C57.1999 16.3027 57.5452 15.2107 58.1612 14.296C58.7772 13.3813 59.6452 12.6813 60.7652 12.196C61.9039 11.692 63.2852 11.44 64.9092 11.44V6.82C64.9092 6.61467 64.9745 6.44667 65.1052 6.316C65.2359 6.18533 65.4039 6.12 65.6092 6.12H68.9132C69.1185 6.12 69.2865 6.18533 69.4172 6.316C69.5479 6.44667 69.6132 6.61467 69.6132 6.82V11.44C71.2559 11.44 72.6372 11.692 73.7572 12.196C74.8959 12.6813 75.7639 13.3813 76.3612 14.296C76.9772 15.2107 77.3319 16.3027 77.4252 17.572C77.4625 18.3373 77.4625 19.1027 77.4252 19.868C77.3319 21.1373 76.9959 22.2293 76.4172 23.144C75.8385 24.0587 74.9892 24.768 73.8692 25.272C72.7492 25.7573 71.3305 26 69.6132 26V30.62C69.6132 30.8253 69.5479 30.9933 69.4172 31.124C69.2865 31.2547 69.1185 31.32 68.9132 31.32H65.6092ZM64.9372 22.584V14.856C63.8732 14.856 63.0985 15.108 62.6132 15.612C62.1279 16.0973 61.8572 16.8533 61.8012 17.88C61.7825 18.1413 61.7732 18.4307 61.7732 18.748C61.7732 19.0653 61.7825 19.336 61.8012 19.56C61.8759 20.624 62.1559 21.3987 62.6412 21.884C63.1265 22.3507 63.8919 22.584 64.9372 22.584ZM69.5852 22.584C70.6679 22.584 71.4425 22.3413 71.9092 21.856C72.3945 21.3707 72.6652 20.6053 72.7212 19.56C72.7399 19.336 72.7492 19.0653 72.7492 18.748C72.7492 18.4307 72.7399 18.1413 72.7212 17.88C72.6839 16.8347 72.4132 16.0693 71.9092 15.584C71.4239 15.0987 70.6492 14.856 69.5852 14.856V22.584ZM80.9798 26C80.7931 26 80.6345 25.9347 80.5038 25.804C80.3731 25.6733 80.3078 25.5147 80.3078 25.328V12.14C80.3078 11.9347 80.3731 11.7667 80.5038 11.636C80.6345 11.5053 80.8025 11.44 81.0078 11.44H84.3118C84.4985 11.44 84.6571 11.5053 84.7878 11.636C84.9371 11.7667 85.0118 11.9347 85.0118 12.14V22.36L83.7518 21.744L90.6678 11.888C90.7611 11.7573 90.8731 11.6547 91.0038 11.58C91.1345 11.4867 91.2838 11.44 91.4518 11.44H94.4478C94.6345 11.44 94.7931 11.5053 94.9238 11.636C95.0545 11.7667 95.1198 11.9253 95.1198 12.112V25.3C95.1198 25.5053 95.0545 25.6733 94.9238 25.804C94.7931 25.9347 94.6251 26 94.4198 26H91.1158C90.9105 26 90.7425 25.9347 90.6118 25.804C90.4811 25.6733 90.4158 25.5053 90.4158 25.3V15.388L91.7038 15.64L84.7318 25.552C84.6571 25.6827 84.5545 25.7947 84.4238 25.888C84.2931 25.9627 84.1345 26 83.9478 26H80.9798ZM98.0312 26C97.8446 26 97.6766 25.9347 97.5272 25.804C97.3966 25.6547 97.3312 25.4867 97.3312 25.3V22.836C97.3312 22.4253 97.5552 22.192 98.0032 22.136C98.5446 22.08 98.9552 21.828 99.2352 21.38C99.5152 20.932 99.7112 20.2693 99.8232 19.392C99.9352 18.5147 99.9912 17.4133 99.9912 16.088V12.14C99.9912 11.9347 100.057 11.7667 100.187 11.636C100.337 11.5053 100.505 11.44 100.691 11.44H111.667C111.873 11.44 112.041 11.5053 112.171 11.636C112.302 11.7667 112.367 11.9347 112.367 12.14V25.3C112.367 25.5053 112.302 25.6733 112.171 25.804C112.041 25.9347 111.873 26 111.667 26H108.363C108.177 26 108.009 25.9347 107.859 25.804C107.729 25.6733 107.663 25.5053 107.663 25.3V15.108H104.471V16.592C104.471 18.384 104.378 19.8867 104.191 21.1C104.005 22.3133 103.669 23.2747 103.183 23.984C102.698 24.6933 102.035 25.2067 101.195 25.524C100.355 25.8413 99.3006 26 98.0312 26ZM116.603 26C116.398 26 116.23 25.9347 116.099 25.804C115.969 25.6733 115.903 25.5053 115.903 25.3V12.14C115.903 11.9347 115.969 11.7667 116.099 11.636C116.23 11.5053 116.398 11.44 116.603 11.44H119.907C120.113 11.44 120.281 11.5053 120.411 11.636C120.561 11.7667 120.635 11.9347 120.635 12.14V15.92H123.295C125.162 15.92 126.609 16.3773 127.635 17.292C128.662 18.188 129.175 19.4293 129.175 21.016C129.175 22.64 128.643 23.8813 127.579 24.74C126.515 25.58 125.031 26 123.127 26H116.603ZM120.523 22.78H122.875C123.603 22.78 124.135 22.6493 124.471 22.388C124.807 22.108 124.975 21.6507 124.975 21.016C124.975 20.3813 124.807 19.9053 124.471 19.588C124.135 19.2707 123.603 19.112 122.875 19.112H120.523V22.78Z" fill="black"/>
    <path d="M305.25 16.9413C305.25 24.259 299.318 30.1913 292 30.1913C284.682 30.1913 278.75 24.259 278.75 16.9413C278.75 9.62348 284.682 3.69125 292 3.69125C299.318 3.69125 305.25 9.62348 305.25 16.9413Z" fill="black" stroke="#F5F5F5" stroke-width="1.5"/>
    <circle cx="311" cy="16.8238" r="13.25" fill="#9B97A1" stroke="#F5F5F5" stroke-width="1.5"/>
    <circle cx="329" cy="16.0587" r="13.25" fill="white" stroke="#F5F5F5" stroke-width="1.5"/>
    </svg>
    `

    
    return (
      <SafeAreaView style={{height: "100%", width: "100%", alignItems: "center", backgroundColor: "white"}}>
          <View style={{marginTop: "0%", alignItems: "center"}}>
              <Avatar style={{height: 112, width: 110}} source={require('./assets/doctor.png')}/>
          </View>
          
          <View style={{alignItems: "center", marginTop: "5%", width: "100%"}}>
            <SvgXml xml={xmlsvgProfile} height={35} width="100%" />
          </View>

          <View style={{marginTop: 20, alignItems: "flex-start", marginHorizontal: "5%"}}>
            <View>
              <Text style={{color: "#847F8C", fontFamily: "Rubik_500Medium", textAlign: "left", left: 0.8}}>
                  Ф.И.О
              </Text>
            </View>
            <Input
              size="large"
              style={{backgroundColor: "#EDEDEE", borderColor: "transparent", borderRadius: 12, marginTop: "1%"}}
              placeholder='Иван Иванович'
              value={value}
              onChangeText={nextValue => setValue(nextValue)}
            />
          </View>

          <View style={{alignItems: "flex-start", marginTop: 28, marginHorizontal: "5%"}}>
            <View>
              <Text style={{color: "#847F8C", fontFamily: "Rubik_500Medium", left: 0.8, textAlign: "left"}}>
                Адрес
              </Text>
            </View>
            <Input
            size="large"
              style={{backgroundColor: "#EDEDEE", borderColor: "transparent", borderRadius: 12, marginTop: "1%"}}
              placeholder='Улица Пушкина, дом Колотушкина'
              value={value2}
              onChangeText={nextValue => setValue2(nextValue)}
            />
          </View>

          {[value.length, value2.length].filter(item => item === 0).length === 2 ? 
          (
            <View style={{alignItems: 'center', marginTop: 32, width: "100%"}}>
              <Button style={{width: "80%", borderRadius: 12, borderColor: "transparent", backgroundColor: "#D9D7DB"}} disabled={true}
                onPress={() => alert("Hello, World!")}
              >
                ПРОДОЛЖИТЬ
              </Button>
            </View>
          ) 
          : [value.length, value2.length].filter(item => item === 0).length === 0 ?
          (
            <View style={{alignItems: 'center', marginTop: 32, width: "100%"}}>
              <Button style={{width: "80%", borderRadius: 12, backgroundColor: "black", borderColor: "transparent"}} disabled={false}
                onPress={() => {
                  const jsonValue = JSON.stringify({id: 0, name: value, address: value2})
                  AsyncStorage.setItem("userAccount", jsonValue)
                  // alert("Спасибо!")
                  setSkip(true)
                  }}>
                ПРОДОЛЖИТЬ
              </Button>
            </View>
          ) : (
            <View style={{alignItems: 'center', marginTop: 32, width: "100%"}}>
              <Button style={{width: "80%", borderRadius: 12, borderColor: "transparent", backgroundColor: "#D9D7DB"}} disabled={true}
                onPress={() => alert("Hello, World!")}
              >
                ПРОДОЛЖИТЬ
              </Button>
            </View>
          )}

          <View style={{marginTop: 48, alignItems: "center", left: 15, flexDirection: "row", width: "100%"}}>
            <SvgXml xml={xmlsvgVirus} width={36} height={36} />
            <Text style={{maxWidth: 168, fontFamily: "Rubik_500Medium", fontSize: 14, left: '10%'}}>
              Здесь вы найдете лекарства против любых вирусов!
            </Text>
          </View>

          <View style={{marginTop: 40, width: "100%", justifyContent: "flex-start", alignItems: "center", flexDirection: "row-reverse"}}>
            <SvgXml xml={xmlsvgHand} width={36} height={36} />
            <Text style={{maxWidth: 270, fontFamily: "Rubik_500Medium", fontSize: 14, left: '10%'}}>
              Надежный способ предотвратить заражение - мыть руки чаще!
            </Text>
          </View>

          <View style={{marginTop: 40, width: "100%", alignItems: "center", left: 15, flexDirection: "row"}}>
            <SvgXml xml={xmlsvgDistance} width={36} height={36} />
            <Text style={{maxWidth: 222, fontFamily: "Rubik_500Medium", fontSize: 14, left: '10%'}}>
            Держите дистанцие, и старайтесь не прикосаться к окружающей вас среде
            </Text>
          </View>
      </SafeAreaView>
  );
}

  const [skip, setSkip] = React.useState(false);

  const user = AsyncStorage.getItem('userAccount')

  if (user != null) {
    user.then((ret) => {
        // console.log("\n\nreturn of getItem:", ret)
        if (ret === null) {
          // this is the first time
          setSkip(false)
          
        } else {
          // this is the second time
          setSkip(true)
        }
      }).catch(err => console.error(err.toString()));
    };
  
  // console.log(skip)
  if (!fontsLoaded) {
    return (
      <AppLoading />
    )
  } else{
    if (skip) {
      // return the home page
      return (
        <>
        <Root theme='dark'>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
              <Tab.Navigator
                shifting={true}
                barStyle={{backgroundColor: "black", paddingBottom: 5, overflow: "hidden", borderTopRightRadius: 18, borderTopLeftRadius: 18, borderColor: 'black', paddingTop: 5}}
                initialRouteName="Home"
                activeColor="#FBFBFB"
                inactiveColor="#A4A4A4">
                <Tab.Screen name="Home" 
                  options={{
                    tabBarLabel: 'Лекарства', 
                    tabBarIcon: ({ color }) => (
                      <Icon
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        fill={color}
                        name='activity-outline'
                      />
                    ),
                  }} component={HomeScreen} />
                
                <Tab.Screen name="Cart" options={{
                    tabBarLabel: 'Корзина', 
                    tabBarIcon: ({color}) => (
                      <Icon
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        fill={color}
                        name='shopping-cart-outline'
                      />
                    ),
                  }} component={CartScreen} />
              </Tab.Navigator>
            </NavigationContainer>
            {/* <HomeScreen /> */}
          </ApplicationProvider>
          
        </Root>
        <StatusBar backgroundColor='white' style='dark' />
        </>

      );
    } else if(!skip) {
      // return the signup page
      return (
        <>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.light}>
            <SignUp />
          </ApplicationProvider>
          <StatusBar backgroundColor='white' style='dark' />
        </>
      );
    }
  }
}
