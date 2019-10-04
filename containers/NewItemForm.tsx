import React from 'react';
import { Modal, Button, Icon, InputItem, Stepper, List, Flex } from '@ant-design/react-native';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageURISource, ScrollView  } from 'react-native';
import ItemService from '../services/ItemService';
import {Camera} from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {Item} from '../models/Item';


interface IState {
    open: boolean,
    item:{
        id?: string,
        name: string,
        quantity: number,
        picture?:string
    }
}

interface IProps {
    onAdd: (item:Item) => void
}

export default class NewItemForm extends React.Component<IProps> {

  state: IState;
  camera = null;

  constructor(props){
    super(props);

    this.openForm = this.openForm.bind(this);
    this.onClose = this.onClose.bind(this);
    this.emptyItem = this.emptyItem.bind(this);
    this.validateItem = this.validateItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.takePicture = this.takePicture.bind(this);

    this.state = {
        open: false,
        item: this.emptyItem()
    }
  }

  takePicture(): Promise<ImageURISource>{
    return this.camera ? this.camera.takePictureAsync({ skipProcessing: true }).then(x=>x.uri) : Promise.reject("No camera");
  }
  emptyItem = () =>({
    name: '',
    quantity: 1
  })
  validateItem() : boolean{
    return this.state.item.id != null && this.state.item.quantity>=0;
  }
  async addItem(){
    await ItemService.AddOrEditItem(this.state.item as Item);
    this.props.onAdd(this.state.item as Item);
    this.setState({ open: false, item: this.emptyItem() });
  }
  editItem = field => value => new  Promise(resolve => this.setState({ item : {...this.state.item, [field] : value } }, resolve));

  async openForm(name:string){
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    this.setState({open: true, item : {...this.state.item, name}});
  }
  onClose(save){
    this.setState({open: false});
  }

  render(){
    return (
        <Modal visible={this.state.open} transparent closable animationType="slide-up" onClose={()=>this.onClose(false)} >
          <ScrollView style={{ paddingVertical: 20 }}>
              <View style={{alignItems: 'center'}}>
                <Camera
                    style={{...styles.imageSize, marginVertical: 5}}
                    ref={ref => this.camera = ref} 
                    onBarCodeScanned={({ data }) => {
                        if(!this.state.item.id)
                            this.editItem('id')(data);
                    }}
                >
                    <TouchableOpacity style={{...styles.imageSize}} onPress={async ()=>(!this.state.item.id)||this.editItem("picture")(this.state.item.picture ? null : await this.takePicture())}>
                        {this.state.item.picture ? 
                            <Image
                                source={{uri : this.state.item.picture}}
                                style={styles.imageSize}
                            />
                        :
                        null 
                        }
                    </TouchableOpacity>
                </Camera>
                <View style={{alignItems: 'flex-start', flexDirection:'row'}}>
                    <Text>ID : {this.state.item.id||'Waiting for barcode'}</Text>
                    <Button style={styles.removeID} size="small" disabled={!this.state.item.id} type="ghost" onPress={async ()=>{await this.editItem('id')(null); await this.editItem("picture")(null);}} ><Icon name="close" /></Button>
                </View>
                    <InputItem
                        value={this.state.item.name}
                        onChange={this.editItem("name")}
                    >
                        Name
                    </InputItem>
                    <InputItem
                        value={this.state.item.quantity+""}
                        type="number"
                        onChange={this.editItem("quantity")}
                        error={this.state.item.quantity<0}
                        extra={
                            <Stepper
                                min={0}
                                value={this.state.item.quantity}
                                onChange={this.editItem("quantity")}
                            />
                        }>
                        Quantity
                    </InputItem>
                    
            </View>
          </ScrollView>
          <Button disabled={!this.validateItem()} type="primary" onPress={this.addItem} >
            Save Item
          </Button>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    imageSize:{
        width: 150,
        height: 150
    },
    removeID:{
        width: 35,
        marginLeft: 5
    }
});
