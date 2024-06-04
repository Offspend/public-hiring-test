# Improvements

This coding test result is not perfect and can be improved in many ways, but it will require more time and I think it will go beyond the goal of this test.

I list here main improvements that could be done.

## Move to clean architecture

We can move the project to a clean architecture. This will allow us to have a better separation of concerns and make the project more maintainable.

But for this we need to completely rewrite the project, including the exists `carbonEmissionFactor`. That's why we keep the standard NestJS architecture here.

## Improve tests

Currently, many tests like the ones that use the typeorm repository are not unit tests.

Indeed, they use a real database and are therefore more integration tests.

It slows down the test processing and make the tests more fragile (if running in parallel it leads to random failures).

We can improve this by using a mocking library to mock the repository and test the service in isolation.

I keep the tests as they are for now because they are already written and working and follow the same pattern when using a repository.
Indeed, I'm not yet an expert on typeorm and i don't know the better way to mock it.

For other services, I prefered to use mocks

## Add some cache layer

We can add a cache layer to avoid calling the PotgreSQL database, especially when requesting carbon emission factors for creating the carbon footprint calculation.

It can be achieved by using a cache library and store the data in memory or in a Redis database (good to share the cache if we use Kubernetes and pods).

## Add ability to update the carbon emission factor and carbon footprint calculation

Currently, we can only create a carbon footprint calculation and get the carbon emission factor with the POST endpoints.

According to REST API, POST must not update a resource, but create it only. To update the data we need to create a PUT and or PATCH endpoint.
It was not in the requirements, but it could be a good improvement.