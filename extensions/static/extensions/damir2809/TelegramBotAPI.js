// @name Telegram Bot API
// @description Расширение которое позволяет взаимодействовать с Telegram API.
// @thumbnail https://github.com/DBDev-git/TelegramBotAPI/blob/main/Thumbnail%20for%20Telegram%20Bot%20API%20extension%20by%20@AnonimKingNews.png?raw=true
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/768px-Telegram_2019_Logo.svg.png
// @id TelegramBotAPI
/* @authors
@DBDev_IT in Scratch @damir2809,
@Fedor_sushko in Scratch @scratch_craft_2,
@Grisshink in Scratch @ttt999,
@MEOW_MUR920 in Scratch @By-ROlil-CO,
@FXCHK404,
@AnonimKingNews in Scratch @AnonimKing24,
...
*/
// @version 3.4.1

(function (Scratch) {  
    'use strict';  

    if (!Scratch) throw new Error("Scratch API недоступен. Расширение Telegram Bot API невозиожно загрузить.");  

    if (!Scratch.extensions.unsandboxed) throw new Error("Для стабильной и правильной работы требуется режим без песочницы.");

    class TelegramBotAPIExtension {  
        constructor() {
            this.token = '';
            this.updates = [];
            this.offset = 0;
            this.pollingActive = false;
            this.pollingRunning = false;
            this.allUsers = new Set();
            this.recentUsers = [];
            this.maxRecentUsers = 10;
            this.lastCommand = "";
            this.inlineButtons = [];
            this.pollAnswers = [];
            this.dataBase = [];
        }

        getInfo() {  
            return {  
                id: 'TelegramBotAPI',  
                name: 'Telegram Bot API',  
                menuIconURI: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/768px-Telegram_2019_Logo.svg.png",
                docsURI: "https://github.com/DBDev-git/TelegramBotAPI",
                color1: '#0088CC',  
                color2: '#006699',  
                blocks: [  
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Инициализация бота"
                    },
                    {  
                        opcode: 'initBot',  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: 'инициализировать бота с токеном [TOKEN]',  
                        arguments: { TOKEN: { type: Scratch.ArgumentType.STRING, defaultValue: 'ТОКЕН_БОТА' } }  
                    },  
                    {  
                        opcode: 'startPolling',  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: 'начать поллинг каждые [SECONDS] сек',  
                        arguments: { SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 } }  
                    },  
                    {  
                        opcode: 'stopPolling',  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: 'остановить поллинг'  
                    },  
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Отправка сообщений"
                    },
                    {  
                        opcode: 'sendMessage',  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: 'отправить сообщение [TEXT] с форматированием [PARSE_MODE] в чат с ID [CHATID]',
                        arguments: {  
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Привет!'
                            },  
                            PARSE_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "PARSE_MODE_MENU"
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }  
                    }, 
                    {
                        opcode: "sendMessageWithInlineButtons",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "отправить сообщение [TEXT] с массивом кнопок [BUTTONS] -> JSON и с форматированием [PARSE_MODE] в чат с ID [CHATID]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            },
                            BUTTONS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[{"text": "Кнопка 1", "callback_data": "data_1"}, {"text": "Кнопка 2", "url": "https://example.com"}]'
                            },
                            PARSE_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "PARSE_MODE_MENU"
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "answerToMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "ответить [TEXT] на сообщение с ID [MESSAGEID] с форматированием [PARSE_MODE] в чате с ID [CHATID]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            },
                            MESSAGEID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PARSE_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "PARSE_MODE_MENU"
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "answerToMessageWithInlineButtons",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "ответить [TEXT] на сообщение с ID [MESSAGEID] с массивом кнопок [BUTTONS] -> JSON и с форматированием [PARSE_MODE] в чате с ID [CHATID]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            },
                            MESSAGEID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            BUTTONS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[{"text": "Кнопка 1", "callback_data": "data_1"}, {"text": "Кнопка 2", "url": "https://example.com"}]'
                            },
                            PARSE_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "PARSE_MODE_MENU"
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {  
                        opcode: "sendPhoto",  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: "отправить фото [URL] с текстом [TEXT] и форматированием [PARSE_MODE] в чат с ID [CHATID]",  
                        arguments: {  
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://example.com/photo.png"
                            },  
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            },
                            PARSE_MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "PARSE_MODE_MENU"
                            },
                            CHATID: { 
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }  
                        }  
                    },
                    {
                        opcode: "sendSticker",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "отправить стикер с ID [STICKERID] в чат с ID [CHATID]",
                        arguments: {
                            STICKERID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "CAACAgIAAxkBAAIT2Wfc4yJG7w8EJOBAI_Bhl2TjJNEQAAKZYQACxxxhSEMYJmeAkT6gNgQ"
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "sendPoll",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "отправить опрос с вопросом [QUESTION] и с массивом вариантов ответа [OPTIONS] с настройками [ISANONIM] и [ALLOWSMULTIPLE] в чат с ID [CHATID]",
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Опрос"
                            },
                            ISANONIM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "POLL_ISANONIM_MENU"
                            },
                            ALLOWSMULTIPLE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "POLL_ALLOWSMULTIPLE_MENU"
                            },
                            OPTIONS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '["1","2","3"]'
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "sendPayment",  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: "отправить покупку с названием [TITLE] и описанием [DESCRIPTION] и с токеном провайдера [PROVIDER_TOKEN] с валютой [CURRENCY] и ценой [PRICE] в чат с ID [CHATID]",  
                        arguments: {  
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Покупка"
                            },  
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Описание покупки"
                            },  
                            PROVIDER_TOKEN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },  
                            CURRENCY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "XTR"
                            },  
                            PRICE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                        },  
                    },
                    {
                        opcode: "editMessageText",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "изменить текст сообщения с ID [MESSAGEID] в чате с ID [CHATID] на [TEXT]",
                        arguments: {
                            MESSAGEID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            }
                        }
                    },
                    {
                        opcode: "deleteMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "удалить сообщение с ID [MESSAGEID] из чата с ID [CHATID]",
                        arguments: {
                            MESSAGEID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Изменение прав пользователей"
                    },
                    {
                        opcode: "kickUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "кикнуть пользователя с ID [USERID] в чате с ID [CHATID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "muteUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "замутить пользователя с ID [USERID] в чате с ID [CHATID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "unmuteUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "размутить пользователя с ID [USERID] в чате с ID [CHATID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "banUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "забанить пользователя с ID [USERID] в чате с ID [CHATID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        opcode: "unbanUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "разбанить пользователя с ID [USERID] в чате с ID [CHATID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Реакции"
                    },
                    {
                        opcode: "setReaction",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "поставить реакцию [REACTION] на сообщение с ID [MESSAGEID] в чате с ID [CHATID]",
                        arguments: {
                            REACTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "REACTION_MENU"
                            },
                            MESSAGEID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            CHATID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 123456789
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Массивы"
                    },
                    {
                        opcode: "addInlineButtonToInlineButtonsArray",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "добавить кнопку с текстом [TEXT] и типом [TYPE] с данными [DATA] в массив кнопок",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Кнопка 1"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "INLINE_BUTTONS_ARRAY_TYPE_MENU",
                            },
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "data_1"
                            }
                        }
                    },
                    {
                        opcode: "addPollAnswerToPollAnswersArray",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "добавить вариант ответа с текстом [TEXT] в массив вариантов ответа",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Вариант 1"
                            }
                        }
                    },
                    {
                        opcode: "clearArray",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "очистить массив [CLEAR_ARRAY]",
                        arguments: {
                            CLEAR_ARRAY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "CLEAR_ARRAY_MENU"
                            }
                        }
                    },
                    {
                        opcode: "getArray",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "массив [ARRAY]",
                        arguments: {
                            ARRAY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "ARRAY_MENU"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "База данных"
                    },
                    {
                        opcode: "getDataBase",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "база данных"
                    },
                    {
                        opcode: "createDataBaseTable",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "создать таблицу в базе данных с названием [TABLENAME] и с параметрами [PARAMETERS]",
                        arguments: {
                            TABLENAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "User"
                            },
                            PARAMETERS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "tg_id, coins"
                            },
                        }
                    },
                    {
                        opcode: "addDataBaseRecord",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "добавить запись в таблицу [TABLENAME] с параметрами [PARAMETERS] и значениями [VALUES]",
                        arguments: {
                            TABLENAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "User"
                            },
                            PARAMETERS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "tg_id, coins"
                            },
                            VALUES: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "12345, 100"
                            }
                        }
                    },
                    {
                        opcode: "updateDataBaseRecord",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "обновить запись в таблице [TABLENAME] где [KEY] равно [VALUE] с параметрами [PARAMETERS] и значениями [VALUES]",
                        arguments: {
                            TABLENAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "User"
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "tg_id"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "12345"
                            },
                            PARAMETERS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "coins"
                            },
                            VALUES: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "200"
                            }
                        }
                    },
                    {
                        opcode: "deleteDataBaseRecord",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "удалить запись из таблицы [TABLENAME] где [KEY] равно [VALUE]",
                        arguments: {
                            TABLENAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "User"
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "tg_id"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "12345"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Получение обновлений"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "1. Сообщения"
                    },
                    {  
                        opcode: 'getMessage',  
                        blockType: Scratch.BlockType.REPORTER,  
                        text: "получить [GETMESSAGE_TYPE] последнего сообщения",
                        arguments: {
                            GETMESSAGE_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "GETMESSAGE_TYPE_MENU"
                            }
                        }
                    }, 
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "2. Коллбэки"
                    },
                    {
                        opcode: "getCallback",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "получить [GETCALLBACK_TYPE] коллбэка",
                        arguments: {
                            GETCALLBACK_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "GETCALLBACK_TYPE_MENU"
                            }
                        }
                    },
                    {
                        opcode: "answerToCallback",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "ответить на коллбэк с ID [ID] с типом [TYPE] и текстом [TEXT]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1000000000
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "CALLBACK_ANSWER_TYPE_MENU",
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Привет!"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "3. Проверка на обновления"
                    },
                    {  
                        opcode: 'hasNewMessages',  
                        blockType: Scratch.BlockType.BOOLEAN,  
                        text: 'есть новые сообщения?'  
                    },  
                    {  
                        opcode: 'isMessageStartsWith',  
                        blockType: Scratch.BlockType.BOOLEAN,  
                        text: 'последнее сообщение - начинается с [TEXT]?',  
                        arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '/start' } }  
                    },  
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Пользователи"
                    },
                    {  
                        opcode: 'getAllUsers',  
                        blockType: Scratch.BlockType.REPORTER,  
                        text: 'получить всех пользователей'  
                    },  
                    {  
                        opcode: 'getRecentUsers',  
                        blockType: Scratch.BlockType.REPORTER,  
                        text: 'получить последних пользователей'  
                    },  
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Обновления"
                    },
                    {
                        opcode: "whenNewUpdate",
                        blockType: Scratch.BlockType.HAT,
                        text: "когда получено новое обновление"
                    },
                    {  
                        opcode: 'clearUpdates',  
                        blockType: Scratch.BlockType.COMMAND,  
                        text: 'очистить обновления'  
                    },  
                ],  
                menus: {
                    PARSE_MODE_MENU: {
                        acceptReporters: false,
                        items: ["нет", "Markdown", "HTML"]
                    },
                    INLINE_BUTTONS_ARRAY_TYPE_MENU: {
                        acceptReporters: false,
                        items: ["данные", "ссылка"]
                    },
                    CALLBACK_ANSWER_TYPE_MENU: {
                        acceptReporters: false,
                        items: ["уведомление", "предупреждение"]
                    },
                    GETMESSAGE_TYPE_MENU: {
                        acceptReporters: false,
                        items: ["текст", "ID", "ID чата", "команду", "имя пользователя", "ID пользователя", "ID стикера"]
                    },
                    GETCALLBACK_TYPE_MENU: {
                        acceptReporters: false,
                        items: ["данные", "ID", "ID чата", "имя пользователя", "ID пользователя"]
                    },
                    POLL_ISANONIM_MENU: {
                        acceptReporters: false,
                        items: ["анонимный", "не анонимный"]
                    },
                    POLL_ALLOWSMULTIPLE_MENU: {
                        acceptReporters: false,
                        items: ["поддерживающий несколько ответов", "не поддерживающий несколько ответов"]
                    },

                    REACTION_MENU: {
                        acceptReporters: false,
                        items: ["👍", "👎", "❤", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡"]
                    },
                    CLEAR_ARRAY_MENU: {
                        acceptReporters: false,
                        items: ["инлайн-кнопок", "вариантов ответа"]
                    },
                    ARRAY_MENU: {
                        acceptReporters: false,
                        items: ["инлайн-кнопок", "вариантов ответа"]
                    }
                }
            };  
        }  

        resetBot(args) {
            this.token = args.TOKEN;
            this.updates = [];
            this.offset = 0;
            this.allUsers = new Set();
            this.recentUsers = [];
            this.lastCommand = "";
        }

        initBot(args) {
            this.pollingActive = false;

            return new Promise((resolve, _) => {
                const checkPoll = () => {
                    if (this.pollingRunning) {
                        setTimeout(checkPoll, 100);
                        return;
                    }
                    this.resetBot(args);
                    resolve();
                };
                checkPoll();
            });
        }

        startPolling(args) {
            if (!this.token || this.pollingActive || this.pollingRunning) return;
            const poll = () => {
                this.pollingRunning = true;
                const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${this.offset}`;
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.ok && data.result.length > 0) {
                            this.updates = data.result;
                            this.offset = this.updates[this.updates.length - 1].update_id + 1;
                            this._updateUsers();
                        }
                        if (!this.pollingActive) {
                            this.pollingRunning = false;
                            return;
                        }
                        setTimeout(poll, args.SECONDS * 1000);
                    })
                    .catch(error => {
                        if (!this.pollingActive) {
                            this.pollingRunning = false;
                            return;
                        }
                        console.error('Ошибка поллинга:', error);
                        setTimeout(poll, args.SECONDS * 1000);
                    });
            };
            this.pollingActive = true;
            poll();
        }

        stopPolling() {
            this.pollingActive = false;
        }

        async sendMessage(args) {  
            if (!this.token) return;  
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;  
            if (args.PARSE_MODE === "нет") {
                await fetch(url, {  
                    method: 'POST',  
                    headers: { 
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({
                        chat_id: args.CHATID,
                        text: args.TEXT,
                    })  
                }).catch(error => console.error("Ошибка отправки сообщения:", error));
                return;
            }
            await fetch(url, {  
                method: 'POST',  
                headers: {  
                    "Content-Type": "application/json",  
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    text: args.TEXT,
                    parse_mode: args.PARSE_MODE
                })  
            }).catch(error => console.error("Ошибка отправки сообщения:", error));  
        }  

        async sendMessageWithInlineButtons(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
            if (args.PARSE_MODE === "нет") {
                await fetch(url, {  
                    method: 'POST',  
                    headers: {  
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({
                        chat_id: args.CHATID,
                        text: args.TEXT,
                    })  
                }).catch(error => console.error("Ошибка отправки сообщения:", error));
                return;
            }
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    text: args.TEXT,
                    parse_mode: args.PARSE_MODE,
                    reply_markup: {
                        "inline_keyboard": [
                            JSON.parse(args.BUTTONS)
                        ]
                    }
                })
            }).catch(error => console.error("Ошибка отправки сообщения с инлайн-кнопками:", error));
        }

        async answerToMessage(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
            if (args.PARSE_MODE === "нет") {
                await fetch(url, {  
                    method: 'POST',  
                    headers: {  
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({
                        chat_id: args.CHATID,
                        text: args.TEXT,
                    })  
                }).catch(error => console.error("Ошибка отправки сообщения:", error));
                return;
            }
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    text: args.TEXT,
                    parse_mode: args.PARSE_MODE,
                    reply_to_message_id: args.MESSAGEID
                })
            }).catch(error => console.error("Ошибка отправки сообщения:", error));
        }

        async answerToMessageWithInlineButtons(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
            if (args.PARSE_MODE === "нет") {
                await fetch(url, {  
                    method: 'POST',  
                    headers: {  
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({
                        chat_id: args.CHATID,
                        text: args.TEXT,
                    })  
                }).catch(error => console.error("Ошибка отправки сообщения:", error));
                return;
            }
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    text: args.TEXT,
                    parse_mode: args.PARSE_MODE,
                    reply_to_message_id: args.MESSAGEID,
                    reply_markup: {
                        "inline_keyboard": [
                            JSON.parse(args.BUTTONS)
                        ]
                    }
                })
            }).catch(error => console.error("Ошибка ответа на сообщение с инлайн-кнопками:", error));
        }

        async sendPhoto(args) {  
            if (!this.token) return;  
            const url = `https://api.telegram.org/bot${this.token}/sendPhoto`;  
            if (args.PARSE_MODE === "нет") {
                await fetch(url, {  
                    method: 'POST',  
                    headers: {  
                        "Content-Type": "application/json",  
                    },  
                    body: JSON.stringify({
                        chat_id: args.CHATID,
                        caption: args.TEXT,
                    })  
                }).catch(error => console.error("Ошибка отправки сообщения:", error));
                return;
            }
            await fetch(url, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    text: args.TEXT,
                    parse_mode: args.PARSE_MODE,
                    photo: args.URL
                })  
            }).catch(error => console.error("Ошибка отправки фото:", error));  
        }  

        async sendSticker(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/sendSticker`;
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    sticker: args.STICKERID
                })
            }).catch(error => console.error("Ошибка отправки стикера:", error));
        }

        async sendPoll(args) {  
            if (!this.token) return;  
            const url = `https://api.telegram.org/bot${this.token}/sendPoll`;  
            if (args.ISANONIM === "аномимный") {
                if (args.ALLOWSMULTIPLE === "не поддерживающий несколько ответов") {
                    await fetch(url, {  
                        method: 'POST',  
                        headers: {  
                            'Content-Type': 'application/json',
                        },  
                        body: JSON.stringify({
                            chat_id: args.CHATID,
                            question: args.QUESTION,
                            options: JSON.parse(args.OPTIONS),
                            is_anonymous: true,
                            allows_multiple_answers: true
                        })  
                    }).catch(error => console.error('Ошибка отправки опроса:', error));  
                } else {
                    await fetch(url, {  
                        method: 'POST',  
                        headers: {  
                            'Content-Type': 'application/json',
                        },  
                        body: JSON.stringify({
                            chat_id: args.CHATID,
                            question: args.QUESTION,
                            options: JSON.parse(args.OPTIONS),
                            is_anonymous: true,
                            allows_multiple_answers: false
                        })  
                    }).catch(error => console.error('Ошибка отправки опроса:', error));  
                }
            } else {
                if (args.ALLOWSMULTIPLE === "поддерживающий несколько ответов") {
                    await fetch(url, {  
                        method: 'POST',  
                        headers: {  
                            'Content-Type': 'application/json',
                        },  
                        body: JSON.stringify({
                            chat_id: args.CHATID,
                            question: args.QUESTION,
                            options: JSON.parse(args.OPTIONS),
                            is_anonymous: false,
                            allows_multiple_answers: true
                        })  
                    }).catch(error => console.error('Ошибка отправки опроса:', error));  
                } else {
                    await fetch(url, {  
                        method: 'POST',  
                        headers: {  
                            'Content-Type': 'application/json',
                        },  
                        body: JSON.stringify({
                            chat_id: args.CHATID,
                            question: args.QUESTION,
                            options: JSON.parse(args.OPTIONS),
                            is_anonymous: false,
                            allows_multiple_answers: false
                        })  
                    }).catch(error => console.error('Ошибка отправки опроса:', error));  
                }
            }
        }

        async sendPayment(args) {  
            if (!this.token) return;  
            const url = `https://api.telegram.org/bot${this.token}/sendInvoice`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    title: args.TITLE,  
                    description: args.DESCRIPTION,  
                    payload: "payment_" + Date.now(),  
                    provider_token: args.PROVIDER_TOKEN,  
                    currency: args.CURRENCY,  
                    prices: [
                        {
                            "label": `buying_${Date.now()}`,
                            "amount": args.PRICES
                        }
                    ]
                })  
            }).catch(error => console.error('Ошибка отправки покупки:', error));  
        }

        async editMessageText(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/editMessageText`;
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    message_id: args.MESSAGEID,
                    text: args.TEXT
                })
            }).catch(error => console.error("Ошибка редактирования сообщения:", error));
        }

        async deleteMessage(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/deleteMessage`;
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: args.CHATID,
                    message_id: args.MESSAGEID
                })
            }).catch(error => console.error("Ошибка удаления сообщения:", error));
        }

        async kickUser(args) {  
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/kickChatMember`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    user_id: args.USERID,
                })
            }).catch(error => console.error("Ошибка кика пользователя:", error));
        }  

        async muteUser(args) {  
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/restrictChatMember`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    user_id: args.USERID,  
                    permissions: {
                        can_send_messages: false
                    },  
                })
            }).catch(error => console.error("Ошибка мута пользователя:", error));
        }  

        async unmuteUser(args) {  
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/restrictChatMember`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    user_id: args.USERID,  
                    permissions: {
                        can_send_messages: true
                    },
                })
            }).catch(error => console.error("Ошибка унмута пользователя:", error));
        }  

        async banUser(args) {  
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/banChatMember`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    user_id: args.USERID
                })
            }).catch(error => console.error("Ошибка бана пользователя:", error));
        }  

        async unbanUser(args) {  
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/unbanChatMember`;  
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    chat_id: args.CHATID,  
                    user_id: args.USERID
                })
            }).catch(error => console.error("Ошибка унбана пользователя:", error));
        }  

        async setReaction(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/setMessageReaction`;  
            const reaction = [
                {
                    type: "emoji",
                    emoji: args.REACTION
                }
            ];
            await fetch(url, {  
                method: 'POST',  
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    message_id: args.MESSAGEID,
                    chat_id: args.CHATID,
                    reaction: JSON.stringify(reaction)
                })
            }).catch(error => console.error("Ошибка поставки реакции:", error));
        }

        addInlineButtonToInlineButtonsArray(args) {
            if (args.TYPE === "данные") {
                this.inlineButtons.push({"text": args.TEXT, "callback_data": args.DATA});
            } else if (args.TYPE === "ссылка") {
                this.inlineButtons.push({"text": args.TEXT, "url": args.DATA});
            }
        }

        addPollAnswerToPollAnswersArray(args) {
            this.pollAnswers.push(args.TEXT);
        }

        clearArray(args) {
            if (args.CLEAR_ARRAY == "инлайн-кнопок") this.inlineButtons = [];
            if (args.CLEAR_ARRAY == "вариантов ответа") this.pollAnswers = [];
        }

        getArray(args) {
            if (args.ARRAY == "инлайн-кнопок") return JSON.stringify(this.inlineButtons);
            if (args.ARRAY == "вариантов ответа") return JSON.stringify(this.pollAnswers);
        }

        getDataBase() {
            return JSON.stringify(this.dataBase);
        }

        createDataBaseTable(args) {
            this.dataBase.push({
                name: args.TABLENAME,
                parameters: args.PARAMETERS.split(',').map(param => param.trim()),
                objects: []
            });
        }

        addDataBaseRecord(args) {
            const table = this.dataBase.find(table => table.name === args.TABLENAME);
            if (table) {
                const values = args.VALUES.split(',').map(value => value.trim());
                const record = {};
                table.parameters.forEach((param, index) => {
                    record[param] = values[index];
                });
                table.objects.push(record);
            }
        }

        updateDataBaseRecord(args) {
            const table = this.dataBase.find(table => table.name === args.TABLENAME);
            if (table) {
                const record = table.objects.find(record => record[args.KEY] === args.VALUE);
                if (record) {
                    const values = args.VALUES.split(',').map(value => value.trim());
                    table.parameters.forEach((param, index) => {
                        if (values[index] !== undefined) {
                            record[param] = values[index];
                        }
                    });
                }
            }
        }

        deleteDataBaseRecord(args) {
            const table = this.dataBase.find(table => table.name === args.TABLENAME);
            if (table) {
                table.objects = table.objects.filter(record => record[args.KEY] !== args.VALUE);
            }
        }

        getMessage(args) {  
            if (args.GETMESSAGE_TYPE === "текст") {
                if (this.updates.length === 0) return '';  
                const lastUpdate = this.updates[this.updates.length - 1];  
                return lastUpdate.message ? lastUpdate.message.text || '' : '';  
            } else if (args.GETMESSAGE_TYPE === "ID") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.message ? lastUpdate.message.message_id.toString() : "";
            } else if (args.GETMESSAGE_TYPE === "ID чата") {
                if (this.updates.length === 0) return '';  
                const lastUpdate = this.updates[this.updates.length - 1];  
                return lastUpdate.message ? lastUpdate.message.chat.id.toString() : '';  
            } else if (args.GETMESSAGE_TYPE === "команду") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                const text = lastUpdate.message ? lastUpdate.message.text || "" : "";
                if (text.startsWith("/")) this.lastCommand = text.split(" ")[0];
                return this.lastCommand;
            } else if (args.GETMESSAGE_TYPE === "ID стикера") {
                if (this.updates.length === 0) return '';
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.message && lastUpdate.message.sticker ? lastUpdate.message.sticker.file_id : '';
            } else if (args.GETMESSAGE_TYPE === "имя пользователя") {
                if (this.updates.length === 0) return '';  
                const lastUpdate = this.updates[this.updates.length - 1];  
                return lastUpdate.message && lastUpdate.message.from ? lastUpdate.message.from.username || '' : '';  
            } else if (args.GETMESSAGE_TYPE === "ID пользователя") {
                if (this.updates.length === 0) return '';  
                const lastUpdate = this.updates[this.updates.length - 1];  
                return lastUpdate.message && lastUpdate.message.from ? lastUpdate.message.from.id || '' : ''; 
            }
        }  

        getCallback(args) {
            if (args.GETCALLBACK_TYPE === "данные") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.callback_query ? lastUpdate.callback_query.data || "" : "";
            } else if (args.GETCALLBACK_TYPE === "ID") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.callback_query ? lastUpdate.callback_query.id : "";
            } else if (args.GETCALLBACK_TYPE === "ID чата") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.callback_query ? lastUpdate.callback_query.message.chat.id.toString() : "";
            } else if (args.GETCALLBACK_TYPE === "имя пользователя") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.callback_query && lastUpdate.callback_query.from ? lastUpdate.callback_query.from.username || "" : "";
            } else if (args.GETCALLBACK_TYPE === "ID пользователя") {
                if (this.updates.length === 0) return "";
                const lastUpdate = this.updates[this.updates.length - 1];
                return lastUpdate.callback_query && lastUpdate.callback_query.from ? lastUpdate.callback_query.from.id || "" : "";
            }
        }

        async answerToCallback(args) {
            if (!this.token) return;
            const url = `https://api.telegram.org/bot${this.token}/answerCallbackQuery`;
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    callback_query_id: args.ID,
                    text: args.TEXT,
                    show_alert: args.TYPE === "предупреждение"
                })
            }).catch(error => console.error("Ошибка ответа на коллбэк:", error));
        }

        hasNewMessages() {  
            return this.updates.length > 0;  
        }  

        isMessageStartsWith(args) {  
            if (this.updates.length === 0) return false;
            const lastUpdate = this.updates[this.updates.length - 1];
            const text = lastUpdate.message ? lastUpdate.message.text || "" : "";
            return text.startsWith(args.TEXT);
        }  

        getAllUsers() {  
            return Array.from(this.allUsers).join('; ');  
        }  

        getRecentUsers() {  
            return this.recentUsers.map(user => `${user.chatId}: ${user.username}`).join('; ');  
        }  

        whenNewUpdate() {
            return this.updates.length > 0;
        }

        async clearUpdates() {
            return new Promise(resolve => {  
                this.updates = [];
                this.lastCommand = "";
                resolve();
            });
        }  

        async _updateUsers() {  
            this.updates.forEach(update => {
                if (update.message && update.message.from) {
                    const user = {
                        chatId: update.message.chat.id.toString(),
                        username: update.message.from.username || update.message.from.first_name || "Неизвестный"
                    };
                    const userKey = `${user.chatId}:${user.username}`;
                    if (!this.allUsers.has(userKey)) {
                        this.allUsers.add(userKey);
                    }
                    this.recentUsers.push(user);
                    if (this.recentUsers.length > this.maxRecentUsers) {
                        this.recentUsers.shift();
                    }
                }
            });  
        }
    }  
 
  
    Scratch.extensions.register(new TelegramBotAPIExtension());  
})(Scratch);  