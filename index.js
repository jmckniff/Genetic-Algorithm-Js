
window.addEventListener('load', eventWindowLoaded, false);

function evolve(iteration, generation, existingPopulation) {
  
    if (!iteration) return;
    
    const maxPopulation = 100;
    var population = existingPopulation || generatePopulation(maxPopulation);
  
    var rows = generateRows(population);
    _grid.render(rows);

    _generation.textContent = "Generation: " + generation;
    _totalFitness.textContent = "Total fitness: " + getTotalFitness(population);

    var fittest = selectFittest(population);

    var newPopulation = generatePopulation(maxPopulation / 2);
    var parentA = fittest.a;
    var parentB = fittest.b;

    var child = parentA.breed(parentB);

    newPopulation.push(parentA);
    newPopulation.push(parentB);
    newPopulation.push(child);

    var survivors = getSurvivors(population);
    
    newPopulation = newPopulation.concat(survivors);
    newPopulation = shuffle(newPopulation);

    generation++;

    var delayBetweenIterations = 300;
    setTimeout(function() { evolve(iteration - 1, generation, newPopulation); }, delayBetweenIterations);
}

function getTotalFitness(population) {
    var total = 0;

    for(var i = 0; i < population.length; i++) {
        var individual = population[i];
        total += individual.getFitness();
    }

    return total;
}

function getSurvivors(population) {
    
    var random = getRandomBetween(0, 1);
    var startIndex = random == 0 ? 0 : population.length / 2;
    var endIndex = random == 0 ? population.length / 2 : population.length;

    var survivors = population.splice(startIndex, endIndex);
    
    return survivors;
}

function eventWindowLoaded () {
 
    _grid = new Grid();
    _generation = document.getElementById("generation");
    _totalFitness = document.getElementById("totalFitness");

    var numberOfIterations = 100;
    var generation = 1;

    evolve(numberOfIterations, generation, null);
}

function generateRows(population) {
  var rows = [];
  var rowCount = 10;
  var columnCount = 10;
  var types = ["blue", "red", "green"];
  var i = 0;
  for (var row = 0; row < rowCount; row++) {
    var columns = [];
    
    for (var column = 0; column < columnCount; column++) {
      var type = types[getRandomBetween(0, 3)];
      
      var individual = population[i];
      i++;
      
      if (individual) {
        var fitness = individual.getFitness();
        
        if (fitness < 100) {
          columns[column] = "purple";
        } else if (fitness < 300) {
          columns[column] = "blue";
        } else if (fitness < 600) {
          columns[column] = "red";
        } else if (fitness < 900) {
          columns[column] = "orange";
        } else if (fitness < 1200) {
          columns[column] = "yellow";
        } else if (fitness == 1200) {
          columns[column] = "white";
        }
        
      } else {
        columns[column] = "black";
      }
    }
    
    rows[row] = columns;
  }
  
  return rows;
}

function getRandomBetween(min, max) {
  return Math.floor(Math.random() * max) + min;
}
 
function Grid() {

  this._canvas = null;
  
  function createCanvas () {
    var canvas = document.getElementById('myCanvas');

    if (!isCanvasSupported(canvas)) {
      throw "HTML5 Canvas element not supported by this browser!";
    }

    return canvas;
  }
  
  function isCanvasSupported(e) {
    return !!e.getContext;
  }
  
  function createTile (type) {
    return {
      type,
      height: 50,
      width: 50
    }
  }
  
  this.render = function(rows) {
   
    var ctx = _canvas.getContext('2d');
    ctx.lineWidth = 1;
    
    var x = 0;
    var y = 0;
    var height = _canvas.height;
    var width = _canvas.width;
    var thickness = 10;
    var tileWidth = 50;
    var tileHeight = 50;
    
    for(var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var row = rows[rowIndex];
      
      x = 0;
      
      for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
        var column = row[columnIndex];
        
        // draw tile background
        ctx.beginPath();
        ctx.rect(x, y, tileWidth, tileHeight);
        ctx.fillStyle = column;
        ctx.fill();
        
        // draw tile border
        ctx.moveTo(x, y);  
        ctx.lineTo(x, tileHeight);  
        ctx.stroke();    
        ctx.font = "1px Calibri";  
        ctx.fillText(thickness, x, thickness);  
        
        x = x + tileWidth;  
      }
      
      y = y + tileHeight;
    }
  }
  
  _canvas = createCanvas();
}


function generatePopulation(numberOfIndividuals) {

	var population = [];

	for(var i = 0; i < numberOfIndividuals; i++) {
  	    var individual = new Individual();
    
        population.push(individual);
    }
  
  return population;
}

function selectFittest(population) {
	var populationSortedByFitness = population.sort(function (a, b) {
  	
    if (a.getFitness() < b.getFitness()) {
    	return 1;
    }
    
    if (a.getFitness() > b.getFitness()) {
    	return -1;
    }
    
    return 0;
  });
  
  return { 
  	a: populationSortedByFitness[0],
    b: populationSortedByFitness[1]
  }
}

var Individual = function (strength, dexterity, intelligence, age, speed) {

    const maxStrength = 100;
    const maxDexterity = 100;
    const maxIntelligence = 100;
    const maxAge = 100;
    const maxSpeed = 10;

    this.strength = strength || getRandomBetween(1, maxStrength);
    this.dexterity = dexterity || getRandomBetween(1, maxDexterity);
    this.intelligence = intelligence || getRandomBetween(1, maxIntelligence);
    this.age = age || getRandomBetween(1, maxAge);
    this.speed = speed || getRandomBetween(1, maxSpeed);
	
    this.getFitness = function () {
        var self = this;
        return Math.round(self.strength + self.dexterity + self.intelligence * self.speed / self.age);
    }

    this.breed = function(father) {

        var mother = this;

        // Cross Selection (50% chance to take either parents attributes)
        var strength = getRandomBetween(0, 1) == 0 ? mother.strength : father.strength;
        var dexterity = getRandomBetween(0, 1) == 0 ? mother.dexterity : father.dexterity;
        var intelligence = getRandomBetween(0, 1) == 0 ? mother.intelligence : father.intelligence;
        var age = getRandomBetween(0, 1) == 0 ? mother.age : father.age;
        var speed = getRandomBetween(0, 1) == 0 ? mother.speed : father.speed;

        // Mutation (50% chance to mutate)
        strength = getRandomBetween(0, 1) == 0 ? strength : getRandomBetween(1, maxStrength);
        dexterity = getRandomBetween(0, 1) == 0 ? dexterity : getRandomBetween(1, maxDexterity);
        intelligence = getRandomBetween(0, 1) == 0 ? intelligence : getRandomBetween(1, maxIntelligence);
        age = getRandomBetween(0, 1) == 0 ? age : getRandomBetween(1, maxAge);
        speed = getRandomBetween(0, 1) == 0 ? speed : getRandomBetween(1, maxStrength);

        var child = new Individual(strength, dexterity, intelligence, age, speed);

        return child;
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }