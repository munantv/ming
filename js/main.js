var UtilManager = new Marionette.Application();

(function(app) {
	Swag.registerHelpers(Handlebars);
	
    app.addRegions({
        bannerRegion: "#banner-region",
        mainRegion: "#main-region"
    });

    app.navigate = function(route, options) {
        if (typeof options == "undefined") {
            options = {};
        }
        Backbone.history.navigate(route, options);
    };

    app.getCurrentRoute = function() {
        return Backbone.history.fragment;
    };

    app.on("initialize:after", function() {
        if (Backbone.history) {
            Backbone.history.start();

            if (this.getCurrentRoute() === "") {
                app.trigger("roles:start");
            }
        }
    });

})(UtilManager);
