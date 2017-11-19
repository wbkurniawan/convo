/**
 * Created by William on 5/7/2017.
 */
module.exports = {
    "Einfach" :
        [
            {
                "text": "Die Wohnung hat vier Zimmer, eine Küche, ein Bad und einen Balkon. Das Bad hat kein Fenster und ist klein und dunkel. Die Miete beträgt 200 Euro.",
                "questions" :
                    [
                        {
                            "question": "Wieviele Zimmer hat die Wohnung?",
                            "answer": ["vier", "Die Wohnung hat vier Zimmer"]
                        },
                        {
                            "question":"Gibt es im Bad ein Fenster?",
                            "answer": ["Nein", "Das Bad hat kein Fenster"]
                        },
                        {
                            "question":"Wie hoch ist die Miete?",
                            "answer": ["200 Euro", "Die Miete beträgt 200 EUR"]
                        }
                    ]
            },
            {
                "text": "Mario kommt aus Italien. Er ist 20 Jahre alt und wohnt seit 2 Jahren in Berlin",
                "questions" :
                    [
                        {
                            "question":"Woher kommt Mario?",
                            "answer": ["Aus Italien", "Mario kommt aus Italien"]
                        },
                        {
                            "question":"Seit wann wohnt er in Berlin?",
                            "answer": ["seit zwei Jahren", "Er wohnt seit zwei Jahren in Berlin."]
                        }
                    ]
            },
            {
                "text": "In Berlin wird die Temperatur unter Null fallen, in der Nacht schneit es",
                "questions" :
                    [
                        {
                            "question":"Wann wird es in Berlin schneien?",
                            "answer": "In der Nacht"
                        }
                    ]
            },
        ],
    "Normal" :
        [
            
            {
                "text": "Während es in der Region Berlin am Sonntag noch teils bewölkt, teils freundlich ist, zeigt sich das Wetter an den beiden Tagen danach bedeckt.",
                "questions" :
                    [
                        {
                            "question": "Wie ist das Wetter am Sonntag?",
                            "answer": ["bewölkt und freundlich", "teils bewölkt, teils freundlich", "Am Sonntag ist das Wetter teils bewölkt und teils freundlich"]
                        },
                        {
                            "question": "Wie ist das Wetter am Montag und Dienstag?",
                            "answer": ["bedeckt", "Das Wetter ist am Montag und Dienstag bedeckt", "Das Wetter an den beiden Tagen danach ist bedeckt"]
                        }
                    ]
            }
        ],
    "Schwer" :
        [
            {
                "text": "In Schweden können Touristen schon seit 1990 in einem Hotel aus Eis übernachten. " +
                        "Jetzt gibt es im Norden von Schweden aber auch ein Baumhotel. Am Anfang hatte das Hotel sechs Zimmer. " +
                        "So soll es aber nicht bleiben: Am Ende soll es 24 Zimmer geben. Eine Übernachtung kostet ab 370 Euro.",
                "questions" :
                    [
                        {
                            "question":"Wo befindet sich das Hotel",
                            "answer":["In Schweden", "Das Hotel befindet sich in Schweden"]
                        },
                        {
                            "question":"Wie viel kostet die günstigste Übernachtung?",
                            "answer": ["drei hundert siebzig euro", "Die günstigste Übernachtung beträgt 370 EUR"]
                        },
                        {
                            "question":"Wieviele Zimmer wird es im Hotel geben?",
                            "answer": ["vier und zwanzig", "Es soll 24 Zimmer geben."]
                        }
                    ]
            },
            {
                "text": "In Berlin wird Morgen Schnee geben",
                "questions" :
                    [
                        {"question":"Was wird es Morgen geben",
                            "answer":"Schnee"}
                    ]
            }
        ],
}