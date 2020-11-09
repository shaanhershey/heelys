import React, {Component} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import VerticalSlider from 'rn-vertical-slider';

export default class Slider extends Component{
    constructor(props){
        super(props);
        this.state = {
            value : 0,
            on : true
        }
        this.manager = new BleManager();
    }

    styles = StyleSheet.create({
        button: {
            backgroundColor: 'orange',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 12,
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            overflow: 'hidden',
            padding: 12,
            textAlign:'center'
          }
    });

    render(){
        return(
            <View>
                <View style = {{flexDirection:"row", justifyContent:"center"}}>
                <TouchableOpacity style={this.styles.button} onPress =  {() => {
                    this.powerOn(true);
                }}>
                    <Text> On </Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.styles.button} onPress = {()=> {
                    this.powerOn(false);
                }}>
                    <Text> Off </Text>
                </TouchableOpacity>
                </View>
                <Text> {this.state.value} </Text>
                <VerticalSlider
                    value={this.state.value}
                    disabled={!this.state.on}
                    min={0}
                    max={100}
                    onChange={(value) => {
                        this.valueChange(value);
                        console.log("CHANGE", this.state.value);
                    }}
                    onComplete={(value) => {
                        this.valueChange(value);
                        console.log("COMPLETE", value);
                    }}
                    width={50}
                    height={300}
                    step={1}
                    borderRadius={5}
                    minimumTrackTintColor={"black"}
                    maximumTrackTintColor={"white"}
                />
            </View>
        );
    }

    valueChange = (value) => {
        this.setState({
            value: value
        })
    }

    powerOn = (bool) => {
        if(this.state.value == 0){
            this.setState({
                on: bool
            })
        }
    }
}