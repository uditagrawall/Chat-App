// import React, { useContext, useEffect, useRef, useState} from 'react'
// import assets from '../assets/assets'
// import { formatMessageTime } from '../lib/utils'
// import { ChatContext } from '../../context/ChatContext'
// import { AuthContext } from '../../context/AuthContext'

// const ChatContainer = () => {

//   const { messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
//   const { authUser, onlineUsers} = useContext(AuthContext)

//   const scrollEnd = useRef()

//   const [input, setInput] = useState('');

//   // Handle sending a message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if(input.trim() === "")return null;
//     await sendMessage({text: input.trim()});
//     setInput("")
//   }
//   // Handle sending an image 
//   const handleSendImage = async (e) => {
//     const file = e.target.files[0];
//     if(!file || !file.type.startsWith("/image")){
//       toast.error("select an image file")
//       return;
//     }
//     const reader = new FileReader();

//     reader.onloadend = async ()=> {
//       await sendMessage({image: reader.result})
//       e.target.value = ""
//     }
//     reader.readAsDataURL(file)
//   }

//   useEffect (()=> {
//       if(selectedUser){
//         getMessages(selectedUser._id)
//       }
//   },[selectedUser])

//   useEffect(() => {
//     if(scrollEnd.current && messages){
//       scrollEnd.current.scrollIntoView({ behavior: "smooth"})
//     }
//   },[messages])
//   return  selectedUser ? (
//     <div className='h-full overflow-scroll relative backdrop-blur-lg'>

//       {/* ------- header ----------*/}

//       <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
//         <img src={selectedUser.profilePic || assets.arrow_icon} alt="" className='w-8 rounded-full'/>
//         <p className='flex-1 text-lg text-white flex items-center gap-2'>
//           {selectedUser.fullName}
//           {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
//         </p>
//         <img  onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
//         <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
//       </div>

//       {/* --------- chat area ---------*/} 

//       <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
//             {msg.image ? (
//               <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
//             ):(
//               <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
//             )}
//             <div className='text-center text-xs'>
//               <img src={msg.senderId === authUser._id ?  authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
//               <p className='text-gray-500'>{ formatMessageTime(msg.createdAt) }</p>

//             </div>
//           </div>
//         ))}
//         <div ref={scrollEnd}></div>
//       </div>

//       {/* -------- bottom area ---------*/}

//        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 '>
//         <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
//           <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Send a message" 
//           className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
//           <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
//           <label htmlFor="image">
//             <img src={assets.gallery_icon}  alt=""  className='w-5 mr-2 cursor-pointer'/>
//           </label>
//         </div>
//         <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>

//        </div>

//     </div>
//   ) : (
//     <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
//       <img src={assets.logo_icon} className='max-w-16' alt="" />
//       <p className='text-lg font-medium text-white'> Chat anytime, anywhere</p>
//     </div>
//   )
// }

// export default ChatContainer


// import React, { useContext, useEffect, useRef, useState } from 'react'
// import assets from '../assets/assets'
// import { formatMessageTime } from '../lib/utils'
// import { ChatContext } from '../../context/ChatContext'
// import { AuthContext } from '../../context/AuthContext'

// const ChatContainer = () => {
//   const { messages = [], selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
//   const { authUser, onlineUsers = [] } = useContext(AuthContext)

//   const scrollEnd = useRef()
//   const [input, setInput] = useState('')

//   // Fetch messages when selectedUser changes
//   useEffect(() => { 
//   if (selectedUser?._id) {
//     getMessages(selectedUser._id)
//   }
// }, [selectedUser])

//   // Auto-scroll on new messages
//   useEffect(() => {
//     if (scrollEnd.current) {
//       scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }, [messages])

//   // Send text message handler
//   const handleSendMessage = async (e) => {
//     e.preventDefault()
//     if (!input.trim()) return
//     await sendMessage({ text: input.trim() })
//     setInput('')
//   }

//   // Send image message handler
//   const handleSendImage = async (e) => {
//     const file = e.target.files[0]
//     if (!file || !file.type.startsWith('image')) {
//       alert('Please select a valid image file') // you can replace with toast if needed
//       return
//     }
//     const reader = new FileReader()
//     reader.onloadend = async () => {
//       await sendMessage({ image: reader.result })
//       e.target.value = ''
//     }
//     reader.readAsDataURL(file)
//   }

//   if (!selectedUser) {
//     return (
//       <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
//         <img src={assets.logo_icon} className='max-w-16' alt="Logo" />
//         <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
//       </div>
//     )
//   }

