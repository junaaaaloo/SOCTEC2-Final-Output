/* SOUND */
var rainsound;
var bgsound;
var buttonsound;

/* GAME FRAMES */
var tutorial;
var office;
var home_main;
var garden;
var road;
var home_kitchen;
var home_final;

/* GAME FRAMES LIST */
var frames;

/* GAME FRAMES SPECIFIER */
var tutorial_specifier = "tutorial";
var office_specifier = "office";
var home_main_specifier = "home-main";
var garden_specifier = "garden";
var road_specifier = "road";
var home_kitchen_specifier = "home-kitchen";
var home_final_specifier = "home-final";

/* BUTTONS */
var startgame;
var start;
var about;
var tools;
var giveup;
var notebook;

/* GAME VARIABLES */
var option_open = false;
var time = 0;
var toolsOfUser = [];
var allItems = [];
var timerInterval;

var detective = "Jeff Hancock";
var charmain = "Zane McMullin";
var char1 = "Chester Smith";
var char2 = "Xander Waden";
var char3 = "Mark Sue";
var char4 = "Philip Speer";
var wife = "Heather McMullin";
var husband = "John McMullin";
var playerName = "";

function Chat (image, content, name) {
    this.image = image;
    this.content = content;
    this.name = name;
}

var mute = [false, false];

/* PATH DIRS */
var char1_idle =  ('res/characters/char1-idle.png');
var char1_talking = ('res/characters/char1-talking.png');
var char2_idle = ('res/characters/char2-idle.png');
var char2_talking = ('res/characters/char2-talking.png');
var char3_talking = ('res/characters/char3-talking.png');
var char4_idle = ('res/characters/char4-idle.png');
var char4_talking = ('res/characters/char4-talking.png');
var charmain_ = ('res/characters/charmain-.png');
var charmain_laughing = ('res/characters/charmain-laughing.png');
var charmain_talking = ('res/characters/charmain-talking.png');
var detective_happy = ('res/characters/detective-happy.png');
var detective_idle = ('res/characters/detective-idle.png');
var detective_talking = ('res/characters/detective-talking.png');
var husband_angry = ('res/characters/husband-angry.png');
var husband_idle = ('res/characters/husband-idle.png');
var husband_sad = ('res/characters/husband-sad.png');
var husband_talking = ('res/characters/husband-talking.png');
var wife_angry = ('res/characters/wife-angry.png');
var wife_idle = ('res/characters/wife-idle.png');
var wife_sad = ('res/characters/wife-sad.png');
var wife_talking = ('res/characters/wife-talking.png');

/* ITEMS */
var file;
var note1;
var textmessage;
var note2;
var phonecall;
var note3;
var kitchennote;

