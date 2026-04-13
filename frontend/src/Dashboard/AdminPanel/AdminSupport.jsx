import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import BASE_URL from "../../utils/config";
import { toast } from "react-toastify";
import { FiMessageSquare, FiSend, FiPaperclip, FiCheckCircle, FiLock, FiUnlock, FiAlertTriangle, FiUserX, FiUserCheck, FiSearch } from "react-icons/fi";

const AdminSupport = () => {
  const { token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  
  // Active Thread Data
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef(null);

  // Load left sidebar
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/support/admin/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
         setConversations(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    }
  };

  // Load right pane
  const selectConversation = async (convId) => {
    try {
      const res = await fetch(`${BASE_URL}/support/admin/conversation/${convId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
         setThread(data.data.conversation);
         setMessages(data.data.messages);
         setActiveThreadId(convId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load thread");
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000); // Poll list
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (activeThreadId) {
      selectConversation(activeThreadId);
    }
  }, [activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeThreadId) return;
    if (!messageText.trim() && !attachment) return;

    setSending(true);
    const formData = new FormData();
    formData.append("conversationId", activeThreadId);
    if (messageText) formData.append("messageText", messageText);
    if (attachment) formData.append("attachment", attachment);

    try {
      const res = await fetch(`${BASE_URL}/support/admin/reply`, {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}` },
         body: formData
      });
      const data = await res.json();

      if (data.success) {
         setMessageText("");
         setAttachment(null);
         selectConversation(activeThreadId); // refresh
         fetchConversations(); // refresh list snippet
      } else {
         toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to push reply");
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async (currentStatus) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      const res = await fetch(`${BASE_URL}/support/admin/status`, {
        method: "PATCH",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId: activeThreadId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
         toast.success(data.message);
         selectConversation(activeThreadId);
         fetchConversations();
      }
    } catch(err) {
      toast.error("Failed to change status");
    }
  };

  const toggleBlock = async () => {
    if (!thread?.userId) return;
    const currentStatus = thread.userId.status;
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    
    if (!window.confirm(`Are you sure you want to change user status to ${newStatus.toUpperCase()}?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/support/admin/block`, {
        method: "PATCH",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId: thread.userId._id, blockStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
         toast.success(data.message);
         selectConversation(activeThreadId); // Get fresh user block state natively
      } else {
         toast.error(data.message);
      }
    } catch(err) {
       toast.error("Failed to block user");
    }
  };

  const filteredConversations = conversations.filter(c => 
     c.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-[85vh] flex flex-col md:flex-row gap-6">
        
        {/* Left Pane - List */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-sm border border-border-light flex flex-col overflow-hidden h-full">
           <div className="p-4 border-b border-border-light bg-forest-50/50">
              <h2 className="text-body-lg font-bold text-text-primary flex items-center gap-2 mb-4">
                 <FiMessageSquare className="text-primary" /> Support Desk
              </h2>
              <div className="relative">
                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                 <input 
                   type="text" 
                   placeholder="Search users..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto">
             {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-sm italic">No conversations found.</div>
             ) : (
                <div className="flex flex-col">
                  {filteredConversations.map(conv => (
                    <button 
                      key={conv._id}
                      onClick={() => setActiveThreadId(conv._id)}
                      className={`text-left p-4 border-b border-border-light hover:bg-forest-50 transition-colors ${activeThreadId === conv._id ? 'bg-forest-50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-text-primary truncate">{conv.user?.username || "Unknown"}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${conv.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                             {conv.status}
                          </span>
                       </div>
                       <p className="text-xs text-text-secondary truncate">{conv.lastMessage}</p>
                       <div className="mt-2 text-[10px] text-text-muted flex justify-between">
                         <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                         {conv.user?.status === "blocked" && <span className="text-red-500 font-bold flex items-center gap-1"><FiAlertTriangle/> Blocked</span>}
                       </div>
                    </button>
                  ))}
                </div>
             )}
           </div>
        </div>

        {/* Right Pane - Chat View */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-2xl shadow-sm border border-border-light flex flex-col h-full overflow-hidden relative">
           
           {!activeThreadId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <FiMessageSquare className="w-16 h-16 mb-4 text-slate-300" />
                <p>Select a conversation from the sidebar to view details.</p>
              </div>
           ) : (
              <>
                 {/* Thread Header */}
                 <div className="px-6 py-4 border-b border-border-light flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                          {thread?.userId?.photo ? (
                             <img src={`http://localhost:3050${thread.userId.photo}`} alt="" className="w-full h-full object-cover"/>
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-text-muted font-bold text-lg">{thread?.userId?.username?.charAt(0).toUpperCase()}</div>
                          )}
                       </div>
                       <div>
                          <h3 className="font-bold text-text-primary leading-tight">{thread?.userId?.username}</h3>
                          <p className="text-xs text-text-secondary">{thread?.userId?.email}</p>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       <button 
                         onClick={toggleBlock}
                         className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${thread?.userId?.status === "blocked" ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                       >
                         {thread?.userId?.status === "blocked" ? <><FiUserCheck/> Unblock User</> : <><FiUserX/> Block User</>}
                       </button>
                       <button 
                         onClick={() => toggleStatus(thread.status)}
                         className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors text-white ${thread?.status === "open" ? 'bg-slate-800 hover:bg-slate-900' : 'bg-green-600 hover:bg-green-700'}`}
                       >
                         {thread?.status === "open" ? <><FiLock/> Close Ticket</> : <><FiUnlock/> Reopen Ticket</>}
                       </button>
                    </div>
                 </div>

                 {/* Blocked banner warning */}
                 {thread?.userId?.status === "blocked" && (
                    <div className="bg-red-600 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-2">
                      <FiAlertTriangle/> This user is BLOCKED from using support or booking trips.
                    </div>
                 )}

                 {/* Chat Messages */}
                 <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                   {messages.map((msg, index) => {
                     const isAdmin = msg.senderRole === "admin";
                     return (
                       <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"} animate-fade-in`}>
                         <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isAdmin ? "bg-forest-800 text-white rounded-br-none" : "bg-white border border-border-light text-text-primary rounded-bl-none"}`}>
                           
                           {!isAdmin && (
                              <div className="text-xs font-bold text-slate-400 mb-1">
                                 {msg.senderId?.username}
                              </div>
                           )}
                           
                           {msg.messageText && <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.messageText}</p>}
                           
                           {msg.fileUrl && (
                              <a href={`http://localhost:3050${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" 
                                 className={`mt-2 flex items-center gap-2 p-2 rounded-lg text-sm transition-colors border ${isAdmin ? 'bg-forest-900/50 border-forest-700 hover:bg-forest-900' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}>
                                <FiPaperclip /> View Attached File
                              </a>
                           )}
                           
                           <span className={`text-[10px] flex items-center gap-1 mt-2 inline-block ${isAdmin ? "text-forest-200" : "text-text-muted"}`}>
                             {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             {isAdmin && <FiCheckCircle className="inline ml-1" />}
                           </span>
                         </div>
                       </div>
                     );
                   })}
                   <div ref={messagesEndRef} />
                 </div>

                 {/* Input form */}
                 <div className="bg-white border-t border-border-light p-4 flex-shrink-0 relative">
                   {attachment && (
                      <div className="absolute -top-12 left-4 bg-white border border-border-light shadow-md px-4 py-2 rounded-lg text-sm flex items-center gap-3">
                        <span className="truncate max-w-[200px] text-primary">{attachment.name}</span>
                        <button onClick={() => setAttachment(null)} className="text-red-500 font-bold">&times;</button>
                      </div>
                   )}
                   
                   <form onSubmit={handleSend} className="flex gap-3">
                     <button type="button" className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-text-muted hover:bg-slate-100 rounded-full relative cursor-pointer">
                       <FiPaperclip className="w-5 h-5" />
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                     </button>
                     <input
                       type="text"
                       placeholder="Send an admin reply..."
                       className="flex-1 bg-slate-100 border-transparent rounded-full px-6 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                       value={messageText}
                       onChange={(e) => setMessageText(e.target.value)}
                     />
                     <button type="submit" disabled={sending || (!messageText.trim() && !attachment)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-forest-800 hover:bg-forest-900 rounded-full text-white shadow-md disabled:opacity-50">
                       <FiSend className="w-5 h-5 mr-0.5 mt-0.5" />
                     </button>
                   </form>
                 </div>
              </>
           )}

        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
