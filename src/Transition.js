import React, { Component,createFactory } from 'react';
import PropTypes from 'prop-types';
import {
    Animated
} from 'react-native';
import {GetStyleValueById} from "react-native-styling";

class TransitionComponents extends Component {

    static propTypes = {
        component: PropTypes.func.isRequired,
        style:PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        animationOptions:PropTypes.object,
        animationPlayed:PropTypes.func
    };

    static defaultProps = {};

    _animatedValues = {};
    _animatedSettings = {};
    _animations = [];
    _styleValues = {};
    _interpolatedValues = {};

    constructor(props){

        super(props);

        this._styleValues = this.prepareAnimatedValues(props.style,props.animationOptions);

    }

    componentDidUpdate(){

        this.playAnimation();

    }

    componentWillReceiveProps(nextProps){

        const style = this.prepareAnimatedValues(nextProps.style,nextProps.animationOptions);
        this.prepareAnimation(style,nextProps.animationOptions);

        this._styleValues = style;

    }

    playAnimation(){

        const a = this._animations,l = a.length;

        if(l){

            let callback = this.props.animationPlayed;

            callback = callback?callback:undefined;

            if(l===1){

                a[0].start(callback)

            }else{

                Animated.sequence(a).start(callback);

            }

        }

    }

    prepareAnimation(style,animationOptions){

        animationOptions = typeof animationOptions==="undefined"?{}:animationOptions;

        let animations = {},keys,animationArr = [],oStyle = this._styleValues,interpolatedValues = this._interpolatedValues,
            _animatedValues = this._animatedValues,_animatedSettings = this._animatedSettings;

        Object.keys(_animatedValues).map((k)=>{

            let animatedValue = _animatedValues[k],
                setting = _animatedSettings[k],
                option = typeof animationOptions[k]!=="undefined"?animationOptions[k]:null,
                interpolate = typeof setting.interpolate!=="undefined"?setting.interpolate:null,
                typeofV = typeof style[k],
                animatedOption = {
                    toValue: style[k],
                    duration: setting.duration,
                    delay: setting.delay?setting.delay:0,
                };

            if(typeof animationOptions["_all"]!=="undefined"){

                option = option?{...animationOptions._all,...option}:animationOptions._all;

            }

            if(typeofV!=="undefined"&&style[k]!=oStyle[k]){

                if(interpolate){

                    _animatedValues[k] = animatedValue = new Animated.Value(interpolate.inputRange[0]);

                    animatedValue = animatedValue.interpolate(interpolate);

                    animatedOption.toValue = interpolate.inputRange[(interpolate.inputRange.length-1)];

                }else if(typeofV==="string"){

                    _animatedValues[k] = animatedValue = new Animated.Value(0);

                    interpolatedValues[k] = animatedValue.interpolate({
                        inputRange: [0, 100],
                        outputRange: [oStyle[k], style[k]]
                    });

                    animatedOption.toValue = 100;

                }

                if(option){

                    animatedOption = {...animatedOption,...option};

                }

                setting.sequence = setting.sequence?setting.sequence:0;

                if(typeof animations[setting.sequence]==="undefined"){

                    animations[setting.sequence] = [];

                }

                animations[setting.sequence].push(Animated.timing(
                    animatedValue,
                    animatedOption
                ));

            }

        });

        keys = Object.keys(animations);

        if(keys.length){

            if(keys.length!==1) {

                keys.sort();

            }

            keys.map((k)=>{

                if(animations[k].length===1) {

                    animationArr.push(animations[k][0]);

                }else{

                    animationArr.push(Animated.parallel(animations[k]));

                }

            });

            this._animations = animationArr;

        }



    }

    prepareAnimatedValues(styles,animationOptions){

        animationOptions = typeof animationOptions==="undefined"?{}:animationOptions;

        if(typeof styles==="number"){

            styles = [styles];
            this.props.style = styles;

        }

        let styleValues = {},
            styleVals = {};

        styles.map((v)=>{

            if(typeof v==="number"){

                v = GetStyleValueById(v);

            }

            styleValues = {...styleValues,...v};

        });

        if(styleValues.transition){

            let _animatedValues = this._animatedValues,_animatedSettings = this._animatedSettings,
                transactions = Array.isArray(styleValues.transition)?styleValues.transition:[styleValues.transition],
                interpolatedValues = this._interpolatedValues;

            transactions.map((transaction)=>{

                const property = transaction.property,
                    val = styleValues[property],
                    interpolate = typeof transaction.interpolate!=="undefined"?transaction.interpolate:null;

                    if(typeof _animatedValues[transaction.property]==="undefined"){

                        const initVal = interpolate?interpolate.inputRange[0]:(typeof val==="number"?val:0);

                        _animatedValues[property] = new Animated.Value(initVal);

                    }

                if(typeof val==="string"||interpolate){

                    interpolatedValues[property] = _animatedValues[property].interpolate(interpolate?interpolate:{
                        inputRange: [0, 100],
                        outputRange: [val, val]
                    });

                }

                _animatedSettings[property] = transaction;
                styleVals[property] = val;

            });

        }

        return styleVals;

    }

    render(){

        let props = {...this.props},TransitionComponent = this.props.component,
            style = props.style,key,_interpolatedValues = this._interpolatedValues,
            _animatedValues = this._animatedValues,animatedStyle = {};

        delete props.style;
        delete props.children;
        delete props.component;

        for(key in _animatedValues){

            if(typeof _interpolatedValues[key]==="object"){

                animatedStyle[key] = _interpolatedValues[key];

            }else{

                animatedStyle[key] = _animatedValues[key];

            }

        }

        if(Array.isArray(style)){

            style.push(animatedStyle);

        }else{

            style = [style,animatedStyle];

        }

        return (
            <TransitionComponent style={style} {...props}>{this.props.children}</TransitionComponent>
        );

    }

}

class TransitionText extends TransitionComponents{

    static defaultProps = {component:Animated.Text};

}

class TransitionView extends TransitionComponents{

    static defaultProps = {component:Animated.View};

}

class TransitionScrollView extends TransitionComponents{

    static defaultProps = {component:Animated.ScrollView};

}

class TransitionImage extends TransitionComponents{

    static defaultProps = {component:Animated.Image};

}

export const Transition = {
    Text:TransitionText,
    View:TransitionView,
    ScrollView:TransitionScrollView,
    Image:TransitionImage
};