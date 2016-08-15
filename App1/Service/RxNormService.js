var app = angular.module('RxNormApp');

app.service('RxNormService', RxNormService);

function RxNormService($http, $log)
{
	var service = this;

	this.DrugInteractionByRxCUI = function (rxCUI, success, failure){
		$http.get('https://rxnav.nlm.nih.gov/REST/interaction/interaction.json', 
		{
		  dataType: 'json',
		  params: {
		     rxcui : rxCUI
		  }
		})
		.success(function (data) {
		     success(data);
		})
		.error( function () {
		   	 $log.info('DrugInteractionByRxCUI Search error');
		});	
	}

	this.PrescribeDrugBySearchByName = function(drugname, success){
		$http.get('https://rxnav.nlm.nih.gov/REST/Prescribe/drugs', 
		{
		  dataType: 'json',
		  params: {
		     name : drugName
		  }
		})
		.success(function (data) {
		     success(data);
		})
		.error( function () {
		   	 $log.info('PrescribeDrugBySearchByName Search error');
		});	
	}

	this.DrugSearchByName = function(drugName, success, failure)
	{
		$http.get('https://rxnav.nlm.nih.gov/REST/drugs', 
		{
		  dataType: 'json',
		  params: {
		     name : drugName
		  }
		})
		.success(function (data) {
		     success(data);
		})
		.error( function () {
		   	 $log.info('DrugSearchByName Search error');
		});	
	}
}