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
              signIn: "Sign in",
              signOut: "Sign out",
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
            planTitle: "Basic Insights",
            proTitle : "Personalized Insights",
            unlockButton: "Unlock Personalized Insights for $100",
            processingTime: "Processing Time: 2-3 minutes",
          },
          privacyPage: {
            title: "Privacy Policy",
            effectiveDate: "Effective Date: June 13, 2025",
            intro:
              "SCOREWISE (https://www.scorewise.ca) is committed to protecting your privacy. This policy outlines how we collect, use, and protect your data when you use our credit report analysis services.",
            sections: {
              whoWeAre: {
                title: "1. Who We Are",
                content:
                  "SCOREWISE is a Canadian credit wellness platform. Our tools analyze credit reports submitted by users to provide insights and improvement strategies.",
              },
              whatWeCollect: {
                title: "2. What We Collect",
                items: [
                  "Uploaded credit reports (PDF format from Equifax or TransUnion)",
                  "Device, browser, and language metadata",
                  "User interactions for session-based analysis only",
                ],
                note: "We do not collect your name, SIN, banking, or address details unless you explicitly provide them in the uploaded document.",
              },
              howWeUse: {
                title: "3. How We Use Your Data",
                intro: "Your credit report is analyzed using AI to:",
                items: [
                  "Display a preview of problematic items",
                  "Generate improvement letters and strategies (upon purchase)",
                  "Offer tailored insights — fully automated, no human viewing",
                ],
              },
              retention: {
                title: "4. Retention & Deletion",
                content:
                  "Uploaded files are deleted automatically within minutes after analysis. We do not store your data long-term, and no copies are retained beyond session use.",
              },
              security: {
                title: "5. Security Measures",
                items: [
                  "SSL encryption for all file transfers",
                  "All processing takes place on secure Canadian servers",
                  "No tracking scripts or marketing pixels are embedded",
                ],
              },
              compliance: {
                title: "6. Canadian Compliance",
                intro: "SCOREWISE complies with:",
                items: [
                  "PIPEDA – Personal Information Protection and Electronic Documents Act",
                  "CASL – Canada’s Anti-Spam Legislation",
                ],
                note: "This service is available exclusively to Canadian users.",
              },
              languages: {
                title: "7. Language Support",
                content:
                  "We support English, French, Spanish, Arabic, Russian, Hindi, and Ukrainian. This policy is legally binding in English only.",
              },
              rights: {
                title: "8. Your Rights",
                intro: "You may contact us at any time to:",
                items: [
                  "Request deletion of your report (if still on our server)",
                  "Access a session-based summary of data processed",
                ],
                contact: "Contact us at privacy@scorewise.ca",
              },
              updates: {
                title: "9. Updates",
                content:
                  "We will post any future changes to this policy directly on this page. Continued use of our service implies acceptance of the latest terms.",
              },
            },
          },
          emptyData: "No data found"
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
              signIn: "Войти",
              signOut: "Выйти",
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
            planTitle: "Базовая аналитика",
            unlockButton: "Разблокировать персональные рекомендации за $100",
            processingTime: "Время обработки: 2–3 минуты",
          },
          privacyPage: {
            title: "Политика конфиденциальности",
            effectiveDate: "Дата вступления в силу: 13 июня 2025 года",
            intro:
              "SCOREWISE (https://www.scorewise.ca) стремится защищать вашу конфиденциальность. В этой политике описывается, как мы собираем, используем и защищаем ваши данные при использовании наших услуг анализа кредитных отчетов.",
            sections: {
              whoWeAre: {
                title: "1. Кто мы такие",
                content:
                  "SCOREWISE — это канадская платформа по улучшению кредитной истории. Наши инструменты анализируют предоставленные пользователями кредитные отчеты, чтобы предложить рекомендации по улучшению.",
              },
              whatWeCollect: {
                title: "2. Что мы собираем",
                items: [
                  "Загруженные кредитные отчеты (в формате PDF от Equifax или TransUnion)",
                  "Данные об устройстве, браузере и языке",
                  "Действия пользователя для анализа в рамках сессии",
                ],
                note: "Мы не собираем ваше имя, SIN, банковские или адресные данные, если вы явно не укажете их в загружаемом документе.",
              },
              howWeUse: {
                title: "3. Как мы используем ваши данные",
                intro: "Ваш кредитный отчет анализируется с помощью ИИ для:",
                items: [
                  "Предварительного просмотра проблемных пунктов",
                  "Создания писем и стратегий улучшения (после оплаты)",
                  "Предоставления персонализированных советов — полностью автоматически, без участия человека",
                ],
              },
              retention: {
                title: "4. Хранение и удаление",
                content:
                  "Загруженные файлы автоматически удаляются через несколько минут после анализа. Мы не храним ваши данные долгое время, и копии не сохраняются после сессии.",
              },
              security: {
                title: "5. Меры безопасности",
                items: [
                  "SSL-шифрование для всех передач файлов",
                  "Обработка данных только на защищенных серверах в Канаде",
                  "Отсутствие трекинговых скриптов и маркетинговых пикселей",
                ],
              },
              compliance: {
                title: "6. Соответствие канадским нормам",
                intro: "SCOREWISE соответствует требованиям:",
                items: [
                  "PIPEDA — Закон о защите личной информации и электронных документах",
                  "CASL — Канадский закон о борьбе со спамом",
                ],
                note: "Сервис доступен исключительно для пользователей из Канады.",
              },
              languages: {
                title: "7. Языковая поддержка",
                content:
                  "Мы поддерживаем английский, французский, испанский, арабский, русский, хинди и украинский. Эта политика имеет юридическую силу только на английском языке.",
              },
              rights: {
                title: "8. Ваши права",
                intro: "Вы можете связаться с нами в любое время, чтобы:",
                items: [
                  "Запросить удаление вашего отчета (если он еще на сервере)",
                  "Получить сводку об обработанных данных за сессию",
                ],
                contact: "Свяжитесь с нами по адресу privacy@scorewise.ca",
              },
              updates: {
                title: "9. Обновления",
                content:
                  "Мы будем публиковать все будущие изменения этой политики на этой странице. Дальнейшее использование нашего сервиса означает согласие с обновленными условиями.",
              },
            },
          },
          emptyData: "Данные не найдены",
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
              signIn: "Увійти",
              signOut: "Вийти",
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
            planTitle: "Базові висновки",
            unlockButton: "Відкрити персоналізовані поради за $100",
            processingTime: "Час обробки: 2–3 хвилини",
          },
          privacyPage: {
            title: "Політика конфіденційності",
            effectiveDate: "Дата набрання чинності: 13 червня 2025 року",
            intro:
              "SCOREWISE (https://www.scorewise.ca) прагне захистити вашу конфіденційність. У цій політиці викладено, як ми збираємо, використовуємо та захищаємо ваші дані під час користування нашими послугами з аналізу кредитних звітів.",
            sections: {
              whoWeAre: {
                title: "1. Хто ми",
                content:
                  "SCOREWISE — це канадська платформа для покращення кредитного рейтингу. Наші інструменти аналізують кредитні звіти користувачів для надання порад і стратегій покращення.",
              },
              whatWeCollect: {
                title: "2. Що ми збираємо",
                items: [
                  "Завантажені кредитні звіти (PDF з Equifax або TransUnion)",
                  "Дані про пристрій, браузер та мову",
                  "Взаємодії користувача для сеансового аналізу",
                ],
                note: "Ми не збираємо ваше ім’я, SIN, банківські або адресні дані, якщо ви їх явно не зазначили у документі.",
              },
              howWeUse: {
                title: "3. Як ми використовуємо ваші дані",
                intro: "Ваш кредитний звіт аналізується за допомогою ШІ для:",
                items: [
                  "Попереднього перегляду проблемних пунктів",
                  "Генерації листів та стратегій покращення (після оплати)",
                  "Надання персоналізованих порад — повністю автоматично, без участі людини",
                ],
              },
              retention: {
                title: "4. Зберігання та видалення",
                content:
                  "Завантажені файли автоматично видаляються через декілька хвилин після аналізу. Ми не зберігаємо ваші дані надовго.",
              },
              security: {
                title: "5. Заходи безпеки",
                items: [
                  "SSL-шифрування для всіх передач файлів",
                  "Уся обробка відбувається на захищених канадських серверах",
                  "Відсутні трекінг-скрипти або маркетингові пікселі",
                ],
              },
              compliance: {
                title: "6. Відповідність канадським нормам",
                intro: "SCOREWISE дотримується вимог:",
                items: [
                  "PIPEDA — Закон про захист персональної інформації та електронних документів",
                  "CASL — Канадський закон про боротьбу зі спамом",
                ],
                note: "Послуга доступна лише для користувачів з Канади.",
              },
              languages: {
                title: "7. Підтримка мов",
                content:
                  "Ми підтримуємо англійську, французьку, іспанську, арабську, російську, хінді та українську мови. Ця політика юридично обов’язкова лише англійською мовою.",
              },
              rights: {
                title: "8. Ваші права",
                intro: "Ви можете зв’язатися з нами, щоб:",
                items: [
                  "Запросити видалення вашого звіту (якщо він ще на сервері)",
                  "Отримати сесійну інформацію про оброблені дані",
                ],
                contact: "Напишіть нам: privacy@scorewise.ca",
              },
              updates: {
                title: "9. Оновлення",
                content:
                  "Ми опублікуємо всі майбутні зміни на цій сторінці. Подальше використання сервісу означає згоду з оновленими умовами.",
              },
            },
          },
          emptyData: "Даних не знайдено"
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
              signIn: "Iniciar sesión",
              signOut: "Cerrar sesión",
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
            planTitle: "Información básica",
            unlockButton: "Desbloquear recomendaciones personalizadas por $100",
            processingTime: "Tiempo de procesamiento: 2–3 minutos",
          },
          privacyPage: {
            title: "Política de Privacidad",
            effectiveDate: "Fecha de entrada en vigor: 13 de junio de 2025",
            intro:
              "SCOREWISE (https://www.scorewise.ca) se compromete a proteger su privacidad. Esta política describe cómo recopilamos, usamos y protegemos sus datos cuando utiliza nuestros servicios de análisis de informes crediticios.",
            sections: {
              whoWeAre: {
                title: "1. Quiénes somos",
                content:
                  "SCOREWISE es una plataforma canadiense de bienestar crediticio. Nuestros instrumentos analizan informes crediticios proporcionados por los usuarios para ofrecer recomendaciones y estrategias de mejora.",
              },
              whatWeCollect: {
                title: "2. Qué recopilamos",
                items: [
                  "Informes crediticios subidos (formato PDF de Equifax o TransUnion)",
                  "Metadatos del dispositivo, navegador e idioma",
                  "Interacciones del usuario para análisis basado en la sesión",
                ],
                note: "No recopilamos su nombre, SIN, datos bancarios o de dirección a menos que los proporcione explícitamente en el documento cargado.",
              },
              howWeUse: {
                title: "3. Cómo usamos sus datos",
                intro: "Su informe crediticio se analiza con IA para:",
                items: [
                  "Mostrar una vista previa de los elementos problemáticos",
                  "Generar cartas y estrategias de mejora (con compra)",
                  "Ofrecer ideas personalizadas — totalmente automatizado, sin intervención humana",
                ],
              },
              retention: {
                title: "4. Retención y eliminación",
                content:
                  "Los archivos subidos se eliminan automáticamente unos minutos después del análisis. No almacenamos sus datos a largo plazo ni guardamos copias.",
              },
              security: {
                title: "5. Medidas de seguridad",
                items: [
                  "Cifrado SSL para todas las transferencias de archivos",
                  "Procesamiento en servidores seguros canadienses",
                  "Sin scripts de seguimiento ni píxeles de marketing",
                ],
              },
              compliance: {
                title: "6. Cumplimiento canadiense",
                intro: "SCOREWISE cumple con:",
                items: [
                  "PIPEDA – Ley de Protección de Información Personal y Documentos Electrónicos",
                  "CASL – Ley Antispam de Canadá",
                ],
                note: "Este servicio está disponible exclusivamente para usuarios en Canadá.",
              },
              languages: {
                title: "7. Soporte de idiomas",
                content:
                  "Admitimos inglés, francés, español, árabe, ruso, hindi y ucraniano. Esta política es legalmente vinculante solo en inglés.",
              },
              rights: {
                title: "8. Sus derechos",
                intro: "Puede contactarnos en cualquier momento para:",
                items: [
                  "Solicitar la eliminación de su informe (si aún está en el servidor)",
                  "Acceder a un resumen de los datos procesados durante la sesión",
                ],
                contact: "Contáctenos: privacy@scorewise.ca",
              },
              updates: {
                title: "9. Actualizaciones",
                content:
                  "Publicaremos cualquier cambio futuro en esta página. El uso continuado del servicio implica la aceptación de los términos actualizados.",
              },
            },
          },
          emptyData: "No se encontraron datos"
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
              signIn: "Se connecter",
              signOut: "Se déconnecter",
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
            planTitle: "Aperçu de base",
            unlockButton: "Déverrouiller les conseils personnalisés pour 100 $",
            processingTime: "Temps de traitement : 2–3 minutes",
          },
          privacyPage: {
            title: "Politique de confidentialité",
            effectiveDate: "Date d'entrée en vigueur : 13 juin 2025",
            intro:
              "SCOREWISE (https://www.scorewise.ca) s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos données lors de l'utilisation de nos services d'analyse de rapports de crédit.",
            sections: {
              whoWeAre: {
                title: "1. Qui nous sommes",
                content:
                  "SCOREWISE est une plateforme canadienne de bien-être financier. Nos outils analysent les rapports de crédit fournis par les utilisateurs afin de proposer des stratégies d'amélioration.",
              },
              whatWeCollect: {
                title: "2. Ce que nous collectons",
                items: [
                  "Rapports de crédit téléchargés (format PDF d'Equifax ou TransUnion)",
                  "Métadonnées de l'appareil, du navigateur et de la langue",
                  "Interactions utilisateur pour analyse de session uniquement",
                ],
                note: "Nous ne collectons pas votre nom, SIN, coordonnées bancaires ou adresse, sauf si vous les fournissez dans le document téléchargé.",
              },
              howWeUse: {
                title: "3. Comment nous utilisons vos données",
                intro: "Votre rapport de crédit est analysé par l'IA pour :",
                items: [
                  "Afficher un aperçu des éléments problématiques",
                  "Générer des lettres et stratégies d'amélioration (après achat)",
                  "Offrir des recommandations personnalisées — entièrement automatisé, sans intervention humaine",
                ],
              },
              retention: {
                title: "4. Conservation et suppression",
                content:
                  "Les fichiers téléchargés sont supprimés automatiquement quelques minutes après l’analyse. Nous ne conservons aucune donnée à long terme ni copies.",
              },
              security: {
                title: "5. Mesures de sécurité",
                items: [
                  "Chiffrement SSL pour tous les transferts de fichiers",
                  "Traitement sur des serveurs canadiens sécurisés",
                  "Aucun script de suivi ou pixel marketing",
                ],
              },
              compliance: {
                title: "6. Conformité canadienne",
                intro: "SCOREWISE respecte :",
                items: [
                  "PIPEDA — Loi sur la protection des renseignements personnels et les documents électroniques",
                  "CASL — Loi canadienne anti-pourriel",
                ],
                note: "Ce service est exclusivement réservé aux utilisateurs canadiens.",
              },
              languages: {
                title: "7. Prise en charge des langues",
                content:
                  "Nous prenons en charge l’anglais, le français, l’espagnol, l’arabe, le russe, l’hindi et l’ukrainien. Cette politique n’a de valeur juridique qu’en anglais.",
              },
              rights: {
                title: "8. Vos droits",
                intro: "Vous pouvez nous contacter à tout moment pour :",
                items: [
                  "Demander la suppression de votre rapport (s’il est encore sur notre serveur)",
                  "Obtenir un résumé de session des données traitées",
                ],
                contact: "Contactez-nous à : privacy@scorewise.ca",
              },
              updates: {
                title: "9. Mises à jour",
                content:
                  "Toute modification future de cette politique sera publiée sur cette page. L'utilisation continue du service vaut acceptation des nouvelles conditions.",
              },
            },
          },
          emptyData: "Aucune donnée trouvée"
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
              signIn: "تسجيل الدخول",
              signOut: "تسجيل الخروج",
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
            planTitle: "رؤى أساسية",
            unlockButton: "افتح التوصيات المخصصة مقابل 100 دولار",
            processingTime: "مدة المعالجة: 2-3 دقائق",
          },
          privacyPage: {
            title: "سياسة الخصوصية",
            effectiveDate: "تاريخ السريان: 13 يونيو 2025",
            intro:
              "تلتزم SCOREWISE (https://www.scorewise.ca) بحماية خصوصيتك. توضح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها عند استخدامك لخدمات تحليل تقارير الائتمان الخاصة بنا.",
            sections: {
              whoWeAre: {
                title: "1. من نحن",
                content:
                  "SCOREWISE هي منصة كندية للعافية الائتمانية. تقوم أدواتنا بتحليل تقارير الائتمان المقدمة من المستخدمين لتقديم استراتيجيات ونصائح للتحسين.",
              },
              whatWeCollect: {
                title: "2. ما نقوم بجمعه",
                items: [
                  "تقارير الائتمان المحملة (بصيغة PDF من Equifax أو TransUnion)",
                  "بيانات الجهاز والمتصفح واللغة",
                  "تفاعلات المستخدم لتحليلها في الجلسة فقط",
                ],
                note: "نحن لا نجمع اسمك أو رقم التأمين الاجتماعي أو التفاصيل المصرفية أو عنوانك ما لم تقدمها أنت صراحة في المستند المرفوع.",
              },
              howWeUse: {
                title: "3. كيف نستخدم بياناتك",
                intro:
                  "يتم تحليل تقرير الائتمان الخاص بك باستخدام الذكاء الاصطناعي من أجل:",
                items: [
                  "عرض معاينة للعناصر الإشكالية",
                  "توليد رسائل واستراتيجيات تحسين (بعد الشراء)",
                  "تقديم رؤى مخصصة — بشكل آلي تمامًا دون تدخل بشري",
                ],
              },
              retention: {
                title: "4. الاحتفاظ والحذف",
                content:
                  "يتم حذف الملفات المحملة تلقائيًا خلال دقائق بعد التحليل. لا نقوم بتخزين بياناتك على المدى الطويل.",
              },
              security: {
                title: "5. تدابير الأمان",
                items: [
                  "تشفير SSL لجميع نقل الملفات",
                  "جميع المعالجات تتم على خوادم كندية آمنة",
                  "لا توجد برامج تتبع أو بكسلات تسويقية",
                ],
              },
              compliance: {
                title: "6. الامتثال الكندي",
                intro: "SCOREWISE تمتثل لما يلي:",
                items: [
                  "PIPEDA – قانون حماية المعلومات الشخصية والمستندات الإلكترونية",
                  "CASL – قانون مكافحة الرسائل المزعجة في كندا",
                ],
                note: "هذه الخدمة متاحة حصريًا للمستخدمين في كندا.",
              },
              languages: {
                title: "7. دعم اللغات",
                content:
                  "ندعم الإنجليزية والفرنسية والإسبانية والعربية والروسية والهندية والأوكرانية. هذه السياسة ملزمة قانونيًا باللغة الإنجليزية فقط.",
              },
              rights: {
                title: "8. حقوقك",
                intro: "يمكنك التواصل معنا في أي وقت لـ:",
                items: [
                  "طلب حذف تقريرك (إذا كان لا يزال على الخادم)",
                  "الحصول على ملخص بيانات الجلسة التي تمت معالجتها",
                ],
                contact: "راسلنا عبر: privacy@scorewise.ca",
              },
              updates: {
                title: "9. التحديثات",
                content:
                  "سننشر أي تغييرات مستقبلية في هذه الصفحة. استمرار استخدامك للخدمة يعني موافقتك على الشروط المحدثة.",
              },
            },
          },
          emptyData: "لم يتم العثور على بيانات"
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
              signIn: "साइन इन करें",
              signOut: "साइन आउट करें",
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
            planTitle: "बुनियादी जानकारियाँ",
            unlockButton: "$100 में व्यक्तिगत सलाह अनलॉक करें",
            processingTime: "प्रोसेसिंग समय: 2–3 मिनट",
          },
          privacyPage: {
            title: "गोपनीयता नीति",
            effectiveDate: "प्रभावी तिथि: 13 जून 2025",
            intro:
              "SCOREWISE (https://www.scorewise.ca) आपकी गोपनीयता की सुरक्षा के लिए प्रतिबद्ध है। यह नीति बताती है कि हम आपके डेटा को कैसे एकत्रित, उपयोग और सुरक्षित करते हैं जब आप हमारे क्रेडिट रिपोर्ट विश्लेषण सेवा का उपयोग करते हैं।",
            sections: {
              whoWeAre: {
                title: "1. हम कौन हैं",
                content:
                  "SCOREWISE एक कनाडाई क्रेडिट वेलनेस प्लेटफ़ॉर्म है। हमारे टूल्स उपयोगकर्ताओं द्वारा प्रदान की गई क्रेडिट रिपोर्ट्स का विश्लेषण करते हैं और सुधार रणनीतियाँ प्रदान करते हैं।",
              },
              whatWeCollect: {
                title: "2. हम क्या एकत्र करते हैं",
                items: [
                  "क्रेडिट रिपोर्ट्स (PDF फॉर्मेट में Equifax या TransUnion से)",
                  "डिवाइस, ब्राउज़र और भाषा की जानकारी",
                  "सेशन आधारित विश्लेषण के लिए उपयोगकर्ता की इंटरैक्शन",
                ],
                note: "जब तक आप स्पष्ट रूप से न दें, हम आपका नाम, SIN, बैंकिंग या पता संबंधी जानकारी एकत्र नहीं करते।",
              },
              howWeUse: {
                title: "3. हम आपके डेटा का उपयोग कैसे करते हैं",
                intro:
                  "आपकी क्रेडिट रिपोर्ट का विश्लेषण AI से किया जाता है ताकि:",
                items: [
                  "समस्यात्मक आइटम्स की पूर्वावलोकन दिखाया जा सके",
                  "सुधार पत्र और रणनीतियाँ उत्पन्न की जा सकें (खरीद के बाद)",
                  "व्यक्तिगत सुझाव प्रदान किए जा सकें — पूर्णतः स्वचालित, बिना मानवीय हस्तक्षेप के",
                ],
              },
              retention: {
                title: "4. संग्रहण और हटाना",
                content:
                  "अपलोड की गई फ़ाइलें विश्लेषण के कुछ ही मिनटों बाद स्वचालित रूप से हटा दी जाती हैं। हम डेटा को लंबे समय तक संग्रहित नहीं करते।",
              },
              security: {
                title: "5. सुरक्षा उपाय",
                items: [
                  "सभी फ़ाइल ट्रांसफ़र के लिए SSL एन्क्रिप्शन",
                  "सभी प्रोसेसिंग सुरक्षित कनाडाई सर्वरों पर होती है",
                  "कोई ट्रैकिंग स्क्रिप्ट या मार्केटिंग पिक्सेल नहीं हैं",
                ],
              },
              compliance: {
                title: "6. कनाडाई अनुपालन",
                intro: "SCOREWISE निम्नलिखित के अनुरूप है:",
                items: [
                  "PIPEDA – व्यक्तिगत जानकारी संरक्षण और इलेक्ट्रॉनिक दस्तावेज़ अधिनियम",
                  "CASL – कनाडा का एंटी-स्पैम कानून",
                ],
                note: "यह सेवा केवल कनाडा के उपयोगकर्ताओं के लिए उपलब्ध है।",
              },
              languages: {
                title: "7. भाषा समर्थन",
                content:
                  "हम अंग्रेज़ी, फ्रेंच, स्पेनिश, अरबी, रूसी, हिंदी और यूक्रेनी का समर्थन करते हैं। यह नीति केवल अंग्रेज़ी में कानूनी रूप से बाध्यकारी है।",
              },
              rights: {
                title: "8. आपके अधिकार",
                intro: "आप किसी भी समय हमसे संपर्क कर सकते हैं:",
                items: [
                  "अपनी रिपोर्ट हटवाने का अनुरोध करने के लिए (यदि यह अभी भी सर्वर पर है)",
                  "प्रोसेस किए गए डेटा का सेशन-आधारित सारांश प्राप्त करने के लिए",
                ],
                contact: "संपर्क करें: privacy@scorewise.ca",
              },
              updates: {
                title: "9. अपडेट्स",
                content:
                  "हम इस पृष्ठ पर भविष्य के किसी भी परिवर्तन को पोस्ट करेंगे। हमारी सेवा का निरंतर उपयोग इन शर्तों की स्वीकृति दर्शाता है।",
              },
            },
          },
          emptyData: "कोई डेटा नहीं मिला"
        },
      },
    },
    react: {
      wait: true,
    },
  });

export default i18n;
