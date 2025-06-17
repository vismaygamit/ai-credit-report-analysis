// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en", // default language
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          homePage: {
            heading: "Understand & Improve Your Credit Report – Instantly",
            subheading:
              "Upload your credit report. Get step-by-step guidance to boost your score.",
            cta: "Start Free Analysis",
            features: [
              "We do not store your credit report. All data is deleted after analysis.",
              "Automatic analysis, no human viewing",
              "Used by thousands to improve their credit fast",
            ],
            stepsTitle: "Get Started in 3 Easy Steps",
            step1: {
              title: "Step 1: Download Report",
              desc: "Visit Equifax.ca and download your free credit report with a score as PDF.",
            },
            step2: {
              title: "Step 2: Upload & Analyze",
              desc: "Upload your report. We'll securely scan it and provide a preview of your credit score analysis.",
            },
            step3: {
              title: "Step 3: Pay & Receive Report",
              desc: "Purchase to receive your full improvement plan, personalized letters, and AI assistant support.",
            },
            secureNote:
              "All reports are automatically deleted after analysis. 100% private and secure.",
            secondCTA: "Start Now",
            testimonialsTitle: "What People Are Saying",
            testimonial1:
              "I uploaded my Equifax report and got a breakdown of exactly what to fix. Super easy to use.",
            testimonial2:
              "The pay-to-delete letter helped me remove an old Rogers collection. Score jumped 48 points!",
            user1: "- Amandeep S, Brampton, ON",
            user2: "- Melissa T, Vancouver, BC",
          },
          header: {
            nav: {
              home: "Home",
              analyze: "Analyze",
            },
          },
          footer: {
            copyright: "All rights reserved.",
          },
          analyzePage: {
            dragDrop: "Drag & drop file here",
            or: "or",
            chooseFile: "CHOOSE FILE",
            acceptedFile: "Accepted file type: PDF",
            privacyNote:
              "No data is stored | Credit report deleted after analysis",
            preview: "Preview",
            analyzeButton: "Analyze",
            resetButton: "Reset",
          },
        },
      },
      ru: {
        translation: {
          homePage: {
            heading: "Поймите и улучшите свой кредитный отчет — мгновенно",
            subheading:
              "Загрузите свой кредитный отчет. Получите пошаговое руководство для повышения рейтинга.",
            cta: "Начать бесплатный анализ",
            features: [
              "Мы не сохраняем ваш кредитный отчет. Все данные удаляются после анализа.",
              "Автоматический анализ, без участия человека",
              "Используется тысячами для быстрого улучшения кредитной истории",
            ],
            stepsTitle: "Начните с 3 простых шагов",
            step1: {
              title: "Шаг 1: Загрузите отчет",
              desc: "Посетите Equifax.ca и скачайте бесплатный кредитный отчет в формате PDF.",
            },
            step2: {
              title: "Шаг 2: Загрузите и проанализируйте",
              desc: "Загрузите свой отчет. Мы безопасно его проанализируем и покажем предварительный результат.",
            },
            step3: {
              title: "Шаг 3: Оплатите и получите отчет",
              desc: "Купите полный план улучшения, персонализированные письма и поддержку AI-ассистента.",
            },
            secureNote:
              "Все отчеты удаляются после анализа. Полная конфиденциальность и безопасность.",
            secondCTA: "Начать сейчас",
            testimonialsTitle: "Что говорят люди",
            testimonial1:
              "Я загрузил свой отчет Equifax и получил точную информацию о том, что нужно исправить.",
            testimonial2:
              "Письмо о погашении помогло мне удалить старый долг. Рейтинг вырос на 48 пунктов!",
            user1: "- Амандип С., Брамптон, Онтарио",
            user2: "- Мелисса Т., Ванкувер, Британская Колумбия",
          },
          header: {
            nav: {
              home: "Главная",
              analyze: "Анализ",
            },
          },
          footer: {
            copyright: "Все права защищены.",
          },
          analyzePage: {
            dragDrop: "Перетащите файл сюда",
            or: "или",
            chooseFile: "ВЫБРАТЬ ФАЙЛ",
            acceptedFile: "Допустимый тип файла: PDF",
            privacyNote:
              "Данные не сохраняются | Кредитный отчет удаляется после анализа",
            preview: "Предпросмотр",
            analyzeButton: "Анализировать",
            resetButton: "Сбросить",
          },
        },
      },
      uk: {
        translation: {
          homePage: {
            heading: "Зрозумійте та покращте свій кредитний звіт — миттєво",
            subheading:
              "Завантажте кредитний звіт. Отримайте покрокову інструкцію для підвищення балу.",
            cta: "Почати безкоштовний аналіз",
            features: [
              "Ми не зберігаємо ваш кредитний звіт. Всі дані видаляються після аналізу.",
              "Автоматичний аналіз, без участі людини",
              "Тисячі користувачів вже покращили свій кредитний рейтинг",
            ],
            stepsTitle: "Почніть з 3 простих кроків",
            step1: {
              title: "Крок 1: Завантажте звіт",
              desc: "Перейдіть на Equifax.ca та завантажте безкоштовний кредитний звіт у форматі PDF.",
            },
            step2: {
              title: "Крок 2: Завантажте та проаналізуйте",
              desc: "Завантажте звіт. Ми безпечно проаналізуємо його та покажемо попередні результати.",
            },
            step3: {
              title: "Крок 3: Оплатіть і отримайте звіт",
              desc: "Придбайте план покращення, персональні листи та підтримку AI-асистента.",
            },
            secureNote:
              "Всі звіти видаляються після аналізу. Конфіденційність гарантовано.",
            secondCTA: "Почати зараз",
            testimonialsTitle: "Відгуки користувачів",
            testimonial1:
              "Я завантажив звіт і отримав чіткий план дій. Дуже зручно.",
            testimonial2:
              "Лист на видалення боргу допоміг мені прибрати старий запис. Бал зріс на 48 пунктів!",
            user1: "- Амандіп С., Брамптон",
            user2: "- Мелісса Т., Ванкувер",
          },
          header: {
            nav: {
              home: "Головна",
              analyze: "Аналіз",
            },
          },
          footer: {
            copyright: "Усі права захищені.",
          },
          analyzePage: {
            dragDrop: "Перетягніть файл сюди",
            or: "або",
            chooseFile: "ОБРАТИ ФАЙЛ",
            acceptedFile: "Прийнятний тип файлу: PDF",
            privacyNote:
              "Дані не зберігаються | Кредитний звіт видаляється після аналізу",
            preview: "Попередній перегляд",
            analyzeButton: "Аналізувати",
            resetButton: "Скинути",
          },
        },
      },
      es: {
        translation: {
          homePage: {
            heading: "Comprende y mejora tu informe de crédito — al instante",
            subheading:
              "Sube tu informe de crédito. Obtén orientación paso a paso para mejorar tu puntuación.",
            cta: "Comenzar análisis gratuito",
            features: [
              "No almacenamos tu informe. Todos los datos se eliminan tras el análisis.",
              "Análisis automático, sin revisión humana",
              "Miles de personas lo utilizan para mejorar su crédito rápidamente",
            ],
            stepsTitle: "Comienza en 3 pasos simples",
            step1: {
              title: "Paso 1: Descargar informe",
              desc: "Visita Equifax.ca y descarga tu informe de crédito gratuito en PDF.",
            },
            step2: {
              title: "Paso 2: Subir y analizar",
              desc: "Sube tu informe. Lo escanearemos de forma segura y te daremos un análisis previo.",
            },
            step3: {
              title: "Paso 3: Pagar y recibir informe",
              desc: "Compra para recibir tu plan de mejora, cartas personalizadas y soporte con AI.",
            },
            secureNote:
              "Todos los informes se eliminan tras el análisis. 100% privado y seguro.",
            secondCTA: "Comenzar ahora",
            testimonialsTitle: "Lo que dicen nuestros usuarios",
            testimonial1:
              "Subí mi informe Equifax y me dijeron exactamente qué corregir. Muy fácil.",
            testimonial2:
              "La carta me ayudó a eliminar una deuda antigua. ¡Mi puntuación subió 48 puntos!",
            user1: "- Amandeep S., Brampton, ON",
            user2: "- Melissa T., Vancouver, BC",
          },
          header: {
            nav: {
              home: "Inicio",
              analyze: "Analizar",
            },
          },
          footer: {
            copyright: "Todos los derechos reservados.",
          },
          analyzePage: {
            dragDrop: "Arrastra y suelta el archivo aquí",
            or: "o",
            chooseFile: "ELEGIR ARCHIVO",
            acceptedFile: "Tipo de archivo aceptado: PDF",
            privacyNote:
              "No se almacenan datos | El informe de crédito se elimina después del análisis",
            preview: "Vista previa",
            analyzeButton: "Analizar",
            resetButton: "Restablecer",
          },
        },
      },
      fr: {
        translation: {
          homePage: {
            heading:
              "Comprenez et améliorez votre rapport de crédit – instantanément",
            subheading:
              "Téléchargez votre rapport de crédit. Recevez un guide étape par étape pour améliorer votre score.",
            cta: "Commencer l'analyse gratuite",
            features: [
              "Nous ne stockons pas votre rapport. Toutes les données sont supprimées après analyse.",
              "Analyse automatique, aucune intervention humaine",
              "Utilisé par des milliers pour améliorer leur crédit rapidement",
            ],
            stepsTitle: "Commencez en 3 étapes simples",
            step1: {
              title: "Étape 1 : Télécharger le rapport",
              desc: "Visitez Equifax.ca et téléchargez votre rapport de crédit gratuit en PDF.",
            },
            step2: {
              title: "Étape 2 : Télécharger et analyser",
              desc: "Téléchargez votre rapport. Nous l'analyserons en toute sécurité et fournirons un aperçu.",
            },
            step3: {
              title: "Étape 3 : Payer et recevoir",
              desc: "Achetez pour recevoir votre plan d'amélioration, des lettres personnalisées, et un assistant IA.",
            },
            secureNote:
              "Tous les rapports sont supprimés après analyse. 100 % privé et sécurisé.",
            secondCTA: "Commencer maintenant",
            testimonialsTitle: "Ce que les gens disent",
            testimonial1:
              "J’ai téléchargé mon rapport Equifax et su quoi corriger. Très simple.",
            testimonial2:
              "La lettre m’a aidé à supprimer une ancienne dette. Score augmenté de 48 points !",
            user1: "- Amandeep S., Brampton, ON",
            user2: "- Melissa T., Vancouver, BC",
          },
          header: {
            nav: {
              home: "Accueil",
              analyze: "Analyser",
            },
          },
          footer: {
            copyright: "Tous droits réservés.",
          },
          analyzePage: {
            dragDrop: "Glissez-déposez le fichier ici",
            or: "ou",
            chooseFile: "CHOISIR UN FICHIER",
            acceptedFile: "Type de fichier accepté : PDF",
            privacyNote:
              "Aucune donnée n'est stockée | Le rapport de crédit est supprimé après l'analyse",
            preview: "Aperçu",
            analyzeButton: "Analyser",
            resetButton: "Réinitialiser",
          },
        },
      },
      ar: {
        translation: {
          homePage: {
            heading: "افهم وحسّن تقريرك الائتماني – فورًا",
            subheading:
              "قم برفع تقريرك الائتماني. احصل على إرشادات خطوة بخطوة لزيادة الدرجة.",
            cta: "ابدأ التحليل المجاني",
            features: [
              "لا نقوم بحفظ تقريرك. يتم حذف جميع البيانات بعد التحليل.",
              "تحليل تلقائي دون تدخل بشري",
              "يستخدمه الآلاف لتحسين درجاتهم بسرعة",
            ],
            stepsTitle: "ابدأ في 3 خطوات بسيطة",
            step1: {
              title: "الخطوة 1: تحميل التقرير",
              desc: "قم بزيارة Equifax.ca وحمّل تقريرك الائتماني المجاني بصيغة PDF.",
            },
            step2: {
              title: "الخطوة 2: رفع وتحليل",
              desc: "قم برفع تقريرك وسنقوم بتحليله بأمان وتقديم نظرة سريعة.",
            },
            step3: {
              title: "الخطوة 3: الدفع واستلام التقرير",
              desc: "اشترِ للحصول على خطة التحسين الكاملة، رسائل مخصصة، ودعم الذكاء الاصطناعي.",
            },
            secureNote: "يتم حذف جميع التقارير بعد التحليل. خصوصية وأمان 100٪.",
            secondCTA: "ابدأ الآن",
            testimonialsTitle: "آراء المستخدمين",
            testimonial1:
              "قمت برفع تقريري من Equifax وحصلت على خطوات واضحة للإصلاح. سهل الاستخدام.",
            testimonial2:
              "الرسالة ساعدتني في إزالة دين قديم. ارتفع التقييم 48 نقطة!",
            user1: "- أمانديب س، برامبتون، أونتاريو",
            user2: "- ميليسا ت، فانكوفر",
          },
          header: {
            nav: {
              home: "الصفحة الرئيسية",
              analyze: "تحليل",
            },
          },
          footer: {
            copyright: "جميع الحقوق محفوظة.",
          },
          analyzePage: {
            dragDrop: "اسحب الملف وأفلته هنا",
            or: "أو",
            chooseFile: "اختر ملفًا",
            acceptedFile: "نوع الملف المقبول: PDF",
            privacyNote:
              "لا يتم تخزين البيانات | يتم حذف تقرير الائتمان بعد التحليل",
            preview: "معاينة",
            analyzeButton: "تحليل",
            resetButton: "إعادة تعيين",
          },
        },
      },
      hi: {
        translation: {
          homePage: {
            heading: "अपने क्रेडिट रिपोर्ट को समझें और सुधारें – तुरंत",
            subheading:
              "अपनी क्रेडिट रिपोर्ट अपलोड करें। स्कोर बढ़ाने के लिए चरण-दर-चरण मार्गदर्शन प्राप्त करें।",
            cta: "निःशुल्क विश्लेषण शुरू करें",
            features: [
              "हम आपकी रिपोर्ट को संग्रहीत नहीं करते। विश्लेषण के बाद सभी डेटा हटा दिए जाते हैं।",
              "स्वचालित विश्लेषण, कोई मानवीय हस्तक्षेप नहीं",
              "हज़ारों लोग तेज़ी से अपना स्कोर सुधारने के लिए उपयोग करते हैं",
            ],
            stepsTitle: "3 आसान चरणों में शुरू करें",
            step1: {
              title: "चरण 1: रिपोर्ट डाउनलोड करें",
              desc: "Equifax.ca पर जाएं और अपना मुफ्त क्रेडिट रिपोर्ट PDF में डाउनलोड करें।",
            },
            step2: {
              title: "चरण 2: अपलोड और विश्लेषण करें",
              desc: "अपनी रिपोर्ट अपलोड करें। हम इसे सुरक्षित रूप से स्कैन करके पूर्वावलोकन प्रदान करेंगे।",
            },
            step3: {
              title: "चरण 3: भुगतान करें और रिपोर्ट प्राप्त करें",
              desc: "संपूर्ण सुधार योजना, व्यक्तिगत पत्र, और एआई सहायता प्राप्त करने के लिए भुगतान करें।",
            },
            secureNote:
              "सभी रिपोर्ट विश्लेषण के बाद हटा दी जाती हैं। 100% सुरक्षित और निजी।",
            secondCTA: "अब शुरू करें",
            testimonialsTitle: "लोग क्या कह रहे हैं",
            testimonial1:
              "मैंने अपनी रिपोर्ट अपलोड की और सुधार के स्पष्ट निर्देश मिले। बहुत आसान!",
            testimonial2:
              "लेटर की मदद से पुराना कलेक्शन हटा। स्कोर में 48 पॉइंट की बढ़त!",
            user1: "- अमनदीप एस, ब्रैम्पटन",
            user2: "- मेलिसा टी, वैंकूवर",
          },
          header: {
            nav: {
              home: "होम",
              analyze: "विश्लेषण करें",
            },
          },
          footer: {
            copyright: "सर्वाधिकार सुरक्षित।",
          },
          analyzePage: {
            dragDrop: "फ़ाइल को यहां खींचें और छोड़ें",
            or: "या",
            chooseFile: "फ़ाइल चुनें",
            acceptedFile: "स्वीकृत फ़ाइल प्रकार: PDF",
            privacyNote:
              "कोई डेटा संग्रहीत नहीं किया जाता | विश्लेषण के बाद क्रेडिट रिपोर्ट हटा दी जाती है",
            preview: "पूर्वावलोकन",
            analyzeButton: "विश्लेषण करें",
            resetButton: "रीसेट करें",
          },
        },
      },
    },
    react: {
      wait: true,
    },
  });

export default i18n;
