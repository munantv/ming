(function(app) {

    app.module("RolesApp", function(RolesApp, app, Backbone, Marionette, $, _) {

        RolesApp.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "start": "showStart"
            }
        });

        var API = {
            showStart: function() {
                RolesApp.Start.Controller.showStart();
            }
        };

        app.on("roles:start", function() {
            app.navigate("start");
            API.showStart();
        });
        
        app.addInitializer(function() {
            new RolesApp.Router({
                controller: API
            });
        });

    });

})(UtilManager);