$(function () {
    
    /* BUTTON */
    startgame = document.getElementById('start-game');
    start = document.getElementById('start');
    about = document.getElementById('about');
    tools = document.getElementById('tools');
    notebook = document.getElementById('notebook');
    objectives =  document.getElementById('objectives');
    giveup = document.getElementById('giveup');
    
    file = document.getElementById('file');
    note1 = document.getElementById('note1-file');
    textmessage = document.getElementById('textmessage');
    note2 = document.getElementById('note2-file');
    phonecall = document.getElementById('phonecall');
    note3 = document.getElementById('note3-file');
    kitchennote = document.getElementById('final-note');
    
    /* AUDIO */
    rainsound = document.getElementById('rain-audio');
    bgsound = document.getElementById('bg-audio');
    buttonclick = document.getElementById('button-audio');
    
    /* FRAMES */
    tutorial = document.getElementById(tutorial_specifier);
    office = document.getElementById(office_specifier);
    home_main = document.getElementById(home_main_specifier);
    garden = document.getElementById(garden_specifier);
    road = document.getElementById(road_specifier);
    home_kitchen = document.getElementById(home_kitchen_specifier);
    home_final = document.getElementById(home_final_specifier);

    frames = [];
    frames.push(tutorial);
    frames.push(office);
    frames.push(home_main);
    frames.push(garden);
    frames.push(road);
    frames.push(home_kitchen);
    frames.push(home_final);
    
    
    $(startgame).hide();
    
    /* CONTENT SET UP */
    $('#main').hide();
    
    $('.file-name').html("Name: " + charmain);
    $('.about-container').hide();
    $('#options').hide();
    $('.objectives-container').hide();
    $('.item-container').hide();
    
    rainsound.volume = 0.25;
    buttonclick.volume = 0.5;
    bgsound.volume = 0.5;    
    
    $('#close-btn').hide();
    
    /* EVENTS */
    $('button').click(function() {
        buttonclick.play();
    });
    
    $('#options-trigger').click(function() {
        $('#options').fadeToggle();
        if(option_open) {
            $('#close-btn').fadeOut(function(){
                $('#options-btn').fadeIn();
            });
            
            $('#options-trigger span').html('Options');
        } else {
             $('#options-btn').fadeOut(function(){
                $('#close-btn').fadeIn();
            });
            
            $('#options-trigger span').html('Close');
        }
        
        option_open = !option_open;
    });
    
    $('#close-file').click(function(){
        $('.item-container').slideUp(); 
    });
    
    $(startgame).click(function() {
        initOffice();
        visibleFrame(office);
        tick();
        rainsound.pause();
        mute[1] = true;
    });
    
    $(giveup).click(function() {
        $('#main').fadeOut(function(){
            $('.main-menu').fadeIn(function() {
                reset();
                mute[1] = false;
                rainsound.play();
            });
        });
    });
    
    $('#playerName').on('input', function(){
        playerName = $('#playerName').val()
        if(playerName.trim() != "")
            $(startgame).show();
        else
            $(startgame).hide();
    });
    
    $(about).click(aboutVisible);
    $(start).click(game);

    lock();
    $('#close-file').click(function(){
        $('.item-container').slideUp(); 
    });

    visibleItem('none');
    $('#item-main-container').hide();
    $('.notebook-container').hide();
    $('.objectives-container').hide();

    $('#objectives').click(function(){
        $('.objectives-container').slideToggle();
    });

    $('#tools').click(function(){
        $('#item-main-container').slideToggle();
    });

    $('#notebook').click(function(){
        $('.notebook-container').slideToggle();
    })

    $('.item-button').click(function(){
       var id = $(this).attr('data-openid'); 
        $('#item-main-container').slideUp(function(){
            visibleItem(id);
        });
    });
    
    /* AUDIO PLAY */
    bgsound.play();
    rainsound.play();
});

/* UTILITITES */
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


/* SETTING VISIBILITIES */
function aboutVisible () {
    $('.main-menu').fadeOut(function () {
        $('.about-container').fadeIn();
    });
}

function startVisible () {
    $('.about-container').fadeOut(function() {
        $('.main-menu').fadeIn();
    });
}

function game () {
    $('.main-menu').fadeOut(function () {
        visibleFrame(tutorial, function(){
            reset();
            objectives.disabled = true;
            tools.disabled = true;
            notebook.disabled = true;
            $('#main').fadeIn();
        });
    });
}


/* GAME FUNCTIONS */
function reset () {
    if(timerInterval != null)
        clearInterval(timerInterval);
    toolsOfUser = [];
    time = 0;
    lock();
    $('.ingame-field').val("");
    document.getElementById('time').innerHTML = "Time " + pad(0, 2) + ":" + pad(0, 2) + ":" + pad(0, 2)

}

function volumeBG () {
    bgsound.volume = $('#bg').val() * 0.01;
    rainsound.volume = $('#bg').val() * 0.005;
    
    if($('#bg').val() == 0) {
        bgsound.pause();
        rainsound.pause();
    } else {
        if(!mute[0])
            bgsound.play();
        if(!mute[1])
            rainsound.play(); 
    }
}

function volumeSFX () {
    buttonclick.volume = $('#sfx').val() * 0.01;
    
    if($('#sfx').val() == 0) {
        buttonclick.pause();
    } else {
        buttonclick.play();
    }
}


function visibleFrame (visible, func) {
    func = func || null;
    frames.forEach(function(item, index){
        $(item).hide();
    });
    
    if(func == null)
        $(visible).fadeIn();
    else 
        $(visible).fadeIn(func);
}

