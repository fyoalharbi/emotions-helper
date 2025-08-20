import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const LetterGlitch = ({
  glitchColors = ["#2d2d32", "#8a2be2", "#adff2f"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;
  const lettersAndSymbols = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "!",
    "@",
    "#",
    "$",
    "&",
    "*",
    "(",
    ")",
    "-",
    "_",
    "+",
    "=",
    "/",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    "<",
    ">",
    ",",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  ];
  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };
  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  const interpolateColor = (start, end, factor) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };
  const calculateGrid = (width, height) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };
  const initializeLetters = (columns, rows) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1
    }));
  };
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };
  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";
    letters.current.forEach((letter, index) => {
      const x = index % grid.current.columns * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };
  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;
      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();
      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };
  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;
        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(
            startRgb,
            endRgb,
            letter.colorProgress
          );
          needsRedraw = true;
        }
      }
    });
    if (needsRedraw) {
      drawLetters();
    }
  };
  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }
    if (smooth) {
      handleSmoothTransitions();
    }
    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    context.current = canvas.getContext("2d");
    resizeCanvas();
    animate();
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [glitchSpeed, smooth]);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full bg-black overflow-hidden", children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "block w-full h-full" }),
    outerVignette && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]"
      }
    ),
    centerVignette && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"
      }
    )
  ] });
};
gsap.registerPlugin(ScrollTrigger);
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const NeonButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
  size = "large"
}) => {
  const sizeStyles = {
    small: { padding: "8px 16px", fontSize: "12px" },
    medium: { padding: "12px 24px", fontSize: "14px" },
    large: { padding: "16px 32px", fontSize: "16px" }
  };
  const buttonStyle = {
    background: "#1a1a2e",
    border: "2px solid #8a2be2",
    color: disabled ? "#666" : "#ffffff",
    ...sizeStyles[size],
    fontFamily: "monospace",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: disabled ? "not-allowed" : "pointer",
    position: "relative",
    boxShadow: disabled ? "none" : "0 0 10px #00f5ff, inset 0 0 10px rgba(0, 245, 255, 0.1)",
    transition: "all 0.1s",
    imageRendering: "pixelated",
    opacity: disabled ? 0.5 : 1,
    ...!disabled && {
      ":hover": {
        background: "rgba(0, 245, 255, 0.1)",
        boxShadow: "0 0 20px #8a2be2, inset 0 0 20px rgba(0, 245, 255, 0.2)",
        textShadow: "0 0 10px #8a2be2"
      },
      ":active": {
        transform: "scale(0.98)"
      }
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      style: buttonStyle,
      className: `neon-button ${className}`,
      onClick,
      disabled,
      type: "button",
      onMouseEnter: (e) => {
        if (!disabled) {
          e.currentTarget.style.background = "rgba(0, 245, 255, 0.1)";
          e.currentTarget.style.boxShadow = "0 0 20px #8a2be2, inset 0 0 20px rgba(0, 245, 255, 0.2)";
          e.currentTarget.style.textShadow = "0 0 10px #8a2be2";
        }
      },
      onMouseLeave: (e) => {
        if (!disabled) {
          e.currentTarget.style.background = "#1a1a2e";
          e.currentTarget.style.boxShadow = "0 0 10px #8a2be2, inset 0 0 10px rgba(0, 245, 255, 0.1)";
          e.currentTarget.style.textShadow = "none";
        }
      },
      onMouseDown: (e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(0.98)";
        }
      },
      onMouseUp: (e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1)";
        }
      },
      children
    }
  );
};
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
      مذنب: ["خجول", "ندامة"],
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
      فخور: ["ناجح", "واثق"],
      مقبول: ["محترم", "قيّم"],
      قوي: ["شجاع", "إبداعي"],
      مسالم: ["محب", "شاكر"],
      واثق: ["حساس", "ودود"],
      متفائل: ["متفائل", "ملهم"]
    }
  },
  "المفاجأة": {
    level2: {
      مذهول: ["انبهار", "إعجاب", "تعجب"],
      مشتكك: ["ارتباك", "تشويش", "لبس"],
      مندهش: ["رهبة", "مندهشة"],
      متحمس: ["نشيط", "متلهف"]
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
function Welcome() {
  var _a;
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 70, y: 70 });
  const [attempts, setAttempts] = useState(0);
  const [yesattempts, setYesattempts] = useState(0);
  const [showEmotions, setShowEmotions] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentLevel2, setCurrentLevel2] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectLevel3, setSelectedLevel3] = useState(0);
  const handleYesClick = () => {
    setYesattempts((prev) => prev + 1);
    if (yesattempts == 0 && attempts == 0 || yesattempts == 0 && attempts < 5) {
      setShowEmotions(true);
    } else if (yesattempts == 2) {
      setShowEmotions(true);
    }
  };
  const handleNoattempts = () => {
    setAttempts((prev) => prev + 1);
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
    setSelectedLevel3((prev) => prev + 1);
  };
  const handleBack = () => {
    if (selectedPath.length === 3) {
      setSelectedPath([selectedPath[0], selectedPath[1]]);
    } else if (selectedPath.length === 2) {
      setCurrentLevel2(null);
      setSelectedPath([selectedPath[0]]);
      setCurrentEmotion(selectedPath[0]);
    } else if (selectedPath.length === 1) {
      setCurrentEmotion(null);
      setSelectedPath([]);
    }
  };
  const pixelButtonStyle = {
    imageRendering: "pixelated",
    border: "3px solid #000",
    borderRadius: "0",
    boxShadow: "4px 4px 0px #000, inset -2px -2px 0px rgba(0,0,0,0.3)",
    fontFamily: "monospace",
    textShadow: "1px 1px 0px #000"
  };
  if (selectedPath.length === 2 && currentEmotion && currentLevel2) {
    const level3Emotions = ((_a = emotionData[currentEmotion]) == null ? void 0 : _a.level2[currentLevel2]) || [];
    return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", style: { fontFamily: "Noto Kufi Arabic, sans-serif" }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(
        LetterGlitch,
        {
          glitchSpeed: 50,
          centerVignette: true,
          outerVignette: false,
          smooth: true,
          glitchColors: ["#2d2d32", "#581c87", "#581c87"]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center min-h-screen p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleBack,
            className: "text-white hover:text-purple-300 transition-colors",
            children: "← العودة"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white text-lg mb-2", children: "المشاعر المحددة:" }),
          /* @__PURE__ */ jsx("p", { className: "text-purple-300 text-md", children: selectedPath.join(" → ") })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16", children: "حدد بدقة أكثر" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl", children: level3Emotions.map((emotion, index) => /* @__PURE__ */ jsx(NeonButton, { onClick: () => handleLevel3Click(), children: emotion }, index)) }),
        selectLevel3 == 1 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "الله يعينك أو يزيدك ما حطيت حاجة تشوف ايش اخترت" })
          }
        ),
        selectLevel3 == 2 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "خلاص ما فيه شيء اكثر والله" })
          }
        ),
        selectLevel3 == 3 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "ترا بهكر جهازك" })
          }
        ),
        selectLevel3 == 10 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "فكرة الموقع ما خلتني انام" })
          }
        ),
        selectLevel3 == 15 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "تحسب بقول شيء اكثر؟ اضغط الين تصير 100 عدة" })
          }
        ),
        selectLevel3 > 15 && selectLevel3 < 100 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: selectLevel3 })
          }
        ),
        selectLevel3 == 100 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "اتمنى تصمل على اشياء ثانية بحياتك نفس صملتك هنا" })
          }
        ),
        selectLevel3 == 101 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "الله يشفيك" })
          }
        ),
        selectLevel3 >= 102 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
            style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
            children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "aheleles ahlelas" })
          }
        )
      ] })
    ] });
  }
  if (currentEmotion && emotionData[currentEmotion]) {
    const level2Emotions = Object.keys(emotionData[currentEmotion].level2);
    return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", style: { fontFamily: "Noto Kufi Arabic, sans-serif" }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(
        LetterGlitch,
        {
          glitchSpeed: 50,
          centerVignette: true,
          outerVignette: false,
          smooth: true,
          glitchColors: ["#2d2d32", "#581c87", "#581c87"]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center min-h-screen p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleBack,
            className: "text-white hover:text-purple-300 transition-colors",
            children: "← العودة"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white text-lg mb-2", children: "اخترت:" }),
          /* @__PURE__ */ jsx("p", { className: "text-purple-300 text-xl font-bold", children: currentEmotion })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16", children: [
          "وش نوع ",
          currentEmotion,
          " اللي تحس فيه؟"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl", children: level2Emotions.map((emotion, index) => /* @__PURE__ */ jsx(NeonButton, { onClick: () => handleLevel2Click(emotion), children: emotion }, index)) })
      ] })
    ] });
  }
  if (showEmotions) {
    return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", style: { fontFamily: "Noto Kufi Arabic, sans-serif" }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(
        LetterGlitch,
        {
          glitchSpeed: 50,
          centerVignette: true,
          outerVignette: false,
          smooth: true,
          glitchColors: ["#2d2d32", "#581c87", "#581c87"]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center min-h-screen p-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[clamp(1.5rem,4vw,6rem)] text-white font-bold text-center mb-16", children: "وش تحس فيه؟" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-4xl", children: Object.keys(emotionData).map((emotion, index) => /* @__PURE__ */ jsx(NeonButton, { onClick: () => handleEmotionClick(emotion), children: emotion }, index)) })
      ] }),
      /* @__PURE__ */ jsx("style", { jsx: true, children: `
          @keyframes float {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) translateY(-100px) scale(1.5); }
          }
        ` })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", style: { fontFamily: "Noto Kufi Arabic, sans-serif" }, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(
      LetterGlitch,
      {
        glitchSpeed: 50,
        centerVignette: true,
        outerVignette: false,
        smooth: true,
        glitchColors: ["#2d2d32", "#581c87", "#581c87"]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center min-h-screen p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[clamp(2rem,5vw,8rem)] text-white font-bold leading-tight text-center mb-16", children: "ما تعرف تعبر عن مشاعرك؟" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-8 items-center", children: [
        /* @__PURE__ */ jsx(NeonButton, { onClick: handleYesClick, children: "ايه :(" }),
        /* @__PURE__ */ jsx(
          NeonButton,
          {
            onClick: handleNoattempts,
            className: "bg-red-600 hover:bg-red-700 text-white text-3xl px-12 py-6 font-bold transition-all duration-300 cursor-pointer select-none",
            children: "الا"
          }
        )
      ] }),
      attempts === 1 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "على مين؟" })
        }
      ),
      attempts === 2 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "لا نكذب على بعض" })
        }
      ),
      attempts === 3 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "بس يا حح" })
        }
      ),
      attempts === 4 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "خل اساعدك طيب" })
        }
      ),
      attempts === 5 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "عطني فرصة" })
        }
      ),
      attempts >= 6 && yesattempts === 1 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "غصباً عنك" })
        }
      ),
      attempts >= 6 && yesattempts === 2 && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center p-4 rounded backdrop-blur",
          style: { ...pixelButtonStyle, backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid #fff" },
          children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: ":P" })
        }
      )
    ] })
  ] });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-tKC4XhlV.js", "imports": ["/assets/chunk-UH6JLGW7-BnjEZNfp.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CP9mTmeo.js", "imports": ["/assets/chunk-UH6JLGW7-BnjEZNfp.js"], "css": ["/assets/root-CvfzcRmO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DGgl3KD7.js", "imports": ["/assets/chunk-UH6JLGW7-BnjEZNfp.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-36e524f2.js", "version": "36e524f2", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
