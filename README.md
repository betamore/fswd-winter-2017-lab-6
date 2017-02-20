# Full Stack Web Development - Lab 6: Testing and Pull Requesting

[![Greenkeeper badge](https://badges.greenkeeper.io/betamore/fswd-winter-2017-lab-6.svg)](https://greenkeeper.io/)

## Setup

* Pair up (or three up if an odd number)
* Nominate a primary code owner
* That person forks this repository to their own GitHub account
  * And then gives access to that repository to their teammates

## Exercise

* Everybody clone that primary repository to your machine
* Run npm test
* Setup an account with [Travis CI](https://travis-ci.org) and direct it to your repository
* Run npm test
* Commit the change and push it to git
* Watch what Travis does with it
* Write up a couple test cases (in plain English)
* One person translates those test cases into actual tests, the other should work on the server implementation of those cases.
* Tester commits the tests to git, and push to the repository
* Developer pulls from git and incorporates (manually or via git) the server code changes
* Run npm test, commit, and push
* Repeat until you can no longer come up with additional test cases
* Finally, submit a pull request to the original Betamore repository with your fancy new code and tests!

## Building an Authentication system

Consider what your authentication system is going to need:

* A place to store users' credentials
* A way for existing users to login
* A way for new users to sign up

Think about what needs to happen for each of those. What happens when a user tries to login with credentials that do not exist?
What happens when a logged in user tries to login? Make a list of all the possible wacky scenarios! Each scenario could make for
a good test.