function visibleItem (item) {
    $('.item').each(function(index, it) {
        $(it).hide();    
    });
        
    $(item).show(function(){
        $('.item-container').slideDown();
    });
}

function tick () {
    timerInterval = setInterval(function() {
        var seconds = time % 60;
        var minutes = parseInt(time/60);
        var hours = parseInt(time/(60*60));
        time += 1;

        document.getElementById('time').innerHTML = "Time " + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2)
    }, 1000);
}

function pushChat (chatbox, chat) {
    $(chatbox + ' .chat-name').html(chat.name);
    $(chatbox + ' img').attr('src', chat.image);
    $(chatbox + ' .chat-content').html(chat.content);
}

function pushGame (gameinfo, message) {
    $(gameinfo).html(message);
}

function pushReal (realinfo, message) {
    $(realinfo).html(message);
}

function pushNotebook(message) {
    var docu = document.createElement('div');
    $(docu).addClass('real-info');
    $(docu).html(message);
    $('.notebook-container .main').append(docu);
}

function pushObjective(message) {
    var docu = document.createElement('div');
    $(docu).addClass('game-info');
    $(docu).html(message)
    $('.objectives-container .main').append(docu);
}

function lock() {
    $("#file-btn").hide();
    $("#note1-btn").hide();
    $("#textmess-btn").hide();
    $("#note2-btn").hide();
    $("#phone-call-btn").hide();
    $("#note3-btn").hide();
    $("#note4-btn").hide();
}

function initOffice () {
    i = 0;
    x = 0;

    $('#office .chatbox').show();
    $('#office .game-info').hide();
    $('#office .real-info').hide();
    $('.location').html("Office");
    
    objectives.disabled = false;
    tools.disabled = false;
    notebook.disabled = false;
    
    var detectiveMessages = [
        "Hello.",
        "I'm Senior Detective Jeff Hancock of the SLDU Investigation Firm. I'm expecting great things from you, "+playerName+".", 
        "As your first job, we are going to investigate a case of a missing person. His name is " +charmain+". Here read the file.", "READFILE", 
        "You can read the file again in your <span class = 'underline'> items</span>  if you want to.",
        "Don't mess this up. I'm counting on you. Go to their house, the address is in the file.",
        "What do you mean you can't read their address in the file? Of course the address there is valid. AGAIN, don't mess up if you want to stay. I'm leaving now."
    ];
    
    var gameInfo = [
        "Seems like I'm in trouble!",
        "Well, there really wasn't any real address on the case file, right?",
        "READFILE",
        "Hmmm, I think the address is decoded. I should look for clues in this office.",
        "HIDE",
        "VIEWNOTE",
        "This seems like a clue.",
        "I think I know how to decode this."
    ];
    
    var gameInfo2 = [
        "Yes, I got it!",
        "It's Mckinley Road, Gotham City. I'd better get going there."
    ]
    
    var realInfo = ["Have you read the clue?"]
                    
    $('#office .chatbox .chat-name').html(detective);
    var i = 0;
    
    $('#office .chatbox img').attr('src', detective_talking);
    $('#office .chatbox .chat-content').html(detectiveMessages[i]);
    i += 1;
    
    $('#office .decode').hide();
    
    $('#office .chatbox').click(function(){
        if(detectiveMessages[i] == "READFILE") {
            visibleItem(file);
            $('#file-btn').show();
        } else if (detectiveMessages.length == i) {
            $('#office .chatbox').slideUp(1000, function(){
                $('#office .game-info').slideDown();
                $('#office .game-info').html(gameInfo[0]);
                pushObjective("Find clues for the address in the office. HINT: There seems to be papers around here...");
                i = 0;
            });   
        } else {
            $('#office .chatbox img').attr('src', detective_talking);
            $('#office .chatbox .chat-content').html(detectiveMessages[i]);
        }
        
        i += 1;
    });
    
    $('#office .game-info').click(function(){
        if(gameInfo[i] == "READFILE") {
            visibleItem(file);
        } else if (gameInfo[i] == "HIDE") {
            $('#office .game-info').slideUp();
            $('#note1').click(function(){
                $('#office .game-info').html("What's this?");
                $('#office .game-info').slideDown(function(){
                    pushObjective('Decode the address.');
                    $('#note1').off();
                    $('#note1-btn').show();
                })
            });
        } else if (gameInfo[i] == "VIEWNOTE") {
            visibleItem(note1);
        } else if (gameInfo.length == i){
            $('#office .game-info').slideUp(function(){
                $('#office .real-info').slideDown(); 
                $('#office .decode').slideDown();
                $('#office .real-info').html('<span class = "bold"> What is data encryption? </span> <br> It is the translation of data into another form. It can be accessed by people with the <span class = "underline"> decryption key </span>. It is used for data security. Ciphertext is the encrypted data while Plain Text is the unencrypted data. What you have in the case file is ciphertext, you have to convert it to plain text. Use the key from the note to decipher it.');
                pushNotebook('<span class = "bold"> What is data encryption? </span> <br> It is the translation of data into another form. It can be accessed by people with the <span class = "underline"> decryption key </span>. It is used for data security. Ciphertext is the encrypted data while Plain Text is the unencrypted data. What you have in the case file is ciphertext, you have to convert it to plain text. Use the key from the note to decipher it.');
            });
            $('#office .game-info').off();
        } else {
            $('#office .game-info').html(gameInfo[i]);
        }
        i += 1;
    });

    
    $('.decode-btn').click(function(){
       var text = $('.ciphertext').val();
        if(text.toUpperCase() == 'MCKINLEY ROAD GOTHAM CITY') {
            $('#office .decode').slideUp();
            var c = 0;
            $('#office .game-info').html(gameInfo2[c]);
            c++;
            $('#office .game-info').off();
            $('#office .game-info').slideDown();
            $('#office .game-info').click(function(){
                $('#office .game-info').html(gameInfo2[c]);
                c++;
                
                if(c == gameInfo2.length+1) {
                    initHomeMain();
                    visibleFrame(home_main);
                }
            });
        } else {
            $('#office .real-info').html("Wrong code! Try again. Read the note and the case file again. ")
        }
    });
    
    i = 0;
}

