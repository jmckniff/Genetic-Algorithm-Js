# Genetic-Algorithm-Js
A genetic algorithm written in Javascript.

Genetic algorithms mimic evolutionary behaviours found in nature, or in this case survival of the fittest.

* First a random population of individuals is generated.
* Each individual in the population's fitness is assessed.
* The two fittest individuals are selected to breed, these are the parents.
* A child is created using a random cross section of the parents genes.
* The childs genes may randomly mutate to produce even further variation in the gene pool.
* A random selection from the current population are chosen as the lucky survivors.
* The parents, child and lucky survivors form the basis for a new population.
* New inviduals are added to the population to keep it a fixed size.
* The process is repeated to create a new generation.
