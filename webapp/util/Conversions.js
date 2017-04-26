jQuery.sap.declare("zui.s2p.mm.purchorder.approve.porelease.util.Conversions");
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");
zui.s2p.mm.purchorder.approve.porelease.util.Conversions = {
	formatAccountAssignment: function(headerInfo) {
		// Call the standard formatter as there is a lot of logic in there.
		var sResult = ui.s2p.mm.purchorder.approve.util.Conversions.accountingFormatter(headerInfo);
		
		// If it prefixes with "Network" - remove the Network part
		if (sResult && sResult.indexOf("Network") === 0) {
			sResult = sResult.slice(8);
		}
		
		return sResult;
	}
	
	
};