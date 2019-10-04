import React from 'react';
import { StyleSheet, Text, View, YellowBox, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ListItem from './containers/ListItem';

interface IState {
  isReady: Boolean
}

interface IProps {}

export default class App extends React.Component<IProps> {

  state: IState = {
    isReady: false
  }

  constructor(props){
    super(props);
  }

  async componentDidMount(){
    await Font.loadAsync(
      'antoutline',
      require('@ant-design/icons-react-native/fonts/antoutline.ttf')
    );

    await Font.loadAsync(
      'antfill',
      require('@ant-design/icons-react-native/fonts/antfill.ttf')
    );
    this.setState({ isReady: true });
  }

  render(){
    const { isReady } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <ListItem />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#EEE',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});


YellowBox.ignoreWarnings(['Setting a timer']);
const _console = {...console};
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};