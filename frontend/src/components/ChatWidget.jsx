import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useLang } from '../LangContext';

const BOT_FLOWS = {
  en: [
    { id: 'greeting', bot: `Hi! 👋 I'm **Shine**, your detailing assistant. *We wash and wax while you relax!*

How can I help you today?`, options: ['See packages & pricing', 'Chat on WhatsApp 🟢', 'Call us now 📞', 'What products do you use?'] },
    { id: 'whatsapp', trigger: ['Chat on WhatsApp 🟢', 'Book now via WhatsApp'], bot: "Redirecting you to our WhatsApp...", action: 'url:https://wa.me/17143344582' },
    { id: 'call', trigger: 'Call us now 📞', bot: "You can reach us at **(714) 334-4582**. We are available Mon-Sat, 7am-5pm!", options: ['Back to menu'] },
    { id: 'packages', trigger: 'See packages & pricing', bot: `Great choice! We have 4 professional packages:

✨ **Super Wash** – from $50
🌟 **Wash & Wax** – from $85 *(most popular)*
💎 **Mini Detail** – from $150
🏆 **Complete Detail** – from $275

All services at your home or office. Want to book one?`, options: ['Book now via WhatsApp', 'Tell me more about Complete Detail', 'Back to menu'] },
    { id: 'complete', trigger: 'Tell me more about Complete Detail', bot: `The **Complete Detail** is our premium service:

• Full interior steam cleaning
• Exterior clay bar treatment
• Meguiar's finishing wax
• Leather/vinyl UV protection
• Full sanitization

Starts at $275 (Sedan) · $300 (Mid-Size) · $325 (SUV)

🕒 About 2 hours. Worth every penny! 🏆`, options: ['Book now via WhatsApp', 'See other packages', 'Back to menu'] },
    { id: 'products', trigger: 'What products do you use?', bot: `We only use **Meguiar's Premium Products** and biodegradable, eco-friendly supplies safe for your car AND the environment! 🌿

We also use professional steam cleaning for interiors.`, options: ['Sounds great! Book via WhatsApp', 'Back to menu'] },
    { id: 'book', trigger: ['Book an appointment', 'Sounds great! Book via WhatsApp', 'Agendar una cita'], bot: "Awesome! The best way to book is via WhatsApp or by calling us. Which do you prefer?", options: ['Chat on WhatsApp 🟢', 'Call us now 📞'] },
    { id: 'menu', trigger: 'Back to menu', bot: "Of course! What would you like to know?", options: ['See packages & pricing', 'Chat on WhatsApp 🟢', 'Call us now 📞', 'What products do you use?'] },
  ],
  es: [
    { id: 'greeting', bot: `¡Hola! 👋 Soy **Shine**, tu asistente de detallado. *¡Nosotros lavamos y enceramos mientras tú te relajas!*

¿En qué te puedo ayudar hoy?`, options: ['Ver paquetes y precios', 'Chatear por WhatsApp 🟢', 'Llamarnos ahora 📞', '¿Qué productos usan?'] },
    { id: 'whatsapp', trigger: ['Chatear por WhatsApp 🟢', 'Reservar por WhatsApp'], bot: "Redirigiéndote a nuestro WhatsApp...", action: 'url:https://wa.me/17143344582' },
    { id: 'call', trigger: 'Llamarnos ahora 📞', bot: "Puedes llamarnos al **(714) 334-4582**. ¡Estamos disponibles de Lun-Sáb, de 7am a 5pm!", options: ['Volver al menú'] },
    { id: 'packages', trigger: 'Ver paquetes y precios', bot: `¡Excelente! Tenemos 4 paquetes profesionales:

✨ **Super Wash** – desde $50
🌟 **Wash & Wax** – desde $85 *(el más popular)*
💎 **Mini Detail** – desde $150
🏆 **Complete Detail** – desde $275

¿Quieres agendar uno?`, options: ['Reservar por WhatsApp', 'Más info del Complete Detail', 'Volver al menú'] },
    { id: 'complete', trigger: 'Más info del Complete Detail', bot: `El **Complete Detail** es nuestro servicio premium:

• Limpieza interior completa a vapor
• Tratamiento Clay Bar exterior
• Cera Meguiar's de acabado
• Protección UV cuero/vinilo
• Sanitización completa

Desde $275 (Sedan) · $300 (Mediano) · $325 (SUV)

🕒 Aprox. 2 horas. ¡Vale cada centavo! 🏆`, options: ['Reservar por WhatsApp', 'Ver otros paquetes', 'Volver al menú'] },
    { id: 'products', trigger: '¿Qué productos usan?', bot: `Usamos exclusivamente **Productos Premium Meguiar's** y suministros biodegradables seguros para tu carro y el medio ambiente 🌿

También usamos limpieza a vapor para interiores.`, options: ['¡Suena bien! Reservar por WhatsApp', 'Volver al menú'] },
    { id: 'book', trigger: ['Agendar una cita', '¡Sí, agendar ahora!', '¡Suena bien! Reservar por WhatsApp'], bot: "¡Perfecto! La mejor manera de agendar es por WhatsApp o llamándonos directamente. ¿Qué prefieres?", options: ['Chatear por WhatsApp 🟢', 'Llamarnos ahora 📞'] },
    { id: 'menu', trigger: 'Volver al menú', bot: "¡Claro! ¿Qué deseas saber?", options: ['Ver paquetes y precios', 'Chatear por WhatsApp 🟢', 'Llamarnos ahora 📞', '¿Qué productos usan?'] },
  ]
};