//   return (
//     <div className='h-full overflow-scroll relative backdrop-blur-lg'>
//       {/* Header */}
//       <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
//         <img
//           src={selectedUser.profilePic || assets.avatar_icon}
//           alt={`${selectedUser.fullName} profile`}
//           className='w-8 rounded-full'
//         />
//         <p className='flex-1 text-lg text-white flex items-center gap-2'>
//           {selectedUser.fullName}
//           {onlineUsers.includes(selectedUser._id) && (
//             <span className='w-2 h-2 rounded-full bg-green-500'></span>
//           )}
//         </p>
//         <img
//           onClick={() => setSelectedUser(null)}
//           src={assets.arrow_icon}
//           alt="Back"
//           className='md:hidden max-w-7 cursor-pointer'
//         />
//         <img src={assets.help_icon} alt="Help" className='max-md:hidden max-w-5' />
//       </div>

//       {/* Messages */}
//       <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
//         {messages
//           .filter(Boolean)
//           .map((msg, index) => {
//             const isSender = msg.senderId === authUser?._id
//             return (
//               <div
//                key={msg._id || index}
//                 className={`flex items-end gap-2 justify-end ${!isSender ? 'flex-row-reverse' : ''}`}
//               >
//                 {msg.image ? (
//                   <img
//                     src={msg.image}
//                     alt="Sent media"
//                     className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'
//                   />
//                 ) : (
//                   <p
//                     className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
//                       isSender ? 'rounded-br-none' : 'rounded-bl-none'
//                     }`}
//                   >
//                     {msg.text}
//                   </p>
//                 )}
//                 <div className='text-center text-xs'>
//                   <img
//                     src={
//                       isSender
//                         ? authUser?.profilePic || assets.avatar_icon
//                         : selectedUser?.profilePic || assets.avatar_icon
//                     }
//                     alt="Profile"
//                     className='w-7 rounded-full'
//                   />
//                   <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
//                 </div>
//               </div>
//             )
//           })}
//         <div ref={scrollEnd}></div>
//       </div>

//       {/* Input Area */}
//       <form
//         onSubmit={handleSendMessage}
//         className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'
//       >
//         <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
//           <input
//             type='text'
//             placeholder='Send a message'
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
//             autoComplete='off'
//           />
//           <input
//             type='file'
//             id='image'
//             accept='image/png, image/jpeg'
//             onChange={handleSendImage}
//             hidden
//           />
//           <label htmlFor='image'>
//             <img src={assets.gallery_icon} alt="Add media" className='w-5 mr-2 cursor-pointer' />
//           </label>
//         </div>
//         <button type='submit'>
//           <img src={assets.send_button} alt="Send" className='w-7 cursor-pointer' />
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ChatContainer
 

import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const ChatContainer = () => {
  const { messages = [], selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers = [] } = useContext(AuthContext)

  const scrollEnd = useRef(null)
  const [input, setInput] = useState('')

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Handle sending a text message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  // Handle sending an image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image')) {
      alert('Please select a valid image file')
      e.target.value = '' // Reset file input
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = '' // Reset file input after sending
    }
    reader.readAsDataURL(file)
  }

  // If no user is selected, show welcome screen
  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt="Logo" />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
      </div>
    )
  }

  return (
    <div className='h-full overflow-hidden relative backdrop-blur-lg flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt={`${selectedUser.fullName} profile`}
          className='w-8 h-8 rounded-full object-cover'
        />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500' />
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className='md:hidden w-7 cursor-pointer'
        />
        <img src={assets.help_icon} alt="Help" className='hidden md:block w-5' />
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-3 pb-6'>
        {messages.filter(Boolean).map((msg, index) => {
          const isSender = msg.senderId === authUser?._id
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 justify-end ${!isSender ? 'flex-row-reverse' : ''}`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Sent media"
                  className='max-w-[230px] border border-gray-700 rounded-lg mb-8 object-cover'
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-words bg-violet-500/30 text-white ${
                    isSender ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className='text-center text-xs flex flex-col items-center'>
                <img
                  src={
                    isSender
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt="Profile"
                  className='w-7 h-7 rounded-full object-cover'
                />
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          )
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className='flex items-center gap-3 p-3 bg-gray-900 bg-opacity-50 backdrop-blur-sm'
      >
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            type='text'
            placeholder='Send a message'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            autoComplete='off'
          />
          <input
            type='file'
            id='image'
            accept='image/png, image/jpeg'
            onChange={handleSendImage}
            hidden
          />
          <label htmlFor='image'>
            <img src={assets.gallery_icon} alt="Add media" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <button type='submit' className='focus:outline-none'>
          <img src={assets.send_button} alt="Send" className='w-7 cursor-pointer' />
        </button>
      </form>
    </div>
  )
}

export default ChatContainer
