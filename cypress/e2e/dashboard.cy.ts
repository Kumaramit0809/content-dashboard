describe("Content dashboard", () => {
  beforeEach(() => cy.visit("/"));

  it("loads the feed", () => {
    cy.get("article", { timeout: 10000 }).should("have.length.greaterThan", 0);
  });
  it("searches with debounce", () => {
    cy.get("article", { timeout: 10000 }).should("exist");
    cy.get('input[type="search"]').type("space");
    cy.contains("article h3", /space/i, { timeout: 10000 }).should("be.visible");
  });
  it("saves a favorite and keeps it after reload", () => {
    cy.get("article button", { timeout: 10000 }).first().click();
    cy.contains("button", "Favorites (1)").click();
    cy.get("article").should("have.length", 1);
    cy.reload();
    cy.contains("button", "Favorites (1)").should("exist");
  });
  it("toggles dark mode", () => {
    cy.contains("button", "Dark mode").click();
    cy.get("html").should("have.class", "dark");
  });
});
