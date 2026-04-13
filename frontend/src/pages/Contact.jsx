import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMessageSquare, FiSend, FiPaperclip, FiInfo, FiLock, FiAlertCircle } from "react-icons/fi";
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Contact = () => {
  const { user, token } = useContext(AuthContext);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/support/conversation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
         setConversation(data.data.conversation);
         setMessages(data.data.messages);
         setIsBlocked(data.data.userStatus === "blocked");
      }
    } catch (error) {
       console.error("Error fetching support chat", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      fetchChat();
      // Optional polling interval to achieve 'real-time' feeling without web sockets
      const interval = setInterval(fetchChat, 10000); // 10 seconds
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
         toast.error("File excessively large. Limit is 10MB");
         return;
      }
      setAttachment(file);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachment) return;
    if (isBlocked) return toast.error("You are blocked from contacting support.");
    if (conversation?.status === "closed") return toast.info("This ticket is closed.");

    setSending(true);
    const formData = new FormData();
    if (messageText) formData.append("messageText", messageText);
    if (attachment) formData.append("attachment", attachment);

    try {
      const res = await fetch(`${BASE_URL}/support/message`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${token}`
         },
         body: formData
      });
      const data = await res.json();

      if (data.success) {
         setMessageText("");
         setAttachment(null);
         fetchChat(); // Refresh chat
      } else {
         if (data.blocked) setIsBlocked(true);
         toast.error(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error submitting message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center spinner"></div>;
  }

  // --- UNAUTHENTICATED VIEW ---
  if (!user) {
    return (
      <section className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-lg w-full p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-forest-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-display-sm text-text-primary mb-3">Customer Support</h2>
          <p className="text-body-md text-text-secondary mb-8">
            Please log in to your account to open a specialized support ticket and talk to our team.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/login" className="btn-primary w-full">Log In</Link>
            <Link to="/register" className="btn-secondary w-full">Create Account</Link>
          </div>
        </div>
      </section>
    );
  }

  // --- AUTHENTICATED CHAT VIEW ---
  return (
    <section className="bg-background min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-white rounded-2xl border border-border-light shadow-elevated overflow-hidden">
        
        {/* Header */}
        <div className="bg-forest-900 px-6 py-4 flex items-center justify-between shadow-md z-10 w-full flex-shrink-0">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-white font-bold p-1 overflow-hidden pointer-events-none">
                 <img src="/logo.png" alt="TravelNode" className="object-contain w-full h-full filter brightness-200" onError={(e) => { e.target.style.display='none' }} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-white">TravelNode Support</h2>
               <div className="flex items-center gap-2 text-forest-200 text-xs">
                 <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                 {conversation && <span className="ml-2 uppercase tracking-wide opacity-50 px-2 border-l border-forest-600">Ticket #{conversation._id.substring(18)}</span>}
               </div>
             </div>
           </div>
        </div>

        {/* Warning Banner */}
        {isBlocked && (
           <div className="bg-red-50 border-b border-red-200 p-3 text-sm text-red-800 flex items-center justify-center gap-2 font-semibold">
              <FiAlertCircle /> Your account has been blocked from creating new support requests.
           </div>
        )}
        {conversation?.status === "closed" && !isBlocked && (
           <div className="bg-amber-50 border-b border-amber-200 p-3 text-sm text-amber-800 flex items-center justify-center gap-2 font-semibold">
              <FiLock /> This ticket is currently closed by an administrator.
           </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          
          <div className="text-center my-4">
             <span className="bg-slate-200 text-slate-600 px-4 py-1 rounded-full text-xs font-semibold shadow-sm inline-block">
               An agent will join to assist you shortly.
             </span>
          </div>

          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-50">
               <FiMessageSquare className="w-16 h-16 mb-4 text-slate-300" />
               <p>Send a message to start a conversation with us.</p>
             </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.senderRole === "user";
            return (
              <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isUser ? "bg-primary text-white rounded-br-none" : "bg-white border border-border-light text-text-primary rounded-bl-none"}`}>
                  
                  {!isUser && (
                     <div className="text-xs font-bold text-accent mb-1 flex items-center gap-1">
                        TravelNode Admin
                     </div>
                  )}
                  
                  {msg.messageText && <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.messageText}</p>}
                  
                  {msg.fileUrl && (
                     <a href={`http://localhost:3050${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" 
                        className={`mt-2 flex items-center gap-2 p-2 rounded-lg text-sm transition-colors border ${isUser ? 'bg-forest-800/50 border-forest-600 hover:bg-forest-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}>
                       <FiPaperclip /> View Attachment
                     </a>
                  )}
                  
                  <span className={`text-[10px] flex items-center gap-1 mt-2 inline-block ${isUser ? "text-forest-100" : "text-text-muted"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-border-light p-4 flex-shrink-0 z-10 w-full relative">
          {attachment && (
             <div className="absolute -top-12 left-4 bg-white border border-border-light shadow-md px-4 py-2 rounded-lg text-sm flex items-center gap-3">
               <span className="truncate max-w-[200px] text-primary font-semibold">{attachment.name}</span>
               <button onClick={() => setAttachment(null)} className="text-red-500 font-bold hover:text-red-700">&times;</button>
             </div>
          )}
          
          <form onSubmit={sendMessage} className="flex gap-3">
            <button 
              type="button" 
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-text-muted hover:bg-slate-100 hover:text-primary rounded-full transition-colors relative cursor-pointer disabled:opacity-50"
              disabled={isBlocked || conversation?.status === "closed"}
            >
              <FiPaperclip className="w-5 h-5" />
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={isBlocked || conversation?.status === "closed"}
              />
            </button>
            <input
              type="text"
              placeholder={isBlocked ? "You are blocked." : conversation?.status === "closed" ? "Ticket closed." : "Type your message..."}
              className="flex-1 bg-slate-100 border-transparent rounded-full px-6 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner disabled:opacity-60"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isBlocked || conversation?.status === "closed"}
            />
            <button 
              type="submit" 
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-md transition-all ${(!messageText.trim() && !attachment) || sending || isBlocked || conversation?.status === "closed" ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-forest-600 hover:shadow-elevated hover:-translate-y-0.5'}`}
              disabled={(!messageText.trim() && !attachment) || sending || isBlocked || conversation?.status === "closed"}
            >
              <FiSend className={`w-5 h-5 ${messageText.trim() || attachment ? 'mr-0.5 mt-0.5' : ''}`} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;