function formatMsg(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

export default function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [startedLang, setStartedLang] = useState(null);

  const flows = BOT_FLOWS[lang];

  const startChat = () => {
    if (startedLang !== lang) {
      const greeting = flows.find(f => f.id === 'greeting');
      setMessages([{ from: 'bot', text: greeting.bot, options: greeting.options }]);
      setStartedLang(lang);
    }
  };

  const handleOption = (option) => {
    setMessages(prev => [...prev, { from: 'user', text: option }]);
    setTimeout(() => {
      const flow = flows.find(f =>
        Array.isArray(f.trigger) ? f.trigger.includes(option) : f.trigger === option
      );
      if (flow) {
        if (flow.action?.startsWith('navigate:')) {
          setMessages(prev => [...prev, { from: 'bot', text: flow.bot, options: [] }]);
          // Redirection to /book removed at user request for cleanup
        } else {
          setMessages(prev => [...prev, { from: 'bot', text: flow.bot, options: flow.options }]);
        }
      }
    }, 600);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const msg = inputVal.trim();
    setInputVal('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: lang === 'en'
          ? "I'd be happy to help! For quick answers, use the options below or call us at **714 334-4582** 📞"
          : "¡Con gusto te ayudo! Para respuestas rápidas usa las opciones de abajo o llámanos al **714 334-4582** 📞",
        options: lang === 'en'
          ? ['See packages & pricing', 'Book an appointment']
          : ['Ver paquetes y precios', 'Agendar una cita']
      }]);
    }, 700);
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => { const opening = !open; setOpen(opening); if (opening) startChat(); }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9000,
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), #E6BC00)',
          border: 'none', cursor: 'pointer', color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(255, 212, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: open ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
        }}
      >
        {open ? <X size={28} /> : (
          <img
            src="/logo.png"
            alt="Shine Pro"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '6rem', right: '1.5rem', zIndex: 9000,
          width: 380, maxHeight: 600,
          background: 'var(--surface)', borderRadius: 24,
          border: '1px solid rgba(255, 212, 0, 0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'fadeUp 0.4s ease forwards',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1D25, #0A0D14)',
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            borderBottom: '1px solid rgba(255, 212, 0, 0.1)',
          }}>
            <img
              src="/logo.png"
              alt="Shine Pro"
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'es' ? 'Asistente Shine' : 'Shine Assistant'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                {lang === 'es' ? 'En línea ahora' : 'Online now'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            maxHeight: 380,
          }}>
            {messages.map((msg, i) => (
              <div key={i} className="animate-fade-up">
                {/* Bubble */}
                <div style={{
                  display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '85%',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, var(--primary), #E6BC00)'
                      : 'rgba(255,255,255,0.05)',
                    color: msg.from === 'user' ? '#000' : '#fff',
                    borderRadius: msg.from === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    padding: '0.75rem 1.1rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    fontWeight: msg.from === 'user' ? 700 : 400,
                    boxShadow: msg.from === 'user' ? '0 4px 12px rgba(255,212,0,0.2)' : 'none',
                    border: msg.from === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  }} dangerouslySetInnerHTML={{ __html: formatMsg(msg.text) }} />
                </div>
                {/* Options */}
                {msg.from === 'bot' && msg.options?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {msg.options.map((opt, j) => (
                      <button key={j} onClick={() => {
                        if (opt.includes('WhatsApp')) {
                          window.open('https://wa.me/17143344582', '_blank');
                        } else {
                          handleOption(opt);
                        }
                      }}
                        style={{
                          background: 'transparent', 
                          border: '1px solid rgba(255, 212, 0, 0.3)',
                          color: 'var(--primary)', borderRadius: '50px', padding: '0.45rem 1rem',
                          fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(255, 212, 0, 0.1)'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                      >{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 50, padding: '0.75rem 1.25rem', color: '#fff',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            />
            <button onClick={handleSend}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #E6BC00)',
                border: 'none', cursor: 'pointer', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255,212,0,0.3)',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}


