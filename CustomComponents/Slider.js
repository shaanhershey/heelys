import React, {Component} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import { BluetoothSerial } from 'react-native-bluetooth-serial';
//import { BleManager } from 'react-native-ble-plx';
import VerticalSlider from 'rn-vertical-slider';

export default class Slider extends Component{
    constructor(props){
        super(props);
        this.state = {
            value : 0,
            on : true,
            isEnabled: false,
            discovering: false,
            devices: [],
            unpairedDevices: [],
            connected: false,
            section: 0
        }
        //this.manager = new BleManager();
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

    componentDidMount () {
        Promise.all([
          BluetoothSerial.isEnabled(),
          BluetoothSerial.list()
        ])
        .then((values) => {
          const [ isEnabled, devices ] = values
          this.setState({ isEnabled, devices })
        })
    
        BluetoothSerial.on('bluetoothEnabled', () => Toast.showShortBottom('Bluetooth enabled'))
        BluetoothSerial.on('bluetoothDisabled', () => Toast.showShortBottom('Bluetooth disabled'))
        BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
        BluetoothSerial.on('connectionLost', () => {
          if (this.state.device) {
            Toast.showShortBottom(`Connection to device ${this.state.device.name} has been lost`)
          }
          this.setState({ connected: false })
        })
        console.log(BluetoothSerial.list());
      }


    

    // componentDidMount() {
    //     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    //     .then((result) => (console.log(result)))
    //     .catch((error) => console.log(error));
    // }

    // scanAndConnect() {
    //     const deviceIds = new Set();
    //     this.manager.startDeviceScan(null, null, (error, device) => {
    //         if (error) {
    //             // Handle error (scanning will be stopped automatically)
    //             console.log(error);
    //             return
    //         }
    
    //         // Check if it is a device you are looking for based on advertisement data
    //         // or other criteria.
    //         deviceIds.add(device.id);
    //         console.log(deviceIds);
    //         // if (device.id === '76:18:E5:DB:C7:43'){
    //         //     this.manager.stopDeviceScan();
    //         //     device.connect()
    //         //     .then((device) => {
    //         //         return device.discoverAllServicesAndCharacteristics()
    //         //     })
    //         //     .then((device) =>{
    //         //         console.log(device);
    //         //     })
    //         //     .catch((error) => {
    //         //         console.log(error);
    //         //     });
    //         // }
    //     });
    // }

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
                    }}
                    onComplete={(value) => {
                        this.valueChange(value);
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

    connect = (device) => {
        BluetoothSerial.connect(device.id)
        .then((res) => {
            Toast.showShortBottom(`Connected to device ${device.name}`)
            this.setState({ device, connected: true, connecting: false })
        })
        .catch((err) => Toast.showShortBottom(err.message))
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