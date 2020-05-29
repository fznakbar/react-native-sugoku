import React from 'react';
import { useSelector } from 'react-redux'
import { 
  View, 
  Text, 
  StyleSheet, 
  Button,
  FlatList,
  TouchableOpacity
 } from 'react-native';
 import Constants from 'expo-constants'

function Finish({ route, navigation }) {

  let list = useSelector(state => state.leaderBoard)

  let newList = list.sort((function (a, b) {
    return a.time - b.time;
  }))

  const goHome = () => {
    navigation.navigate('Home')
  }

  const { status, solved } = route.params

  return(
    <View style={styles.container}>
        {status === 'unsolved' || status === 'broken'?
          <>
            {!solved ?
              <>
              <Text style={styles.welcome1}>Sorry,</Text>
              <Text style={styles.welcome}>You {status} The Game</Text>
              </>
              :
              <>
              <Text style={styles.welcome1}>Huh,</Text>
              <Text style={styles.welcome}>You Cheat The Game !</Text>
              <Text style={styles.surrender}>Try not to surrender next time !</Text>
              </>
            }
          </>
            :
            <>
            <Text style={styles.welcome}>Congratulations,</Text>
            <Text style={styles.welcome}>You {status} The Game !</Text>
            </>
        }
        <Text style={styles.leader}>Our Leader Board :</Text>
            {/* {newList.map((el, index) => {
              return(
                <View key={index}>
                  <Text style={styles.name}>{index + 1}. {el.name} : {Math.floor(el.time / 60)} Minutes {(el.time - (Math.floor(el.time / 60) * 60))} Seconds</Text>
                </View>
              )
            })} */}
           <FlatList
              style={styles.flat}
              data={newList}
              renderItem={({ item, index }) => <Text style={styles.name} keyExtractor={index}>{index + 1}. {item.name} : {Math.floor(item.time / 60)} Minutes {(item.time - (Math.floor(item.time / 60) * 60))} Seconds</Text>}
              keyExtractor={(item, index) => index.toString()}
           />
        {/* <Button onPress={goHome} title="New Game ?" ></Button> */}
        <TouchableOpacity
          onPress={() => {goHome()}}
          style={styles.addName}
        >
          <Text style={styles.submit}>New Game ?</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  flat : {
    marginBottom : 10
  },
  area : {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  container : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center'
  },  
  welcome1 : {
    fontSize : 35,
    marginTop : 160
  },
  welcome : {
    fontSize : 35
  },
  status : {
    fontSize : 20
  },
  surrender : {
    fontSize : 20
  },
  leader : {
    fontSize : 20,
    marginTop : 40,
    color : '#d65306'
  },
  name : {
    fontSize : 20,
    marginVertical : 3
  },
  addName : {
    backgroundColor : '#d65306',
    borderRadius: 60,
    height : 40,
    width : 150,
    marginTop : 40,
    marginBottom : 240
  },
  submit : {
    fontSize : 20,
    textAlign : 'center',
    marginTop : 6,
    color : 'white'
  }
})

export default Finish