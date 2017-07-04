import React, { Component } from 'react';
import {
    Button,
    Text,
    View,
    Easing
} from 'react-native';
import {GetStyle,CreateNestedStyleSheet} from 'react-native-styling';
import Transition from 'react-native-css-transition';

const styles = {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        Counter:{
            stateTest: {
                default: {
                    transition:[{
                        property:"color",
                        duration:1000,
                        delay:0,
                        timingFunction:Easing.back,
                        sequence:0,
                    },{
                        property:"fontSize",
                        duration:1000,
                        delay:0,
                        timingFunction:Easing.back,
                        sequence:1,
                    }],
                    color: '#333'
                },
                1:{
                    color: 'yellow'
                },
                2:{
                    color: 'orange'
                },
                3:{
                    color: 'red'
                }
            }
        }
    },
    compliedStyle = CreateNestedStyleSheet(styles);

export default class App extends Component {

    state = {
        value: 0
    };

    incrementCount = () => {
        this.setState({value:this.state.value+1});
    };

    render() {
        const v = this.state.value;
        return ( <View style={compliedStyle.container}>
            <Text>
                Counter:
                <Transition.Text
                    style={GetStyle(compliedStyle.Counter.stateTest,{fontSize:10+v*5},v)}
                    animationOptions={{_all:{duration:500}}}   //overwrite all duration
                    animationPlayed={()=>{ console.log("Animated!") }}
                >{v}</Transition.Text>
            </Text>
            <Button title="Add" onPress={this.incrementCount}/>
        </View> );
    }
}