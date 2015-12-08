(function(app) {

	app.module("RolesApp.Start", function(Start, app, Backbone, Marionette, $, _) {
		Start.Controller = {
			showStart: function() {
                var startView = new Start.StartView();
                app.mainRegion.show(startView);
            },
		};
	});

})(UtilManager);
