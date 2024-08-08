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
                id: uuidv4(),
                senderId: senderId.toString(),
                roomId: roomId.toString(),

                message,
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

    async getAllChatsBySenderId(roomIds) {
        try {
            let chatList = [];
            console.log("roomIds", roomIds);
            const messagesRef = await firestore.collection('messages')
                .where('roomId', 'in', roomIds)
                .orderBy('updatedAt', 'desc')
                .limit(10)
                .get();
            console.log("message ref log :", messagesRef)

            if (!messagesRef.empty) {
                console.log("message ref : ", messagesRef)
                chatList = messagesRef.docs.map((ele) => ({ documentId: ele.id, ...ele.data() }));

            }

            return chatList;
        } catch (error) {
            console.log('Error sending message:', error);
            throw error;
        }
    }

    async getChatByRoomId(roomId, page = 1, limit = 10) {
        try {
            const messagesRef = await firestore.collection('messages')
                .where('roomId', '==', roomId)
                .where('deleted', '==', false)
                .orderBy('updatedAt', 'asc')
                .limit(limit)
                .startAfter(page * limit)
                .get();

            let chats = [];

            if (!messagesRef.empty) {
                chats = messagesRef.docs.map(ele => ({
                    documentId: ele.id,
                    ...ele.data()
                }));
            }

            return chats;
        } catch (error) {
            console.log('Error sending message:', error);
            throw error;
        }
    }


}
module.exports = ChatService;