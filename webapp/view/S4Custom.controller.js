jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.BusyIndicator");
sap.ui.controller("zui.s2p.mm.purchorder.approve.porelease.view.S4Custom", {

	onEditPress: function() {

		// Populate the edit model.
		var oModel = this.getView().getModel("edit");
		var oContext = this.getView().getBindingContext().getObject();
		
		var pad = "0000000000";
		var deliveryAddrNo = pad.substring(0, pad.length - oContext.deliveryAddrNo.length) 
					+ oContext.deliveryAddrNo;
	
		
		oModel.setProperty("/poNumber", this.sPoNumber);
		oModel.setProperty("/poItemNumber", this.sItemNumber);
		oModel.setProperty("/workitemId", this.sWorkitemID);
		oModel.setProperty("/deliveryAddrNo", deliveryAddrNo);
		oModel.setProperty("/deliveryText", oContext.deliveryText);
		oModel.setProperty("/taxCode", oContext.taxCode);
		oModel.setProperty("/deliveryDate", oContext.DeliveryDate);

		// Create the dialog if it isn't already
		if (!this._editReqDetailsDialog) {
			this._editReqDetailsDialog = sap.ui.xmlfragment("zui.s2p.mm.purchorder.approve.porelease.view.EditItemDetails", this);
			this.getView().addDependent(this._editReqDetailsDialog);
		}

		// Display the popup dialog
		this._editReqDetailsDialog.open();
	},

	onEditCancel: function() {

		// reset any changes
		var model = this.getView().getModel("custom");
		model.resetChanges();

		// close the dialog
		if (this._editReqDetailsDialog) {
			this._editReqDetailsDialog.close();
		}
	},

	onEditOk: function() {

		var oSourceModel = this.getView().getModel("edit");
		var oData = oSourceModel.getData();
		
		// add the timezone offset to the delivery date
		var timezoneOffset = oData.deliveryDate.getTimezoneOffset() * 60 * 1000;
		oData.deliveryDate = new Date(oData.deliveryDate.getTime() - timezoneOffset);

		//Check all mandatory fields
		if (!oData.deliveryAddrNo ||
			!oData.deliveryDate ||
			!oData.taxCode) {

			this._errorMessageBox("Complete all required fields before editing the requisition details");
			return;
		}

		// Copy fields back to the target model
		var oTargetModel = this.getView().getModel("custom");

		var sPath = "/PurchaseOrderItems(poNumber='" + oData.poNumber +
			"',poItemNumber='" + oData.poItemNumber +
			"',workitemId='" + oData.workitemId +
			"')";
			
		sap.ui.core.BusyIndicator.show();

		oTargetModel.createBindingContext(sPath, null, null, function() {

			oTargetModel.setProperty(sPath + "/poNumber", oData.poNumber);
			oTargetModel.setProperty(sPath + "/poItemNumber", oData.poItemNumber);
			oTargetModel.setProperty(sPath + "/workitemId", oData.workitemId);
			oTargetModel.setProperty(sPath + "/deliveryAddrNo", oData.deliveryAddrNo);
			oTargetModel.setProperty(sPath + "/deliveryText", oData.deliveryText);
			oTargetModel.setProperty(sPath + "/taxCode", oData.taxCode);
			oTargetModel.setProperty(sPath + "/deliveryDate", oData.deliveryDate);
			
			

			oTargetModel.submitChanges({

				success: function(data) {
					
					sap.ui.core.BusyIndicator.hide();
					
					// Check for errors
					if (data && data.__batchResponses[0] ) {
						var response = data.__batchResponses[0].response;
						if (response && response.statusCode && response.statusCode === "400")
						{
							this._errorMessageBox($.parseJSON(response.body).error.message.value);
							return;
						}
						
					}
					
					// Purchase Order has been updated
					sap.m.MessageToast.show("Purchase Order Item has been updated successfully", {
						duration: 4000,
						width: "15em"
					});
					
					// Refresh the base model as well
					this.getView().getModel().refresh(true);
					
					// all done - close the dialog
					if (this._editReqDetailsDialog) {
						this._editReqDetailsDialog.close();
					}
				}.bind(this),
				
				error: function(error) {
					sap.ui.core.BusyIndicator.hide();
					this._errorMessageBox("Error updating Purchase Order Item");
				}.bind(this)
			});

		}.bind(this));
	},

	_errorMessageBox: function(errorText) {
		var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		sap.m.MessageBox.alert(
			errorText, {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			}
		);
	}
});