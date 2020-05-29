import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TextInput, 
  AsyncStorage, 
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useDispatch } from 'react-redux'

const formatNumber = number => `0${number}`.slice(-2)

const getRemaining = (time) => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60
  return { mins : formatNumber(mins), secs : formatNumber(secs) }
}

function Board({ route, navigation }){
  const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)
  const { dificulty } = route.params
  const [board, setBoard] = useState([])
  const [name, setName] = useState('')
  const [input, setInput] = useState([])
  const [status, setStatus] = useState("")
  const [isSolved, setIsSolved] = useState(false)

  const [remainingSecs, setRemainingSecs] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const { mins, secs } =getRemaining(remainingSecs)

  let dispatch = useDispatch()
  
  const stopper = () => {
    setIsActive(!isActive)
    // console.log('timer stopped')
    // console.log(mins, secs)
  }

  const fetchData = useCallback(async () => {
    // console.log('fetching')
    const response = await fetch(`https://sugoku2.herokuapp.com/board?difficulty=${dificulty}`);
    const data = await response.json();
    setBoard(data.board);
    const boardClone = clone(data.board);
    setInput(boardClone);
    setStatus(false);
    setIsActive(true);
    // console.log('start-timer')
    // console.log('fetched')
  });

  useEffect(() => {
    fetchData()
    getName()
  },[])

  useLayoutEffect(() => {
    let interval = null
    if(isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1)
      }, 1000)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, remainingSecs]);

  const inputChange = (num, row, col) => {
    const newBoard = input.slice(0)
    newBoard[row][col] = Number(num)
    setInput(newBoard)
  }

  const newBoard = () => {
    fetchData()
    setRemainingSecs(0)
  }

  const getName = useCallback(async () => {
    try{
      // console.log('getName')
      const userName = await AsyncStorage.getItem('name')
      setName(userName)
    } catch (err) {
      alert(err)
    }
  })

  const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

  const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

  const validate = async () => {
    const currentBoard = { board : input }
    const res = await fetch('https://sugoku2.herokuapp.com/validate', {
      method: 'POST',
      body: encodeParams(currentBoard),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const result = await res.json()
    setStatus(result.status)
    // console.log(result.status + ' <<<< validate')
    alert(result.status)
    return result.status
  }

  const solve = async () => {
    const currentBoard = { board }
    const res = await fetch('https://sugoku2.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams(currentBoard),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const result = await res.json()
    // console.log(result.status + ' <<<< solve status') 
    setBoard(result.solution)
    setStatus(result.status)
    setIsSolved(true)
  }

  const finish = async () => {
    // console.log(isSolved + ' <<< isSolved di board')
    stopper()
    let hasil = await validate()

    // FOR PRODUCTION <<<<<<<<<<< !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (hasil === solve && !isSolved){
      dispatch({
        type : 'SET_LEADERBOARD',
        payload : {
          name : name,
          time : (mins*60) + secs
        }
      }) 
    }
    // FOR PRODUCTION <<<<<<<<<<< !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //FOR TESTING PURPOSE ONLY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // if (hasil === 'unsolved' && isSolved){
    //   dispatch({
    //     type : 'SET_LEADERBOARD',
    //     payload : {
    //       name : name,
    //       time : (mins*60) + secs
    //     }
    //   }) 
    // }
    //FOR TESTING PURPOSE ONLY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    navigation.navigate('Finish', {status : hasil, solved : isSolved})
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.container}>
          <Text style={styles.time}>{`${mins} : ${secs}`}</Text>
          <Text style={styles.text}>Solve it, {name} !</Text>
          {!board.length && <ActivityIndicator size="large" color="#0000ff"/>}
          <View>
            {board.map((el, rowIndex) => (
            <View 
              style={
                [ styles.board,
                  rowIndex === 2 || rowIndex === 5
                  ? styles.doubleRow
                  : rowIndex === 8
                  ? styles.bottomRow
                  : styles.row]
              } 
              key={rowIndex}>
              {el.map((ell, colIndex) => (
                <View
                  style={
                      colIndex === 2 || colIndex === 5
                      ? styles.doubleCell
                      : colIndex === 8
                      ? styles.rightCell
                      : styles.cell
                  }
                  key={colIndex}
                >
                  <TextInput 
                      style={styles.number}
                      editable={ell === 0 ? true : false}
                      maxLength={1}
                      keyboardType="numeric"
                      onChangeText={num => inputChange(num, rowIndex, colIndex)}
                      >
                      {status === 'solved' ? (
                        ell
                        ) : (
                          ell == 0 ? "" : ell
                      )}
                  </TextInput>
                </View>
              ))}
            </View>
            ))}
            <View style={styles.button}>
              <Button title="Validate" onPress={validate}></Button>
              <Button title="New Board" onPress={newBoard}></Button>
              <Button 
                  title="Finish" 
                  onPress={() => {finish()}}
              >
              </Button>
            </View>
            <Button 
                  title="Surrender? Solve" 
                  onPress={solve}
                  color="#86cc5e"
              ></Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  board : {
    display : 'flex',
    flexDirection : 'row',
  },
  number : {
    borderWidth : 1,
    height : 40,
    width : 40,
    textAlign : 'center',
    fontSize : 20,
    color : 'green'
  },
  text : {
    fontSize : 40,
    marginBottom : 50,
    marginTop : -10
  },
  button : {
    display : "flex",
    flexDirection : 'row',
    marginTop: 150,
    justifyContent: 'center'
  },
  doubleRow: {
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
  },
  bottomRow: {
    display: "flex",
    flexDirection: "row",
  },
  doubleCell: {
    borderRightWidth: 2,
  },
  time : {
    fontSize : 30,
    color : '#d65306'
  }
})

export default Board