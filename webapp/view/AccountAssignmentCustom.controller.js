jQuery.sap.require("sap.ui.model.Filter");
jQuery.sap.require("sap.ui.model.FilterOperator");
sap.ui.controller("zui.s2p.mm.purchorder.approve.porelease.view.AccountAssignmentCustom", {
	
	onAccountAssignmentEdit: function(event) {
		
		// Get the binding Context from the event
		this.oContext = event.getSource().getBindingContext();
		
		// Instantiate the GL Account dialog
		if (!this.oAccountDialog) {
			this.oAccountDialog = sap.ui.xmlfragment("zui.s2p.mm.purchorder.approve.porelease.view.AccountValueHelpDialog", this);
			this.getView().addDependent(this.oAccountDialog);
		}
		this.oAccountDialog.open();
		
	},
	
	_handleAccountSearch: function(event) {
		var searchValue = event.getParameter("value");
			var filters = [];
			filters.push(new sap.ui.model.Filter(
				"filterString1",
				sap.ui.model.FilterOperator.Contains, searchValue
			));
			filters.push(new sap.ui.model.Filter(
				"filterString1",
				sap.ui.model.FilterOperator.Contains, searchValue
			));
			event.getSource().getBinding("items").filter(filters);
	},
	
	_handleValueHelpClose: function(event) {
		var selectedItem = event.getParameter("selectedItem");
		var oData = this.oContext.getObject();
		
		if (!selectedItem) {
			return;
		}
		
		var account = selectedItem.getTitle();
		var poNumber = oData.PoNumber;
		var poItem  = oData.ItemNumber;
		var accountLineNumber = oData.AccountLineNumber;
		var workitemId = window.location.hash.split("/")[3];
		
		//Build the path for the update model
		var sPath = "/PurchaseOrderAccountAssigns(poNumber='" + poNumber +
			"',poItemNumber='" + poItem +
			"',workitemId='" + workitemId +
			"',accountLineNumber='" + accountLineNumber +
			"')";
			
		var oTargetModel = this.getView().getModel("custom");

		sap.ui.core.BusyIndicator.show();

		oTargetModel.createBindingContext(sPath, null, null, function() {

			oTargetModel.setProperty(sPath + "/glAccountNumber", account);
			
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
					if (this.oAccountDialog) {
						this.oAccountDialog.close();
					}
				}.bind(this),
				
				error: function() {
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