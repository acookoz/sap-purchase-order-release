jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.ui.model.Filter");
jQuery.sap.require("sap.m.Toolbar");
jQuery.sap.require("sap.m.ToolbarSpacer");
jQuery.sap.require("sap.m.Text");
jQuery.sap.require("sap.m.Column");
jQuery.sap.require("zui.s2p.mm.purchorder.approve.porelease.util.Conversions");
jQuery.sap.require("sap.ui.model.odata.ODataModel");
sap.ui.controller("zui.s2p.mm.purchorder.approve.porelease.view.S3Custom", {
	
	stdForwardHandle: null,

	extHookOnInit: function() {

		// Instantiate Custom model for this controller
		var oModel = new sap.ui.model.json.JSONModel({
			showAllLineItems: false
		});
		this.getView().setModel(oModel, "S3Custom");

		//By default, filter the line items that have already been released.
		this._setItemFilter(false);

	},

	extHookSetHeaderFooterOptions: function(l) {
		//Remove the share button and reject button from the footer
		l.bSuppressBookmarkButton = true;

		l.oNegativeAction = null;
		
		//Store the original agent search function
		this.stdForwardHandle = jQuery.proxy(l.buttonList[0].onBtnPressed, this);
		//Replace with the custom function
		l.buttonList[0].onBtnPressed = jQuery.proxy(this._initAgentSearch, this);
		
		return l;
	},

	onShowAllItemsChange: function() {

		var bValue = !(this.getView().getModel("S3Custom").getProperty("/showAllLineItems"));
		this.getView().getModel("S3Custom").setProperty("/showAllLineItems", bValue);

		this._setItemFilter(bValue);

	},

	_setItemFilter: function(bValue) {

		var filters = [];
		if (!bValue) {
			filters.push(new sap.ui.model.Filter("releasedFlag", sap.ui.model.FilterOperator.EQ, "X"));
		}
		this.getView().byId("itemsTable").getBinding("items").filter(filters);

	},
	
	_initAgentSearch: function() {
		
		var sapOrigin = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath()).SAP__Origin;
		var filter = "$filter=" + encodeURIComponent("SAP__Origin eq '" + sapOrigin + "'");
		this.oDataModel.read("/ForwardingAgentCollection", null, [filter], true, function(data) {
			sap.ca.ui.dialog.forwarding.setFoundAgents(data.results);
		}, jQuery.proxy(this._onRequestFailed, this));
		
		this.stdForwardHandle.call(this);
		
	}

});