function initHomeMain() {
    var chatbox = "#home-main .chatbox";
    var realinfo = "#home-main .real-info";
    var gameinfo = "#home-main .game-info";
    var ciphertext = "#home-main .ciphertext";
    var decode = '#home-main .decode';
    var decodeBtn = '#home-main .decode-btn'
    var itemContainer = ".item-container";
    var objectiveContainer = ".objectives-container";

    $(itemContainer).hide();
    $(chatbox).hide();
    $(realinfo).hide();
    $(decode).hide();
    $(gameinfo).hide();
    $('.location').html(charmain.split(' ')[1] + "'s House");

    var messages = [];
    messages.push(new Chat(wife_idle, "Hello, Detective! Please come in!", wife));
    messages.push(new Chat(husband_idle, "Good Morning Detective, " + playerName + "!", "Make yourself comfortable", husband));
    messages.push(new Chat(wife_idle, "Please call me " + wife.split(' ')[0] + ".", wife));
    messages.push(new Chat(husband_idle, "My name is " + husband.split(' ')[0] + ".", husband));
    messages.push(new Chat(wife_sad, "We've been worried sick about our son " + charmain.split(' ')[0] + ".", wife));
    messages.push(new Chat(husband_sad, "His pranks have never been this long. It would only last days at the very least.", husband));
    messages.push(new Chat(husband_idle, "That's why we want you to find him immediately. Something might happen to him!", husband));
    messages.push(new Chat(wife_idle, "We're giving you permission to view anything in our house that might be useful for your investigation.", wife));

    var gameMessages1 = [];
    gameMessages1 = [
        "Oh! There's a phone here.",
        "VIEWPHONE",
        "This text message seems to lead me somewhere.",
        "I should be able to decode the place. What does ROT6 even mean?",
        "I should find more clues."
    ];

    var lastMessages = [];
    lastMessages = [
        "Yes, Let's go now to Eternity Garden!"    
    ];

    var gameMessages2 = [];
    gameMessages2 = [
        "A note!",
        "VIEWNOTE",
        "This text contains the key to finding Zane.",
        "I think I know where to find to next."
    ];
    var i = 0;
    pushChat(chatbox, messages[i]); 
    i += 1;

    $(chatbox).click(function(){
        if(i >= messages.length) {
            pushObjective("Find clues in the McMullin's house.");
            $(chatbox).off();
            $(chatbox).slideUp();
            $('#phone').click(function(){
                $(gameinfo).slideDown();
                $('#textmess-btn').show();
                $('#phone').off();
                var j = 0;
                pushGame(gameinfo, gameMessages1[0]);
                j += 1;
                $(gameinfo).click(function(){
                    if (gameMessages1[j] == "VIEWPHONE") {
                        visibleItem('#text-file');
                        j+=1;
                    } else if (j >= gameMessages1.length) {
                        $(gameinfo).off();
                        $(gameinfo).slideUp();

                        $('#book').click(function(){  
                            $(gameinfo).slideDown();  
                            var j = 0;
                            pushGame(gameinfo, gameMessages2[0]);
                            j += 1;
                            $(gameinfo).click(function(){
                                if (gameMessages2[j] == "VIEWNOTE") {
                                    visibleItem('#note2-file');
                                    $('#note2-btn').show();
                                    j+=1;
                                } else if (j >= gameMessages2.length) {
                                    pushObjective("Decode the text! HINT: Rotate");
                                    $(gameinfo).off();
                                    $(gameinfo).slideUp();

                                    $(decode).slideDown();

                                    pushReal(realinfo, "There are many types of ciphers. Ciphers are steps in order to encrypt data. Earlier you've encountered A1Z26 cipher which means letter A is equivalent to the number 1, letter B is equivalent to the number 2, and so on and so forth. Can you know guess what ROT6 means? This kind of cipher is called the Caesar Cipher. What does it do? Well, you gotta nfind out!")
                                    pushNotebook("There are many types of ciphers. Earlier you've encountered A1Z26 cipher which means letter A is equivalent to the number 1, letter B is equivalent to the number 2, and so on and so forth. Can you know guess what ROT6 means? This kind of cipher is called the Caesar Cipher. What does it do? Well, you gotta find out!");
                                    $(realinfo).slideDown();

                                    $(decodeBtn).click(function(){
                                        var text = $(ciphertext).val();
                                        if(text.toUpperCase() == 'ETERNITY GARDEN') {
                                            $(decode).slideUp();
                                            $(realinfo).slideUp();

                                            $(decode).off();
                                            var c = 0;

                                            $(gameinfo).slideDown();
                                            pushGame(gameinfo, lastMessages[c]);
                                            c++;
                                            $(gameinfo).click(function(){
                                                if(c >= lastMessages.length) {
                                                    initGarden();
                                                    visibleFrame(garden);
                                                } else {
                                                    pushGame(gameinfo, lastMessages[c]);
                                                    c++;
                                                }
                                            });


                                        } else {
                                            pushReal(realinfo, "Code Incorrect! Please try again.");
                                        }
                                    });  
                                } else {
                                    pushGame(gameinfo, gameMessages2[j]);
                                    j+=1;
                                }

                            });
                        });
                    } else {
                        pushGame(gameinfo, gameMessages1[j]);
                        j+=1;
                    }

                });
            });
        } else {
            pushChat(chatbox, messages[i]); 
            i += 1;
        }
    });

    $(chatbox).slideDown();
}

