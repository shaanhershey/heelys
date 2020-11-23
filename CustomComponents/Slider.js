import React, {Component} from 'react';
import { Button, 
    StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import VerticalSlider from 'rn-vertical-slider';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class Slider extends Component{
    constructor(props){
        super(props);
        this.state = {
            value : 0,
            on : true,
            device : null,
            freeToWrite: true
        }
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


    async connectAndSetup () {
        try{
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            console.log(granted);
            const device = await RNBluetoothClassic.pairDevice("98:D3:31:F4:25:E3");
            console.log(device.name);
            await device.connect({
                CONNECTOR_TYPE: 'delimited',
                SECURE_SOCKET : false,
                DELIMETER : '\n'
            });
            console.log("connected");
            this.setState({device : device});
            console.log(device.name);
        } catch (err){
            console.log(err.message);
        }
    }

    componentDidMount () {
        this.connectAndSetup();
    }

    async allowWriting () {
        await sleep(1000);
        this.setState({freeToWrite : true});
    }

    async writeToDevice(message){
        try{
            if (this.state.freeToWrite || message == "0"){
                console.log(message);
                await this.state.device.write(message);
                this.setState({freeToWrite : false});
                this.allowWriting();
            }
        } catch (err){
            console.log(err.message);
        }
    }

    render(){
        return(
            <View>
                <View style = {{flexDirection:"row", justifyContent:"center"}}>
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
                </View>
                <Text> {this.state.value} </Text>
                <VerticalSlider
                    value={this.state.value}
                    disabled={!this.state.on}
                    min={0}
                    max={100}
                    onChange={(value) => {
                        this.valueChange(value);
                    }}
                    onComplete={(value) => {
                        this.valueChange(value);
                        this.writeToDevice(value);
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