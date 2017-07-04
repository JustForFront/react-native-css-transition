# react-native-css-transition
Enable animate react-native components like css transition property.

## Install
```
npm install react-native-css-transition
```
```javascript
import Transition from 'react-native-css-transition';
```

## Dependencies
[react-native-styling](https://github.com/JustForFront/react-native-styling): For compling nested raw style sheet.

## Basic usage
### Preparing style sheet
It's not a must to use react-native-styling for compling sheet, but we recommended for improving performance.
```javascript
export const styles = {
    Counter:{
        stateTest: {
            default: {
                transition:[{    //Must not pass to native StyleSheet.create directly, will cause error
                    property:"color",
                    duration:1000,
                    delay:0,
                    timingFunction:Easing.back, // native Easing options
                    interpolate:{   // Default interpolate option for non-numeric value, auto generated
                            inputRange: [0, 100],
                            outputRange: ["#333", "#333"] // Default is initial value
                    },
                    sequence:0, //determinate the property animation effect run sync/async with others, default all zero  
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
};

export const compliedStyle = CreateNestedStyleSheet(styles);
```

### Component
Supports the same basic components as react native Animated: Text, View, ScrollView, Image
```javascript
<Transition.Text 
  style={GetStyle(compliedStyle.Counter.stateTest,{fontSize:10+stateValue*5},stateValue)} //will change as stateValue changed
  animationOptions={{_all:{useNativeDriver:true}}}
  >{v}</Transition.Text>
```
#### Props
##### style
Can be a normal style ID(s) or raw style properties, or stated sheet by [CreateNestedStyleSheet](https://github.com/JustForFront/react-native-styling#createnestedstylesheet) with transition property.
The transition component will monitor the delegated properties accroding to transition property setting and animated them on changed. Just like how CSS transition property works.
##### animationPlayed
Callback on animation played, work as Animation.start(animationPlayed).
##### animationOptions
Animation option object. First level key match with animated property name, \_all to match all. These options will overwrite computed property value.