function initGarden() {
    var chatbox = "#garden .chatbox";
    var realinfo = "#garden .real-info";
    var gameinfo = "#garden .game-info";
    var ciphertext = "#garden .ciphertext";
    var decode = '#garden .decode';
    var decodeBtn = '#garden .decode-btn'
    var itemContainer = ".item-container";
    var objectiveContainer = ".objectives-container";

    $(itemContainer).hide();
    $(chatbox).hide();
    $(realinfo).hide();
    $(decode).hide();
    $(gameinfo).hide();
    $('.location').html("Eternity Garden");

    var messages = [];
    messages.push(new Chat(char1_idle, "!", char1));
    messages.push(new Chat(char2_idle, "!", char2));
    messages.push(new Chat(char1_idle, "Are you the detective on Zane's case?", char1));
    messages.push(new Chat(char2_idle, "Zane left us a diagram. It's reall weird because it has our names on it.", char2));
    messages.push(new Chat(char1_idle, "We hope we could tell you anything but even we don't know where he is.", char1));
    messages.push(new Chat(char1_idle, "I also left my phone in his house a month ago. Do you have it?", char1));
    messages.push(new Chat(char1_idle, "Thank you so much! I hope you find Zane!", char1));
    messages.push(new Chat(char2_idle, "Goodluck! I don't think he left clues around here.", char2));

    var gameMessages1 = [];
    gameMessages1 = [
        "Let's see this diagram.",
        "VIEWDIAGRAM",
        "This diagram seems to lead me somewhere. It's also the easiest.",
        "I should be able to decode the place.",
        "I think I can decrypt where to go next.."
    ];

    var lastMessages = [
        "Yes, I got it!",
        "It is at Elm's Road. Let's go!"
    ]

    var i = 0;
    pushChat(chatbox, messages[i]); 
    i += 1;

    $(chatbox).click(function(){
        if(i >= messages.length) {
            pushObjective("View the diagram given.");
            $(chatbox).off();
            $(chatbox).slideUp();

            $(gameinfo).slideDown();
            $('#note3-btn').show();

            var j = 0;
            pushGame(gameinfo, gameMessages1[0]);
            j += 1;

            $(gameinfo).click(function(){
                if (gameMessages1[j] == "VIEWDIAGRAM") {
                    pushObjective("Decode the text!");
                    visibleItem('#note3-file');
                    j+=1;
                } else if (gameMessages1.length <= j) {
                    $(gameinfo).off();
                    $(gameinfo).slideUp();

                    $(decode).slideDown();

                    pushReal(realinfo, "Wow! You're now a pro detective. ROT means rotate and the number beside it means the number of times you're going to rotate! This next cipher is easy for you for sure!")
                    pushNotebook("Wow! You're now a pro detective. ROT means rotate and the number beside it means the number of times you're going to rotate! This next cipher is easy for you for sure!")
                    $(realinfo).slideDown();

                    $(decodeBtn).click(function(){
                        var a = $(ciphertext).val();
                        if(a.toUpperCase() == 'ELMS') {
                            $(decode).slideUp();
                            $(realinfo).slideUp();

                            $(decodeBtn).off();
                            var c = 0;

                            $(gameinfo).slideDown();
                            pushGame(gameinfo, lastMessages[c]);
                            c++;

                            $(gameinfo).click(function(){
                            if(c >= lastMessages.length) {
                                initRoad();
                                visibleFrame(road);
                            } else {
                                pushGame(gameinfo, lastMessages[c]);
                                c++;
                            }
                        });                                     
                        } else {
                            pushReal(realinfo, "Code Incorrect! Please try again.");
                        }
                    });

                } else {
                    pushGame(gameinfo, gameMessages1[j]); 
                    j += 1;
                }
            });
        } else {
            pushChat(chatbox, messages[i]); 
            i += 1;
        };
    });

    $(chatbox).slideDown();

}

