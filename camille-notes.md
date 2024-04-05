# Notes regarding code provided

## General Comments

This is the very first time I deal with NestJS framework. I use to work on a NodeJs environnment but we re-created from scratch our own framwork
So I'm not that familiar with the module initialization, the request decorator etc. but I think I could manage for this case.

- Comment 1:

  - I did not fix it, but in every test I would mock the return form the repository to be able to have parallele tests that can "write" on the same table withoud disturbing the others
  - I modify the jest command by adding `--runInBand` to prevent all the flacky issues I was facing

- Comment 2:

  - I did a unit test of the controller to be able to cover it 100%.
  - This unit test mock the return of all the services
  - This tests is compmentary of the e2e test itself

- Comment 3:

  - I did not deal on purpose of the name uniqueness of a productCarbonFootprint because two product could have the same name but not same exact quantity and / or ingredients
  - Maybe a mistake of my part but I realized that at the end of producing this test

- Comment 4:
  - I did not modify a lot everything regarding carbonEmissionFactor entity, service and controller.
  - I apply good practice of code only on the part I had to do (async/await, controller test, try/catch etc)

## Comments for ./src/productCarbonFootprint/productCarbonFootprints.controller.ts

- Comment 1:

  - Implement an authorization service to check if the user can do the action
  - This service throw new UnauthorizedException(...) error if the user can not do it

- Comment 2:

  - This should be in a transformer own class like productCarbonFootprintTransformer
  - This transformer whould take the payload as argument, would parse it and convert into Dto
  - This transformer would call a static method from the Entity class like ProductCarbonFootprintEntity.fromJSON({...pCFEvent})
  - I addition, we could use `class-validator` to validate any instance of a classe thanks to decorator
