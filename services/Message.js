// const { v4: uuidv4 } = require('uuid');
// const { db } = require('../firebaseConfig');
// const { timestamp } = require('../firebaseConfig');

const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin')
const serviceAccount = require('../test-f5f15-firebase-adminsdk-3i3mu-70398b4bee.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

class ChatService {
    constructor() {
        this.timestamp = admin.firestore.FieldValue.serverTimestamp();
    }
    async sendMessage(senderId, roomId, message) {
        try {
            const data = {
                id: uuidv4(), senderId, roomId, message,
                // images, videos, 
                // reactions, readBy: [], 
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
                deletedAt: ''
            };
            console.log(data);
            return await this.addToFirestore('messages', data);
        } catch (error) {
            console.log('Error sending message:', error);
            throw error;
        }
    }


    async addToFirestore(collectionName, data) {
        const collectionRef = (await firestore.collection(collectionName).add(data)).get();
        return { id: (await collectionRef).id, ...(await collectionRef).data() };
    }

}
module.exports = ChatService;