function initRoad() {
    var chatbox = "#road .chatbox";
    var realinfo = "#road .real-info";
    var gameinfo = "#road .game-info";
    var ciphertext = "#road .ciphertext";
    var decode = '#road .decode';
    var decodeBtn = '#road .decode-btn'
    var itemContainer = ".item-container";
    var objectiveContainer = ".objectives-container";

    $(itemContainer).hide();
    $(chatbox).hide();
    $(realinfo).hide();
    $(decode).hide();
    $(gameinfo).hide();
    $('.location').html("Elm's Road");

    var messages = [];
    messages.push(new Chat(char3_talking, "Yes? Who are you?", char3));
    messages.push(new Chat(char3_talking, "Oh, Apologies. Yes, I am " + char3 + ".", char3));
    messages.push(new Chat(char3_talking, "Zane you say?", char3));
    messages.push(new Chat(char3_talking, "Well, Zane sent me an audio recording last week.", char3));
    messages.push(new Chat(char3_talking, "Here, I'll send it to you.", char3));
    messages.push(new Chat(char3_talking, "Also, he was at my house a few days ago. He left through the kitchen door.", char3));
    messages.push(new Chat(char3_talking, "You want to investigate my house? Sure, I'll comply.", char3));
    messages.push(new Chat(char3_talking, "Just tell me when you're ready.", char3));

    var gameMessages1 = [];
    gameMessages1 = [
        "Let's listen to this audio recording.",
        "VIEWPHONE",
        "This puzzle is a bit hard. I think I need more to decode this.",
        "It's too vague. Also, there is no key.",
        "Maybe there's more to find at Mark's house",
        "Let's go!"
    ]

    var i = 0;
    pushChat(chatbox, messages[i]); 
    i += 1;

    $(chatbox).click(function(){
        if(i >= messages.length) {
            pushObjective("Listen to the audio recording.");
            $(chatbox).off();
            $(chatbox).slideUp();

            $(gameinfo).slideDown();
            $('#note3-btn').show();

            var j = 0;
            pushGame(gameinfo, gameMessages1[0]);
            j += 1;

            $(gameinfo).click(function(){
                if (gameMessages1[j] == "VIEWPHONE") {
                    pushObjective("Decode the audio!");
                    visibleItem('#phone-call');
                    $('#phone-call-btn').show();
                    j+=1;
                } else if (gameMessages1.length <= j) {
                    $(gameinfo).off();
                    $(gameinfo).slideUp();
                    initHomeKitchen();
                    visibleFrame(home_kitchen);
                } else {
                    pushGame(gameinfo, gameMessages1[j]); 
                    j += 1;
                }
            });
        } else {
            pushChat(chatbox, messages[i]); 
            i += 1;
        };
    });

    $(chatbox).slideDown();

}

