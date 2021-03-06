$(function(){
				
	var height, width;
	
	var defaultSty = window.defaultSty = cytoscape.stylesheet()
			.selector("node")
				.css({
					"content": "data(id)",
					"border-width": 3,
					"background-color": "#DDD",
					"border-color": "#555",
					"shape": "ellipse",
					"text-halign": "center",
					"text-valign": "bottom"
					//"border-style": "dashed"
					//"background-size-x": '5',
					//"background-image": "images/test-bg.png",
					//"background-position-x": 5,
					// "pie-1-background-size": "33%",
					// "pie-1-background-color": "red",
					// "pie-2-background-size": "25%",
					// "pie-2-background-color": "green",
					// "pie-3-background-size": "10%",
					// "pie-3-background-color": "blue",
					// "pie-4-background-size": "15%",
					// "pie-4-background-color": "yellow"
				})
			.selector("$node > node") // compound (parent) nodes
				.css({"textValign": "bottom",
					"font-weight": "bold",
					"font-style": "italic",
					"background-color": "#B7E1ED",
					"padding-left": 10,
					"padding-right": 20,
					"padding-top": 5,
					"padding-bottom": 30
				})
			.selector("node[id='non-auto']") // to init a non-auto sized compound
				.css({"width": 100,
					"height": 50,
					"shape": "triangle"
			    })
			.selector("edge")
				.css({
					"width": "mapData(weight, 0, 100, 1, 4)",
					"target-arrow-shape": "triangle",
					"source-arrow-shape": "circle",
					"opacity": 0.5,
					"content": "data(id)"
				})
			.selector(":selected")
				.css({
					"background-color": "#000",
					"line-color": "#000",
					"source-arrow-color": "#000",
					"target-arrow-color": "#000"
				})
			.selector(".ui-cytoscape-edgehandles-source")
				.css({
					"border-color": "#5CC2ED",
					"border-width": 3
				})
			.selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
				.css({
					"background-color": "#5CC2ED"
				})
			.selector("edge.ui-cytoscape-edgehandles-preview")
				.css({
					"line-color": "#5CC2ED",
					"source-arrow-color": "#5CC2ED",
					"target-arrow-color": "#5CC2ED"
				})
			.selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
				.css({
					"shape": "rectangle",
					"width": 15,
					"height": 15
				})
			.selector('#n0').css({ height: 200, width: 200, shape: 'ellipse' })
			.selector('#e0').css({ 'line-color': 'cyan' })
			.selector('#e1').css({ 'line-color': 'magenta' })
			.selector('#e2').css({ 'line-color': 'yellow' })
			.selector('#e3').css({ 'line-color': 'black' })


	;
	
	window.options = {
		renderer: {
			name: "canvas"
		},
		layout: {
			name: "grid"
		},
		style: defaultSty,
		
		elements: {
			nodes: [
			], 
			
			edges: [
			]
		},
		ready: function(){
			console.log('cy ready');

			window.cy = this;
			window.$$ = cytoscape;
		},
		initrender: function(){
			console.log('initrender');
			console.log(arguments);
		}
	};
	
	var cliques = 1;
	var numNodes = 1;
	var numEdges = 0;
	
	function randNodeId( clique ){
		var min = numNodes * clique / cliques;
		var max = numNodes * (clique + 1) / cliques - (cliques == 1 ? 0 : 1);
		var rand = Math.floor( Math.random() * (max - min) + min );
		var id = "n" + rand;

		return id;
	}
	
	for(var i = 0; i < numNodes; i++){
		options.elements.nodes.push({
			data: {
				id: "n" + i,
				weight: Math.round( Math.random() * 100 )
			}
		});
	}
	
	var j = 0;
	for(var clique = 0; clique < cliques; clique++){
		for(var i = 0; i < numEdges/cliques; i++){
			var srcId = randNodeId( clique );
			var tgtId = randNodeId( clique );

			options.elements.edges.push({
				data: {
					id: "e" + (j++),
					source: 'n0',
					target: 'n1',
					weight: Math.round( Math.random() * 100 )
				}
			});
		}
	}
	
	var $container = $("#cytoscape");
	var $container2 = $("#cytoscape2");
	
	$container.cy(options).cy(function(){
		
		height = $container.height();
		width = $container.width();
		
		// test renderTo
		var $d = $('#dummy-canvas');
		if( $d.length > 0 ){
			var dc = $d[0].getContext('2d');
			setInterval(function(){
				dc.setTransform(1, 0, 0, 1, 0, 0);
				dc.clearRect(0, 0, 600, 600);
				cy.renderTo( dc, 0.5, { x: 0, y: 0 } );
			}, 1000/30);
		}
		
		function number(group){
			var input = $("#" + group + "-number");
			var val = parseInt( input.val() );
			
			if( isNaN(val) ){
				return 0;
			}
			
			return val;
		}
		
		function time(callback){
			var start = new Date();
			callback();
			var end = new Date();
			
			$("#add-remove-time").html( (end - start) + " ms" );
		}
		
		$("#add-elements-button").click(function(){
			var n = number("nodes");
			var e = number("edges");
			
			var nodes = [];
			for(var i = 0; i < n; i++){
				nodes.push({
					group: "nodes",
					data: { id: "n" + (i + numNodes), weight: Math.round( Math.random() * 100 ) },
					position: { x: Math.random() * width, y: Math.random() * height }
				});
			}
			numNodes += n;
			
			cy.add(nodes);
			
			var nodesCollection = cy.nodes();
			function nodeId(){
				var index = Math.round((nodesCollection.size() - 1) * Math.random());
				return nodesCollection.eq(index).data("id");
			}
			
			var edges = [];
			for(var i = 0; i < e; i++){
				edges.push({
					group: "edges",
					data: {
						id: "e" + (i + numEdges), 
						weight: Math.round( Math.random() * 100 ),
						source: nodeId(),
						target: nodeId()
					}
				});
			}
			numEdges += e;
			
			time(function(){
				cy.add(edges);
			});
		});

		
		$("#remove-elements-button").click(function(){
			var n = number("nodes");
			var e = number("edges");
			
			time(function(){
				cy.nodes().slice(0, n).remove();
				cy.edges().slice(0, e).remove();
			});
			

		});
		
		$("#remove-selected-button").click(function(){
			cy.elements(":selected").remove();
		});

	});

	// compound graph in the second instance
	$container2.cy({
		elements: {
		   nodes: [{ data: { id: 'n8', parent: 'n4' } },
			   { data: { id: 'n9', parent: 'n4' } },
			   { data: { id: 'n4', parent: 'n1' } },
			   { data: { id: 'n5', parent: 'n1', shape: 'triangle' } },
			   { data: { id: 'n1' } },
		       { data: { id: 'n2' } },
		       { data: { id: 'node6', parent: 'n2' } },
		       { data: { id: 'n7', parent: 'n2', shape: 'square' } },
			   { data: { id: 'n3', parent: 'non-auto', shape: 'rectangle' } },
			   { data: { id: 'non-auto'}}],
		   edges: [ { data: { id: 'e1', source: 'n1', target: 'n3' } },
		       { data: { id: 'e2', source: 'n3', target: 'n7' } },
		       { data: { id: 'e3', source: 'node6', target: 'n7' } },
		       { data: { id: 'e4', source: 'node6', target: 'n9' } },
		       { data: { id: 'e5', source: 'n8', target: 'n9' } },
		       { data: { id: 'e6', source: 'n5', target: 'n8' } },
		       { data: { id: 'e7', source: 'n2', target: 'n4' } }]
		},
		style: defaultSty,

		ready: function(){
		   window.cy2 = this;
		   cy2.on("click", "node", function(evt){
		       var node = this;
		       console.log("%o", node);
		   });
		}
	}).cy(function(){
		$("#compound-remove-selected-button").click(function(){
			cy2.elements(":selected").remove();
		});

		$("#compound-hide-selected-button").click(function(){
			cy2.elements(":selected").hide();
		});

		$("#compound-show-all-button").click(function(){
			cy2.elements().show();
		});

		var numChildren = 0;

		$("#add-child-button").click(function(){

			var parentId = $("#parent-node").val();
			var nodes = [];

			nodes.push({group: "nodes",
				           data: {id: "c" + numChildren, parent: parentId},
				           position: {x: Math.random() * width, y: Math.random() * height}});

			numChildren++;

			cy2.add(nodes);
		});

		$("#set-random-style").click(function(){

			var nodes = cy2.elements("node:selected");

			for (var i=0; i < nodes.size(); i++)
			{
				var shapes = ["triangle", "rectangle", "ellipse", "pentagon"];

				// pick a random shape and dimensions
				nodes[i].css({"width": Math.round(Math.random() * 50 + 1),
					"height": Math.round(Math.random() * 50 + 1),
					"shape": shapes[Math.floor(Math.random() * 4)]});
			}

		});
	});
	


	
});