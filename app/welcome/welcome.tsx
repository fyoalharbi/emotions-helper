import React, { useState, useEffect } from 'react';
import LetterGlitch from './LetterGlitch';
import NeonButton from './NeonButton';



const emotionData = {
  الخوف: {
    level2: {
      فزع: ["عاجز", "خائف"],
      قلق: ["مرتبك", "مضطرب البال"], 
      "غير آمن": ["غير كافي", "دوني"],
      ضعف: ["غير كافي", "عديم الأهمية"],
      رفض: ["مستبعد", "مضطهد", "انكماش"],
      تهديد: ["متوتر", "مكشوف"]
    }
  },
  الغضب: {
    level2: {
      خذلان: ["خيانة", "مستاء"],
      إذلال: ["اضطهاد", "سخرية"],
      حقد: ["ناقم", "انتهك"],
      غاضب: ["محتد", "غيور"],
      عدوانية: ["استفزاز", "شراسة"],
      احباط: ["محتد", "منزعج"],
      متباعد: ["منسحب", "فاقد الإحساس"],
      إحراج: ["متشكك", "رافض"]
    }
  },
  الإشمئزاز: {
    level2: {
      رافض: ["سريع الحكم", "منزعج"],
      "خائب الأمل": ["مروع", "ثار"], 
      فظيع: ["مشمئز", "كريه"], 
      نفور: ["هلع", "متردد"]
    }
  },
  الحزن: {
    level2: {
      مجروح: ["منحرج", "مخيب"],
      اكتئاب: ["متدني", "خالي من المشاعر"],
      مذنب: [ "خجول", "ندامة"],
      يائس: ["عاجز", "حزين"], 
      ضعيف: ["هش", "ضحية"],
      وحيد: ["تخلى عنه", "معزول"]
    }
  },
  السعادة: {
    level2: {
      مرح: ["ثائر", "نبيه"],
      قنوع: ["حر", "مبتهج"],
      مهتم: ["فضولي", "متسائل"],
      فخور: ["ناجح", "واثق",],
      مقبول: ["محترم", "قيّم"],
      قوي: ["شجاع", "إبداعي"],
      مسالم: ["محب", "شاكر"],
      واثق: ["حساس", "ودود"], 
      متفائل: ["متفائل","ملهم"]
    }
  },
  "المفاجأة": {
    level2: {
      مذهول: ["انبهار", "إعجاب", "تعجب"],
      مشتكك: ["ارتباك", "تشويش", "لبس"],
      مندهش: ["رهبة","مندهشة"],
      متحمس: ["نشيط","متلهف"],
    }
  },
  "السوء": {
    level2: {
      ذنب: ["ندم", "تأنيب", "لوم"],
      عار: ["خزي", "إذلال", "فضيحة"],
      كراهية: ["بغض", "حقد", "ضغينة"]
    }
  }
};
    

export function Welcome() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 70, y: 70 });
  const [attempts, setAttempts] = useState(0);
  const [yesattempts, setYesattempts] = useState(0);
  const [showEmotions, setShowEmotions] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentLevel2, setCurrentLevel2] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectLevel3, setSelectedLevel3] = useState(0);

  const handleYesClick = () => {
    setYesattempts(prevYes => {
      const newYes = prevYes + 1;
  
      if ((newYes === 1 || newYes === 2) && attempts >= 6) {
        setShowEmotions(false);
      } else if ((newYes >= 2 && attempts >= 5) || (newYes === 1 && attempts <= 5)) {
        setShowEmotions(true);
      }
  
      return newYes;
    });
  };

  const handleNoattempts = () => {
    setAttempts(prev => prev + 1);
  };

  const handleEmotionClick = (emotion) => {
    setCurrentEmotion(emotion);
    setSelectedPath([emotion]);
  };

  const handleLevel2Click = (level2Emotion) => {
    setCurrentLevel2(level2Emotion);
    setSelectedPath([...selectedPath, level2Emotion]);
  };

  const handleLevel3Click = () => {
    setSelectedLevel3(prev => prev + 1);
    // Here you could show a final screen or handle the complete selection
  };

  const handleBack = () => {
    if (selectedPath.length === 3) {
      // From level 3 back to level 2
      setSelectedPath([selectedPath[0], selectedPath[1]]);
    } else if (selectedPath.length === 2) {
      // From level 2 back to level 1
      setCurrentLevel2(null);
      setSelectedPath([selectedPath[0]]);
      setCurrentEmotion(selectedPath[0]);
    } else if (selectedPath.length === 1) {
      // From level 1 back to main emotions
      setCurrentEmotion(null);
      setSelectedPath([]);
    }
  };

  const pixelButtonStyle = {
    imageRendering: 'pixelated',
    border: '3px solid #000',
    borderRadius: '0',
    boxShadow: '4px 4px 0px #000, inset -2px -2px 0px rgba(0,0,0,0.3)',
    fontFamily: 'monospace',
    textShadow: '1px 1px 0px #000'
  };

  // Show level 3 emotions
  if (selectedPath.length === 2 && currentEmotion && currentLevel2) {
    const level3Emotions = emotionData[currentEmotion]?.level2[currentLevel2] || [];
    
    return (
      <div className="relative min-h-screen overflow-hidden" style={{fontFamily: 'Noto Kufi Arabic, sans-serif'}}>
        <div className="absolute inset-0 z-0">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={["#2d2d32","#581c87", "#581c87"]}
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="mb-4">
            <button 
              onClick={handleBack}
              className="text-white hover:text-purple-300 transition-colors"
            >
              ← العودة
            </button>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-white text-lg mb-2">المشاعر المحددة:</p>
            <p className="text-purple-300 text-md">{selectedPath.join(' → ')}</p>
          </div>
          
          <h1 className="text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16">
            حدد بدقة أكثر
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
            {level3Emotions.map((emotion, index) => (
              <NeonButton key={index} onClick={() => handleLevel3Click()
                
              }>
                {emotion}
              </NeonButton>
            ))}
          </div>
          {
          selectLevel3 == 1 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">الله يعينك أو يزيدك ما حطيت حاجة تشوف ايش اخترت</p>
          </div>
        )}
        {
          selectLevel3 == 2 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">خلاص ما فيه شيء اكثر والله</p>
          </div>
        )}
        {
          selectLevel3 == 3 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">ترا بهكر جهازك</p>
          </div>
        )}
        {
          selectLevel3 == 10 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">فكرة الموقع ما خلتني انام</p>
          </div>
        )}

