import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  AsyncStorage, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

function Home({ navigation }) {
  const image = { uri: "https://i2.wp.com/d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2020/01/16161919/hacktiv8.png?fit=300%2C300&ssl=1" };
  let [name, setName] = useState('')
  let [isName, setIsName] = useState(false)

  const addName = () => {
    AsyncStorage.setItem('name', name)
    setIsName(true)
  }

  const signOut = () => {
    setName('')
    setIsName(false)
  }
 
  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <ImageBackground source={image} style={styles.image}>
        <View style={styles.container}>
          {!isName ?
          <>
            {name.length >= 4 ? 
              <>
                <Text style={styles.welcome}>Sure?</Text>
                <TouchableOpacity
                  onPress={() => {addName()}}
                  style={styles.addName}
                >
                  <Text style={styles.submit}>Submit Name</Text>
                </TouchableOpacity>
              </>
              : 
              <>  
                <Text style={styles.welcome}>Hello!</Text>
                <Text style={styles.text}>Please enter your name to continue
                </Text>
                <Text style={styles.text2}>Fill 4 - 8 character</Text>
              </>
            }
            <TextInput 
              onChangeText={name => setName(name)}
              style={styles.input}
              autoCapitalize={"words"}
              keyboardType="default"
              maxLength={8}
              textAlign={'center'}
              >
            </TextInput>
          </>
          :
          <>
            <Text style={styles.level}>Select Level</Text>
            <View>
              <Button onPress={() => navigation.navigate('Board', {dificulty : 'easy'})} title="Easy"></Button>
              <Button onPress={() => navigation.navigate('Board', {dificulty : 'medium'})} title="Medium"></Button>
              <Button onPress={() => navigation.navigate('Board', {dificulty : 'hard'})} title="Hard"></Button>
              <Button onPress={() => navigation.navigate('Board', {dificulty : 'random'})} title="Random"></Button>
            </View>
            <Text style={styles.change}>Change Name ?</Text>
          <Button onPress={() => {signOut()}} title="Sign Out" color ="red"></Button>
          </>
          }
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
  },  
  welcome : {
    fontSize : 50,
    color : '#292929',
    marginTop : 140
  },
  level : {
    fontSize : 50,
    color : '#292929',
    marginTop : 180
  },
  name : {
    fontSize : 20,
    marginBottom : 20
  },
  input : {
    borderWidth : 2,
    width : 300,
    height : 40,
    borderColor : 'gray',
    fontSize : 20,
    borderRadius : 30
  },
  text : {
    color : '#d65306',
    marginBottom : 20,
    marginTop : 10,
    fontSize : 15,
    backgroundColor : '#f2f2f2'
  },
  text2 : {
    color : '#d65306',
    fontSize : 15,
    backgroundColor : '#f2f2f2'
  },
  button : {
    margin : 0
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  image: {
    flex: 1,
    marginTop : 50,
    alignContent : 'center',
    justifyContent: "center",
    alignItems : 'center',
    height : 250,
    width : 300
  },
  change : {
    fontSize : 20,
    marginTop : 100
  },
  addName : {
    backgroundColor : '#d65306',
    borderRadius: 60,
    height : 40,
    width : 150,
    marginBottom : 5
  },
  submit : {
    fontSize : 20,
    textAlign : 'center',
    marginTop : 6,
    color : 'white'
  }
})

export default Home