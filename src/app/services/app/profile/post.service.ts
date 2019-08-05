import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { Post, Attached, Image } from '../../../model/index';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: AngularFireList<Post> = null;

  constructor(
    private db: AngularFireDatabase
  ) {}

  /**
   * Get Posts DB
   */
  getPost(): AngularFireList<Post> {
    this.posts = this.db.list(`public/post`)
    return this.posts;
  }

  /**
   * Create Comment DB
   * @param comment 
   */
  createPost(post: Post): void {
    var postJson = JSON.parse(JSON.stringify(post));
    this.posts.push(postJson);
  }

  /**
   * Update post comment DB
   * @param key 
   * @param item 
   */
  updateItem(key: string, item: Post): void {
    this.posts.update(key, item).catch(error => console.log(error));
 }

  /**
   * Delete Comment DB
   * @param key 
   */
  deletePost(key: string): void {
    this.posts.remove(key);
  }

  /**
   * Delete Files DB
   * @param key 
   */
  deleteFilesTemp(images: Image[], attachments: Attached[]): void {
    images.forEach(element =>{
      firebase.storage().refFromURL(element.url).delete()
    });
    attachments.forEach(element =>{
      firebase.storage().refFromURL(element.url).delete()
    })
  }

  /**
   * delete unic file storage
   * @param url 
   */
  deleteFileTemp(url: string){
    firebase.storage().refFromURL(url).delete();
  }

  /**
   * Upload Files Storage
   * @param file 
   * @param id 
   * @param index 
   */
  uploadFilePost(file: File, id: number, index: number) {
    return new Promise<string>(async (resolve, reject) => {
      if (file != null) {
        const metaData = { 'contentType': file.type };
        const storageRef: firebase.storage.Reference = firebase.storage().ref(`/post/${id}/files/${index}-${file.name}`);
        await storageRef.put(file, metaData);
        firebase.storage().ref(`/post/${id}/files`).child(`/${index}-${file.name}`).getDownloadURL().then((url) => {
          resolve(url)
        })
      } else {
        reject(null)
      }
    })
  }
}
