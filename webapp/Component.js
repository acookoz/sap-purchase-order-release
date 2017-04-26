jQuery.sap.declare("zui.s2p.mm.purchorder.approve.porelease.Component");
jQuery.sap.require("sap.ui.model.odata.ODataModel");
jQuery.sap.require("zui.s2p.mm.purchorder.approve.porelease.model.models");
jQuery.sap.require("sap.ui.model.BindingMode");
// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "ui.s2p.mm.purchorder.approve",
	// url: "/sap/bc/ui5_ui5/sap/MM_PO_APV"
	// Use the below URL to run the extended application when SAP-delivered application located in a local cloud environment:
	url: jQuery.sap.getModulePath("zui.s2p.mm.purchorder.approve.porelease") + "/../../MM_PO_APV" // Use the below url to run the extended application when SAP-delivered application located in a cloud environment:
		//url: jQuery.sap.getModulePath("zui.s2p.mm.purchorder.approve.purch-order-release") +
		//"/../orion/file/c01452c48$P1942027597-OrionContent/MM_PO_APV" // we use a URL relative to our own component
		// extension application is deployed with customer namespace
});
this.ui.s2p.mm.purchorder.approve.Component.extend("zui.s2p.mm.purchorder.approve.porelease.Component", {
	metadata: {
		version: "1.0",
		config: {
			"sap.ca.i18Nconfigs": {
				"bundleName": "zui.s2p.mm.purchorder.approve.porelease.i18n.i18n"
			},
			"commonServiceUrl": "/sap/opu/odata/sap/zmm_common_srv/",
			"customServiceUrl": "/sap/opu/odata/sap/zmm_purch_ord_srv/"
		},
		customizing: {
			"sap.ui.controllerExtensions": {
				"ui.s2p.mm.purchorder.approve.view.S3": {
					"controllerName": "zui.s2p.mm.purchorder.approve.porelease.view.S3Custom"
				},
				"ui.s2p.mm.purchorder.approve.view.S4": {
					"controllerName": "zui.s2p.mm.purchorder.approve.porelease.view.S4Custom"
				}
			},
			"sap.ui.viewReplacements": {
				"ui.s2p.mm.purchorder.approve.view.S2": {
					"viewName": "zui.s2p.mm.purchorder.approve.porelease.view.S2Custom",
					"type": "XML"
				},
				"ui.s2p.mm.purchorder.approve.view.S3": {
					"viewName": "zui.s2p.mm.purchorder.approve.porelease.view.S3Custom",
					"type": "XML"
				},
				"ui.s2p.mm.purchorder.approve.view.S4": {
					"viewName": "zui.s2p.mm.purchorder.approve.porelease.view.S4Custom",
					"type": "XML"
				},
				"ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable": {
					"viewName": "zui.s2p.mm.purchorder.approve.porelease.view.AccountAssignmentCustom"
				}
			},
			"sap.ui.viewExtensions": {
				"ui.s2p.mm.purchorder.approve.view.S4": {
					"extInformationS4": {
						className: "sap.ui.core.Fragment",
						fragmentName: "zui.s2p.mm.purchorder.approve.porelease.view.S4ExtItemDetail",
						type: "XML"
					}
					/*,
										"extMaterialHeaderInfo": {
											className: "sap.ui.core.Fragment",
											fragmentName: "zui.s2p.mm.purchorder.approve.porelease.view.S4ExtHeader",
											type: "XML"
										},
										"extServiceHeaderInfo": {
											className: "sap.ui.core.Fragment",
											fragmentName: "zui.s2p.mm.purchorder.approve.porelease.view.S4ExtHeader",
											type: "XML"
										}*/
				}
				/*,
							"sap.ui.viewReplacements": {
								"ui.s2p.mm.requisition.approve.view.AccountAssignmentTable": {
									"viewName": "zui.s2p.mm.purchorder.approve.purch-order-release.view.AccountAssignmentTableCustom",
									"type": "XML"
								}
							}*/
			}
		}
	},

	init: function() {

		// create and set the common ODataModel
		var oCommonModel = zui.s2p.mm.purchorder.approve.porelease.model.models.createODataModel({
			urlParametersForEveryRequest: [
				"sap-server",
				"sap-client",
				"sap-language"
			],
			url: this.getMetadata().getConfig().commonServiceUrl,
			config: {
				useBatch: true,
				metadataUrlParams: {
					"sap-documentation": "heading"
				},
				json: true
			}
		});
		this.setModel(oCommonModel, "common");
		this._createMetadataPromise(oCommonModel);
		
		var oCustomModel = zui.s2p.mm.purchorder.approve.porelease.model.models.createODataModel({
			urlParametersForEveryRequest: [
				"sap-server",
				"sap-client",
				"sap-language"
			],
			url: this.getMetadata().getConfig().customServiceUrl,
			config: {
				useBatch: true,
				metadataUrlParams: {
					"sap-documentation": "heading"
				}
			}
		});
		oCustomModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		this.setModel(oCustomModel, "custom");
		this._createMetadataPromise(oCustomModel);
		
		var oEditModel = zui.s2p.mm.purchorder.approve.porelease.model.models.createEditModel();
		this.setModel(oEditModel, "edit");

	},

	/**
	 * Creates a promise which is resolved when the metadata is loaded.
	 * @param {sap.ui.core.Model} oModel the app model
	 * @private
	 */
	_createMetadataPromise: function(oModel) {
		this.oWhenMetadataIsLoaded = new Promise(function(fnResolve, fnReject) {
			oModel.attachEventOnce("metadataLoaded", fnResolve);
			oModel.attachEventOnce("metadataFailed", fnReject);
		});
	}

});