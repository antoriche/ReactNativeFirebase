import { firestore, storage } from './firebase';
import { Item } from '../models/Item';

const uriToBlob = (uri) : Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      
      xhr.send(null);
    });
  }

export default {
    getItems: ():Promise<Item[] > => {
        return firestore.collection("items").get()
            .then(snapshot => (
                snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Item[]
            ))
    },
    getItemByID: (id:string):Promise<Item> => {
        return firestore.collection("items").doc(id).get()
            .then(doc => (
                {id: doc.id, ...doc.data()} as Item
            ))
    },
    AddOrEditItem: async (item:Item):Promise<void>=> {
        const data = {...item};
        delete data.id;
        if(data.picture){
            const ref = storage.ref().child(`images/items/${item.id}.jpg`);
            const task = ref.put(await uriToBlob(data.picture));
            data.picture = await task.snapshot.ref.getDownloadURL();
        }
        return firestore.collection("items").doc(item.id).set(data);
    }
}