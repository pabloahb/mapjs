/*global describe, expect, it, MAPJS*/
describe('layout', function () {
	'use strict';
	var dimensionProvider = function (text) {
		var length = (text || '').length + 1;
		return {
			width: length * 20,
			height: length * 10
		};
	};
	describe('Calculating dimensions', function () {
		it('should return two margins plus text width/height as dimensions of a single idea', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '1'
				}),
				result = MAPJS.calculateDimensions(contentAggregate, dimensionProvider, 10);
			expect(result).toEqual({
				id: 7,
				title: '1',
				width: 60,
				height: 40,
				Width: 60,
				Height: 40,
				WidthLeft: 0
			});
		});
		it('should return (width1 + width2 + 4 * margin, max(height1, height2) + 2 * margin)', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '1',
					ideas: {
						1: {
							id: 8,
							title: '11'
						}
					}
				}),
				result = MAPJS.calculateDimensions(contentAggregate, dimensionProvider, 10);
			expect(result).toEqual({
				id: 7,
				title: '1',
				width: 60,
				height: 40,
				Width: 140,
				Height: 50,
				WidthLeft: 0,
				ideas: {
					1: {
						id: 8,
						title: '11',
						width: 80,
						height: 50,
						Width: 80,
						Height: 50,
						WidthLeft: 0
					}
				}
			});
		});
		it('should disregard children of collapsed nodes', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '1',
					attr: { collapsed: true },
					ideas: {
						1: {
							id: 8,
							title: '11'
						}
					}
				}),
				result = MAPJS.calculateDimensions(contentAggregate, dimensionProvider, 10);
			expect(result).toPartiallyMatch({
				id: 7,
				Width: 60,
				Height: 40,
				WidthLeft: 0,
				attr: {collapsed: true}
			});
		});
		it('', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '7',
					ideas: {
						'-1': {
							id: 8,
							title: '8'
						},
						1: {
							id: 9,
							title: '9'
						}
					}
				}),
				result = MAPJS.calculateDimensions(contentAggregate, dimensionProvider, 10);
			expect(result.Width).toBe(180);
		});
	});
	describe('Calculating positions', function () {
		it('', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '1'
				}),
				result = MAPJS.calculatePositions(contentAggregate, dimensionProvider, 10, 0, 0);
			expect(result).toEqual({
				id: 7,
				title: '1',
				x: 10,
				y: 10,
				width: 60,
				height: 40,
				Width: 60,
				Height: 40,
				WidthLeft: 0
			});
		});
		it('', function () {
			var contentAggregate = MAPJS.content({
					id: 7,
					title: '1',
					ideas: {
						1: {
							id: 8,
							title: '11'
						}
					}
				}),
				result = MAPJS.calculatePositions(contentAggregate, dimensionProvider, 10, 0, 0);
			expect(result).toEqual({
				id: 7,
				title: '1',
				x: 10,
				y: 15,
				width: 60,
				height: 40,
				Width: 140,
				Height: 50,
				WidthLeft: 0,
				ideas: {
					1: {
						id: 8,
						title: '11',
						x: 70,
						y: 10,
						width: 80,
						height: 50,
						Width: 80,
						Height: 50,
						WidthLeft: 0
					}
				}
			});
		});
	});
	it('should assign root node level 1', function () {
		var contentAggregate = MAPJS.content({ id: 7 }),
			result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[7].level).toEqual(1);
	});
	it('should assign child node levels recursively', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				ideas: {
					1: {
						id: 2,
						ideas: {
							1: {
								id: 22
							}
						}
					},
					2: {
						id: 3
					}
				}
			}),
			result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[7].level).toEqual(1);
		expect(result.nodes[2].level).toEqual(2);
		expect(result.nodes[22].level).toEqual(3);
		expect(result.nodes[3].level).toEqual(2);
	});
	it('should place a root node on (margin, margin)', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				title: 'Hello'
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[7]).toPartiallyMatch({
			id: 7,
			x: -60,
			y: -30,
			width: 140,
			height: 80,
			title: 'Hello',
			level: 1
		});
	});
	it('should place root node left of its only right child', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				title: '1',
				ideas: {
					1: {
						id: 8,
						title: '12'
					}
				}
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[7]).toPartiallyMatch({
			x: -20,
			y: -10
		});
		expect(result.nodes[8]).toPartiallyMatch({
			x: 40,
			y: -15
		});
	});
	it('should place root node right of its only left child', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				title: '1',
				ideas: {
					1: {
						id: 8,
						title: '12'
					},
					'-1': {
						id: 9,
						title: '123'
					}
				}
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[9]).toPartiallyMatch({
			x: -120,
			y: -20
		});
	});
	it('should work recursively', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				title: '1',
				ideas: {
					1: {
						id: 8,
						title: '12'
					},
					'-1': {
						id: 9,
						title: '123',
						ideas: {
							3: {
								id: 10,
								title: '1234'
							}
						}
					}
				}
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[10].x).toBe(-240);
	});
	it('should place child nodes below each other', function () {
		var contentAggregate = MAPJS.content({
				id: 7,
				title: '1',
				ideas: {
					2: {
						id: 8,
						title: '12'
					},
					1: {
						id: 9,
						title: '123'
					}
				}
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[9].y).toBe(-45);
		expect(result.nodes[8].y).toBe(15);
	});
	it('should center children vertically', function () {
		var contentAggregate = MAPJS.content({
				id: 10,
				title: '123',
				ideas: {
					'-2': {
						id: 11,
						title: ''
					}
				}
			}),
			result;
		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[11].y).toBe(-5);
	});
	it('should copy style to nodes', function () {
		var contentAggregate = MAPJS.content({
			title: '123',
			attr: { collapsed: true, style: { background: '#FFFFFF'}}
		}),
			result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[1]).toPartiallyMatch({
			attr: {collapsed: true, style: { background: '#FFFFFF'}}
		});
	});
	it('should set style using defaults where not defined', function () {
		var contentAggregate = MAPJS.content({
			title: '123',
			attr: { collapsed: true}
		}),
			result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);
		expect(result.nodes[1].attr.style.background).not.toBeUndefined();
	});
	it('should not include links between collapsed nodes', function () {
		var contentAggregate = MAPJS.content({
			id: 1,
			title: 'first',
			attr: { collapsed: true },
			ideas: {
				100: {
					id: 2,
					title: 'second'
				},
				200: {
					id: 3,
					title: 'third'
				}
			},
			links: [{
				ideaIdFrom: 2,
				ideaIdTo: 3
			}]
		}),
			result;

		result = MAPJS.calculateLayout(contentAggregate, dimensionProvider);

		expect(result.links).toEqual([]);
	});
});
describe('MAPJS.frame', function () {
	'use strict';
	it('should set origin.y to be the minimum y', function () {
		var nodes = [{x: -10, y: 5, width: 10, height: 55}, {x: 1, y: -12, width: 15, height: 30}],
			result = MAPJS.calculateFrame(nodes, 5);
		expect(result).toPartiallyMatch({top: -17, left: -15, width: 36, height: 82});
	});
});
describe('New layout', function () {
	'use strict';
	describe('Tree', function () {
		var dimensionProvider = function (content) {
			var parts = content.title.split('x');
			return {
				width: parseInt(parts[0]),
				height: parseInt(parts[1])
			};
		}
		describe('Calculating Tree', function () {
			it ('should convert a single root node into a tree', function () {
				var content = MAPJS.content({
						id: 1,
						title: '100x200',
						attr: { name: 'value' }
					}),
					result;

				result = MAPJS.calculateTree(content, dimensionProvider);

				expect(result).toPartiallyMatch({
					id: 1,
					title: '100x200',
					attr: { name: 'value' },
					width: 100,
					height: 200
				});
			});
			it ('should convert a root node with a single child into a tree', function () {
				var content = MAPJS.content({
						id: 1,
						title: '200x100',
						ideas: {
							100: {
								id: 2,
								title: '300x80'
							}
						}
					}),
					result;

				result = MAPJS.calculateTree(content, dimensionProvider, 10);

				expect(result).toPartiallyMatch({
					id: 1,
					title: '200x100',
					width: 200,
					height: 100
				});
				expect(result.subtrees[0]).toPartiallyMatch({
					id: 2,
					title: '300x80',
					width: 300,
					height: 80,
					deltaX: 210,
					deltaY: 10
				});
			});
			
			it ('should convert a root node with a two children into a tree', function () {
				var content = MAPJS.content({
						id: 1,
						title: '200x100',
						ideas: {
							100: {
								id: 2,
								title: '300x80'
							},
							200: {
								id: 3,
								title: '100x30'
							}
						}
					}),
					result;

				result = MAPJS.calculateTree(content, dimensionProvider, 10);

				expect(result).toPartiallyMatch({
					id: 1,
					title: '200x100',
					width: 200,
					height: 100
				});
				expect(result.subtrees[0]).toPartiallyMatch({
					id: 2,
					title: '300x80',
					width: 300,
					height: 80,
					deltaX: 210,
					deltaY: -10
				});
				expect(result.subtrees[1]).toPartiallyMatch({
					id: 3,
					title: '100x30',
					width: 100,
					height: 30,
					deltaX: 210,
					deltaY: 80
				});
			});
		

			it ('should convert a root node with a two children into a tree', function () {
				var content = MAPJS.content( {
						id: 1,
						"title":"118x34",
						ideas: {
							100: {
								id: 2,
								title: "23x34",
								ideas: {
									100: {
										id: 4,
										title: "113x34"
									}
								}
							},
							200: {
								id: 3,
								title: "107x34",
								ideas: {
									31: {
										id: 31,
										title: "23x34"
									},
									32: {
										id: 32,
										title: "23x34"
									}
								}								
							}
						}
					}),
					result;

				result = MAPJS.calculateTree(content, dimensionProvider, 10);
				console.log(JSON.stringify(result, null, 2));
			});
		});

		describe('conversion to layout', function () {
			it('should calculate the layout for a single node', function () {
				var tree = new MAPJS.Tree({
					id: 1,
					title: 'Hello world',
					attr: { name: 'value' },
					width: 200,
					height: 100
				}), result;

				result = tree.toLayout();

				expect(result).toEqual({
					nodes: {
						'1': {
							id: 1,
							level: 1,
							title: 'Hello world',
							attr: { name: 'value' },
							x: -100,
							y: -50
						}
					},
					links: {},
					connectors: {}
				});
			});
			it('should calculate the layout for two nodes', function () {
				var tree = new MAPJS.Tree({
					id: 1,
					title: 'Hello world',
					attr: { name: 'value' },
					width: 200,
					height: 100,
					subtrees: [
						new MAPJS.Tree({
							id: 2,
							title: 'First child',
							attr: { name: 'value2' },
							width: 300,
							height: 80,
							deltaX: 210,
							deltaY: 10
						})
					]
				}), result;

				result = tree.toLayout();

				expect(result).toEqual({
					nodes: {
						'1': {
							id: 1,
							level: 1,
							title: 'Hello world',
							attr: { name: 'value' },
							x: -100,
							y: -50
						},
						'2': {
							id: 2,
							level: 2,
							title: 'First child',
							attr: { name: 'value2' },
							x: 110,
							y: -40
						}
					},
					links: {},
					connectors: {
						'2': {
							from: 1,
							to: 2
						}
					}
				});

			});			
			it('should calculate the layout for two left-aligned sub child nodes', function () {
				var tree = new MAPJS.Tree({
					id: 1,
					title: 'Hello world',
					attr: { name: 'value' },
					width: 200,
					height: 100,
					subtrees: [
						new MAPJS.Tree({
							id: 2,
							title: 'First child',
							attr: { name: 'value2' },
							width: 300,
							height: 80,
							deltaX: 210,
							deltaY: -10
						}), 
						new MAPJS.Tree({
							id: 3,
							title: 'Second child',
							attr: { name: 'value3' },
							width: 100,
							height: 30,
							deltaX: 210,
							deltaY: 80
						})
					]
				}), result;

				result = tree.toLayout();

				expect(result).toEqual({
					nodes: {
						'1': {
							id: 1,
							level: 1,
							title: 'Hello world',
							attr: { name: 'value' },
							x: -100,
							y: -50
						},
						'2': {
							id: 2,
							level: 2,
							title: 'First child',
							attr: { name: 'value2' },
							x: 110,
							y: -60
						},
						'3': {
							id: 3,
							level: 2,
							title: 'Second child',
							attr: { name: 'value3' },
							x: 110,
							y: 30
						}
					},
					links: {},
					connectors: {
						'2': {
							from: 1,
							to: 2
						},
						'3': {
							from: 1,
							to: 3
						}

					}
				});
			});
		})
	});
	describe('Outline', function () {
		var dimensionProviderResults, dimensionProvider;
		beforeEach(function () {
			dimensionProvider = function (content) {
				var parts = content.title.split('x');
				return {
					width: parseInt(parts[0]),
					height: parseInt(parts[1])
				};
			};
		});
		it('should create an outline from a single idea', function () {
			var result, content = MAPJS.content({ title: '20x10' });

			result = MAPJS.Outline.fromDimensions(dimensionProvider(content));

			expect(result.borders()).toEqual({
				top: [{
					h: -5,
					l: 20
				}],
				bottom: [{
					h: 5,
					l: 20
				}]
			});

		});
		it('should be calculate spacing between simple outlines', function () {
			var outline1 = new MAPJS.Outline([{ h: -35, l: 50}], [{ h: 35, l: 50}]),
				outline2 = new MAPJS.Outline([{ h: -40, l: 120}], [{ h: 40, l: 120}]),
				result;

			result = outline1.spacingAbove(outline2);

			expect(result).toBe(75);
		});
		it('should calculate spacing between more complex outlines', function () {

			var outline1 = new MAPJS.Outline([{"h":-17,"l":23},{"l":123,"h":-17}],[{"h":17,"l":23},{"l":123,"h":17}]),
				outline2 = new MAPJS.Outline([{"h":-17,"l":107},{"l":33,"h":-39}],[{"h":17,"l":107},{"l":33,"h":39}]),
				result = outline1.spacingAbove(outline2);

			expect(result).toBe(56);
		});
		describe('borderLength', function () {
			it('should calculate length of a border', function () {
				var result;

				result = MAPJS.Outline.borderLength([{ l: 100, h: -10 }, { l: 200, h: -50 }]);

				expect(result).toBe(300);
			});
		});
		describe('stackLeft', function () {
			it('should ', function () {

			});
		});
		describe('borderSegmentIndexAt', [
				['returns element at length if exists', [{ l: 50, h: -10 }, { l: 100, h: -30 }], 70, 1],
				['returns -1 if too short', [{ l: 50, h: -10 }, { l: 100, h: -30 }], 151, -1],
				['returns right segment if on spot', [{ l: 50, h: -10 }, { l: 100, h: -30 }], 50, 1],
				['returns initial segment if length 0', [{ l: 50, h: -10 }, { l: 100, h: -30 }], 0, 0],
				['returns -1 on right border', [{ l: 50, h: -10 }, { l: 100, h: -30 }], 150, -1]
			],
			function (border, length, expected) {
				var result;

				result = MAPJS.Outline.borderSegmentIndexAt(border, length);

				expect(result).toBe(expected);
			}
		)
		describe('extending borders', [
			['should preserve first border if second is shorter', [{h:-10, l:3}] , [{h:-20, l:1}] , [{h:-10, l:3}] ],
			['should preserve total length when first border is shorter', [{h:-30, l:12}] , [{h:-10, l:6}, {h:-20, l:8}] , [{h:-30, l:12}, {h: -20, l: 2}] ],
			['should preserve extend with segment of second border if second is longer', [{h:-10, l:3}] , [{h:-20, l:5}] , [{h:-10, l:3}, {h: -20, l:2}] ],
			['should skip second border elements before end of first border', [{h:-10, l:3}] , [{h:-20, l:1}, {h: -30, l: 4}] , [{h:-10, l:3}, {h: -30, l:2}] ],
			['should skip second border elements aligned with the end of first border', [{h:-10, l:3}] , [{h:-20, l:3}, {h: -30, l: 4}] , [{h:-10, l:3}, {h: -30, l:4}] ],
			['should skip second border elements aligned with the end of first border', [{h:-10, l:1}, {h:-20, l:2}, {h:-30, l:3}] , [{h:-20, l:4}, {h: -30, l: 3}, {h: -50, l: 5 }] , [{h:-10, l:1}, {h: -20, l:2}, {h: -30, l: 3}, {h: -30, l: 1 }, {h: -50, l:5 }] ],
			],
			function (firstBorder, secondBorder, expected) {
				var result;
				result = MAPJS.Outline.extendBorder(firstBorder, secondBorder);
				expect(result).toEqual(expected);				
			}
		);
		it('should calculate spacing between more complex outlines', function () {
			var outline1 = new MAPJS.Outline([], [{ h: 5, l: 6}, { h: 15, l: 8 }]),
				outline2 = new MAPJS.Outline([{ h: -10, l: 12}], []),
				result;

			result = outline1.spacingAbove(outline2);

			expect(result).toBe(25);

		});
		it('should be able to stack simple outlines', function () {
			var outline1 = new MAPJS.Outline([{ h: -35, l: 50}], [{ h: 35, l: 50}]),
				outline2 = new MAPJS.Outline([{ h: -40, l: 120}], [{ h: 40, l: 120}]),
				result;

			result = outline2.stackBelow(outline1, 10);

			expect(result.borders()).toEqual({
				top: [{ h: -35, l: 50}, {h: 45, l: 70}],
				bottom: [{h: 125, l: 120}]					
			});
		});
		it('should be able to stack outlines with more complex borders', function () {
			var outline1 = new MAPJS.Outline([{ h: -5, l: 6}, {h: -15, l:8}], [{ h: 5, l: 6}, { h: 15, l: 8}]),
				outline2 = new MAPJS.Outline([{ h: -10, l: 12}], [{ h: 10, l: 12}]),
				result;

			result = outline2.stackBelow(outline1, 10);

			expect(result.borders()).toEqual({
				top: [{ h: -5, l: 6}, {h: -15, l:8}],
				bottom: [{h: 45, l: 12}, {h: 15, l: 2}]					
			});
		});
	});
});
