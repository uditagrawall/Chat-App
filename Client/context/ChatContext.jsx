import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const {socket, axios} = useContext(AuthContext);

  // function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if(data.success){
        setUsers(data.users)
        setUnseenMessages(data.unseenMessages)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to get messages for selected users

  const getMessages  = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success){
         setMessages(data.messages)
    }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to send message to selected users

  const sendMessage = async (messageData) =>{
    try {
      const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if(data.success){
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Function to subscribe to messages for selected users

    const subscribeToMessages = async()=> {
      if(!socket) return;

      socket.on("newMessage", (newMessage)=> {
        if(selectedUser && newMessage.senderId === selectedUser._id){
          newMessage.seen = true;
          setMessages((prevMessages)=> [...prevMessages, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else{
          setUnseenMessages((prevUnseenMessages)=> ({
            ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
          }))
        }
      })
    }

    // function to unsubscribe from messages

    const unsubscribeFromMessages = async () => {
      if(socket) socket.off("newMessage");

    }

    useEffect(()=> {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    },[socket, selectedUser])

  const value = {
      // messages, users, selectedUser, getUsers, setMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
  messages,
  users,
  selectedUser,
  getUsers,
  getMessages, // <-- Add this
  sendMessage,
  setSelectedUser,
  unseenMessages,
  setUnseenMessages
  }

  return (
    <ChatContext.Provider value={value}>
      { children }
    </ChatContext.Provider>
  )
}

// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unseenMessages, setUnseenMessages] = useState({}); // ✅ fix

//   const { socket, axios } = useContext(AuthContext);

//   // Get all users
//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/messages/users");
//       if (data.success) {
//         setUsers(data.users);
//         setUnseenMessages(data.unseenMessages);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get messages from selected user
//   const getMessages = async (userId) => {
//     try {
//       const { data } = await axios.get(`/api/messages/${userId}`);
//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Send message to selected user
//   const sendMessage = async (messageData) => {
//     try {
//       const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
//       if (data.success) {
//         setMessages((prevMessages) => [...prevMessages, data.newMessage]);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Subscribe to incoming messages
//   const subscribeToMessages = () => {
//     if (!socket) return;

//     socket.off("newMessage"); // ✅ prevent duplicates

//     socket.on("newMessage", (newMessage) => {
//       if (selectedUser && newMessage.senderId === selectedUser._id) {
//         newMessage.seen = true;
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//         axios.put(`/api/messages/mark/${newMessage._id}`);
//       } else {
//         setUnseenMessages((prev) => ({
//           ...prev,
//           [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
//         }));
//       }
//     });
//   };

//   useEffect(() => {
//     subscribeToMessages();
//     return () => socket?.off("newMessage"); // ✅ clean up
//   }, [socket, selectedUser]);

//   const value = {
//     messages,
//     users,
//     selectedUser,
//     setSelectedUser,
//     getUsers,
//     getMessages,
//     sendMessage,
//     setMessages,
//     unseenMessages,
//     setUnseenMessages
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };
