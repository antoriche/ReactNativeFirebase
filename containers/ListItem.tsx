import React from 'react';
import { Accordion, Flex, Button, SearchBar, Icon, Provider } from '@ant-design/react-native';
import { StyleSheet, View, Keyboard, ScrollView } from 'react-native';
import ItemService from '../services/ItemService';
import { Item } from '../models/Item';
import NewItemForm from './NewItemForm';
import ItemView from '../components/ItemView';

interface IState {
  list: Item[],
  active: number[],
  filter: string,
  searchFocus: boolean
}

interface IProps {}

export default class ListItem extends React.Component<IProps> {

  state: IState = {
    list: [],
    active: [],
    filter: null,
    searchFocus: false
  }

  searchField = null;
  newItemForm = null;

  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.filter = this.filter.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount(){
    this.refresh();
  }

  refresh(){
    ItemService.getItems().then((list: Item[]) => this.setState({list}))
  }

  onChange(active){
    this.setState({active});
  }

  filter(item:Item){
    if(!this.state.filter)return true;
    return item.name.toLowerCase().includes(this.state.filter.toLowerCase().trim());
  }

  render(){
    return (
            <Provider>
                <View style={styles.topBar}>
                    <Flex>
                        <Flex.Item flex={4}>
                            <SearchBar
                                style={styles.queryField}
                                value={this.state.filter}
                                placeholder=""
                                cancelText="Annuler"
                                ref={x=>this.searchField=x}
                                onSubmit={x=>this.setState({filter: x})}
                                onCancel={_=>{this.setState({filter: null}); Keyboard.dismiss();}}
                                onChange={x=>this.setState({filter: x})}
                                onBlur={_=>{this.setState({searchFocus: false});}}
                                onFocus={_=>this.setState({searchFocus: true})}
                            />
                        </Flex.Item>
                        {!this.state.searchFocus ? <Flex.Item style={{}} flex={1}>
                            <Button style={styles.addButton} type="primary" onPress={_=>this.newItemForm.openForm(this.state.filter)} ><Icon name="plus" color="white" /></Button>
                        </Flex.Item> : null}
                    </Flex>
                    <NewItemForm ref={ref => this.newItemForm = ref} onAdd={_=>this.refresh()} />
                </View>
                <ScrollView>
                    <Accordion onChange={this.onChange} activeSections={this.state.active} >
                        {this.state.list.filter(this.filter).map((item, i) => (<Accordion.Panel key={i} header={item.name}><ItemView onChange={this.refresh} item={item} /></Accordion.Panel>))}
                    </Accordion>
                </ScrollView>
            </Provider>
    );
  }
}

const styles = StyleSheet.create({
  topBar:{
    padding: 10,
  },
  addButton:{
    
  },
  queryField:{

  }
});