{
          selectLevel3 == 15 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">تحسب بقول شيء اكثر؟ اضغط الين تصير 100 عدة</p>
          </div>
        )}
        {
          selectLevel3 > 15 && selectLevel3 < 100 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">{selectLevel3}</p>
          </div>
        )}
        {
          selectLevel3 == 100 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">اتمنى تصمل على اشياء ثانية بحياتك نفس صملتك هنا</p>
          </div>
        )}
        {
          selectLevel3 == 101 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">الله يشفيك</p>
          </div>
        )}
        {
          selectLevel3 >= 102 &&(
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">aheleles ahlelas</p>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Show level 2 emotions
  if (currentEmotion && emotionData[currentEmotion]) {
    const level2Emotions = Object.keys(emotionData[currentEmotion].level2);
    
    return (
      <div className="relative min-h-screen overflow-hidden" style={{fontFamily: 'Noto Kufi Arabic, sans-serif'}}>
        <div className="absolute inset-0 z-0">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={["#2d2d32","#581c87", "#581c87"]}
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="mb-4">
            <button 
              onClick={handleBack}
              className="text-white hover:text-purple-300 transition-colors"
            >
              ← العودة
            </button>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-white text-lg mb-2">اخترت:</p>
            <p className="text-purple-300 text-xl font-bold">{currentEmotion}</p>
          </div>
          
          <h1 className="text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16">
            وش نوع {currentEmotion} اللي تحس فيه؟
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl">
            {level2Emotions.map((emotion, index) => (
              <NeonButton key={index} onClick={() => handleLevel2Click(emotion)}>
                {emotion}
              </NeonButton>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show main emotions (level 1)
  if (showEmotions) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{fontFamily: 'Noto Kufi Arabic, sans-serif'}}>
        <div className="absolute inset-0 z-0">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={["#2d2d32","#581c87", "#581c87"]}
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16">
            وش تحس فيه؟
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-4xl">
            {Object.keys(emotionData).map((emotion, index) => (
              <NeonButton key={index} onClick={() => handleEmotionClick(emotion)}>
                {emotion}
              </NeonButton>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) translateY(-100px) scale(1.5); }
          }
        `}</style>
      </div>
    );
  }

  // Initial screen
  return (
    <div className="relative min-h-screen overflow-hidden" style={{fontFamily: 'Noto Kufi Arabic, sans-serif'}}>
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={["#2d2d32","#581c87", "#581c87"]}
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-[clamp(2rem,5vw,8rem)] text-white font-bold leading-tight text-center mb-16">
          ما تعرف تعبر عن مشاعرك؟
        </h1>
        
        <div className="flex gap-8 items-center">
          <NeonButton onClick={handleYesClick}>
            ايه :(
          </NeonButton>
          
          <NeonButton 
            onClick={handleNoattempts}
            className="bg-red-600 hover:bg-red-700 text-white text-3xl px-12 py-6 font-bold transition-all duration-300 cursor-pointer select-none"
          >
            الا
          </NeonButton>
        </div>
        
        {attempts === 1 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">على مين؟</p>
          </div>
        )}
        {attempts === 2 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">لا نكذب على بعض</p>
          </div>
        )}
        {attempts === 3 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">بس يا حح</p>
          </div>
        )}
        {attempts === 4 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">خل اساعدك طيب</p>
          </div>
        )}
        {attempts === 5 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">عطني فرصة</p>
          </div>
        )}
        {attempts === 6 && yesattempts === 1 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">غصباً عنك</p>
          </div>
        )}
        {attempts === 6 && yesattempts === 2 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur" 
               style={{...pixelButtonStyle, backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #fff'}}>
            <p className="text-lg">:P</p>
          </div>
        ) }
        
      </div>
    </div>
  );
}
const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];