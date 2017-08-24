/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

var questions = require("./questions");
var instructions = require("./instructions");
var listenings = require("./listening");

'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.1128001d-daf4-4273-a30c-a77792851bd2';  // TODO replace with your app ID (OPTIONAL).
var MAX_PRONOUNCIATION_QUESTION = 5;
var gradePronounciation = {0:"Ich habe leider nichts verstanden.", 1:"Es war leider nicht sehr gut. ", 2 :"Nicht schlecht. ", 3: "Gut. ", 4:"Sehr gut! ", 5: "Super."};
var gradeListening = {0:"Es tut mir leid. ", 1:"Nicht schlecht.", 2 :"Gut. ", 3: "Super. "};

var NewSessionHandlers = {
    'LaunchRequest': function () {
        this.emit(':askWithCard', instructions.START_TRAINING, instructions.START_TRAINING_REPROMPT, instructions.WELCOME, instructions.WELCOME_HELP);
    },
    'UserLevelIntent': function () {
        // this.emit(':ask',instructions.CHANGE_LEVEL,instructions.CHANGE_LEVEL_REPROMPT);
        var filledSlots = delegateSlotCollection.call(this);
        this.attributes['userLevel'] = this.event.request.intent.slots.UserLevelSlot.value;
        this.emit(':ask', instructions.YOUR_LEVEL_IS + this.event.request.intent.slots.UserLevelSlot.value + '. ' + instructions.CHOOSE_TRAINING + instructions.START_TRAINING_REPROMPT, instructions.START_TRAINING_REPROMPT);
    },
    'ConversationIntent': function () {
        this.emit(':tell','Gesprächtraining wird gestartet');
    },
    'ListeningIntent': function () {
        var currentQuestion = '';

        var intentObj = this.event.request.intent;
        var slotToElicit = 'ListeningAnswer';

        var userLevel = this.attributes['userLevel'];
        var userLevelSpeech = '';
        if ( typeof userLevel !== 'undefined' && userLevel  ){
            userLevelSpeech = ' Level ' + userLevel;
        }

        var levelQuestion = getLevelPronunciation(userLevel,listenings);
        var randomIndex;
        var currentListening;
        if (!intentObj.slots.ListeningAnswer.value) {
            randomIndex = randomInt(0,levelQuestion.length);
            this.attributes['randomIndex'] = randomIndex;
            currentListening = levelQuestion[randomIndex];
            console.log("randomIndex",randomIndex);
            console.log("currentListening",currentListening);
            currentQuestion = currentListening.questions[0].question;
            this.attributes['answer'] = currentListening.questions[0].answer;

            var speechOutput = currentListening.text + '<break time="1s"/>' + instructions.PLEASE_ASWER_FOLOWING_QUESTION + currentQuestion ;
            var repromptSpeech = currentQuestion;
            this.attributes['conversationCount'] = 0;
            this.attributes['score'] = 0;
            this.emit(':elicitSlotWithCard', slotToElicit, speechOutput, repromptSpeech,'1. Frage',currentQuestion);
        }else{
            this.attributes['conversationCount']++;
            var questionNo = this.attributes['conversationCount'];
            randomIndex = this.attributes['randomIndex'];
            currentListening = levelQuestion[randomIndex];

            var speechOutput = "";
            var userAnswer = intentObj.slots.ListeningAnswer.value.toString().trim().toLowerCase();
            var correctAnswer = this.attributes['answer'].toString().trim().toLowerCase();
            console.log("correctAnswer", this.attributes['answer']);
            console.log("userAnswer", intentObj.slots.ListeningAnswer.value);
            if(userAnswer == correctAnswer ){
                speechOutput = intentObj.slots.ListeningAnswer.value + instructions.IS_CORRECT + ". ";
                this.attributes['score']++;
            }else{
                speechOutput = intentObj.slots.ListeningAnswer.value + instructions.IS_FALSE + ". ";
            }

            if(questionNo < currentListening.questions.length){
                this.attributes['answer'] = currentListening.questions[questionNo].answer;
                currentQuestion = currentListening.questions[questionNo].question;
                this.emit(':elicitSlotWithCard', slotToElicit, speechOutput + currentQuestion, currentQuestion,(questionNo+1)+'. Frage',currentQuestion);
            }else{
                var note = gradeListening[parseInt(this.attributes['score'])];
                var pointText = this.attributes['score'] + '/' + currentListening.questions.length;
                this.emit(':tellWithCard', speechOutput + '. ' + note + '. ' + instructions.YOU_HAVE + this.attributes['score'] + instructions.FROM + currentListening.questions.length + instructions.POINT + instructions.SCORED,pointText, note);
            }
        }
    },

    'PronunciationIntent': function () {
        // this.emit(':tell','Aussprache Training wird gestartet');
        var currentQuestion = '';
        var intentObj = this.event.request.intent;
        var slotToElicit = 'UserAnswer';
        var userLevel = this.attributes['userLevel'];
        var userLevelSpeech = '';
        if ( typeof userLevel !== 'undefined' && userLevel  ){
        userLevelSpeech = instructions.LEVEL + userLevel;
        }
        var levelQuestion = getLevelPronunciation(userLevel,questions);
        var randomQuestionIndex;
        if (!intentObj.slots.UserAnswer.value) {
            randomQuestionIndex = getShuffeldIndex(levelQuestion,MAX_PRONOUNCIATION_QUESTION);
            this.attributes['randomQuestionIndex'] = JSON.stringify(randomQuestionIndex);
            currentQuestion = levelQuestion[parseInt(randomQuestionIndex[0])].name.value;
            var speechOutput = instructions.CONVERSATION_TRAINING + userLevelSpeech +'. ' + instructions.REPEAT_AFTER_ME + '<prosody rate="x-slow">' + currentQuestion +'</prosody>';
            var repromptSpeech = speechOutput;
            this.attributes['conversationCount'] = 0;
            this.attributes['answer'] = currentQuestion;
            this.attributes['questionList'] = currentQuestion;
            this.attributes['score'] = 0;
            getDictionary(currentQuestion,2).then((response) => {
                var card = formatCard(response);
                this.emit(':elicitSlotWithCard', slotToElicit, speechOutput, repromptSpeech,currentQuestion,card);
            });
        } else{
            this.attributes['conversationCount']++;
            var questionNo = this.attributes['conversationCount'];

            randomQuestionIndex = JSON.parse(this.attributes['randomQuestionIndex']);
            console.log(randomQuestionIndex);

            var speechOutput = "";
            var userAnswer = intentObj.slots.UserAnswer.value.toString().trim().toLowerCase();
            var correctAnswer = this.attributes['answer'].toString().trim().toLowerCase();
            if(userAnswer == correctAnswer ){
                speechOutput = intentObj.slots.UserAnswer.value + instructions.IS_CORRECT + ". ";
                this.attributes['score']++;
            }else{
                speechOutput = intentObj.slots.UserAnswer.value + instructions.IS_FALSE + ". ";
            }
            var repromptSpeech = speechOutput;

            if(questionNo < MAX_PRONOUNCIATION_QUESTION){
                currentQuestion = levelQuestion[parseInt(randomQuestionIndex[questionNo])].name.value;
                this.attributes['answerList'] += ', ' + intentObj.slots.UserAnswer.value;
                var question = instructions.REPEAT_AFTER_ME + '. <prosody rate="x-slow">' + currentQuestion + '</prosody>';
                this.attributes['questionList'] += ', ' + currentQuestion;
                this.attributes['answer'] = currentQuestion;

                getDictionary(currentQuestion,2).then((response) => {
                    var card = formatCard(response);
                    this.emit(':elicitSlotWithCard', slotToElicit, speechOutput + question, repromptSpeech + question,currentQuestion,card);
                });
            }else{
                var note = gradePronounciation[parseInt(this.attributes['score'])];
                this.emit(':tellWithCard', speechOutput + '. ' + note + '. ' + instructions.YOU_HAVE + this.attributes['score'] + instructions.FROM + MAX_PRONOUNCIATION_QUESTION + instructions.POINT + instructions.SCORED,this.attributes['score'] + '/' + MAX_PRONOUNCIATION_QUESTION, this.attributes['questionList']);
            }
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = instructions.START_TRAINING;
        var reprompt = "";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = instructions.BYE;
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = instructions.BYE;
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.emit(':tell', speechOutput);
    },
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(NewSessionHandlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
function getLevelPronunciation(userLevel,questions) {
    console.log(userLevel);
    if ( typeof userLevel == 'undefined'){
        return questions.A1;
    }else if(userLevel=="a eins" || userLevel=="a. eins"){
        return questions.A1;
    }else if(userLevel=="a zwei" || userLevel=="a. zwei"){
        return questions.A2;
    }else if(userLevel=="b eins" || userLevel=="b. eins"){
        return questions.B1;
    }else if(userLevel=="b zwei" || userLevel=="b. zwei"){
        return questions.B2;
    }else if(userLevel=="c eins" || userLevel=="c. eins"){
        return questions.C1;
    }else if(userLevel=="c zwei" || userLevel=="c. zwei"){
        return questions.C2;
    }else{
        return questions.A1;
    }
}


function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function getShuffeldIndex(question,total){
    var randomIndex = [];
    for (var i in question) {
        randomIndex.push(i);
    }
    shuffle(randomIndex);
    if(total>question.length){
        return randomIndex;
    }else{
        return randomIndex.slice(0,total);
    }
}

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getDictionary(word,totalEntry) {
    var fetch = require('node-fetch');
    var libxmljs = require("libxmljs");

    return fetch('http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?lang=de&search=' + word)
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            var result = [];
            var xmlDoc = libxmljs.parseXml(body);
            var sections = xmlDoc.find('//section');

            sections.forEach(function(section) {
                var counter = 0;
                var sectionNode =[];

                // var entries = section.find('//entry');
                var entries = section.childNodes();
                entries.forEach(function(entry) {
                    if(entry.name()=="entry" && counter<totalEntry) {
                        var entryNode = [];
                        // console.log(entry.attr('uid').value());
                        // var sides = entry.find('//side');
                        var sidesEn = entry.child(0);
                        var wordEn = sidesEn.child(0).text();
                        var sidesDe = entry.child(1);
                        var wordDe = sidesDe.child(0).text();
                        sectionNode.push({"en": wordEn, "de": wordDe});
                        counter++;
                    }
                });

                var sectionTitle = section.attr('sctTitle').value().toString();
                // console.log(sectionTitle);
                result.push({"section":sectionTitle, "words": sectionNode});
            });
            return result;
        });
}

function formatCard(translations) {
    var card = "";
    try {
        translations.forEach(function (item) {
            if(item.section){
                card += item.section.toUpperCase() + "\n" ;
                if(item.words.length>0){
                    card += "D: " + item.words[0].de + "\nE: " + item.words[0].en + "\n" ;
                }
                if(item.words.length>1) {
                    card += "D: " + item.words[1].de + "\nE: " + item.words[1].en + "\r\n\r\n";
                }
            }
        });
    } catch (err) {
        //todo: debug only.
        card = "lost in translation";
    }
    return card;
}