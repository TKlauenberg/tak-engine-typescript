import { expect } from "chai";
import { Then, When } from "cucumber";
import { parse } from "../../../src/ptn";

When("I parse the PTN file", function (docString) {
  const [result, gameOrError] = parse(docString);
  this.parsingResult = result;
  this.game = gameOrError;
  this.error = gameOrError;
});

Then("The parsing should be unsuccessful", function() {
  expect(this.parsingResult).to.be.false;
});

Then("The parsing should be successful", function() {
  expect(this.parsingResult).to.be.true;
});
