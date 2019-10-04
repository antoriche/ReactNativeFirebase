import React from 'React';
import { StyleSheet, View, Image } from 'react-native';
import {InputItem, Stepper} from '@ant-design/react-native';
import { Item } from '../models/Item';
import ItemService from '../services/ItemService';

interface IProps{
    item: Item;
    onChange: () => void;
};

export default class ItemView extends React.PureComponent<IProps>{

    onChange = (qty)=>{
        this.props.item.quantity = qty;
        if(qty < 0)return;
        const item = {...this.props.item, quantity: qty};
        ItemService.AddOrEditItem(item);
        this.props.onChange();
    }

    render(){
        const {item} = this.props;
        return(
        <View>
            <Image style={styles.image} source={{uri : item.picture}} />
            <InputItem
                value={this.props.item.quantity+""}
                type="number"
                onChange={this.onChange}
                error={this.props.item.quantity<0}
                extra={
                    <Stepper
                        min={0}
                        value={this.props.item.quantity}
                        onChange={this.onChange}
                    />
                }>
                Quantity
            </InputItem>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    image:{
        flexDirection: "row",
        width: 100,
        height: 100
    }
  });