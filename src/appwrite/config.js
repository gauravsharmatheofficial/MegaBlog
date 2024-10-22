import conf from "../conf/conf";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Your API Endpoint
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
        title,
        content,
        featuredImage,
        status,
        userId,
      });
    } catch (error) {
      console.log("Appwrite Service :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
        title,
        content,
        featuredImage,
        status,
      });
    } catch (error) {
      console.log("Appwrite Service :: updatePost :: error", error);
    }
  }

  async updatePost(slug) {
    try {
      await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug);
      return true;
    } catch (error) {
      console.log("Appwrite Service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug);
      return true;
    } catch (error) {
      console.log("Appwrite Service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, queries);
      return true;
    } catch (error) {
      console.log("Appwrite Service :: getPosts :: error", error);
      return false;
    }
  }

  //file upload method

  async uploadFile(file) {
    try {
      return await this.Storage.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.log("Appwrite Service :: uploadFile :: error", error);
      return false;
    }
  }

  async dellteFile(fileId) {
    try {
      await this.Storage.dellteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite Service :: uploadFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
