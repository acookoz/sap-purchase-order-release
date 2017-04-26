jQuery.sap.declare("zui.s2p.mm.purchorder.approve.porelease.model.models");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.Device");
jQuery.sap.require("sap.ui.model.odata.v2.ODataModel");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");

zui.s2p.mm.purchorder.approve.porelease.model.models = {

	extendMetadataUrlParameters: function(aUrlParametersToAdd, oMetadataUrlParams, sServiceUrl) {
		var oExtensionObject = {},
			oServiceUri = new URI(sServiceUrl);

		aUrlParametersToAdd.forEach(function(sUrlParam) {
			var sLanguage,
				oUrlParameters,
				sParameterValue;

			if (sUrlParam === "sap-language") {
				// for sap-language we check if the launchpad can provide it.
				// oMetadataUrlParams["sap-language"] = sap.ushell.Container.getUser().getLanguage();
			} else {
				oUrlParameters = jQuery.sap.getUriParameters();
				sParameterValue = oUrlParameters.get(sUrlParam);
				if (sParameterValue) {
					oMetadataUrlParams[sUrlParam] = sParameterValue;
					oServiceUri.addSearch(sUrlParam, sParameterValue);
				}
			}
		});

		jQuery.extend(oMetadataUrlParams, oExtensionObject);
		return oServiceUri.toString();
	},

	/**
	 *
	 * @param {object} oOptions a map which contains the following parameter properties
	 * @param {string} oOptions.url see {@link sap.ui.model.odata.v2.ODataModel#constructor.sServiceUrl}.
	 * @param {object} [oOptions.urlParametersForEveryRequest] If the parameter is present in the URL or in case of language the UShell can provide it,
	 * it is added to the odata models metadataUrlParams {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters.metadataUrlParams}, and to the service url.
	 * If you provided a value in the config.metadataUrlParams this value will be overwritten by the value in the url.
	 *
	 * Example: the app is started with the url query, and the user has an us language set in the launchpad:
	 *
	 * ?sap-server=serverValue&sap-host=hostValue
	 *
	 * The createODataModel looks like this.
	 *
	 * models.createODataModel({
	 *     urlParametersToPassOn: [
	 *         "sap-server",
	 *         "sap-language",
	 *         "anotherValue"
	 *     ],
	 *     url : "my/Url"
	 * });
	 *
	 * then the config will have the following metadataUrlParams:
	 *
	 * metadataUrlParams: {
	 *     // retrieved from the url
	 *     "sap-server" : "serverValue"
	 *     // language is added from the launchpad
	 *     "sap-language" : "us"
	 *     // anotherValue is not present in the url and will not be added
	 * }
	 *
	 * @param {object} [oOptions.config] see {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters} it is the exact same object, the metadataUrlParams are enriched by the oOptions.urlParametersToPassOn
	 * @returns {sap.ui.model.odata.v2.ODataModel}
	 */
	createODataModel: function(oOptions) {
		var aUrlParametersForEveryRequest,
			oConfig,
			sUrl;

		oOptions = oOptions || {};

		if (!oOptions.url) {
			jQuery.sap.log.error("Please provide a url when you want to create an ODataModel", "Z_MM_PO_APV.model.models.createODataModel");
			return null;
		}

		// create a copied instance since we modify the config
		oConfig = jQuery.extend(true, {}, oOptions.config);

		aUrlParametersForEveryRequest = oOptions.urlParametersForEveryRequest || [];
		oConfig.metadataUrlParams = oConfig.metadataUrlParams || {};

		sUrl = this.extendMetadataUrlParameters(aUrlParametersForEveryRequest, oConfig.metadataUrlParams, oOptions.url);

		var oModel = this._createODataModel(sUrl, oConfig);
		oModel.setSizeLimit(9999);

		return oModel;
	},

	_createODataModel: function(sUrl, oConfig) {
		return new sap.ui.model.odata.v2.ODataModel(sUrl, oConfig);
	},

	createDeviceModel: function() {
		var oModel = new sap.ui.model.json.JSONModel(sap.ui.Device);
		oModel.setDefaultBindingMode("OneWay");
		return oModel;
	},

	// createFLPModel: function() {
	// 	var bIsShareInJamActive = sap.ushell.Container.getUser().isJamActive(),
	// 		oModel = new JSONModel({
	// 			isShareInJamActive: bIsShareInJamActive
	// 		});
	// 	oModel.setDefaultBindingMode("OneWay");
	// 	return oModel;
	// },

	createAttachmentsModel: function() {
		var oModel = new sap.ui.model.json.JSONModel([]);
		return oModel;
	},

	createRequisitionModel: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			itemText: "",
			material: "",
			materialGroup: "",
			accountAssignCategory: ""
		});
		return oModel;
	},

	createAccountModel: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			account: "",
			costCentre: "",
			unloadingPoint: ""
		});
		return oModel;
	},

	createDefaultService: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			defaultServiceNo: ""
		});
		return oModel;
	},

	createServiceModel: function() {
		var oModel = new sap.ui.model.json.JSONModel([]);
		return oModel;
	},

	createOTVModel: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			name: "",
			abn: "",
			notes: "",
			australianVendor: true
		});
		return oModel;
	},

	createResourceModel: function(sBundleName) {
		var oResourceModel = new sap.ui.model.resource.ResourceModel({
			"bundleName": sBundleName
		});
		return oResourceModel;
	},
	
	createEditModel: function() {
		return new sap.ui.model.json.JSONModel({
			poNumber: "",
			poItemNumber: "",
			workitemId: "",
			deliveryAddrNo: "",
			deliveryText: "",
			taxCode: "",
			deliveryDate: ""
		});
	}

};