# Not handled

* Ingredient unit vs. Carbon Factor unit, at the moment any unit is accepted and
  is considered as `kg` which is obviously wrong.
* Product name not validated (empty or too long)
* Finding carbon emission factors for a product is misplaced and inefficient

# Design flaws

* Very coupled to the ORM
* A bit tied to NestJS (Errors extending `HttpException`)
