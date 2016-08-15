var app = angular.module('RxNormApp', ['ui.grid']);

app.controller('RxNormController', RxNormController);

function RxNormController($q, $scope, $timeout, $log, RxNormService)
{	
	$scope.conceptProperties = [];
	$scope.interactionPairs = [];
	$scope.interactionSourceConceptItems = [];

	$scope.interactionSourceConceptItemsGridOptions = {};
	$scope.conceptPropertiesGridOptions = {};

    $scope.conceptPropertiesGridOptions.columnDefs =
    [
    	{
	    	name: 'rxcui', 
	    	field: 'rxcui',
	        cellTemplate: 
	        '<a href="#" ng-click="grid.appScope.DrugInteraction(row)">{{row.entity.rxcui}}</a>'
		}, 
	    {name: 'name', field: 'name' }, 
	    {name: 'synonym', field: 'synonym' },
	    {name: 'umlscui', field: 'umlscui' } 
    ];

    $scope.interactionSourceConceptItemsGridOptions.columnDefs =
    [    	
	    {name: 'id', field: 'id' }, 
	    {name: 'name', field: 'name' },
	    {
	    	name: 'url', 
	    	field: 'url',
	        cellTemplate: 
	        '<a target="_blank" href="{{row.entity.url}}">{{row.entity.url}}</a>'
		}, 
    ];

	function resetScopeObjects(){
		$scope.conceptProperties = [];
		$scope.interactionPairs = [];
		$scope.interactionSourceConceptItems = [];
	}

	$scope.DrugInteraction = function(row){
		var rxCUI = row.entity.rxcui;
		var deferred = $q.defer();

		RxNormService.DrugInteractionByRxCUI(rxCUI, function(data){
			$scope.interactionPairs = [];

			if(data != undefined && 
			   data.interactionTypeGroup != undefined &&
			   data.interactionTypeGroup.length > 0 &&
			   data.interactionTypeGroup[0].interactionType != undefined &&
			   data.interactionTypeGroup[0].interactionType.length > 0)
			{					
				$scope.interactionPairs = data.interactionTypeGroup[0].interactionType[0].interactionPair;
				
				for (var i = 0; i < $scope.interactionPairs.length; i++) {
					$scope.interactionSourceConceptItems.push($scope.interactionPairs[i].interactionConcept[0].sourceConceptItem);
					$scope.interactionSourceConceptItems.push($scope.interactionPairs[i].interactionConcept[1].sourceConceptItem);
				}

				$scope.interactionSourceConceptItemsGridOptions = { data : $scope.interactionSourceConceptItems };	
				deferred.resolve();	
			}		
		},
		function(){
			deferred.reject();
			$log.info('DrugInteractionByRxCUI error');
		});
	}

	$scope.DrugSearchByName = function(){
		var deferred = $q.defer();
		RxNormService.DrugSearchByName(this.query, function(data){
			resetScopeObjects();

			if(data != undefined && data.drugGroup != undefined &&
			   data.drugGroup.conceptGroup)
			{	
				for (var i = 0; i < data.drugGroup.conceptGroup.length; i++) {
					if(data.drugGroup.conceptGroup[i].conceptProperties == undefined)
						continue;

					for (var j = 0; j < data.drugGroup.conceptGroup[i].conceptProperties.length; j++) {
						$scope.conceptProperties.push(data.drugGroup.conceptGroup[i].conceptProperties[j]); 
					}
				}

				$scope.conceptProperties = 
				JSON.parse(angular.toJson($scope.conceptProperties));

				$scope.conceptPropertiesGridOptions = { data : $scope.conceptProperties };	
         
				$log.info($scope.conceptProperties);
				deferred.resolve();	
			}		
		},
		function(){
			deferred.reject();
			$log.info('DrugSearchByName error');
		});
	} 
}