(function(app) {

    var deckTplSource = $("#deck-tpl").html(),
        playerTplSource = $("#player-tpl").html();

    var deckTpl = Handlebars.compile(deckTplSource),
        playerTpl = Handlebars.compile(playerTplSource);

    var DeckView = Marionette.ItemView.extend({
        template: deckTpl,
        draw: function() {
            var card = _.first(this.model.get('deck')),
                rest = _.rest(this.model.get('deck'));
            if (rest.length < 1) {
                this.redeck();
            } else {
                this.model.set('deck', rest);
            }
            this.render();
            return card;
        },
        redeck: function() {
            var deck = this.parentCt.abandoned.currentView.model.get('deck');
            deck = _.shuffle(deck);
            this.model.set('deck', deck);
            this.parentCt.abandoned.currentView.model.set('deck', []);
            this.render();
            this.parentCt.abandoned.currentView.render();
        },
        abandon: function(card) {
            var deck = this.model.get('deck');
            deck.push(card);
            this.model.set('deck', deck);
            this.render();
        }
    });

    var PlayerView = Marionette.ItemView.extend({
        template: playerTpl,
        events: {
            "click button.button-throw": "throw",
            "click button.button-draw": "draw"
        },

        draw: function() {
            this.parentCt.draw(this.model.get('id'));
        },

        drawOver: function(card) {
            var cards = this.model.get('cards');
            cards.push(card);
            this.model.set('cards', cards);
            this.render();
        },

        throw: function(e) {
            var id = parseInt(e.currentTarget.getAttribute('data')),
                cards = this.model.get('cards');
            for (var index = 0; index < cards.length; index++) {
                if (cards[index].id === id) {
                    break;
                }
            }
            this.parentCt.abandoned.currentView.abandon(cards[index]);
            cards.splice(index, 1);
            this.model.set('cards', cards);
            this.render();
        }
    });

    app.module("RolesApp.Start", function(Start, app, Backbone, Marionette, $, _) {
        var startTplSource = $("#start-tpl").html();
        var startTpl = Handlebars.compile(startTplSource);

        Start.StartView = Marionette.Layout.extend({
            template: startTpl,
            regions: {
                deck: "#deck-region",
                abandoned: '#abandoned-region',
                player1: '#player1-region',
                player2: '#player2-region',
                player3: '#player3-region',
                player4: '#player4-region',
                player5: '#player5-region',
                player6: '#player6-region',
            },
            events: {
                "click button.button-start": "restart"
            },

            onShow: function() {
                this.deck.show(new DeckView({
                    model: new Backbone.Model({
                        name: '牌堆',
                        deck: _.shuffle(_.clone(app.cards))
                    })
                }));
                this.deck.currentView.parentCt = this;
                this.abandoned.show(new DeckView({
                    model: new Backbone.Model({
                        name: '弃牌堆',
                        deck: []
                    })
                }));
                this.abandoned.currentView.parentCt = this;
                for (var i = 1; i < 7; i++) {
                    this["player" + i].show(new PlayerView({
                        model: new Backbone.Model({
                            id: i,
                            cards: []
                        })
                    }));
                    this["player" + i].currentView.parentCt = this;
                }
                //console.log(this);
            },

            restart: function() {
                this.render();
                this.onShow();
            },

            draw: function(id) {
                var card = this.deck.currentView.draw();
                this["player" + id].currentView.drawOver(card);
            }
        });
    });

})(UtilManager);