function initHomeKitchen() {
    var chatbox = "#home-kitchen .chatbox";
    var realinfo = "#home-kitchen .real-info";
    var gameinfo = "#home-kitchen .game-info";
    var ciphertext = "#home-kitchen .ciphertext";
    var decode = '#home-kitchen .decode';
    var decodeBtn = '#home-kitchen .decode-btn'
    var itemContainer = ".item-container";
    var objectiveContainer = ".objectives-container";

    $(itemContainer).hide();
    $(chatbox).hide();
    $(realinfo).hide();
    $(decode).hide();
    $(gameinfo).hide();
    $('.location').html("Sue's House");

    var messages = [];
    messages.push(new Chat(char3_talking, "We have arrived.", char3));
    messages.push(new Chat(char3_talking, "Would you like anything to drink? Tea or Coffee", char3));
    messages.push(new Chat(char3_talking, "Okay, I'll prepare some. In the mean time, you can search the kitchen.", char3));

    var gameMessages1 = [];
    gameMessages1 = [
        "Oh! There's a note here",
        "VIEWNOTE4",
        "Hmmmmm.",
        "This is really hard.",
        "But I think I got it!",
        "I'll find you Zane!"
    ];

    var lastMessages = [];
    lastMessages = [
        "Aha! I was right! It is at Taft Towers!",
        "There's no time to waste!"
    ];
    var i = 0;
    pushChat(chatbox, messages[i]); 
    i += 1;

    $(chatbox).click(function(){
        if(i >= messages.length) {
            $(chatbox).off();
            $(chatbox).slideUp();
            $('#note4').click(function(){

                $(gameinfo).slideDown();  
                var j = 0;
                pushGame(gameinfo, gameMessages1[0]);
                j += 1;
                $(gameinfo).click(function(){
                    if (gameMessages1[j] == "VIEWNOTE4") {
                        visibleItem('#note4-file');
                        $('#note4-btn').show();
                        $('#note4').off();
                        j+=1;
                    } else if (j >= gameMessages1.length) {
                        pushObjective("Decode the text! HINT: Rotate");
                        $(gameinfo).off();
                        $(gameinfo).slideUp();

                        $(decode).slideDown();

                        pushReal(realinfo, "This is the last cipher that you have to decode. This is a premade cipher. Your job is to decode this last puzzle. You can view the notes again. Maybe there are some hidden hints there.");
                        pushNotebook("This is the last cipher that you have to decode. This is a premade cipher. Your job is to decode this last puzzle. You can view the notes again. Maybe there are some hidden hints there. HINT: Absolute Value maybe?");
                        pushNotebook("A - C = C - A");
                        $(realinfo).slideDown();

                        $(decodeBtn).click(function(){
                            var text = $(ciphertext).val();
                            if(text.toUpperCase() == 'TAFT') {
                                $(decode).slideUp();
                                $(realinfo).slideUp();

                                $(decode).off();
                                var c = 0;

                                $(gameinfo).slideDown();
                                pushGame(gameinfo, lastMessages[c]);
                                c++;
                                $(gameinfo).click(function(){
                                    if(c >= lastMessages.length) {
                                        initHomeFinal();
                                        visibleFrame(home_final);
                                    } else {
                                        pushGame(gameinfo, lastMessages[c]);
                                        c++;
                                    }
                                });


                            } else {
                                pushReal(realinfo, "Code Incorrect! Please try again.");
                            }
                        });  
                    } else {
                        pushGame(gameinfo, gameMessages1[j]);
                        j+=1;
                    }

                });

            });
        } else {
            pushChat(chatbox, messages[i]); 
            i += 1;
        }
    });


    
    function initHomeFinal() {
            var chatbox = "#home-final .chatbox";
            var realinfo = "#home-final .real-info";
            var gameinfo = "#home-final .game-info";
            var ciphertext = "#home-final .ciphertext";
            var decode = '#home-final .decode';
            var decodeBtn = '#home-final .decode-btn'
            var itemContainer = ".item-container";
            var objectiveContainer = ".objectives-container";

            $(itemContainer).hide();
            $(chatbox).hide();
            $(realinfo).hide();
            $(decode).hide();
            $(gameinfo).hide();
            $('.location').html("Sue's House");

            var messages = [];
            messages.push(new Chat(char4_idle, "Hi, Who are you?", char4));
            messages.push(new Chat(char4_idle, "You looking for Zane?", char4));
            messages.push(new Chat(char4_idle, "Secret.", char4));
            messages.push(new Chat(char4_talking, "Just kidding. He's inside! Come in!", char4));
            messages.push(new Chat(charmain_, "Hello!", charmain));
            messages.push(new Chat(charmain_, "Wow! You must be really good to solve all my puzzles! I'm impressed!", charmain));
            messages.push(new Chat(charmain_, "Congratulations! I know declare you a Kyrpto!", charmain));
            messages.push(new Chat(charmain_, "A Krypto is someone who surpasses my level of cryptography. You're awesome!", charmain));
            messages.push(new Chat(charmain_, "Come on, let's go home! My parents are probably pissed!", charmain));

            var lastMessages = [];
            lastMessages = [
               "CONGRATULATIONS in completing this game!",
                "Before you click next, you can view the notes on the side bar one last time if you want to review about Decryption."
            ];
            var i = 0;
            pushChat(chatbox, messages[i]); 
            i += 1;

            $(chatbox).click(function(){
                if(i >= messages.length) {
                    $(chatbox).off();
                    $(chatbox).slideUp();
                    $(realinfo).slideDown();  
                    
                    var j = 0;
                    pushGame(realinfo, lastMessages[0]);
                    j += 1;
                    
                    $(realinfo).click(function(){
                        if(j >= lastMessages.length) {
                            $('.main-menu').show();
                            $('#main').hide();
                            reset();
                        } else {
                            pushReal(realinfo, lastMessages[j])
                            j +=  1;
                        }
                    });
                } else {
                    pushChat(chatbox, messages[i]); 
                    i += 1;
                }
            });

            $(chatbox).slideDown();
        }$(chatbox).slideDown();
}
